import { Agent } from "../types/agent";
import { RippleConfig } from "../types/config";
import { LPOperation, LiquidityEvent } from "../types/event";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { logAgentError } from "../utils/error";
import { recordCall } from "../utils/metrics";
import { now, isOlderThan } from "../utils/time";
import { debug } from "../utils/debug";

interface TickBand {
  min: number;
  max: number;
  ticks: number[];
}

const config: RippleConfig = {
  windowMs: 5 * 60 * 1000,
  minOps: 3,
  minUniqueWallets: 2,
  bandGap: 1,
  bandMaxWidth: 10,
  minLpSize: 0.001,
  maxLpSize: 5.0,
  debounceMs: 300 * 1000,
  triggerResonance: 0.6,
  analysisInterval: 10
};

const resonanceState = {
  operations: new Map<string, Map<string, LPOperation[]>>(),
  tickCounts: new Map<string, Map<number, number>>(),
  timeWindows: new Map<string, Map<string, Set<number>>>(),
  walletRepeats: new Map<string, Map<string, number>>(),
  lastEmission: new Map<string, number>(),
  lastCleanup: now()
};

const clusterTicks = (ticks: number[], maxGap: number = config.bandGap): TickBand[] => {
  if (ticks.length === 0) return [];
  
  const sortedTicks = [...ticks].sort((a, b) => a - b);
  const bands: TickBand[] = [];
  let currentBand = [sortedTicks[0]];
  
  for (let i = 1; i < sortedTicks.length; i++) {
    if (sortedTicks[i] - sortedTicks[i-1] <= maxGap) {
      currentBand.push(sortedTicks[i]);
    } else {
      if (currentBand.length >= 2) {
        bands.push({
          min: Math.min(...currentBand),
          max: Math.max(...currentBand),
          ticks: currentBand
        });
      }
      currentBand = [sortedTicks[i]];
    }
  }
  
  if (currentBand.length >= 2) {
    bands.push({
      min: Math.min(...currentBand),
      max: Math.max(...currentBand),
      ticks: currentBand
    });
  }
  
  return bands;
};

const calculateBandTightness = (band: TickBand): number => {
  if (band.ticks.length <= 1) return 0;
  
  const range = band.max - band.min;
  const density = band.ticks.length / (range + 1);
  
  return Math.min(density, 1);
};

const calculateFrequency = (poolId: string, windowMs: number): number => {
  const poolTimeWindows = resonanceState.timeWindows.get(poolId);
  if (!poolTimeWindows || poolTimeWindows.size === 0) return 0;
  
  const currentTime = now();
  const cutoffTime = currentTime - windowMs;
  
  let totalOps = 0;
  for (const timestamps of poolTimeWindows.values()) {
    for (const timestamp of timestamps) {
      if (timestamp >= cutoffTime) {
        totalOps++;
      }
    }
  }
  
  const windowMinutes = windowMs / (60 * 1000);
  return totalOps / windowMinutes;
};

const calculateWalletConcentration = (poolId: string, band: TickBand, windowMs: number): number => {
  const poolOps = resonanceState.operations.get(poolId);
  if (!poolOps) return 0;
  
  const currentTime = now();
  const cutoffTime = currentTime - windowMs;
  const walletOpCounts = new Map<string, number>();
  
  for (const [wallet, operations] of poolOps.entries()) {
    let count = 0;
    for (const op of operations) {
      if (op.timestamp >= cutoffTime && band.ticks.indexOf(op.tickOrBin) >= 0) {
        count++;
      }
    }
    if (count > 0) {
      walletOpCounts.set(wallet, count);
    }
  }
  
  if (walletOpCounts.size === 0) return 0;
  
  const totalOps = Array.from(walletOpCounts.values()).reduce((sum, count) => sum + count, 0);
  const sortedCounts = Array.from(walletOpCounts.values()).sort((a, b) => b - a);
  
  const top2Share = sortedCounts.slice(0, 2).reduce((sum, count) => sum + count, 0) / totalOps;
  
  return Math.min(top2Share, 1);
};

const calculateResonance = (bandTightness: number, frequency: number, walletConcentration: number): number => {
  const w1 = 0.4;
  const w2 = 0.3;  
  const w3 = 0.3;
  
  const normalizedTightness = Math.min(bandTightness, 1);
  const normalizedFrequency = Math.min(frequency / 10, 1);
  const normalizedConcentration = Math.min(walletConcentration, 1);
  
  return w1 * normalizedTightness + w2 * normalizedFrequency + w3 * normalizedConcentration;
};

