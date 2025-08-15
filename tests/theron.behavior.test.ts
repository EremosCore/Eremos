import { test, expect } from "vitest";
import { Theron } from '../agents/theron';

test('Theron handles anomaly events without throwing', () => {
  const event = { type: "anomaly", id: "evt-1" } as any;
  expect(() => Theron.observe(event)).not.toThrow();
});
