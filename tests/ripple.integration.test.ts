import { Ripple } from '../agents/ripple';
import { LiquidityEvent } from '../types/event';

describe('Ripple Agent - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete ripple detection workflow', () => {
    const poolId = 'integration-test-pool';
    
    const events: LiquidityEvent[] = [
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet1', tickOrBin: 100, operationType: 'add', amount: 1.5 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet1', tickOrBin: 101, operationType: 'remove', amount: 0.8 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet1', tickOrBin: 102, operationType: 'add', amount: 2.1 },
      
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet2', tickOrBin: 100, operationType: 'add', amount: 1.2 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet2', tickOrBin: 101, operationType: 'add', amount: 0.9 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet2', tickOrBin: 102, operationType: 'remove', amount: 1.7 },
      
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet3', tickOrBin: 100, operationType: 'add', amount: 0.7 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet3', tickOrBin: 101, operationType: 'remove', amount: 1.3 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet3', tickOrBin: 102, operationType: 'add', amount: 1.9 },
      

      { type: 'liquidity_operations', poolId, walletAddress: 'wallet4', tickOrBin: 101, operationType: 'add', amount: 1.1 }
    ];

    events.forEach(event => {
      expect(() => Ripple.observe(event)).not.toThrow();
    });

    const memory = Ripple.getMemory?.() || [];
    expect(memory.length).toBeGreaterThan(0);
    
    const poolMemory = memory.find(line => line.includes(poolId));
    expect(poolMemory).toBeDefined();
  });

  test('agent handles mixed valid and invalid operations', () => {
    const poolId = 'mixed-test-pool';
    
    const mixedEvents = [
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet1', tickOrBin: 100, operationType: 'add', amount: 1.0 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet2', tickOrBin: 101, operationType: 'remove', amount: 2.0 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet3', tickOrBin: 102, operationType: 'add', amount: 0.0001 }, 
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet4', tickOrBin: 103, operationType: 'add', amount: 10.0 }, 
      { type: 'wallet_activity', poolId, walletAddress: 'wallet5' }, 
      { type: 'liquidity_operations', poolId: null, walletAddress: 'wallet6', tickOrBin: 104, operationType: 'add', amount: 1.0 }, 
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet7', tickOrBin: 105, operationType: 'add', amount: 1.5 },
      { type: 'liquidity_operations', poolId, walletAddress: 'wallet8', tickOrBin: 106, operationType: 'remove', amount: 0.8 }
    ];

    mixedEvents.forEach(event => {
      expect(() => Ripple.observe(event as any)).not.toThrow();
    });

    const memory = Ripple.getMemory?.() || [];
    const poolMemory = memory.find(line => line.includes(poolId));
    
    if (poolMemory) {
      expect(poolMemory).toContain('4 wallets');
    }
  });

  test('agent memory shows meaningful information', () => {
    const pools = ['pool-alpha', 'pool-beta', 'pool-gamma'];
    
    pools.forEach((poolId, poolIndex) => {
      for (let walletIndex = 0; walletIndex < 2; walletIndex++) {
        for (let tickIndex = 0; tickIndex < 3; tickIndex++) {
          const event: LiquidityEvent = {
            type: 'liquidity_operations',
            poolId,
            walletAddress: `${poolId}-wallet${walletIndex}`,
            tickOrBin: 100 + tickIndex,
            operationType: walletIndex % 2 === 0 ? 'add' : 'remove',
            amount: 1.0 + (tickIndex * 0.1)
          };
          Ripple.observe(event);
        }
      }
    });

    const memory = Ripple.getMemory?.() || [];
    
    pools.forEach(poolId => {
      const poolLine = memory.find(line => line.includes(poolId));
      expect(poolLine).toBeDefined();
      expect(poolLine).toContain('2 wallets');
      expect(poolLine).toContain('3 ticks');
    });

    expect(memory.length).toBeGreaterThanOrEqual(pools.length);
    memory.forEach(line => {
      expect(line).toMatch(/Pool .+: \d+ wallets, \d+ ticks, \d+ windows/);
    });
  });

  test('agent properties match specification', () => {
    expect(Ripple).toBeDefined();
    expect(typeof Ripple).toBe('object');
    
    expect(Ripple.id).toBe('agent-ripple');
    expect(Ripple.name).toBe('Ripple');
    expect(Ripple.role).toBe('lp_activity_monitor');
    expect(Ripple.watchType).toBe('liquidity_operations');
    expect(Ripple.glyph).toBe('≈');
    expect(Ripple.triggerThreshold).toBe(3);
    expect(Ripple.lastSignal).toBeNull();
    expect(Ripple.originTimestamp).toBe('2025-08-13T00:00:00.000Z');
    
    expect(typeof Ripple.description).toBe('string');
    expect(Ripple.description).toContain('Detects repeated small LP add/remove operations');
    expect(Ripple.description).toContain('lp_ripple');
    
    expect(typeof Ripple.observe).toBe('function');
    expect(typeof Ripple.getMemory).toBe('function');
  });
});
