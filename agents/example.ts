import { Agent, BlockchainEvent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

/**
 * Example Agent - Template for custom agent development
 * 
 * This agent serves as a reference implementation showing the basic
 * structure and patterns for creating custom monitoring agents.
 */
export const ExampleAgent: Agent = {
  id: "agent-example",
  name: "Example",
  role: "template",
  watchType: "wallet_activity",
  glyph: "⚡",
  triggerThreshold: 0.7, // 70% confidence threshold
  lastSignal: null,
  originTimestamp: "2025-01-01T00:00:00.000Z",

  description:
    "Template agent used as a reference for custom swarm agent creation. " +
    "Replace fields and logic to define your own behavior. Monitors wallet " +
    "activity and demonstrates basic signal emission patterns.",

  observe: (event: BlockchainEvent) => {
    // Type-safe event processing
    if (event?.type === "wallet_activity") {
      const hash = generateSignalHash(event);
      
      // Calculate confidence based on event data
      const confidence = calculateConfidence(event);
      
      // Only emit signal if confidence meets threshold
      if (confidence >= ExampleAgent.triggerThreshold) {
        logSignal({
          agent: ExampleAgent.name,
          type: "template_log",
          glyph: ExampleAgent.glyph,
          hash,
          timestamp: new Date().toISOString(),
          confidence,
          details: {
            eventType: event.type,
            dataKeys: Object.keys(event.data || {}),
            originalConfidence: event.confidence
          }
        });
        
        // Update last signal
        ExampleAgent.lastSignal = hash;
      }
    }
  },

  getMemory: () => {
    return [
      "template_signal_001", 
      "wallet_event_placeholder",
      "confidence_threshold_met"
    ];
  },
};

/**
 * Calculate confidence score for wallet activity events
 * @param event - The blockchain event to analyze
 * @returns Confidence score between 0.0 and 1.0
 */
function calculateConfidence(event: BlockchainEvent): number {
  let confidence = 0.5; // Base confidence
  
  // Increase confidence based on event properties
  if (event.data) {
    // More data points increase confidence
    const dataPointCount = Object.keys(event.data).length;
    confidence += Math.min(dataPointCount * 0.1, 0.3);
  }
  
  // Use existing confidence if provided
  if (event.confidence !== undefined) {
    confidence = (confidence + event.confidence) / 2;
  }
  
  // Ensure confidence is within valid range
  return Math.max(0, Math.min(1, confidence));
}
