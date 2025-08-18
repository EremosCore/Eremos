import { Theron } from "../agents/theron";

describe("Theron Memory", () => {
  test("Theron returns memory snapshot", () => {
    const memory = Theron.getMemory?.() || [];
    expect(Array.isArray(memory)).toBe(true);
    expect(memory.length).toBeGreaterThanOrEqual(0);
  });

  test("Theron memory contains expected fragments", () => {
    const memory = Theron.getMemory?.() || [];
    expect(memory).toContain("fragment_03c9");
    expect(memory).toContain("fragment_12b7");
    expect(memory).toContain("signal_α-vii");
    expect(memory).toContain("ripple.undeclared");
  });

  test("Theron memory is immutable", () => {
    const memory1 = Theron.getMemory?.() || [];
    const memory2 = Theron.getMemory?.() || [];
    expect(memory1).toEqual(memory2);
  });

  test("Theron memory is always an array", () => {
    const memory = Theron.getMemory?.();
    expect(Array.isArray(memory)).toBe(true);
  });
});