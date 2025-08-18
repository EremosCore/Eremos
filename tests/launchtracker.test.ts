import { LaunchTracker } from "../agents/launchtracker";

describe("LaunchTracker Agent", () => {
  it("should process wallet activity events with all required conditions", () => {
    const event = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 5,
      address: "0x123",
      timestamp: new Date().toISOString()
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("launch_detected")
    );
    consoleSpy.mockRestore();
  });

  it("should not process events without kraken source", () => {
    const event = {
      type: "wallet_activity",
      source: "binance",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 5
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should not process events without funding detected", () => {
    const event = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: false,
      deployDetected: true,
      bundleCount: 5
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should not process events without deploy detected", () => {
    const event = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: false,
      bundleCount: 5
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should not process events with insufficient bundle count", () => {
    const event = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 2
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should not process non-wallet activity events", () => {
    const event = {
      type: "mint_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 5
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should handle null/undefined events gracefully", () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(null);
    LaunchTracker.observe(undefined);
    
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });

  it("should have correct agent properties", () => {
    expect(LaunchTracker.id).toBe("agent-launch");
    expect(LaunchTracker.name).toBe("LaunchTracker");
    expect(LaunchTracker.role).toBe("launch_monitor");
    expect(LaunchTracker.watchType).toBe("wallet_activity");
    expect(LaunchTracker.glyph).toBe("Σ");
    expect(LaunchTracker.triggerThreshold).toBe(2);
    expect(LaunchTracker.lastSignal).toBe(null);
    expect(LaunchTracker.originTimestamp).toBe("2025-06-12T00:00:00.000Z");
    expect(LaunchTracker.description).toContain("Monitors freshly funded wallets");
  });

  it("should return memory snapshot", () => {
    const memory = LaunchTracker.getMemory?.() || [];
    expect(Array.isArray(memory)).toBe(true);
    expect(memory).toContain("launch.signal.001");
    expect(memory).toContain("funding.detected");
  });

  it("should process events with exact bundle count threshold", () => {
    const event = {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 3
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    LaunchTracker.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("LaunchTracker")
    );
    consoleSpy.mockRestore();
  });
});
