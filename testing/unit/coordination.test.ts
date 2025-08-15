import { describe, it, expect, beforeEach } from 'vitest';
import { AgentCoordinator, CorrelationRule } from '../../utils/coordinator';
import { SignalAnalytics, AlertRule } from '../../utils/analytics';
import { Signal } from '../../types/signal';

describe('Agent Coordination System', () => {
  let coordinator: AgentCoordinator;
  
  beforeEach(() => {
    coordinator = new AgentCoordinator();
  });

  describe('Signal Correlation', () => {
    it('should correlate matching signals', () => {
      const rule: CorrelationRule = {
        id: 'test-rule',
        requiredSignals: ['security-alert', 'performance-warning'],
        timeWindow: 5000,
        minConfidence: 0.5,
        outputPattern: 'composite-alert'
      };

      coordinator.addCorrelationRule(rule);

      // Register signals that should trigger correlation
      coordinator.registerSignal({
        agent: 'security-agent',
        type: 'security-alert',
        confidence: 0.8
      });

      coordinator.registerSignal({
        agent: 'performance-agent', 
        type: 'performance-warning',
        confidence: 0.7
      });

      // Check if correlation was detected
      const isCorrelated = coordinator.correlateSignals(['security-alert', 'performance-warning'], 5000);
      expect(isCorrelated).toBe(true);
    });

    it('should respect time windows for correlation', () => {
      const rule: CorrelationRule = {
        id: 'time-sensitive-rule',
        name: 'Time Sensitive Correlation',
        signals: ['event-a', 'event-b'],
        timeWindow: 1000, // 1 second
        action: (signals) => ({ 
          id: 'time-composite', 
          type: 'composite' as SignalType,
          source: 'coordinator',
          timestamp: Date.now(),
          data: { count: signals.length }
        })
      };

      coordinator.addCorrelationRule(rule);

      const signal1: Signal = {
        id: 'signal-1',
        type: 'event' as SignalType,
        source: 'event-a',
        timestamp: Date.now(),
        data: {}
      };

      const signal2: Signal = {
        id: 'signal-2',
        type: 'event' as SignalType,
        source: 'event-b', 
        timestamp: Date.now() + 2000, // 2 seconds later
        data: {}
      };

      coordinator.processSignal(signal1);
      const result = coordinator.processSignal(signal2);
      
      expect(result).toBeNull(); // Should not correlate due to time window
    });

    it('should handle multiple correlation rules', () => {
      const rule1: CorrelationRule = {
        id: 'rule-1',
        name: 'Rule 1',
        signals: ['type-a', 'type-b'],
        timeWindow: 5000,
        action: () => ({ 
          id: 'composite-1', 
          type: 'composite' as SignalType,
          source: 'coordinator',
          timestamp: Date.now(),
          data: { rule: 'rule-1' }
        })
      };

      const rule2: CorrelationRule = {
        id: 'rule-2', 
        name: 'Rule 2',
        signals: ['type-c', 'type-d'],
        timeWindow: 5000,
        action: () => ({ 
          id: 'composite-2', 
          type: 'composite' as SignalType,
          source: 'coordinator',
          timestamp: Date.now(),
          data: { rule: 'rule-2' }
        })
      };

      coordinator.addCorrelationRule(rule1);
      coordinator.addCorrelationRule(rule2);

      expect(coordinator.getActiveRules()).toHaveLength(2);
      expect(coordinator.getActiveRules().map(r => r.id)).toContain('rule-1');
      expect(coordinator.getActiveRules().map(r => r.id)).toContain('rule-2');
    });
  });

  describe('Signal Buffer Management', () => {
    it('should maintain signal buffer within size limits', () => {
      const coordinator = new AgentCoordinator({ maxBufferSize: 3 });
      
      for (let i = 0; i < 5; i++) {
        const signal: Signal = {
          id: `signal-${i}`,
          type: 'test' as SignalType,
          source: 'test-agent',
          timestamp: Date.now() + i,
          data: { index: i }
        };
        coordinator.processSignal(signal);
      }

      const stats = coordinator.getStats();
      expect(stats.bufferSize).toBeLessThanOrEqual(3);
    });

    it('should provide accurate statistics', () => {
      const signal: Signal = {
        id: 'test-signal',
        type: 'test' as SignalType,
        source: 'test-agent',
        timestamp: Date.now(),
        data: {}
      };

      coordinator.processSignal(signal);
      
      const stats = coordinator.getStats();
      expect(stats.totalSignalsProcessed).toBe(1);
      expect(stats.bufferSize).toBe(1);
      expect(stats.activeRules).toBe(0);
    });
  });
});

