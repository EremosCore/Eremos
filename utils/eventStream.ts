import { BlockchainEvent, EventCorrelation } from "../types/event";
import { ExtendedAgent } from "../types/agent";

// Priority queue for event processing
class PriorityQueue<T> {
  private queue: Array<{ item: T; priority: number }> = [];
  
  enqueue(item: T, priority: number) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => b.priority - a.priority); // Higher priority first
  }
  
  dequeue(): T | undefined {
    return this.queue.shift()?.item;
  }
  
  peek(): T | undefined {
    return this.queue[0]?.item;
  }
  
  get size(): number {
    return this.queue.length;
  }
  
  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// Event correlation engine
class EventCorrelator {
  private correlations: Map<string, EventCorrelation> = new Map();
  private eventPatterns: Map<string, string[]> = new Map();
  
  correlateEvents(events: BlockchainEvent[]): EventCorrelation[] {
    const correlations: EventCorrelation[] = [];
    
    // Group events by time window (5 second windows)
    const timeWindows = new Map<number, BlockchainEvent[]>();
    const windowSize = 5000; // 5 seconds
    
    events.forEach(event => {
      const window = Math.floor(event.timestamp / windowSize);
      if (!timeWindows.has(window)) {
        timeWindows.set(window, []);
      }
      timeWindows.get(window)!.push(event);
    });
    
    // Analyze patterns within each time window
    timeWindows.forEach((windowEvents, window) => {
      if (windowEvents.length >= 2) {
        const patterns = this.analyzePatterns(windowEvents);
        patterns.forEach(pattern => {
          const correlation: EventCorrelation = {
            correlationId: `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            events: pattern.events.map(e => e.id),
            pattern: pattern.type,
            confidence: pattern.confidence,
            timestamp: Date.now(),
            agents: []
          };
          
          correlations.push(correlation);
          this.correlations.set(correlation.correlationId, correlation);
        });
      }
    });
    
    return correlations;
  }
  
  private analyzePatterns(events: BlockchainEvent[]): Array<{ type: string; events: BlockchainEvent[]; confidence: number }> {
    const patterns: Array<{ type: string; events: BlockchainEvent[]; confidence: number }> = [];
    
    // Pattern 1: High-frequency trading (multiple transactions in short time)
    const highFreqEvents = events.filter(e => e.type === "transaction");
    if (highFreqEvents.length >= 3) {
      patterns.push({
        type: "high_frequency_trading",
        events: highFreqEvents,
        confidence: Math.min(0.8, highFreqEvents.length * 0.2)
      });
    }
    
    // Pattern 2: Contract deployment followed by immediate activity
    const contractDeployments = events.filter(e => 
      e.type === "contract_event" && 
      (e.data as any).eventName === "ContractCreated"
    );
    const immediateActivity = events.filter(e => 
      e.type === "transaction" && 
      e.timestamp - (contractDeployments[0]?.timestamp || 0) < 10000 // Within 10 seconds
    );
    
    if (contractDeployments.length > 0 && immediateActivity.length > 0) {
      patterns.push({
        type: "contract_deployment_activity",
        events: [...contractDeployments, ...immediateActivity],
        confidence: 0.85
      });
    }
    
    // Pattern 3: Wallet clustering (multiple wallets interacting with same contract)
    const walletEvents = events.filter(e => e.type === "wallet_activity");
    if (walletEvents.length >= 2) {
      patterns.push({
        type: "wallet_clustering",
        events: walletEvents,
        confidence: Math.min(0.9, walletEvents.length * 0.3)
      });
    }
    
    return patterns;
  }
  
  getCorrelations(): EventCorrelation[] {
    return Array.from(this.correlations.values());
  }
}

// Main Event Stream Manager
export class EventStreamManager {
  private eventQueue: PriorityQueue<BlockchainEvent> = new PriorityQueue();
  private agents: Map<string, ExtendedAgent> = new Map();
  private correlator: EventCorrelator = new EventCorrelator();
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;
  private eventCount: number = 0;
  private startTime: number = Date.now();
  
  constructor() {
    console.log("🚀 EventStreamManager initialized");
  }
  
  // Register an agent to receive events
  registerAgent(agent: ExtendedAgent) {
    this.agents.set(agent.id, agent);
    console.log(`📝 Agent ${agent.name} (${agent.id}) registered`);
  }
  
  // Unregister an agent
  unregisterAgent(agentId: string) {
    this.agents.delete(agentId);
    console.log(`❌ Agent ${agentId} unregistered`);
  }
  
  // Add event to the processing queue
  addEvent(event: BlockchainEvent) {
    const priority = this.calculatePriority(event);
    this.eventQueue.enqueue(event, priority);
    this.eventCount++;
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }
  }
  
  // Calculate event priority based on type and data
  private calculatePriority(event: BlockchainEvent): number {
    let priority = 0;
    
    // Base priority by type
    switch (event.type) {
      case "mempool":
        priority += 100; // Highest priority - real-time
        break;
      case "contract_event":
        priority += 80;
        break;
      case "transaction":
        priority += 60;
        break;
      case "wallet_activity":
        priority += 40;
        break;
      case "block":
        priority += 20; // Lowest priority
        break;
    }
    
    // Boost priority for critical events
    if (event.priority === "critical") priority += 50;
    if (event.priority === "high") priority += 30;
    if (event.priority === "medium") priority += 15;
    
    // Boost priority for high-value transactions
    if (event.type === "transaction") {
      const value = parseFloat((event.data as any).value || "0");
      if (value > 100) priority += 20; // High value transactions
      if (value > 1000) priority += 30; // Very high value
    }
    
    return priority;
  }
  
  // Start the event processing loop
  private startProcessing() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    console.log("🔄 Starting event processing loop");
    
    this.processingInterval = setInterval(() => {
      this.processNextEvent();
    }, 10); // Process events every 10ms for low latency
  }
  
  // Process the next event in the queue
  private processNextEvent() {
    const event = this.eventQueue.dequeue();
    if (!event) {
      if (this.eventQueue.isEmpty()) {
        this.stopProcessing();
      }
      return;
    }
    
    // Route event to relevant agents
    this.routeEventToAgents(event);
    
    // Log processing stats periodically
    if (this.eventCount % 100 === 0) {
      this.logStats();
    }
  }
  
  // Stop the processing loop
  private stopProcessing() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
    console.log("⏹️ Event processing stopped");
  }
  
  // Route event to agents based on their watch types
  private routeEventToAgents(event: BlockchainEvent) {
    this.agents.forEach((agent, agentId) => {
      try {
        // Check if agent should observe this event type
        if (this.shouldAgentObserve(agent, event)) {
          agent.observe(event);
        }
      } catch (error) {
        console.error(`❌ Error in agent ${agentId}:`, error);
      }
    });
  }
  
  // Determine if an agent should observe a specific event
  private shouldAgentObserve(agent: ExtendedAgent, event: BlockchainEvent): boolean {
    // Basic type matching
    if (agent.watchType === "wallet_activity" && event.type === "wallet_activity") {
      return true;
    }
    
    if (agent.watchType === "anomaly_detection" && event.priority === "critical") {
      return true;
    }
    
    // Launch tracker specific logic
    if (agent.id === "agent-launch") {
      return event.type === "transaction" || event.type === "contract_event";
    }
    
    // Observer specific logic
    if (agent.id === "agent-observer") {
      return event.type === "wallet_activity" || event.type === "transaction";
    }
    
    // Default: let all agents observe
    return true;
  }
  
  // Get processing statistics
  private logStats() {
    const uptime = Date.now() - this.startTime;
    const eventsPerSecond = (this.eventCount / (uptime / 1000)).toFixed(2);
    const queueSize = this.eventQueue.size;
    
    console.log(`📊 Stats: ${this.eventCount} events processed, ${eventsPerSecond} events/sec, ${queueSize} in queue`);
  }
  
  // Get current statistics
  getStats() {
    const uptime = Date.now() - this.startTime;
    return {
      totalEvents: this.eventCount,
      eventsPerSecond: (this.eventCount / (uptime / 1000)),
      queueSize: this.eventQueue.size,
      registeredAgents: this.agents.size,
      uptime: uptime,
      isProcessing: this.isProcessing
    };
  }
  
  // Get event correlations
  getCorrelations(): EventCorrelation[] {
    return this.correlator.getCorrelations();
  }
  
  // Shutdown the stream manager
  shutdown() {
    this.stopProcessing();
    console.log("🛑 EventStreamManager shutdown complete");
  }
}

// Singleton instance
export const eventStreamManager = new EventStreamManager();
