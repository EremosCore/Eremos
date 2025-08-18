import { formatError, logAgentError } from "../utils/error";

describe("Error Utility", () => {
  describe("formatError", () => {
    it("should format Error instances", () => {
      const error = new Error("Test error message");
      const result = formatError(error);
      
      expect(result).toBe("[Error] Test error message");
    });

    it("should handle unknown error types", () => {
      const result1 = formatError("string error");
      const result2 = formatError(123);
      const result3 = formatError(null);
      const result4 = formatError(undefined);
      
      expect(result1).toBe("[Error] Unknown failure");
      expect(result2).toBe("[Error] Unknown failure");
      expect(result3).toBe("[Error] Unknown failure");
      expect(result4).toBe("[Error] Unknown failure");
    });

    it("should handle Error objects with empty messages", () => {
      const error = new Error("");
      const result = formatError(error);
      
      expect(result).toBe("[Error] ");
    });
  });

  describe("logAgentError", () => {
    it("should log agent errors with formatted messages", () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error("Agent failed");
      
      logAgentError("TestAgent", error);
      
      expect(consoleSpy).toHaveBeenCalledWith("[TestAgent] [Error] Agent failed");
      consoleSpy.mockRestore();
    });

    it("should handle unknown error types in logAgentError", () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      logAgentError("TestAgent", "string error");
      logAgentError("TestAgent", 123);
      logAgentError("TestAgent", null);
      
      expect(consoleSpy).toHaveBeenCalledWith("[TestAgent] [Error] Unknown failure");
      expect(consoleSpy).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });

    it("should handle different agent names", () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error("Test error");
      
      logAgentError("Agent1", error);
      logAgentError("Agent2", error);
      
      expect(consoleSpy).toHaveBeenCalledWith("[Agent1] [Error] Test error");
      expect(consoleSpy).toHaveBeenCalledWith("[Agent2] [Error] Test error");
      consoleSpy.mockRestore();
    });
  });
});
