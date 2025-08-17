import { Harvester } from "../agents/harvester";

describe("Harvester Agent", () => {
  it("should process mint activity events with amount > 10", () => {
    const event = {
      type: "mint_activity",
      address: "0x123",
      amount: 15,
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Harvester.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "Mint spike detected:",
      15
    );
    consoleSpy.mockRestore();
  });

  it("should not process mint activity events with amount <= 10", () => {
    const event = {
      type: "mint_activity",
      address: "0x123",
      amount: 5,
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Harvester.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Mint spike detected:",
      expect.any(Number)
    );
    consoleSpy.mockRestore();
  });

  it("should not process non-mint activity events", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      amount: 100
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Harvester.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Mint spike detected:",
      expect.any(Number)
    );
    consoleSpy.mockRestore();
  });

  it("should handle null/undefined events gracefully", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    Harvester.observe(null);
    Harvester.observe(undefined);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Mint spike detected:",
      expect.any(Number)
    );
    consoleSpy.mockRestore();
  });

  it("should have correct agent properties", () => {
    expect(Harvester.id).toBe("agent-harvester");
    expect(Harvester.name).toBe("Harvester");
    expect(Harvester.role).toBe("indexing");
    expect(Harvester.glyph).toBe("λ");
    expect(Harvester.watchType).toBe("mint_activity");
    expect(Harvester.triggerThreshold).toBe(2);
    expect(Harvester.lastSignal).toBe(null);
    expect(Harvester.description).toContain("Indexes mint data");
  });

  it("should process multiple mint events correctly", () => {
    const events = [
      { type: "mint_activity", amount: 20 },
      { type: "mint_activity", amount: 30 },
      { type: "mint_activity", amount: 5 } // Should not trigger
    ];
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    events.forEach(event => {
      Harvester.observe(event);
    });
    
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith("Mint spike detected:", 20);
    expect(consoleSpy).toHaveBeenCalledWith("Mint spike detected:", 30);
    consoleSpy.mockRestore();
  });
});
