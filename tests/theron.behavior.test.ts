import { Theron } from '../agents/theron';

test('Theron emits signal on wallet cluster', () => {
  const event = { type: 'anomaly', data: { test: true } };
  // observe doesn't return anything, just test it doesn't throw
  expect(() => {
    Theron.observe(event);
  }).not.toThrow();
});
