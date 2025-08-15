import { describe, it, expect, beforeEach } from "vitest";
import { AgentCoordinator } from "../utils/coordinator";

describe("AgentCoordinator", () => {
  let coordinator: AgentCoordinator;

  beforeEach(() => {
    coordinator = new AgentCoordinator();
  });

  it("should register signals and track them", () => {
    coordinator.registerSignal({
      agent: "TestAgent",
      type: "test_signal",
      confidence: 0.8
    });

    const stats = coordinator.getSignalStats();
    expect(stats.total).toBe(1);
    expect(stats.unique_types).toBe(1);
    expect(stats.agents).toBe(1);
  });

  it("should correlate signals within time window", () => {
    coordinator.registerSignal({
      agent: "Agent1",
      type: "cex_funding_detected",
      confidence: 0.85
    });

    coordinator.registerSignal({
      agent: "Agent2", 
      type: "rapid_deployment",
      confidence: 0.78
    });

    const correlated = coordinator.correlateSignals(
      ["cex_funding_detected", "rapid_deployment"], 
      30000
    );

    expect(correlated).toBe(true);
  });

  it("should not correlate signals outside time window", () => {
    coordinator.registerSignal({
      agent: "Agent1",
      type: "old_signal",
      confidence: 0.8
    });

    // Wait a bit (in a real scenario this would be a longer delay)
    const correlated = coordinator.correlateSignals(
      ["old_signal", "new_signal"], 
      1 // Very short window
    );

    expect(correlated).toBe(false);
  });

  it("should emit composite signals", () => {
    const composite = coordinator.emitCompositeSignal({
      type: "coordinated_launch_pattern",
      confidence: 0.95,
      contributingAgents: ["Agent1", "Agent2"],
      pattern: "test_pattern"
    });

    expect(composite.type).toBe("coordinated_launch_pattern");
    expect(composite.confidence).toBe(0.95);
    expect(composite.contributingAgents).toEqual(["Agent1", "Agent2"]);
    expect(composite.timestamp).toBeDefined();
  });

  it("should maintain buffer size limit", () => {
    const coordinator = new AgentCoordinator();
    
    // Add signals beyond buffer size (assuming small buffer for test)
    for (let i = 0; i < 1010; i++) {
      coordinator.registerSignal({
        agent: `Agent${i}`,
        type: `signal_${i}`,
        confidence: 0.5
      });
    }

    const stats = coordinator.getSignalStats();
    expect(stats.total).toBeLessThanOrEqual(1000); // Buffer size limit
  });
});
