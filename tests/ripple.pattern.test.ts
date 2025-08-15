import { Ripple } from '../agents/ripple';
import { LiquidityEvent } from '../types/event';

describe('Ripple Agent - Pattern Detection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createLiquidityEvent = (
    poolId: string,
    walletAddress: string,
    tickOrBin: number,
    operationType: 'add' | 'remove' = 'add',
    amount: number = 1.0
  ): LiquidityEvent => ({
    type: 'liquidity_operations',
    poolId,
    walletAddress,
    tickOrBin,
    operationType,
    amount
  });

  test('should accumulate operations in pool-scoped state', () => {

    const pool1Event = createLiquidityEvent('pool1', 'wallet1', 100);
    const pool2Event = createLiquidityEvent('pool2', 'wallet1', 100);

    Ripple.observe(pool1Event);
    Ripple.observe(pool2Event);

    const memory = Ripple.getMemory?.() || [];

    expect(memory.length).toBeGreaterThan(1);
    expect(memory.some(line => line.includes('pool1'))).toBe(true);
    expect(memory.some(line => line.includes('pool2'))).toBe(true);
  });

  test('should track operations per wallet per pool', () => {
    const poolId = 'test-pool';
    

    for (let i = 0; i < 5; i++) {
      const event = createLiquidityEvent(poolId, 'wallet1', 100 + i);
      Ripple.observe(event);
    }

    const memory = Ripple.getMemory?.() || [];
    const poolMemoryLine = memory.find(line => line.includes(poolId));
    expect(poolMemoryLine).toBeDefined();
    expect(poolMemoryLine).toContain('1 wallets'); 
  });

  test('should handle multiple wallets in same pool', () => {
    const poolId = 'test-pool';
    
    for (let i = 0; i < 3; i++) {
      const event = createLiquidityEvent(poolId, `wallet${i}`, 100);
      Ripple.observe(event);
    }

    const memory = Ripple.getMemory?.() || [];
    const poolMemoryLine = memory.find(line => line.includes(poolId));
    expect(poolMemoryLine).toBeDefined();
    expect(poolMemoryLine).toContain('3 wallets');
  });

  test('should handle both add and remove operations', () => {
    const poolId = 'mixed-ops-pool';
    
    const addEvent = createLiquidityEvent(poolId, 'wallet1', 100, 'add', 1.0);
    const removeEvent = createLiquidityEvent(poolId, 'wallet1', 101, 'remove', 1.0);
    
    Ripple.observe(addEvent);
    Ripple.observe(removeEvent);
    
    const memory = Ripple.getMemory?.() || [];
    const poolLine = memory.find(line => line.includes(poolId));
    expect(poolLine).toBeDefined();
    expect(poolLine).toContain('1 wallets'); 
  });

  test('should handle concurrent pools independently', () => {
    const pools = ['pool-a', 'pool-b', 'pool-c'];
    
    pools.forEach((poolId, poolIndex) => {
      for (let i = 0; i < 3; i++) {
        const event = createLiquidityEvent(poolId, `wallet-${poolIndex}-${i}`, 100 + i);
        Ripple.observe(event);
      }
    });
    
    const memory = Ripple.getMemory?.() || [];
    
    pools.forEach(poolId => {
      expect(memory.some(line => line.includes(poolId))).toBe(true);
    });
    
    pools.forEach(poolId => {
      const poolLine = memory.find(line => line.includes(poolId));
      expect(poolLine).toContain('3 wallets');
    });
  });
});
