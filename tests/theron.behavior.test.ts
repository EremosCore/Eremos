import { Theron } from "../agents/theron";

test("Theron emits signal on anomaly", () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  const event = { type: "anomaly" };
  Theron.observe(event);

  expect(consoleSpy).toHaveBeenCalled();

  consoleSpy.mockRestore();
});

test("Theron returns memory snapshot", () => {
  const memory = Theron.getMemory();
  expect(memory).toBeDefined();
  expect(memory.length).toBe(4);
});
