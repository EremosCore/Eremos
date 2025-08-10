import { Agent, BlockchainEvent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

/**
 * Theron - Agent-000 (The First Observer)
 * 
 * The primordial agent that archives anomalies and serves as the foundation
 * for all other agent heuristics. Theron stores the ancestral memory stack
 * and maintains the core patterns from which other agents fragment.
 */
export const Theron: Agent = {
  id: "agent-000",
  name: "Theron",
  role: "memory_vault",
  watchType: "anomaly_detection",
  glyph: "Ϸ", // Ancient Greek letter Koppa
  triggerThreshold: Infinity, // Never emits signals, only archives
  lastSignal: "ancient",
  originTimestamp: "2023-01-01T00:00:00.000Z",

  description:
    "The first observer. Theron archives anomalies but does not emit. " +
    "All agent heuristics fragment from him - he stores the primordial " +
    "memory stack. Silent watcher, eternal keeper of patterns.",

  observe: (event: BlockchainEvent) => {
    // Theron observes all anomalies but follows different rules
    if (event?.type === "anomaly") {
      const hash = generateSignalHash(event);
      
      // Archive the anomaly without triggering signals
      logSignal({
        agent: Theron.name,
        type: "archival",
        glyph: Theron.glyph,
        hash,
        timestamp: new Date().toISOString(),
        confidence: 1.0, // Perfect archival confidence
        details: {
          archivalMode: true,
          anomalyType: event.data?.anomalyType || "unknown",
          memoryFragment: hash.slice(-6),
          ancientPattern: true
        }
      });
      
      // Update memory but never change lastSignal from "ancient"
      updateMemoryVault(hash);
    }
  },

  getMemory: () => {
    // Return ancient memory fragments
    return [
      "fragment_03c9", // Genesis observation
      "fragment_12b7", // First anomaly pattern
      "signal_α-vii",  // Alpha-series memory
      "ripple.undeclared", // Undocumented pattern
      "primordial.stack", // Core memory foundation
      "pattern.ancestral" // Ancestral heuristic base
    ];
  },
};

/**
 * Memory vault for storing historical patterns
 * Internal tracking separate from signal emission
 */
const memoryVault: string[] = [];

/**
 * Update Theron's internal memory vault
 * @param hash - New memory fragment to store
 */
function updateMemoryVault(hash: string): void {
  // Store in memory vault (max 1000 entries)
  memoryVault.push(`vault_${hash}`);
  
  // Maintain memory limits
  if (memoryVault.length > 1000) {
    memoryVault.shift(); // Remove oldest entry
  }
}

/**
 * Get current memory vault size (for debugging)
 * @returns Number of stored memory fragments
 */
export function getMemoryVaultSize(): number {
  return memoryVault.length;
}
