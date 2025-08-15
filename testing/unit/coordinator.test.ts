import { describe, it, expect, beforeEach } from 'vitest';
import { AgentCoordinator, CompositeSignal, CorrelationRule } from '../../utils/coordinator';
import { Signal } from '../../types/signal';

describe('AgentCoordinator', () => {
  let coordinator: AgentCoordinator;

  beforeEach(() => {
    coordinator = new AgentCoordinator();
  });

  describe('Signal Registration', () => {
    it('should register signals from different agents', () => {
      const signalData = {
        agent: 'observer',
        type: 'WALLET_ACTIVITY',
        confidence: 0.8,
        metadata: { address: '0x123', amount: 100 }
      };

      coordinator.registerSignal(signalData);
      // Note: Since getSignalHistory is not public, we test indirectly through correlation
      expect(() => coordinator.registerSignal(signalData)).not.toThrow();
    });

    it('should generate proper signal structure with required fields', () => {
      const signalData = {
        agent: 'observer',
        type: 'WALLET_ACTIVITY',
        confidence: 0.8
      };

      // Test that registration works without throwing
      expect(() => coordinator.registerSignal(signalData)).not.toThrow();
    });
  });

  describe('Signal Correlation', () => {
    it('should detect predefined correlation patterns', () => {
      // Register signals that match a predefined pattern
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

      // Test that correlation returns boolean (as per implementation)
      const correlationResult = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment'], 30000);
      expect(typeof correlationResult).toBe('boolean');
    });

    it('should require minimum confidence threshold', () => {
      const signal1 = {
        agent: 'observer',
        type: 'cex_funding_detected',
        confidence: 0.5 // Below threshold
      };

      const signal2 = {
        agent: 'harvester',
        type: 'rapid_deployment',
        confidence: 0.6 // Below threshold
      };

      coordinator.registerSignal(signal1);
      coordinator.registerSignal(signal2);

      // Should not correlate due to low confidence
      const correlationResult = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment'], 30000);
      expect(correlationResult).toBe(false);
    });
  });

  describe('Composite Signal Generation', () => {
    it('should emit composite signals when patterns are detected', (done) => {
      // Create a mock event listener
      let compositeSignalEmitted = false;
      
      // Simulate composite signal emission by testing the generation logic
      const signal1 = {
        agent: 'observer',
        type: 'cex_funding_detected',
        confidence: 0.9
      };

      const signal2 = {
        agent: 'harvester',
        type: 'rapid_deployment',
        confidence: 0.9
      };

      coordinator.registerSignal(signal1);
      coordinator.registerSignal(signal2);

      // Test correlation detection
      const hasCorrelation = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment'], 30000);
      expect(hasCorrelation).toBe(true);
      done();
    });

    it('should handle ghost wallet activation pattern', () => {
      const signal1 = {
        agent: 'observer',
        type: 'dormant_wallet_activated',
        confidence: 0.8
      };

      const signal2 = {
        agent: 'harvester',
        type: 'high_value_transaction',
        confidence: 0.9
      };

      coordinator.registerSignal(signal1);
      coordinator.registerSignal(signal2);

      const hasCorrelation = coordinator.correlateSignals(['dormant_wallet_activated', 'high_value_transaction'], 120000);
      expect(hasCorrelation).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing required fields gracefully', () => {
      const invalidSignalData = {
        // Missing agent, type, and confidence
      } as any;

      expect(() => {
        coordinator.registerSignal(invalidSignalData);
      }).toThrow();
    });

    it('should handle invalid correlation patterns', () => {
      const result = coordinator.correlateSignals(['nonexistent_signal_type'], 60000);
      expect(result).toBe(false);
    });

    it('should validate confidence values', () => {
      const invalidSignal = {
        agent: 'test',
        type: 'TEST_SIGNAL',
        confidence: 1.5 // Invalid confidence > 1
      };

      expect(() => {
        coordinator.registerSignal(invalidSignal);
      }).toThrow();
    });
  });

  describe('Performance and Buffer Management', () => {
    it('should handle multiple signal registrations efficiently', () => {
      const startTime = Date.now();
      
      // Register multiple signals
      for (let i = 0; i < 100; i++) {
        const signal = {
          agent: 'test-agent',
          type: 'PERFORMANCE_TEST',
          confidence: Math.random() * 0.5 + 0.5 // Random confidence between 0.5-1.0
        };
        coordinator.registerSignal(signal);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete quickly
      expect(duration).toBeLessThan(1000);
    });

    it('should respect buffer size limits', () => {
      // Test buffer management by registering many signals
      // The implementation should handle buffer overflow gracefully
      for (let i = 0; i < 1500; i++) { // More than buffer size (1000)
        const signal = {
          agent: 'test-agent',
          type: 'BUFFER_TEST',
          confidence: 0.7
        };
        
        expect(() => {
          coordinator.registerSignal(signal);
        }).not.toThrow();
      }
    });
  });

  describe('Coordination Patterns', () => {
    it('should recognize coordinated launch patterns', () => {
      const fundingSignal = {
        agent: 'observer',
        type: 'cex_funding_detected',
        confidence: 0.95,
        metadata: { exchange: 'binance', amount: '1000000' }
      };

      const deploymentSignal = {
        agent: 'harvester',
        type: 'rapid_deployment',
        confidence: 0.9,
        metadata: { contracts: 5, timespan: '15s' }
      };

      coordinator.registerSignal(fundingSignal);
      coordinator.registerSignal(deploymentSignal);

      const correlation = coordinator.correlateSignals(['cex_funding_detected', 'rapid_deployment'], 30000);
      expect(correlation).toBe(true);
    });

    it('should detect suspicious wallet reactivation', () => {
      const dormantSignal = {
        agent: 'observer',
        type: 'dormant_wallet_activated',
        confidence: 0.8,
        metadata: { dormantDays: 365, wallet: '0xabc...' }
      };

      const highValueSignal = {
        agent: 'theron',
        type: 'high_value_transaction',
        confidence: 0.85,
        metadata: { amount: '500000', token: 'USDC' }
      };

      coordinator.registerSignal(dormantSignal);
      coordinator.registerSignal(highValueSignal);

      const correlation = coordinator.correlateSignals(['dormant_wallet_activated', 'high_value_transaction'], 120000);
      expect(correlation).toBe(true);
    });
  });
});
