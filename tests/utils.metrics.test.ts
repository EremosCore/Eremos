import { recordCall, getCallCount } from "../utils/metrics";

describe("Metrics Utility", () => {
  beforeEach(() => {
    // Clear metrics before each test
    Object.keys(require("../utils/metrics").metrics || {}).forEach(key => {
      delete require("../utils/metrics").metrics[key];
    });
  });

  test("tracks agent call count", () => {
    recordCall("test-agent");
    recordCall("test-agent");
    expect(getCallCount("test-agent")).toBe(2);
  });

  test("should return 0 for non-existent agent", () => {
    expect(getCallCount("non-existent-agent")).toBe(0);
  });

  test("should handle multiple agents", () => {
    recordCall("agent1");
    recordCall("agent1");
    recordCall("agent2");
    
    expect(getCallCount("agent1")).toBe(2);
    expect(getCallCount("agent2")).toBe(1);
    expect(getCallCount("agent3")).toBe(0);
  });

  test("should handle single call", () => {
    recordCall("single-agent");
    expect(getCallCount("single-agent")).toBe(1);
  });

  test("should handle empty string agent id", () => {
    recordCall("");
    expect(getCallCount("")).toBe(1);
  });

  test("should handle special characters in agent id", () => {
    recordCall("agent-with-special-chars!@#$%");
    expect(getCallCount("agent-with-special-chars!@#$%")).toBe(1);
  });

  test("should handle numeric agent id", () => {
    recordCall("123");
    expect(getCallCount("123")).toBe(1);
  });

  test("should handle multiple calls to same agent", () => {
    for (let i = 0; i < 10; i++) {
      recordCall("multi-call-agent");
    }
    expect(getCallCount("multi-call-agent")).toBe(10);
  });
});
