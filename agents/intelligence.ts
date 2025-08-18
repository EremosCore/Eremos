import { ExtendedAgent } from "../types/agent";
import { BlockchainEvent } from "../types/event";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { agentCoordinator, SharedMemory, AgentMessage } from "../utils/agentCoordinator";
import { savePattern } from "../utils/storage";

export const IntelligenceAgent: ExtendedAgent = {
  id: "agent-intelligence",
  name: "Intelligence",
  role: "pattern_analysis",
  watchType: "multi_source",
  glyph: "Ω",
  triggerThreshold: 0.7,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  
  description: "Advanced pattern recognition agent that coordinates with other agents to detect complex blockchain patterns and anomalies.",

  // Enhanced observe method that works with the coordination system
  observe: (event: BlockchainEvent) => {
    // Analyze the event for patterns
    const patterns = IntelligenceAgent.analyzePatterns!(event);
    
    // Share intelligence with other agents
    if (patterns.length > 0) {
      patterns.forEach(pattern => {
        IntelligenceAgent.shareIntelligence!(pattern);
      });
    }
    
    // Check for high-confidence signals
    const signalConfidence = IntelligenceAgent.calculateSignalConfidence!(event, patterns);
    
    if (signalConfidence >= IntelligenceAgent.triggerThreshold) {
      const hash = generateSignalHash(event);
      
      logSignal({
        agent: "Intelligence",
        type: "pattern_detected",
        glyph: "Ω",
        hash,
        timestamp: new Date().toISOString(),
        details: { 
          confidence: signalConfidence,
          patterns: patterns.map(p => p.type)
        }
      });
      
      IntelligenceAgent.lastSignal = hash;
    }
    
    // Evaluate coordination rules
    agentCoordinator.evaluateRules(event, IntelligenceAgent);
  },

  // Get enhanced memory including shared intelligence
  getMemory: (): string[] => {
    const sharedMemories = agentCoordinator.getSharedMemory({
      sourceAgent: "agent-intelligence",
      minConfidence: 0.7
    });
    
    return [
      `intelligence_${IntelligenceAgent.lastSignal || "none"}`,
      `patterns_analyzed_${sharedMemories.length}`,
      `correlations_found_${IntelligenceAgent.getCorrelationCount!()}`,
      `intelligence_shared_${IntelligenceAgent.getSharedIntelligenceCount!()}`
    ];
  },








  // Message handler for inter-agent communication
  handleMessage: (message: AgentMessage) => {
    if (message.type === "alert" && message.priority === "critical") {
      console.log(`🚨 Intelligence Agent received critical alert: ${message.payload.eventId}`);
      
      // Trigger enhanced analysis for critical events
      IntelligenceAgent.triggerEnhancedAnalysis!(message.payload);
    }
    
    if (message.type === "intelligence") {
      console.log(`🧠 Intelligence Agent received intelligence: ${message.payload.patternType}`);
      
      // Correlate with existing patterns
      IntelligenceAgent.correlateIntelligence!(message.payload);
    }
  },

  // Trigger enhanced analysis for critical events
  triggerEnhancedAnalysis: (payload: any) => {
    // Look for related events in recent history
    const recentMemories = agentCoordinator.getSharedMemory({
      since: Date.now() - 300000, // Last 5 minutes
      minConfidence: 0.6
    });
    
    if (recentMemories.length > 0) {
      // Create correlation analysis
      const correlation: SharedMemory = {
        id: `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "correlation",
        data: {
          criticalEvent: payload,
          relatedEvents: recentMemories,
          correlationStrength: 0.9
        },
        confidence: 0.9,
        timestamp: Date.now(),
        sourceAgent: "agent-intelligence",
        tags: ["critical_correlation", "enhanced_analysis", "pattern_correlation"]
      };
      
      agentCoordinator.addSharedMemory(correlation);
      IntelligenceAgent.correlationCount!++;
    }
  },

  // Correlate new intelligence with existing patterns
  correlateIntelligence: (payload: any) => {
    // Look for similar patterns
    const similarMemories = agentCoordinator.getSharedMemory({
      type: "intelligence",
      tags: [payload.patternType],
      minConfidence: 0.7
    });
    
    if (similarMemories.length > 0) {
      // Pattern strengthening detected
      const strengthening: SharedMemory = {
        id: `strengthen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "correlation",
        data: {
          patternType: payload.patternType,
          instances: [payload, ...similarMemories.map(m => m.data)],
          strengtheningFactor: similarMemories.length + 1
        },
        confidence: Math.min(0.95, 0.7 + (similarMemories.length * 0.1)),
        timestamp: Date.now(),
        sourceAgent: "agent-intelligence",
        tags: ["pattern_strengthening", payload.patternType, "correlation"]
      };
      
      agentCoordinator.addSharedMemory(strengthening);
      IntelligenceAgent.correlationCount!++;
    }
  },



  // Static properties for tracking
  recentTransactions: [] as BlockchainEvent[],
  contractInteractions: new Map<string, BlockchainEvent[]>(),
  walletBehaviors: new Map<string, { firstSeen: number; lastActivity: number; transactionCount: number }>(),
  correlationCount: 0,
  sharedIntelligenceCount: 0,

  // Ensure methods are always defined
  analyzePatterns: (event: BlockchainEvent) => {
    const patterns: Array<{ type: string; confidence: number; data: any }> = [];
    
    // Pattern 1: High-value transaction patterns
    if (event.type === "transaction") {
      const value = parseFloat((event.data as any).value || "0");
      if (value > 1000) {
        const pattern = {
          type: "high_value_transaction",
          confidence: Math.min(0.9, 0.5 + (value / 10000)),
          data: { value, from: (event.data as any).from, to: (event.data as any).to }
        };
        patterns.push(pattern);
        
        // Save pattern to file
        savePattern(pattern);
      }
      
      // Check for rapid successive transactions
      if (IntelligenceAgent.recentTransactions!.length > 0) {
        const lastTx = IntelligenceAgent.recentTransactions![IntelligenceAgent.recentTransactions!.length - 1];
        const timeDiff = event.timestamp - lastTx.timestamp;
        
        if (timeDiff < 5000 && (lastTx.data as any).from === (event.data as any).from) { // Within 5 seconds, same sender
          const pattern = {
            type: "rapid_transaction_sequence",
            confidence: 0.8,
            data: { timeDiff, sender: (event.data as any).from, txCount: IntelligenceAgent.recentTransactions!.length + 1 }
          };
          patterns.push(pattern);
          
          // Save pattern to file
          savePattern(pattern);
        }
      }
      
      // Add to recent transactions
      IntelligenceAgent.recentTransactions!.push(event);
      if (IntelligenceAgent.recentTransactions!.length > 100) {
        IntelligenceAgent.recentTransactions! = IntelligenceAgent.recentTransactions!.slice(-100);
      }
    }
    
    // Pattern 2: Contract interaction patterns
    if (event.type === "contract_event") {
      const contractAddress = (event.data as any).contractAddress;
      
      // Check if this contract has been interacted with recently
      if (IntelligenceAgent.contractInteractions!.has(contractAddress)) {
        const interactions = IntelligenceAgent.contractInteractions!.get(contractAddress)!;
        interactions.push(event);
        
        if (interactions.length >= 3) {
          const pattern = {
            type: "contract_activity_spike",
            confidence: Math.min(0.95, 0.7 + (interactions.length * 0.1)),
            data: { contractAddress, interactionCount: interactions.length, timeWindow: "recent" }
          };
          patterns.push(pattern);
          
          // Save pattern to file
          savePattern(pattern);
        }
      } else {
        IntelligenceAgent.contractInteractions!.set(contractAddress, [event]);
      }
    }
    
    // Pattern 3: Wallet behavior patterns
    if (event.type === "wallet_activity") {
      const address = (event.data as any).address;
      
      if (IntelligenceAgent.walletBehaviors!.has(address)) {
        const behavior = IntelligenceAgent.walletBehaviors!.get(address)!;
        behavior.transactionCount += (event.data as any).transactionCount;
        behavior.lastActivity = event.timestamp;
        
        // Detect unusual behavior
        if (behavior.transactionCount > 50 && behavior.lastActivity - behavior.firstSeen < 300000) { // 50+ tx in 5 minutes
          const pattern = {
            type: "wallet_behavior_anomaly",
            confidence: 0.85,
            data: { address, transactionCount: behavior.transactionCount, timeWindow: behavior.lastActivity - behavior.firstSeen }
          };
          patterns.push(pattern);
          
          // Save pattern to file
          savePattern(pattern);
        }
      } else {
        IntelligenceAgent.walletBehaviors!.set(address, {
          firstSeen: event.timestamp,
          lastActivity: event.timestamp,
          transactionCount: (event.data as any).transactionCount
        });
      }
    }
    
    return patterns;
  },

  getCorrelationCount: () => IntelligenceAgent.correlationCount!,
  getSharedIntelligenceCount: () => IntelligenceAgent.sharedIntelligenceCount!,

  // Calculate signal confidence based on event and patterns
  calculateSignalConfidence: (event: BlockchainEvent, patterns: Array<{ type: string; confidence: number; data: any }>) => {
    if (patterns.length === 0) return 0;
    
    // Base confidence from pattern strength
    let baseConfidence = patterns.reduce((sum, pattern) => sum + pattern.confidence, 0) / patterns.length;
    
    // Boost confidence for multiple patterns
    if (patterns.length > 1) {
      baseConfidence += Math.min(0.2, patterns.length * 0.05);
    }
    
    // Boost confidence for high-value events
    if (event.type === "transaction") {
      const value = parseFloat((event.data as any).value || "0");
      if (value > 10000) {
        baseConfidence += 0.1;
      }
    }
    
    // Boost confidence for contract events
    if (event.type === "contract_event") {
      baseConfidence += 0.05;
    }
    
    return Math.min(1.0, baseConfidence);
  },

  // Share intelligence with other agents
  shareIntelligence: (pattern: { type: string; confidence: number; data: any }) => {
    const intelligence: SharedMemory = {
      id: `intel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: "intelligence",
      data: {
        patternType: pattern.type,
        confidence: pattern.confidence,
        details: pattern.data,
        timestamp: Date.now()
      },
      confidence: pattern.confidence,
      timestamp: Date.now(),
      sourceAgent: "agent-intelligence",
      tags: ["pattern_analysis", pattern.type, "intelligence"]
    };
    
    agentCoordinator.addSharedMemory(intelligence);
    IntelligenceAgent.sharedIntelligenceCount!++;
    
    // Send message to other agents about this intelligence
    agentCoordinator.sendMessage({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fromAgent: "agent-intelligence",
      toAgent: undefined, // undefined means broadcast to all
      type: "intelligence",
      priority: pattern.confidence > 0.8 ? "high" : "medium",
      payload: {
        patternType: pattern.type,
        confidence: pattern.confidence,
        details: pattern.data
      },
      timestamp: Date.now()
    });
  }
};