const getPoolState = <T>(poolId: string, stateMap: Map<string, T>, defaultValue: () => T): T => {
  if (!stateMap.has(poolId)) {
    stateMap.set(poolId, defaultValue());
  }
  return stateMap.get(poolId)!;
};

const throttle = (fn: Function, delay: number) => {
  let lastCall = 0;
  return function(...args: any[]) {
    const current = now();
    if (current - lastCall >= delay) {
      lastCall = current;
      fn(...args);
    }
  };
};

const cleanupOldData = throttle(() => {
  const currentTime = now();
  const cutoffTime = currentTime - 30 * 60 * 1000;

  for (const [poolId, poolOps] of resonanceState.operations.entries()) {
    for (const [wallet, ops] of poolOps.entries()) {
      const newOps = ops.filter(op => op.timestamp >= cutoffTime);
      if (newOps.length === 0) {
        poolOps.delete(wallet);
        const poolWalletRepeats = resonanceState.walletRepeats.get(poolId);
        if (poolWalletRepeats) {
          poolWalletRepeats.delete(wallet);
        }
      } else {
        poolOps.set(wallet, newOps);
      }
    }
    
    if (poolOps.size === 0) {
      resonanceState.operations.delete(poolId);
      resonanceState.tickCounts.delete(poolId);
      resonanceState.timeWindows.delete(poolId);
      resonanceState.walletRepeats.delete(poolId);
    }
  }

  for (const [poolId, poolTimeWindows] of resonanceState.timeWindows.entries()) {
    for (const [windowId, timestamps] of poolTimeWindows.entries()) {
      const newTimestamps = Array.from(timestamps).filter(t => t >= cutoffTime);
      if (newTimestamps.length === 0) {
        poolTimeWindows.delete(windowId);
      } else {
        poolTimeWindows.set(windowId, new Set(newTimestamps));
      }
    }
  }

  resonanceState.lastCleanup = currentTime;
}, 60000);

const analyzeForRipplePattern = (poolId: string) => {
  const poolTickCounts = resonanceState.tickCounts.get(poolId);
  const poolOps = resonanceState.operations.get(poolId);
  
  if (!poolTickCounts || !poolOps || poolOps.size < config.minUniqueWallets) return;

  const activeTicks = Array.from(poolTickCounts.entries())
    .filter(([_, count]) => count >= config.minOps)
    .map(([tick, _]) => Number(tick));

  if (activeTicks.length === 0) return;

  const bands = clusterTicks(activeTicks, config.bandGap);
  
  for (const band of bands) {
    if (band.ticks.length < 2) continue;
    
    const bandKey = `${poolId}:${band.min}-${band.max}`;
    
    const lastEmission = resonanceState.lastEmission.get(bandKey) || 0;
    if (now() - lastEmission < config.debounceMs) continue;
    
    const bandTightness = calculateBandTightness(band);
    const frequency = calculateFrequency(poolId, config.windowMs);
    const walletConcentration = calculateWalletConcentration(poolId, band, config.windowMs);
    
    const resonance = calculateResonance(bandTightness, frequency, walletConcentration);
    
    const uniqueWallets = getUniqueWalletsInBand(poolId, band, config.windowMs);
    if (uniqueWallets < config.minUniqueWallets) continue;
    
    const opsInBand = getOpsCountInBand(poolId, band, config.windowMs);
    if (opsInBand < config.minOps) continue;
    
    if (resonance >= config.triggerResonance) {
      const hash = generateSignalHash({
        poolId,
        band: { min: band.min, max: band.max },
        windowStart: now() - config.windowMs,
        windowEnd: now(),
        ops: opsInBand,
        uniqueWallets,
        score: Math.round(resonance * 100) / 100
      });

      logSignal({
        agent: "Ripple",
        type: "lp_ripple",
        glyph: "≈",
        hash,
        timestamp: new Date().toISOString()
      });
      
      resonanceState.lastEmission.set(bandKey, now());
      
      debug('Ripple', 
        `Signal emitted - Pool: ${poolId}, Band: ${band.min}-${band.max}, Score: ${resonance.toFixed(2)}, ` +
        `Ops: ${opsInBand}, Wallets: ${uniqueWallets}, Tightness: ${bandTightness.toFixed(3)}, ` +
        `Frequency: ${frequency.toFixed(3)}, Concentration: ${walletConcentration.toFixed(3)}`
      );
    }
  }
};

