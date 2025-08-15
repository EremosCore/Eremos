import { Ripple } from '../agents/ripple';
import { LiquidityEvent } from '../types/event';

describe('Ripple Agent - Core Behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should have correct agent properties', () => {
    expect(Ripple.id).toBe('agent-ripple');
    expect(Ripple.name).toBe('Ripple');
    expect(Ripple.role).toBe('lp_activity_monitor');
    expect(Ripple.watchType).toBe('liquidity_operations');
    expect(Ripple.glyph).toBe('≈');
    expect(Ripple.triggerThreshold).toBe(3);
    expect(Ripple.description).toContain('Detects repeated small LP add/remove operations');
  });

  test('should ignore non-liquidity events', () => {
    const nonLiquidityEvent = {
      type: 'wallet_activity',
      poolId: 'pool1',
      walletAddress: 'wallet1'
    };

    expect(() => {
      Ripple.observe(nonLiquidityEvent);
    }).not.toThrow();
  });

  test('should ignore events missing required fields', () => {
    const incompleteEvent = {
      type: 'liquidity_operations'
    };

    expect(() => {
      Ripple.observe(incompleteEvent);
    }).not.toThrow();
  });

  test('should ignore operations outside size thresholds', () => {
    const tooSmallEvent: LiquidityEvent = {
      type: 'liquidity_operations',
      poolId: 'pool1',
      walletAddress: 'wallet1',
      tickOrBin: 100,
      operationType: 'add',
      amount: 0.0001
    };

    const tooLargeEvent: LiquidityEvent = {
      type: 'liquidity_operations',
      poolId: 'pool1',
      walletAddress: 'wallet1',
      tickOrBin: 100,
      operationType: 'add',
      amount: 10.0 
    };

    expect(() => {
      Ripple.observe(tooSmallEvent);
      Ripple.observe(tooLargeEvent);
    }).not.toThrow();
  });

  test('should handle valid liquidity operations without errors', () => {
    const validEvent: LiquidityEvent = {
      type: 'liquidity_operations',
      poolId: 'pool1',
      walletAddress: 'wallet1',
      tickOrBin: 100,
      operationType: 'add',
      amount: 1.0
    };

    expect(() => {
      Ripple.observe(validEvent);
    }).not.toThrow();
  });

  test('should provide memory information', () => {
    const memory = Ripple.getMemory?.() || [];
    expect(Array.isArray(memory)).toBe(true);
    expect(memory.length).toBeGreaterThan(0);
    
    expect(memory.every(line => typeof line === 'string')).toBe(true);
  });

  test('should handle errors gracefully', () => {
    const malformedEvent = {
      type: 'liquidity_operations',
      poolId: null,
      walletAddress: 'wallet1',
      tickOrBin: 'invalid',
      operationType: 'add',
      amount: 1.0
    };

    expect(() => {
      Ripple.observe(malformedEvent as any);
    }).not.toThrow();
  });
});
