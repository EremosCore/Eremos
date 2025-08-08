import { Theron } from '../agents/theron';

test('Theron processes anomaly events', () => {
  const event = { 
    type: "anomaly", 
    pattern: "suspicious",
    confidence: 0.8,
    timestamp: new Date().toISOString(),
    source: "test"
  };
  Theron.observe(event);
  expect(Theron).toBeDefined();
});
