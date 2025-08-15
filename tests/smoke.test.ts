import { describe, it, expect } from 'vitest';
import { AgentCoordinator } from "../utils/coordinator";

describe('Smoke Tests', () => {
  it("AgentCoordinator can be instantiated", () => {
    const coordinator = new AgentCoordinator();
    expect(coordinator).toBeDefined();
  });

  it("Coordinator can register signals", () => {
    const coordinator = new AgentCoordinator();
    coordinator.registerSignal({
      agent: "TestAgent",
      type: "test_signal", 
      confidence: 0.8
    });
    
    const stats = coordinator.getSignalStats();
    expect(stats.total).toBe(1);
  });

  it("Signal correlation works", () => {
    const coordinator = new AgentCoordinator();
    
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
    
    const hasCorrelation = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment']);
    expect(hasCorrelation).toBe(true);
  });
});
