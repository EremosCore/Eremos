import { Agent } from "../types/agent";
import { BlockchainEvent, WalletActivityEvent } from "../types/event";
import { eventStreamManager } from "./eventStream";
import { saveSharedMemory } from "./storage";

// Type guard function to check if event data is WalletActivityEvent
function isWalletActivityEvent(event: BlockchainEvent): event is BlockchainEvent & { data: WalletActivityEvent } {
  return event.type === "wallet_activity";
}

// Shared memory interface for agents
export interface SharedMemory {
  id: string;
  type: "pattern" | "anomaly" | "intelligence" | "correlation";
  data: any;
  confidence: number;
  timestamp: number;
  sourceAgent: string;
  tags: string[];
}

// Agent communication message
export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent?: string; // undefined means broadcast to all
  type: "alert" | "intelligence" | "request" | "response";
  payload: any;
  priority: "low" | "medium" | "high" | "critical";
  timestamp: number;
}

// Agent coordination rules
export interface CoordinationRule {
  id: string;
  name: string;
  description: string;
  triggerCondition: (event: BlockchainEvent, agent: Agent) => boolean;
  action: (event: BlockchainEvent, agents: Agent[], sharedMemory: SharedMemory[]) => void;
  priority: number;
}

// Main Agent Coordinator
export class AgentCoordinator {
  private agents: Map<string, Agent> = new Map();
  private sharedMemory: SharedMemory[] = [];
  private coordinationRules: CoordinationRule[] = [];
  private messageQueue: AgentMessage[] = [];
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    console.log("🤝 AgentCoordinator initialized");
    this.setupDefaultRules();
  }
  
  // Register an agent with the coordinator
  registerAgent(agent: Agent) {
    this.agents.set(agent.id, agent);
    console.log(`📝 Agent ${agent.name} (${agent.id}) registered with coordinator`);
    
    // Also register with event stream manager
    eventStreamManager.registerAgent(agent);
  }
  
  // Unregister an agent
  unregisterAgent(agentId: string) {
    this.agents.delete(agentId);
    eventStreamManager.unregisterAgent(agentId);
    console.log(`❌ Agent ${agentId} unregistered from coordinator`);
  }
  
  // Add shared memory that agents can access
  addSharedMemory(memory: SharedMemory) {
    this.sharedMemory.push(memory);
    
    // Keep only last 1000 memories to prevent memory bloat
    if (this.sharedMemory.length > 1000) {
      this.sharedMemory = this.sharedMemory.slice(-1000);
    }
    
    console.log(`🧠 Shared memory added: ${memory.type} from ${memory.sourceAgent}`);
    
    // Save to file (new functionality)
    saveSharedMemory(memory);
    
    // Notify relevant agents about new shared memory
    this.notifyAgentsOfNewMemory(memory);
  }
  
  // Get shared memory filtered by criteria
  getSharedMemory(filters?: {
    type?: string;
    sourceAgent?: string;
    tags?: string[];
    minConfidence?: number;
    since?: number;
  }): SharedMemory[] {
    let filtered = this.sharedMemory;
    
    if (filters?.type) {
      filtered = filtered.filter(m => m.type === filters.type);
    }
    
    if (filters?.sourceAgent) {
      filtered = filtered.filter(m => m.sourceAgent === filters.sourceAgent);
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter(m => 
        filters.tags!.some(tag => m.tags.includes(tag))
      );
    }
    
    if (filters?.minConfidence) {
      filtered = filtered.filter(m => m.confidence >= filters.minConfidence!);
    }
    
    if (filters?.since) {
      filtered = filtered.filter(m => m.timestamp >= filters.since!);
    }
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  }
  
  // Send a message between agents
  sendMessage(message: AgentMessage) {
    this.messageQueue.push(message);
    console.log(`📨 Message sent: ${message.type} from ${message.fromAgent} to ${message.toAgent || 'all'}`);
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startMessageProcessing();
    }
  }
  
  // Start processing message queue
  private startMessageProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log("🔄 Starting message processing loop");
    
    this.processingInterval = setInterval(() => {
      this.processNextMessage();
    }, 50); // Process messages every 50ms
  }
  
  // Process the next message in the queue
  private processNextMessage() {
    const message = this.messageQueue.shift();
    if (!message) {
      if (this.messageQueue.length === 0) {
        this.stopMessageProcessing();
      }
      return;
    }
    
    this.deliverMessage(message);
  }
  
  // Stop message processing
  private stopMessageProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log("⏹️ Message processing stopped");
  }
  
  // Deliver message to intended recipient(s)
  private deliverMessage(message: AgentMessage) {
    if (message.toAgent) {
      // Direct message to specific agent
      const targetAgent = this.agents.get(message.toAgent);
      if (targetAgent) {
        this.deliverMessageToAgent(targetAgent, message);
      } else {
        console.warn(`⚠️ Target agent ${message.toAgent} not found for message ${message.id}`);
      }
    } else {
      // Broadcast message to all agents
      this.agents.forEach(agent => {
        this.deliverMessageToAgent(agent, message);
      });
    }
  }
  
  // Deliver message to a specific agent
  private deliverMessageToAgent(agent: Agent, message: AgentMessage) {
    try {
      // Check if agent has a message handler
      if (typeof (agent as any).handleMessage === 'function') {
        (agent as any).handleMessage(message);
      } else {
        // Default message handling - add to agent's memory if it exists
        if (typeof (agent as any).addMessage === 'function') {
          (agent as any).addMessage(message);
        }
      }
    } catch (error) {
      console.error(`❌ Error delivering message to agent ${agent.id}:`, error);
    }
  }
  
  // Notify agents about new shared memory
  private notifyAgentsOfNewMemory(memory: SharedMemory) {
    // Find agents that might be interested in this memory
    const interestedAgents = Array.from(this.agents.values()).filter(agent => {
      // Basic interest matching based on agent type and memory type
      if (memory.type === "anomaly" && agent.watchType === "anomaly_detection") {
        return true;
      }
      
      if (memory.type === "pattern" && agent.watchType === "wallet_activity") {
        return true;
      }
      
      // Launch tracker is interested in contract deployments
      if (memory.type === "intelligence" && agent.id === "agent-launch") {
        return true;
      }
      
      return false;
    });
    
    // Send notification to interested agents
    interestedAgents.forEach(agent => {
      const notification: AgentMessage = {
        id: `notify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromAgent: "coordinator",
        toAgent: agent.id,
        type: "intelligence",
        payload: {
          memoryId: memory.id,
          memoryType: memory.type,
          confidence: memory.confidence,
          tags: memory.tags
        },
        priority: "medium",
        timestamp: Date.now()
      };
      
      this.sendMessage(notification);
    });
  }
  
  // Setup default coordination rules
  private setupDefaultRules() {
    // Rule 1: High-confidence anomaly triggers coordinated response
    this.addCoordinationRule({
      id: "rule_anomaly_response",
      name: "Anomaly Response Coordination",
      description: "When high-confidence anomalies are detected, coordinate all agents for comprehensive analysis",
      triggerCondition: (event, agent) => {
        return event.priority === "critical" && event.type === "wallet_activity";
      },
      action: (event, agents, sharedMemory) => {
        console.log("🚨 Critical anomaly detected - coordinating all agents");
        
        // Add shared memory about the anomaly
        const anomalyMemory: SharedMemory = {
          id: `anomaly_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: "anomaly",
          data: event,
          confidence: 0.95,
          timestamp: Date.now(),
          sourceAgent: "coordinator",
          tags: ["critical", "anomaly", "coordinated_response"]
        };
        
        this.addSharedMemory(anomalyMemory);
        
        // Send alert to all agents
        const alert: AgentMessage = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromAgent: "coordinator",
          toAgent: undefined, // Broadcast
          type: "alert",
          payload: {
            eventId: event.id,
            anomalyMemoryId: anomalyMemory.id,
            priority: "critical"
          },
          priority: "critical",
          timestamp: Date.now()
        };
        
        this.sendMessage(alert);
      },
      priority: 100
    });
    
    // Rule 2: Pattern correlation across agents
    this.addCoordinationRule({
      id: "rule_pattern_correlation",
      name: "Pattern Correlation",
      description: "Correlate patterns detected by different agents to increase confidence",
      triggerCondition: (event, agent) => {
        return isWalletActivityEvent(event) && !!event.data.clusterId;
      },
      action: (event, agents, sharedMemory) => {
        if (!isWalletActivityEvent(event)) return;
        const clusterId = event.data.clusterId;
        
        // Look for existing memories about this cluster
        const clusterMemories = sharedMemory.filter(m => 
          m.tags.includes(clusterId || '') || 
          ((m.data as any).clusterId && (m.data as any).clusterId === clusterId)
        );
        
        if (clusterMemories.length >= 2) {
          // Multiple agents have observed this cluster - create correlation
          const correlationMemory: SharedMemory = {
            id: `correlation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "correlation",
            data: {
              clusterId,
              events: [event, ...clusterMemories.map(m => m.data)],
              agentCount: clusterMemories.length + 1
            },
            confidence: Math.min(0.95, 0.7 + (clusterMemories.length * 0.1)),
            timestamp: Date.now(),
            sourceAgent: "coordinator",
            tags: ["correlation", "wallet_cluster", clusterId || '']
          };
          
          this.addSharedMemory(correlationMemory);
        }
      },
      priority: 80
    });
    
    // Rule 3: Launch detection coordination
    this.addCoordinationRule({
      id: "rule_launch_coordination",
      name: "Launch Detection Coordination",
      description: "Coordinate multiple agents for comprehensive launch detection",
      triggerCondition: (event, agent) => {
        return agent.id === "agent-launch" && event.type === "contract_event";
      },
      action: (event, agents, sharedMemory) => {
        // Look for recent funding events
        const recentMemories = sharedMemory.filter(m => 
          m.type === "intelligence" && 
          m.tags.includes("funding") &&
          Date.now() - m.timestamp < 60000 // Within last minute
        );
        
        if (recentMemories.length > 0) {
          // Potential launch sequence detected
          const launchMemory: SharedMemory = {
            id: `launch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "intelligence",
            data: {
              contractEvent: event,
              fundingEvents: recentMemories,
              launchConfidence: 0.85
            },
            confidence: 0.85,
            timestamp: Date.now(),
            sourceAgent: "coordinator",
            tags: ["launch_detection", "contract_deployment", "funding_correlation"]
          };
          
          this.addSharedMemory(launchMemory);
        }
      },
      priority: 90
    });
  }
  
  // Add a coordination rule
  addCoordinationRule(rule: CoordinationRule) {
    this.coordinationRules.push(rule);
    this.coordinationRules.sort((a, b) => b.priority - a.priority); // Higher priority first
    console.log(`📋 Coordination rule added: ${rule.name}`);
  }
  
  // Evaluate coordination rules for an event
  evaluateRules(event: BlockchainEvent, agent: Agent) {
    this.coordinationRules.forEach(rule => {
      try {
        if (rule.triggerCondition(event, agent)) {
          rule.action(event, Array.from(this.agents.values()), this.sharedMemory);
        }
      } catch (error) {
        console.error(`❌ Error in coordination rule ${rule.id}:`, error);
      }
    });
  }
  
  // Get coordinator statistics
  getStats() {
    return {
      registeredAgents: this.agents.size,
      sharedMemoryCount: this.sharedMemory.length,
      coordinationRules: this.coordinationRules.length,
      messageQueueSize: this.messageQueue.length,
      isProcessing: this.isProcessing
    };
  }
  
  // Shutdown the coordinator
  shutdown() {
    this.stopMessageProcessing();
    console.log("🛑 AgentCoordinator shutdown complete");
  }
}

// Singleton instance
export const agentCoordinator = new AgentCoordinator();
