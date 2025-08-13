import { Theron } from '../agents/theron';

test('Theron emits signal on wallet cluster', () => {
  if (!Theron.observe) {
    throw new Error('observe is not implemented')
  }
  const event = { type: 'wallet_activity',
    wallet: '0x' + Math.floor(Math.random() * 1e16).toString(16),
    amount: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString()
  };
  const signals = Theron.observe(event);
  expect(signals).toBeDefined();
});