describe('Signal Analytics System', () => {
  let analytics: SignalAnalytics;

  beforeEach(() => {
    analytics = new SignalAnalytics();
  });

  describe('Metrics Calculation', () => {
    it('should calculate signal frequency correctly', () => {
      const signals: Signal[] = [
        {
          id: 'signal-1',
          type: 'test' as SignalType,
          source: 'agent-1',
          timestamp: Date.now(),
          data: {}
        },
        {
          id: 'signal-2', 
          type: 'test' as SignalType,
          source: 'agent-1',
          timestamp: Date.now() + 1000,
          data: {}
        }
      ];

      signals.forEach(signal => analytics.recordSignal(signal));
      
      const metrics = analytics.getMetrics();
      expect(metrics.totalSignals).toBe(2);
      expect(metrics.signalsBySource['agent-1']).toBe(2);
    });

    it('should track signal types distribution', () => {
      const signals: Signal[] = [
        {
          id: 'signal-1',
          type: 'security' as SignalType,
          source: 'agent-1', 
          timestamp: Date.now(),
          data: {}
        },
        {
          id: 'signal-2',
          type: 'security' as SignalType, 
          source: 'agent-2',
          timestamp: Date.now(),
          data: {}
        },
        {
          id: 'signal-3',
          type: 'performance' as SignalType,
          source: 'agent-3',
          timestamp: Date.now(),
          data: {}
        }
      ];

      signals.forEach(signal => analytics.recordSignal(signal));
      
      const metrics = analytics.getMetrics();
      expect(metrics.signalsByType['security']).toBe(2);
      expect(metrics.signalsByType['performance']).toBe(1);
    });

    it('should calculate average signal rate', () => {
      const now = Date.now();
      const signals: Signal[] = [
        {
          id: 'signal-1',
          type: 'test' as SignalType,
          source: 'agent-1',
          timestamp: now - 2000, // 2 seconds ago
          data: {}
        },
        {
          id: 'signal-2',
          type: 'test' as SignalType,
          source: 'agent-1', 
          timestamp: now - 1000, // 1 second ago
          data: {}
        },
        {
          id: 'signal-3',
          type: 'test' as SignalType,
          source: 'agent-1',
          timestamp: now, // now
          data: {}
        }
      ];

      signals.forEach(signal => analytics.recordSignal(signal));
      
      const metrics = analytics.getMetrics();
      expect(metrics.averageSignalRate).toBeGreaterThan(0);
    });
  });

  describe('Alert System', () => {
    it('should trigger alerts when conditions are met', () => {
      const mockCallback = vi.fn();
      
      const alertRule: AlertRule = {
        id: 'high-frequency-alert',
        name: 'High Frequency Alert',
        condition: (metrics) => metrics.signalsBySource['agent-1'] > 2,
        action: mockCallback
      };

      analytics.addAlertRule(alertRule);

      // Add signals to trigger alert
      for (let i = 0; i < 4; i++) {
        const signal: Signal = {
          id: `signal-${i}`,
          type: 'test' as SignalType,
          source: 'agent-1',
          timestamp: Date.now() + i,
          data: {}
        };
        analytics.recordSignal(signal);
      }

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should not trigger alerts when conditions are not met', () => {
      const mockCallback = vi.fn();
      
      const alertRule: AlertRule = {
        id: 'low-frequency-alert',
        name: 'Low Frequency Alert', 
        condition: (metrics) => metrics.totalSignals > 10,
        action: mockCallback
      };

      analytics.addAlertRule(alertRule);

      const signal: Signal = {
        id: 'signal-1',
        type: 'test' as SignalType,
        source: 'agent-1',
        timestamp: Date.now(),
        data: {}
      };
      
      analytics.recordSignal(signal);

      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should manage alert rules correctly', () => {
      const alertRule: AlertRule = {
        id: 'test-alert',
        name: 'Test Alert',
        condition: () => false,
        action: () => {}
      };

      analytics.addAlertRule(alertRule);
      expect(analytics.getActiveAlerts()).toHaveLength(1);

      analytics.removeAlertRule('test-alert');
      expect(analytics.getActiveAlerts()).toHaveLength(0);
    });
  });

  describe('Data Export', () => {
    it('should export metrics in correct format', () => {
      const signal: Signal = {
        id: 'test-signal',
        type: 'test' as SignalType,
        source: 'test-agent',
        timestamp: Date.now(),
        data: { value: 42 }
      };

      analytics.recordSignal(signal);
      
      const exported = analytics.exportData();
      expect(exported).toHaveProperty('timestamp');
      expect(exported).toHaveProperty('metrics');
      expect(exported).toHaveProperty('signals');
      expect(exported.signals).toHaveLength(1);
      expect(exported.signals[0]).toEqual(signal);
    });

    it('should reset data when requested', () => {
      const signal: Signal = {
        id: 'test-signal',
        type: 'test' as SignalType,
        source: 'test-agent',
        timestamp: Date.now(),
        data: {}
      };

      analytics.recordSignal(signal);
      expect(analytics.getMetrics().totalSignals).toBe(1);

      analytics.reset();
      expect(analytics.getMetrics().totalSignals).toBe(0);
    });
  });

  describe('Trend Analysis', () => {
    it('should detect increasing trends', () => {
      const baseTime = Date.now() - 5000;
      
      // Create an increasing trend
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < i + 1; j++) {
          const signal: Signal = {
            id: `signal-${i}-${j}`,
            type: 'test' as SignalType,
            source: 'test-agent',
            timestamp: baseTime + (i * 1000),
            data: {}
          };
          analytics.recordSignal(signal);
        }
      }

      const trends = analytics.analyzeTrends();
      expect(trends.overallTrend).toBe('increasing');
    });

    it('should detect anomalies in signal patterns', () => {
      const baseTime = Date.now() - 10000;
      
      // Normal pattern: 1 signal per second
      for (let i = 0; i < 5; i++) {
        const signal: Signal = {
          id: `normal-${i}`,
          type: 'test' as SignalType,
          source: 'test-agent',
          timestamp: baseTime + (i * 1000),
          data: {}
        };
        analytics.recordSignal(signal);
      }

      // Anomaly: 10 signals in one second
      for (let i = 0; i < 10; i++) {
        const signal: Signal = {
          id: `anomaly-${i}`,
          type: 'test' as SignalType,
          source: 'test-agent',
          timestamp: baseTime + 6000,
          data: {}
        };
        analytics.recordSignal(signal);
      }

      const trends = analytics.analyzeTrends();
      expect(trends.anomalies).toHaveLength(1);
    });
  });
});
