import { debug } from "../utils/debug";

describe("Debug Utility", () => {
  it("should log debug messages with scope", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    debug("test", "debug message");
    
    expect(consoleSpy).toHaveBeenCalledWith("[TEST] debug message");
    consoleSpy.mockRestore();
  });

  it("should handle different scopes", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    debug("agent", "agent message");
    debug("system", "system message");
    
    expect(consoleSpy).toHaveBeenCalledWith("[AGENT] agent message");
    expect(consoleSpy).toHaveBeenCalledWith("[SYSTEM] system message");
    consoleSpy.mockRestore();
  });

  it("should handle empty messages", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    debug("test", "");
    
    expect(consoleSpy).toHaveBeenCalledWith("[TEST] ");
    consoleSpy.mockRestore();
  });

  it("should handle special characters in scope", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    debug("test-scope", "message");
    debug("test_scope", "message");
    
    expect(consoleSpy).toHaveBeenCalledWith("[TEST-SCOPE] message");
    expect(consoleSpy).toHaveBeenCalledWith("[TEST_SCOPE] message");
    consoleSpy.mockRestore();
  });
});
