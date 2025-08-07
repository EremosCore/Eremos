import { Theron } from "../agents/theron";

test("Theron emits signal on wallet cluster", () => {
  const event = { type: "wallet_activity", cluster: [1, 2, 3, 4] };
  const signals = Theron.observe(event);
  expect(signals).toBeDefined();
});

test("Theron returns memory snapshot", () => {
  const memory = Theron.getMemory();
  expect(memory).toBeDefined();
  expect(memory.length).toBe(4);
});
