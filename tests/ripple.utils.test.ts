import { generateSignalHash } from '../utils/signal';

describe('Ripple Agent - Utility Integration', () => {
  test('should generate valid signal hashes', () => {
    const signalData = {
      poolId: 'test-pool',
      band: { min: 100, max: 102 },
      windowStart: 1692000000000,
      windowEnd: 1692000300000,
      ops: 5,
      uniqueWallets: 3,
      score: 0.75
    };

    const hash = generateSignalHash(signalData);
    
    expect(typeof hash).toBe('string');
    expect(hash.startsWith('sig_')).toBe(true);
    expect(hash.length).toBeGreaterThan(4);
  });

  test('should handle different signal data structures', () => {
    const data1 = {
      poolId: 'pool1',
      band: { min: 100, max: 102 }
    };
    
    const data2 = {
      poolId: 'pool2',
      operations: 10,
      score: 0.85
    };

    const hash1 = generateSignalHash(data1);
    const hash2 = generateSignalHash(data2);
    
    expect(hash1.startsWith('sig_')).toBe(true);
    expect(hash2.startsWith('sig_')).toBe(true);
    expect(typeof hash1).toBe('string');
    expect(typeof hash2).toBe('string');
  });
});
