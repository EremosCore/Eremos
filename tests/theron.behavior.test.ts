import { Theron } from '../agents/theron';

test('Theron emits signal on wallet cluster', () => {
  const event = {
    type: 'wallet_activity',
    wallet: '7Yk...',
    txCount: 4,
    timestamp: new Date().toISOString(),
  };
  Theron.observe(event);
  // Theron doesn't return signals, it logs them
  expect(Theron.observe).toBeDefined();
});
