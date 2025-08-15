import { describe, it, expect } from 'vitest';
import { SignalAnalytics } from "../utils/analytics";

describe('Analytics Tests', () => {
  it("SignalAnalytics can be instantiated", () => {
    const analytics = new SignalAnalytics();
    expect(analytics).toBeDefined();
  });

  it("Analytics can track signals", () => {
    const analytics = new SignalAnalytics();
    
    analytics.addSignal({
      type: "test_signal",
      hash: "sig_test123",
      timestamp: new Date().toISOString(),
      source: "TestAgent",
      confidence: 0.85
    });
    
    const metrics = analytics.getMetrics();
    expect(metrics.totalSignals).toBe(1);
    expect(metrics.signalsByType['test_signal']).toBe(1);
  });

  it("Analytics calculates metrics correctly", () => {
    const analytics = new SignalAnalytics();
    
    analytics.addSignal({
      type: "signal_1",
      hash: "sig_1",
      timestamp: new Date().toISOString(),
      source: "Agent1",
      confidence: 0.8
    });
    
    analytics.addSignal({
      type: "signal_2", 
      hash: "sig_2",
      timestamp: new Date().toISOString(),
      source: "Agent2",
      confidence: 0.9
    });
    
    const metrics = analytics.getMetrics();
    expect(metrics.totalSignals).toBe(2);
    expect(metrics.averageConfidence).toBeCloseTo(0.85, 2);
  });

  it("Alert rules can be added and work", () => {
    const analytics = new SignalAnalytics();
    
    analytics.addAlertRule({
      id: "test_alert",
      name: "Test Alert",
      condition: (signal) => signal.type === "test_signal",
      priority: "medium", 
      cooldown: 1000,
      enabled: true,
      description: "Test alert rule"
    });
    
    const alerts = analytics.addSignal({
      type: "test_signal",
      hash: "sig_alert",
      timestamp: new Date().toISOString(),
      source: "TestAgent",
      confidence: 0.9
    });
    
    expect(alerts).toHaveLength(1);
    expect(alerts[0].ruleId).toBe("test_alert");
  });

  it("Signal trends can be calculated", () => {
    const analytics = new SignalAnalytics();
    
    // Add some signals
    for (let i = 0; i < 5; i++) {
      analytics.addSignal({
        type: "trend_signal",
        hash: `sig_trend_${i}`,
        timestamp: new Date().toISOString(),
        source: "TrendAgent",
        confidence: 0.8
      });
    }
    
    const trends = analytics.getSignalTrends(1); // Last 1 hour
    expect(trends).toBeDefined();
    expect(Array.isArray(trends)).toBe(true);
  });

  it("Metrics can be exported", () => {
    const analytics = new SignalAnalytics();
    
    analytics.addSignal({
      type: "export_test",
      hash: "sig_export",
      timestamp: new Date().toISOString(), 
      source: "ExportAgent",
      confidence: 0.75
    });
    
    const exported = analytics.exportMetrics('json');
    expect(typeof exported).toBe('string');
    
    const parsed = JSON.parse(exported);
    expect(parsed.totalSignals).toBe(1);
  });
});
