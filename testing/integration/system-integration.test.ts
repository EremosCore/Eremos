import { describe, it, expect, beforeEach } from 'vitest';
import { AgentCoordinator } from '../../utils/coordinator';
import { SignalAnalytics } from '../../utils/analytics';
import { generateSignalHash, logSignal } from '../../utils/signal';
import { Signal } from '../../types/signal';

describe('Integration Tests', () => {
  let coordinator: AgentCoordinator;
  let analytics: SignalAnalytics;

  beforeEach(() => {
    coordinator = new AgentCoordinator();
    analytics = new SignalAnalytics();
  });

  describe('End-to-End Signal Processing', () => {
    it('should process signals through the complete pipeline', () => {
      // Create a test signal
      const signalData = {
        agent: 'observer',
        type: 'cex_funding_detected',
        confidence: 0.9,
        metadata: { exchange: 'binance', amount: '1000000' }
      };

      // Register signal with coordinator
      coordinator.registerSignal(signalData);

      // Create a complete signal for analytics
      const fullSignal: Signal = {
        type: 'cex_funding_detected',
        hash: generateSignalHash(signalData.type),
        timestamp: new Date().toISOString(),
        source: signalData.agent,
        confidence: signalData.confidence,
        metadata: signalData.metadata
      };

      // Process through analytics
      analytics.addSignal(fullSignal);

      // Verify both systems processed the signal
      const metrics = analytics.getMetrics();
      expect(metrics.totalSignals).toBe(1);
      expect(metrics.signalsByType['cex_funding_detected']).toBe(1);
    });

    it('should detect cross-system correlation patterns', () => {
      // Register related signals for correlation
      const signal1 = {
        agent: 'observer',
        type: 'cex_funding_detected',
        confidence: 0.9
      };

      const signal2 = {
        agent: 'harvester',
        type: 'rapid_deployment',
        confidence: 0.85
      };

      coordinator.registerSignal(signal1);
      coordinator.registerSignal(signal2);

      // Check if correlation is detected
      const hasCorrelation = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment'], 30000);
      expect(hasCorrelation).toBe(true);

      // Process same signals through analytics
      const fullSignal1: Signal = {
        type: 'cex_funding_detected',
        hash: generateSignalHash('cex_funding_detected'),
        timestamp: new Date().toISOString(),
        source: 'observer',
        confidence: 0.9
      };

      const fullSignal2: Signal = {
        type: 'rapid_deployment',
        hash: generateSignalHash('rapid_deployment'),
        timestamp: new Date().toISOString(),
        source: 'harvester',
        confidence: 0.85
      };

      analytics.addSignal(fullSignal1);
      analytics.addSignal(fullSignal2);

      const metrics = analytics.getMetrics();
      expect(metrics.totalSignals).toBe(2);
      expect(metrics.averageConfidence).toBe(0.875); // (0.9 + 0.85) / 2
    });
  });

  describe('Multi-Agent Coordination', () => {
    it('should coordinate signals from multiple agents', () => {
      const agentSignals = [
        { agent: 'observer', type: 'wallet_activity', confidence: 0.8 },
        { agent: 'harvester', type: 'token_deployment', confidence: 0.9 },
        { agent: 'theron', type: 'price_movement', confidence: 0.75 },
        { agent: 'launchtracker', type: 'launch_detected', confidence: 0.95 }
      ];

      // Register all signals
      agentSignals.forEach(signal => {
        coordinator.registerSignal(signal);
      });

      // Get statistics
      const stats = coordinator.getSignalStats();
      expect(stats.total).toBe(4);
      expect(stats.agents).toBe(4);
      expect(stats.unique_types).toBe(4);
    });

    it('should maintain signal correlation across time windows', () => {
      // Test time-sensitive correlations
      const now = Date.now();
      
      // First signal
      const signal1 = {
        agent: 'observer',
        type: 'dormant_wallet_activated',
        confidence: 0.8
      };
      
      coordinator.registerSignal(signal1);
      
      // Simulate small delay (within correlation window)
      setTimeout(() => {
        const signal2 = {
          agent: 'theron',
          type: 'high_value_transaction',
          confidence: 0.9
        };
        
        coordinator.registerSignal(signal2);
        
        // Check correlation (should succeed within time window)
        const correlation = coordinator.correlateSignals(['dormant_wallet_activated', 'high_value_transaction'], 120000);
        expect(correlation).toBe(true);
      }, 100); // 100ms delay
    });
  });

  describe('Real-time Analytics Processing', () => {
    it('should handle high-frequency signal processing', () => {
      const signalBatch = [];
      
      // Generate a batch of signals
      for (let i = 0; i < 50; i++) {
        const signal: Signal = {
          type: `signal_type_${i % 5}`,
          hash: generateSignalHash(`signal_type_${i % 5}`),
          timestamp: new Date(Date.now() + i * 100).toISOString(),
          source: `agent_${i % 3}`,
          confidence: 0.5 + (Math.random() * 0.5),
          metadata: { batch: 'test', index: i }
        };
        signalBatch.push(signal);
      }

      const startTime = Date.now();
      
      // Process all signals
      signalBatch.forEach(signal => {
        analytics.addSignal(signal);
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Verify processing completed quickly
      expect(processingTime).toBeLessThan(1000); // Under 1 second
      
      const metrics = analytics.getMetrics();
      expect(metrics.totalSignals).toBe(50);
      expect(Object.keys(metrics.signalsByType)).toHaveLength(5);
      expect(Object.keys(metrics.signalsByAgent)).toHaveLength(3);
    });

    it('should maintain consistency between coordinator and analytics', () => {
      const testSignals = [
        { agent: 'observer', type: 'test_signal_1', confidence: 0.8 },
        { agent: 'harvester', type: 'test_signal_2', confidence: 0.9 },
        { agent: 'theron', type: 'test_signal_3', confidence: 0.7 }
      ];

      // Process through both systems
      testSignals.forEach((signalData, index) => {
        // Register with coordinator
        coordinator.registerSignal(signalData);

        // Create full signal for analytics
        const fullSignal: Signal = {
          type: signalData.type,
          hash: generateSignalHash(signalData.type),
          timestamp: new Date(Date.now() + index * 1000).toISOString(),
          source: signalData.agent,
          confidence: signalData.confidence
        };

        analytics.addSignal(fullSignal);
      });

      // Verify consistency
      const coordinatorStats = coordinator.getSignalStats();
      const analyticsMetrics = analytics.getMetrics();

      expect(coordinatorStats.total).toBe(3);
      expect(analyticsMetrics.totalSignals).toBe(3);
      expect(coordinatorStats.agents).toBe(3);
      expect(Object.keys(analyticsMetrics.signalsByAgent)).toHaveLength(3);
    });
  });

  describe('System Resilience', () => {
    it('should handle invalid signals gracefully', () => {
      const invalidSignals = [
        { agent: '', type: 'valid_type', confidence: 0.8 }, // Empty agent
        { agent: 'valid_agent', type: '', confidence: 0.8 }, // Empty type
        { agent: 'valid_agent', type: 'valid_type', confidence: -1 }, // Invalid confidence
        { agent: 'valid_agent', type: 'valid_type', confidence: 2.0 } // Invalid confidence
      ];

      invalidSignals.forEach(signal => {
        expect(() => {
          coordinator.registerSignal(signal as any);
        }).toThrow();
      });

      // System should still be functional after errors
      const validSignal = {
        agent: 'test_agent',
        type: 'test_signal',
        confidence: 0.8
      };

      expect(() => {
        coordinator.registerSignal(validSignal);
      }).not.toThrow();

      const stats = coordinator.getSignalStats();
      expect(stats.total).toBe(1);
    });

    it('should maintain performance under load', () => {
      const loadTestSignals = [];
      
      // Generate 500 signals for load testing
      for (let i = 0; i < 500; i++) {
        loadTestSignals.push({
          agent: `load_agent_${i % 10}`,
          type: `load_type_${i % 20}`,
          confidence: Math.random()
        });
      }

      const startTime = Date.now();

      // Process all signals through coordinator
      loadTestSignals.forEach(signal => {
        coordinator.registerSignal(signal);
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within reasonable time
      expect(processingTime).toBeLessThan(5000); // 5 seconds max

      const stats = coordinator.getSignalStats();
      expect(stats.total).toBe(500);
      expect(stats.agents).toBe(10);
      expect(stats.unique_types).toBe(20);
    });
  });

  describe('Data Export and Interoperability', () => {
    it('should export data in compatible formats', () => {
      // Add some test data
      const testSignals = [
        { agent: 'observer', type: 'export_test_1', confidence: 0.8 },
        { agent: 'harvester', type: 'export_test_2', confidence: 0.9 }
      ];

      testSignals.forEach(signalData => {
        coordinator.registerSignal(signalData);

        const fullSignal: Signal = {
          type: signalData.type,
          hash: generateSignalHash(signalData.type),
          timestamp: new Date().toISOString(),
          source: signalData.agent,
          confidence: signalData.confidence
        };

        analytics.addSignal(fullSignal);
      });

      // Export analytics data
      const exportedMetrics = analytics.exportMetrics();
      
      // Verify export format
      expect(exportedMetrics).toHaveProperty('timestamp');
      expect(exportedMetrics).toHaveProperty('totalSignals');
      expect(exportedMetrics).toHaveProperty('signalsByType');
      expect(exportedMetrics).toHaveProperty('signalsByAgent');
      expect(exportedMetrics.totalSignals).toBe(2);

      // Verify data integrity
      expect(exportedMetrics.signalsByType['export_test_1']).toBe(1);
      expect(exportedMetrics.signalsByType['export_test_2']).toBe(1);
      expect(exportedMetrics.signalsByAgent['observer']).toBe(1);
      expect(exportedMetrics.signalsByAgent['harvester']).toBe(1);
    });
  });
});
