import { ExampleAgent } from "../agents/example";
import { Theron } from "../agents/theron";
import { Harvester } from "../agents/harvester";
import { Observer } from "../agents/observer";
import { LaunchTracker } from "../agents/launchtracker";
import { GhostWatcher } from "../agents/skieró";

describe("Agent Integration Tests", () => {
  it("should handle multiple agents processing the same event", () => {
    const event = {
      type: "wallet_activity",
      address: "0x123",
      amount: 100,
      cluster: ["0x1", "0x2", "0x3", "0x4"]
    };
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Multiple agents should process this event
    ExampleAgent.observe(event);
    Observer.observe(event);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Example")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Observed cluster:",
      ["0x1", "0x2", "0x3", "0x4"]
    );
    consoleSpy.mockRestore();
  });

  it("should handle different event types across agents", () => {
    const events = [
      { type: "anomaly", pattern: "suspicious", confidence: 0.8 },
      { type: "mint_activity", amount: 15 },
      { type: "wallet_activity", cluster: ["0x1", "0x2", "0x3", "0x4"] },
      { type: "reactivation", walletAgeDays: 200 }
    ];
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Each agent should process their respective event types
    Theron.observe(events[0]);
    Harvester.observe(events[1]);
    Observer.observe(events[2]);
    GhostWatcher.observe(events[3]);
    
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Theron")
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Mint spike detected:",
      15
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Observed cluster:",
      ["0x1", "0x2", "0x3", "0x4"]
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Skieró")
    );
    consoleSpy.mockRestore();
  });

  it("should verify all agents have required properties", () => {
    const agents = [ExampleAgent, Theron, Harvester, Observer, LaunchTracker, GhostWatcher];
    
    agents.forEach(agent => {
      expect(agent.id).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.role).toBeDefined();
      expect(agent.watchType).toBeDefined();
      expect(agent.glyph).toBeDefined();
      expect(agent.triggerThreshold).toBeDefined();
      expect(agent.originTimestamp).toBeDefined();
      expect(agent.description).toBeDefined();
      expect(typeof agent.observe).toBe("function");
      // Some agents may not have getMemory function
      if (agent.getMemory) {
        expect(typeof agent.getMemory).toBe("function");
      }
    });
  });

  it("should verify all agents return memory arrays", () => {
    const agents = [ExampleAgent, Theron, Harvester, Observer, LaunchTracker, GhostWatcher];
    
    agents.forEach(agent => {
      if (agent.getMemory) {
        const memory = agent.getMemory();
        expect(Array.isArray(memory)).toBe(true);
        expect(memory.length).toBeGreaterThan(0);
      }
    });
  });

  it("should handle rapid event processing", () => {
    const events = Array.from({ length: 10 }, (_, i) => ({
      type: "wallet_activity",
      address: `0x${i}`,
      amount: 100 + i
    }));
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    events.forEach(event => {
      ExampleAgent.observe(event);
    });
    
    // ExampleAgent calls logSignal for each wallet_activity event
    expect(consoleSpy).toHaveBeenCalledTimes(10);
    consoleSpy.mockRestore();
  });

  it("should handle mixed event types in sequence", () => {
    const events = [
      { type: "anomaly", pattern: "test" },
      { type: "mint_activity", amount: 20 },
      { type: "wallet_activity", cluster: ["0x1", "0x2", "0x3", "0x4"] },
      { type: "reactivation", walletAgeDays: 300 },
      { type: "wallet_activity", source: "kraken", fundingDetected: true, deployDetected: true, bundleCount: 5 }
    ];
    
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    events.forEach(event => {
      Theron.observe(event);
      Harvester.observe(event);
      Observer.observe(event);
      GhostWatcher.observe(event);
      LaunchTracker.observe(event);
    });
    
    // Should have multiple log calls from different agents
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
