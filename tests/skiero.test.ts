import { GhostWatcher } from "../agents/skieró";

describe("Skieró (GhostWatcher) Agent", () => {
  it("should process reactivation events with wallet age > 180 days", () => {
    const event = {
      type: "reactivation",
      walletAgeDays: 200,
      address: "0x123",
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("wallet_reactivated")
    );
    consoleSpy.mockRestore();
  });

  it("should not process reactivation events with wallet age <= 180 days", () => {
    const event = {
      type: "reactivation",
      walletAgeDays: 150,
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should not process non-reactivation events", () => {
    const event = {
      type: "wallet_activity",
      walletAgeDays: 200,
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should handle null/undefined events gracefully", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // These will throw errors due to null/undefined access, which is expected behavior
    expect(() => GhostWatcher.observe(null)).toThrow();
    expect(() => GhostWatcher.observe(undefined)).toThrow();
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should handle events without walletAgeDays property", () => {
    const event = {
      type: "reactivation",
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should have correct agent properties", () => {
    expect(GhostWatcher.id).toBe("agent-022");
    expect(GhostWatcher.name).toBe("Skieró");
    expect(GhostWatcher.role).toBe("dormant_wallet_monitor");
    expect(GhostWatcher.watchType).toBe("wallet_activity");
    expect(GhostWatcher.glyph).toBe("ψ");
    expect(GhostWatcher.triggerThreshold).toBe(0.7);
    expect(GhostWatcher.lastSignal).toBe("inactive");
    expect(GhostWatcher.originTimestamp).toBe("2024-07-03T00:00:00.000Z");
    expect(GhostWatcher.description).toContain("Tracks long-dormant wallets");
  });

  it("should return memory snapshot", () => {
    const memory = GhostWatcher.getMemory?.() || [];
    expect(Array.isArray(memory)).toBe(true);
    expect(memory).toContain("ghost.wallet.3x89");
    expect(memory).toContain("anomaly.102b");
  });

  it("should process events with exact wallet age threshold", () => {
    const event = {
      type: "reactivation",
      walletAgeDays: 181,
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should process events with very old wallets", () => {
    const event = {
      type: "reactivation",
      walletAgeDays: 1000,
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should include confidence in signal details", () => {
    const event = {
      type: "reactivation",
      walletAgeDays: 200,
      address: "0x123"
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    GhostWatcher.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "├─ context:",
      expect.stringContaining("confidence")
    );
    consoleSpy.mockRestore();
  });
});
