import { describe, it, expect } from "vitest";
import { ExampleAgent } from "../agents/example";

describe("ExampleAgent", () => {
  it("should return memory snapshot", () => {
    const mem = ExampleAgent.getMemory?.() || [];
    expect(mem.length).toBeGreaterThan(0);
  });
});
