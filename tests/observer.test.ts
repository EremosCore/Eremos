import { Observer } from "../agents/observer";

describe("Observer Agent", () => {
  it("should process wallet activity events with cluster length > 3", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      cluster: ["0x1", "0x2", "0x3", "0x4"],
      amount: 100,
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Observer.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "Observed cluster:",
      ["0x1", "0x2", "0x3", "0x4"]
    );
    consoleSpy.mockRestore();
  });

  it("should not process wallet activity events with cluster length <= 3", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      cluster: ["0x1", "0x2"],
      amount: 100,
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Observer.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Observed cluster:",
      expect.any(Array)
    );
    consoleSpy.mockRestore();
  });

  it("should not process non-wallet activity events", () => {
    const event = {
      type: "mint_activity",
      address: "0x123",
      cluster: ["0x1", "0x2", "0x3", "0x4"],
      amount: 100
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Observer.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Observed cluster:",
      expect.any(Array)
    );
    consoleSpy.mockRestore();
  });

  it("should handle null/undefined events gracefully", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Observer.observe(null);
    Observer.observe(undefined);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Observed cluster:",
      expect.any(Array)
    );
    consoleSpy.mockRestore();
  });

  it("should handle events without cluster property", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      amount: 100
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Observer.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Observed cluster:",
      expect.any(Array)
    );
    consoleSpy.mockRestore();
  });

  it("should have correct agent properties", () => {
    expect(Observer.id).toBe("agent-observer");
    expect(Observer.name).toBe("Observer");
    expect(Observer.role).toBe("surveillance");
    expect(Observer.glyph).toBe("φ");
    expect(Observer.watchType).toBe("wallet_activity");
    expect(Observer.triggerThreshold).toBe(3);
    expect(Observer.lastSignal).toBe(null);
    expect(Observer.description).toContain("passive agent");
  });

  it("should process multiple wallet events correctly", () => {
    const events = [
      { type: "wallet_activity", cluster: ["0x1", "0x2", "0x3", "0x4"] },
      { type: "wallet_activity", cluster: ["0x1", "0x2", "0x3", "0x4", "0x5"] },
      { type: "wallet_activity", cluster: ["0x1", "0x2"] } // Should not trigger
    ];
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    events.forEach(event => {
      Observer.observe(event);
    });
    
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith("Observed cluster:", ["0x1", "0x2", "0x3", "0x4"]);
    expect(consoleSpy).toHaveBeenCalledWith("Observed cluster:", ["0x1", "0x2", "0x3", "0x4", "0x5"]);
    consoleSpy.mockRestore();
  });
});