const getUniqueWalletsInBand = (poolId: string, band: TickBand, windowMs: number): number => {
  const poolOps = resonanceState.operations.get(poolId);
  if (!poolOps) return 0;
  
  const currentTime = now();
  const cutoffTime = currentTime - windowMs;
  const uniqueWallets = new Set<string>();
  
  for (const [wallet, operations] of poolOps.entries()) {
    for (const op of operations) {
      if (op.timestamp >= cutoffTime && band.ticks.indexOf(op.tickOrBin) >= 0) {
        uniqueWallets.add(wallet);
        break;
      }
    }
  }
  
  return uniqueWallets.size;
};

const getOpsCountInBand = (poolId: string, band: TickBand, windowMs: number): number => {
  const poolOps = resonanceState.operations.get(poolId);
  if (!poolOps) return 0;
  
  const currentTime = now();
  const cutoffTime = currentTime - windowMs;
  let count = 0;
  
  for (const operations of poolOps.values()) {
    for (const op of operations) {
      if (op.timestamp >= cutoffTime && band.ticks.indexOf(op.tickOrBin) >= 0) {
        count++;
      }
    }
  }
  
  return count;
};

export const Ripple: Agent = {
  id: "agent-ripple",
  name: "Ripple",
  role: "lp_activity_monitor",
  watchType: "liquidity_operations",
  glyph: "≈",
  triggerThreshold: 3,
  lastSignal: null,
  originTimestamp: "2025-08-13T00:00:00.000Z",

  description:
    "Detects repeated small LP add/remove operations on specific tick bands within pools. Emits lp_ripple signal with resonance score based on band tightness, frequency, and wallet concentration.",

  observe: (event) => {
    try {
      recordCall('Ripple');
      
      if (!event || event.type !== "liquidity_operations") return;

      const currentTime = now();
      
      if (currentTime - resonanceState.lastCleanup > 60000) {
        cleanupOldData();
      }

      const {
        poolId,
        walletAddress,
        tickOrBin,
        operationType,
        amount
      } = event as LiquidityEvent;

      if (!poolId || !walletAddress || typeof tickOrBin !== 'number' || !operationType || 
          amount < config.minLpSize || amount > config.maxLpSize) return;
      
      const operation: LPOperation = {
        poolId,
        walletAddress,
        timestamp: currentTime,
        tickOrBin,
        operationType,
        amount
      };

      const poolOps = getPoolState(poolId, resonanceState.operations, () => new Map<string, LPOperation[]>());
      const poolTickCounts = getPoolState(poolId, resonanceState.tickCounts, () => new Map<number, number>());
      const poolTimeWindows = getPoolState(poolId, resonanceState.timeWindows, () => new Map<string, Set<number>>());
      const poolWalletRepeats = getPoolState(poolId, resonanceState.walletRepeats, () => new Map<string, number>());

      if (!poolOps.has(walletAddress)) {
        poolOps.set(walletAddress, []);
      }
      poolOps.get(walletAddress)!.push(operation);

      poolTickCounts.set(tickOrBin, (poolTickCounts.get(tickOrBin) || 0) + 1);
      
      const windowId = Math.floor(currentTime / config.windowMs).toString();
      if (!poolTimeWindows.has(windowId)) {
        poolTimeWindows.set(windowId, new Set());
      }
      poolTimeWindows.get(windowId)!.add(currentTime);

      poolWalletRepeats.set(walletAddress, (poolWalletRepeats.get(walletAddress) || 0) + 1);

      const totalPoolOps = Array.from(poolOps.values()).reduce((sum, ops) => sum + ops.length, 0);
      if (totalPoolOps % config.analysisInterval === 0) {
        analyzeForRipplePattern(poolId);
      }
    } catch (error) {
      logAgentError('Ripple', error);
    }
  },

  getMemory: () => {
    const memoryLines: string[] = [];
    for (const [poolId, poolOps] of resonanceState.operations.entries()) {
      const poolTickCounts = resonanceState.tickCounts.get(poolId);
      const poolTimeWindows = resonanceState.timeWindows.get(poolId);
      
      memoryLines.push(`Pool ${poolId}: ${poolOps.size} wallets, ${poolTickCounts?.size || 0} ticks, ${poolTimeWindows?.size || 0} windows`);
    }
    return memoryLines.length > 0 ? memoryLines : ["No active pools"];
  }
};