import { Theron } from "../agents/theron";

test("Theron emits signal on wallet cluster", () => {
  const event = { type: "wallet_activity" };
  const signals = Theron.observe(event);
  expect(signals).toBeDefined();
});
