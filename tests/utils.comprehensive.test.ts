import { debug } from "../utils/debug";
import { formatError, logAgentError } from "../utils/error";
import { initAgent, shutdownAgent, heartbeat } from "../utils/lifecycle";
import { logSignal } from "../utils/logger";
import { recordCall, getCallCount } from "../utils/metrics";
import { generateSignalHash } from "../utils/signal";
import { now, secondsAgo, isOlderThan } from "../utils/time";

describe("Comprehensive Utils Integration Tests", () => {
  describe("Error handling with lifecycle", () => {
    it("should handle agent lifecycle with error logging", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      initAgent("TestAgent");
      const error = new Error("Test error");
      logAgentError("TestAgent", error);
      shutdownAgent("TestAgent");
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("TestAgent activated")
      );
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining("TestAgent")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("TestAgent deactivated")
      );
      
      consoleSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("Signal generation with logging", () => {
    it("should generate and log signals properly", () => {
      const event = {
        type: "test_event",
        data: "test_data",
        timestamp: new Date().toISOString()
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const hash = generateSignalHash(event);
      logSignal({
        agent: "TestAgent",
        type: "test_signal",
        glyph: "T",
        hash,
        timestamp: new Date().toISOString()
      });
      
      expect(hash).toBeDefined();
      expect(hash).toMatch(/^sig_/);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("TestAgent")
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe("Debug with metrics tracking", () => {
    it("should track debug calls with metrics", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      debug("TestScope", "debug message");
      recordCall("TestScope");
      
      expect(consoleSpy).toHaveBeenCalledWith("[TESTSCOPE] debug message");
      expect(getCallCount("TestScope")).toBe(1);
      
      consoleSpy.mockRestore();
    });
  });

  describe("Time-based operations", () => {
    it("should handle time-based operations correctly", () => {
      const currentTime = now();
      const tenSecondsAgo = secondsAgo(10);
      const isOld = isOlderThan(tenSecondsAgo, 5);
      
      expect(currentTime).toBeGreaterThan(tenSecondsAgo);
      expect(isOld).toBe(true);
    });

    it("should handle edge cases in time operations", () => {
      const futureTime = now() + 60000; // 1 minute in future
      const pastTime = now() - 60000; // 1 minute ago
      
      expect(isOlderThan(futureTime, 30)).toBe(false);
      expect(isOlderThan(pastTime, 30)).toBe(true);
    });
  });

  describe("Complex error scenarios", () => {
    it("should handle various error types", () => {
      const errors = [
        new Error("Standard error"),
        "String error",
        123,
        null,
        undefined,
        { custom: "error" }
      ];
      
      errors.forEach(error => {
        const formatted = formatError(error);
        expect(formatted).toContain("[Error]");
      });
    });
  });

  describe("Multiple agent lifecycle", () => {
    it("should handle multiple agents in sequence", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const agents = ["Agent1", "Agent2", "Agent3"];
      
      agents.forEach(agent => {
        initAgent(agent);
        heartbeat(agent);
        shutdownAgent(agent);
      });
      
      expect(consoleSpy).toHaveBeenCalledTimes(9); // 3 agents × 3 calls each
      
      consoleSpy.mockRestore();
    });
  });

  describe("Metrics with multiple agents", () => {
    it("should track multiple agents correctly", () => {
      const agents = ["Agent1", "Agent2", "Agent3"];
      
      agents.forEach((agent, index) => {
        for (let i = 0; i <= index; i++) {
          recordCall(agent);
        }
      });
      
      expect(getCallCount("Agent1")).toBe(1);
      expect(getCallCount("Agent2")).toBe(2);
      expect(getCallCount("Agent3")).toBe(3);
      expect(getCallCount("NonExistentAgent")).toBe(0);
    });
  });

  describe("Signal with details and confidence", () => {
    it("should log signals with complex details", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const signal = {
        agent: "ComplexAgent",
        type: "complex_signal",
        glyph: "C",
        hash: "complex_hash_123",
        timestamp: new Date().toISOString(),
        details: {
          confidence: 0.95,
          metadata: {
            source: "test",
            version: "1.0"
          },
          nested: {
            data: "value"
          }
        }
      };
      
      logSignal(signal);
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("ComplexAgent")
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "├─ context:",
        expect.stringContaining("confidence")
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe("Performance under load", () => {
    it("should handle rapid operations", () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Rapid debug calls
      for (let i = 0; i < 100; i++) {
        debug("PerfTest", `message_${i}`);
        recordCall(`Agent_${i % 10}`);
      }
      
      expect(consoleSpy).toHaveBeenCalledTimes(100);
      expect(getCallCount("Agent_0")).toBe(10);
      
      consoleSpy.mockRestore();
    });
  });
});
