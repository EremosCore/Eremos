import { ExampleAgent } from "../agents/example";

describe("ExampleAgent", () => {
  it("should return memory snapshot", () => {
    const mem = ExampleAgent.getMemory?.() || [];
    expect(mem.length).toBeGreaterThan(0);
    expect(mem).toContain("template_signal_001");
    expect(mem).toContain("wallet_event_placeholder");
  });

  it("should observe wallet activity events", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      amount: 100,
      timestamp: new Date().toISOString()
    };
    
    // Mock console.log to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    ExampleAgent.observe(event);
    
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("should not process non-wallet activity events", () => {
    const event = {
      type: "mint_activity",
      address: "0x123",
      amount: 100
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    ExampleAgent.observe(event);
    
    // Should not call logSignal for non-wallet activity
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Example")
    );
    consoleSpy.mockRestore();
  });

  it("should handle null/undefined events gracefully", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    ExampleAgent.observe(null);
    ExampleAgent.observe(undefined);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Example")
    );
    consoleSpy.mockRestore();
  });

  it("should have correct agent properties", () => {
    expect(ExampleAgent.id).toBe("agent-xxx");
    expect(ExampleAgent.name).toBe("Example");
    expect(ExampleAgent.role).toBe("template");
    expect(ExampleAgent.watchType).toBe("wallet_activity");
    expect(ExampleAgent.glyph).toBe("x");
    expect(ExampleAgent.triggerThreshold).toBe(3);
    expect(ExampleAgent.lastSignal).toBe(null);
    expect(ExampleAgent.originTimestamp).toBe("2025-01-01T00:00:00.000Z");
    expect(ExampleAgent.description).toContain("Template agent");
  });
});