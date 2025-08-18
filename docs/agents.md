# Agent Development Guide

## Overview

Agents are the core components of the Eremos framework. Each agent is a specialized module that monitors specific types of blockchain activity and emits signals when patterns are detected. Agents operate independently but can share information through the memory system and coordinate through the framework.

## Agent Architecture

### Core Agent Interface

Every agent must implement the `Agent` interface:

```typescript
export type Agent = {
  id: string;                    // Unique agent identifier
  name: string;                  // Human-readable agent name
  role: string;                  // Agent's role in the system
  glyph: string;                 // Visual symbol for identification
  watchType: string;             // Type of events to monitor
  triggerThreshold: number;      // Confidence threshold for signals
  lastSignal: string | null;     // Hash of last emitted signal
  originTimestamp: string;       // When the agent was created
  description: string;           // Agent's purpose and behavior
  observe: (event: any) => void; // Main event processing function
  getMemory?: () => string[];    // Optional memory access
}
```

### Agent Lifecycle

1. **Initialization** - Agent is created and configured
2. **Registration** - Agent registers with the framework
3. **Event Processing** - Agent receives and processes events
4. **Signal Generation** - Agent emits signals when patterns detected
5. **Memory Management** - Agent maintains state and context
6. **Cleanup** - Agent is stopped and resources are released

## Creating Your First Agent

### Basic Agent Template

```typescript
import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const MyFirstAgent: Agent = {
  id: "agent-myfirst-001",
  name: "MyFirst",
  role: "monitoring",
  watchType: "wallet_activity",
  glyph: "★",
  triggerThreshold: 0.7,
  lastSignal: null,
  originTimestamp: "2024-01-01T00:00:00.000Z",
  
  description: "My first agent for monitoring wallet activity and detecting patterns.",
  
  observe: (event) => {
    if (event?.type === "wallet_activity") {
      // Process wallet activity event
      const confidence = analyzeWalletActivity(event);
      
      if (confidence >= MyFirstAgent.triggerThreshold) {
        const hash = generateSignalHash(event);
        
        logSignal({
          agent: "MyFirst",
          type: "wallet_pattern_detected",
          glyph: "★",
          hash,
          timestamp: new Date().toISOString(),
          source: "agent-myfirst",
          confidence: confidence
        });
        
        MyFirstAgent.lastSignal = hash;
      }
    }
  },
  
  getMemory: () => {
    return ["first_agent_active", "wallet_monitoring_enabled"];
  }
};
```

### Advanced Agent with Memory

```typescript
export const AdvancedAgent: Agent = {
  id: "agent-advanced-002",
  name: "Advanced",
  role: "pattern_detection",
  watchType: "contract_deploy",
  glyph: "🔍",
  triggerThreshold: 0.8,
  lastSignal: null,
  originTimestamp: "2024-01-01T00:00:00.000Z",
  
  description: "Advanced agent for detecting complex contract deployment patterns.",
  
  // Private memory storage
  _memory: new Set<string>(),
  _patternHistory: new Map<string, number>(),
  
  observe: (event) => {
    if (event?.type === "contract_deploy") {
      // Add to memory
      this._memory.add(`contract:${event.data.contractAddress}`);
      
      // Analyze pattern
      const pattern = this.analyzeDeploymentPattern(event);
      if (pattern) {
        this._memory.add(`pattern:${pattern}`);
        
        // Check pattern frequency
        const frequency = this._patternHistory.get(pattern) || 0;
        this._patternHistory.set(pattern, frequency + 1);
        
        // Emit signal if pattern is frequent
        if (frequency >= 3) {
          const confidence = this.calculateConfidence(event, pattern, frequency);
          
          if (confidence >= AdvancedAgent.triggerThreshold) {
            this.emitPatternSignal(event, pattern, confidence);
          }
        }
      }
    }
  },
  
  getMemory: function() {
    return Array.from(this._memory);
  },
  
  // Helper methods
  analyzeDeploymentPattern: function(event) {
    // Implement pattern analysis logic
    if (event.data.metadata?.name === "") {
      return "stealth_deploy";
    }
    if (event.data.gasUsed > "0.01 SOL") {
      return "high_gas_deploy";
    }
    return null;
  },
  
  calculateConfidence: function(event, pattern, frequency) {
    let confidence = 0.5; // Base confidence
    
    // Pattern frequency bonus
    if (frequency >= 5) confidence += 0.2;
    if (frequency >= 10) confidence += 0.1;
    
    // Event quality bonus
    if (event.source === "solana_rpc") confidence += 0.1;
    if (event.metadata?.blockHeight) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  },
  
  emitPatternSignal: function(event, pattern, confidence) {
    const hash = generateSignalHash(event);
    
    logSignal({
      agent: "Advanced",
      type: "pattern_detected",
      glyph: "🔍",
      hash,
      timestamp: new Date().toISOString(),
      source: "agent-advanced",
      confidence: confidence,
      data: {
        pattern: pattern,
        contractAddress: event.data.contractAddress,
        deployer: event.data.deployer
      }
    });
    
    AdvancedAgent.lastSignal = hash;
  }
};
```

## Agent Roles and Specializations

### 1. **Surveillance Agents**
- **Purpose**: Monitor general blockchain activity
- **Examples**: Observer, Harvester
- **Characteristics**: High event throughput, broad monitoring scope

```typescript
export const SurveillanceAgent: Agent = {
  // ... basic properties
  role: "surveillance",
  watchType: "all_events",
  
  observe: (event) => {
    // Monitor all event types
    this.recordEvent(event);
    this.checkForAnomalies(event);
    this.updateMetrics(event);
  }
};
```

### 2. **Pattern Detection Agents**
- **Purpose**: Identify specific patterns and anomalies
- **Examples**: AnomalyDetector, PatternMatcher
- **Characteristics**: Complex logic, high confidence requirements

```typescript
export const PatternAgent: Agent = {
  // ... basic properties
  role: "pattern_detection",
  watchType: "wallet_activity",
  
  observe: (event) => {
    // Focus on pattern detection
    const patterns = this.detectPatterns(event);
    for (const pattern of patterns) {
      if (this.isSignificantPattern(pattern)) {
        this.emitPatternSignal(pattern);
      }
    }
  }
};
```

### 3. **Memory Agents**
- **Purpose**: Store and retrieve historical information
- **Examples**: Theron, MemoryVault
- **Characteristics**: Persistent storage, data aggregation

```typescript
export const MemoryAgent: Agent = {
  // ... basic properties
  role: "memory_vault",
  watchType: "all_events",
  
  observe: (event) => {
    // Store event for historical analysis
    this.storeEvent(event);
    this.updateIndexes(event);
    this.cleanupOldData();
  }
};
```

### 4. **Trigger Agents**
- **Purpose**: Emit signals based on specific conditions
- **Examples**: AlertTrigger, ThresholdMonitor
- **Characteristics**: Simple logic, fast response times

```typescript
export const TriggerAgent: Agent = {
  // ... basic properties
  role: "trigger",
  watchType: "specific_events",
  
  observe: (event) => {
    // Check trigger conditions
    if (this.shouldTrigger(event)) {
      this.emitTriggerSignal(event);
    }
  }
};
```

## Event Processing Strategies

### 1. **Event Filtering**

```typescript
observe: (event) => {
  // Filter by event type
  if (event.type !== "wallet_activity") return;
  
  // Filter by data quality
  if (!event.data?.address) return;
  
  // Filter by source
  if (!["solana_rpc", "agent_observer"].includes(event.source)) return;
  
  // Process filtered event
  this.processWalletActivity(event);
}
```

### 2. **Event Batching**

```typescript
export const BatchAgent: Agent = {
  // ... basic properties
  
  _eventBatch: [],
  _batchTimer: null,
  _batchSize: 100,
  _batchTimeout: 5000, // 5 seconds
  
  observe: (event) => {
    this._eventBatch.push(event);
    
    if (this._eventBatch.length >= this._batchSize) {
      this.processBatch();
    } else if (!this._batchTimer) {
      this._batchTimer = setTimeout(() => this.processBatch(), this._batchTimeout);
    }
  },
  
  processBatch: function() {
    if (this._batchTimer) {
      clearTimeout(this._batchTimer);
      this._batchTimer = null;
    }
    
    if (this._eventBatch.length > 0) {
      this.analyzeBatch(this._eventBatch);
      this._eventBatch = [];
    }
  }
};
```

### 3. **Event Prioritization**

```typescript
observe: (event) => {
  const priority = this.calculateEventPriority(event);
  
  if (priority === 'high') {
    // Process immediately
    this.processHighPriorityEvent(event);
  } else if (priority === 'medium') {
    // Add to medium priority queue
    this.mediumPriorityQueue.push(event);
  } else {
    // Add to low priority queue
    this.lowPriorityQueue.push(event);
  }
},

calculateEventPriority: function(event) {
  if (event.type === 'anomaly') return 'high';
  if (event.type === 'contract_deploy') return 'medium';
  if (event.data?.amount > 1000) return 'high';
  return 'low';
}
```

## Signal Generation Best Practices

### 1. **Confidence Calculation**

```typescript
calculateConfidence: function(event, context) {
  let confidence = 0.5; // Base confidence
  
  // Data source quality
  if (event.source === 'solana_rpc') confidence += 0.2;
  if (event.source === 'agent_observer') confidence += 0.1;
  
  // Pattern strength
  if (context.patternStrength > 0.8) confidence += 0.2;
  if (context.historicalConfirmation) confidence += 0.1;
  
  // Data freshness
  const ageMs = Date.now() - event.timestamp;
  if (ageMs < 60000) confidence += 0.1; // Less than 1 minute
  
  // Cross-validation
  if (context.crossAgentValidation) confidence += 0.1;
  
  return Math.min(confidence, 1.0); // Cap at 1.0
}
```

### 2. **Signal Deduplication**

```typescript
export const DeduplicationAgent: Agent = {
  // ... basic properties
  
  _recentSignals: new Set<string>(),
  _signalTTL: 300000, // 5 minutes
  
  emitSignal: function(signal) {
    const signalKey = this.generateSignalKey(signal);
    
    if (this._recentSignals.has(signalKey)) {
      console.log('Duplicate signal detected, skipping');
      return;
    }
    
    // Add to recent signals
    this._recentSignals.add(signalKey);
    
    // Clean up old signals
    setTimeout(() => {
      this._recentSignals.delete(signalKey);
    }, this._signalTTL);
    
    // Emit the signal
    logSignal(signal);
  },
  
  generateSignalKey: function(signal) {
    // Create unique key based on signal content
    return `${signal.type}_${signal.data?.address || 'unknown'}_${Math.floor(Date.now() / 60000)}`;
  }
};
```

### 3. **Signal Throttling**

```typescript
import { createThrottle } from '../utils/throttle';

export const ThrottledAgent: Agent = {
  // ... basic properties
  
  _throttle: createThrottle({
    windowMs: 60000,        // 1 minute window
    maxSignals: 10,         // Max 10 signals per window
    cooldownMs: 5000        // 5 second cooldown
  }),
  
  emitSignal: function(signal) {
    const throttleKey = `${signal.type}_${signal.data?.category || 'general'}`;
    
    if (this._throttle.shouldThrottle(throttleKey)) {
      console.log('Signal throttled:', throttleKey);
      return;
    }
    
    // Emit signal
    logSignal(signal);
    
    // Mark as used
    this._throttle.markUsed(throttleKey);
  }
};
```

## Memory Management

### 1. **Memory Organization**

```typescript
export const OrganizedAgent: Agent = {
  // ... basic properties
  
  _memory: {
    wallets: new Set<string>(),
    contracts: new Set<string>(),
    patterns: new Set<string>(),
    flags: new Set<string>(),
    timestamps: new Map<string, number>()
  },
  
  getMemory: function() {
    const now = Date.now();
    const memory = [];
    
    // Add wallet entries
    for (const wallet of this._memory.wallets) {
      memory.push(`wallet:${wallet}`);
    }
    
    // Add contract entries
    for (const contract of this._memory.contracts) {
      memory.push(`contract:${contract}`);
    }
    
    // Add pattern entries
    for (const pattern of this._memory.patterns) {
      memory.push(`pattern:${pattern}`);
    }
    
    // Add flag entries
    for (const flag of this._memory.flags) {
      memory.push(`flag:${flag}`);
    }
    
    // Add timestamp entries (only recent ones)
    for (const [timestamp, event] of this._memory.timestamps.entries()) {
      if (now - timestamp < 24 * 60 * 60 * 1000) { // Last 24 hours
        memory.push(`timestamp:${event}`);
      }
    }
    
    return memory;
  }
};
```

### 2. **Memory Cleanup**

```typescript
export const CleanupAgent: Agent = {
  // ... basic properties
  
  _cleanupInterval: 300000, // 5 minutes
  _maxMemorySize: 1000,
  
  constructor: function() {
    // Start cleanup timer
    setInterval(() => {
      this.cleanupMemory();
    }, this._cleanupInterval);
  },
  
  cleanupMemory: function() {
    const memory = this.getMemory();
    
    if (memory.length > this._maxMemorySize) {
      // Remove oldest entries
      const sortedMemory = memory.sort((a, b) => {
        const aTime = this.extractTimestamp(a);
        const bTime = this.extractTimestamp(b);
        return aTime - bTime;
      });
      
      // Keep only the newest entries
      const keepCount = Math.floor(this._maxMemorySize * 0.8);
      const newMemory = sortedMemory.slice(-keepCount);
      
      // Update memory
      this.updateMemory(newMemory);
    }
  },
  
  extractTimestamp: function(token) {
    // Extract timestamp from token
    const match = token.match(/timestamp:(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
};
```

## Testing Your Agent

### 1. **Unit Testing**

```typescript
// test/myagent.test.ts
import { MyFirstAgent } from '../agents/myfirst';

describe('MyFirstAgent', () => {
  beforeEach(() => {
    // Reset agent state
    MyFirstAgent.lastSignal = null;
  });
  
  it('should process wallet activity events', () => {
    const event = {
      type: 'wallet_activity',
      data: { address: 'TestWallet123' },
      timestamp: Date.now()
    };
    
    MyFirstAgent.observe(event);
    
    // Verify signal was emitted
    expect(MyFirstAgent.lastSignal).toBeTruthy();
  });
  
  it('should ignore non-wallet events', () => {
    const event = {
      type: 'contract_deploy',
      data: { contractAddress: 'TestContract' }
    };
    
    const initialSignal = MyFirstAgent.lastSignal;
    MyFirstAgent.observe(event);
    
    // Verify no signal was emitted
    expect(MyFirstAgent.lastSignal).toBe(initialSignal);
  });
  
  it('should return memory', () => {
    const memory = MyFirstAgent.getMemory();
    
    expect(Array.isArray(memory)).toBe(true);
    expect(memory).toContain('first_agent_active');
  });
});
```

### 2. **Integration Testing**

```typescript
// test/integration/agent-workflow.test.ts
describe('Agent Workflow Integration', () => {
  it('should process events through multiple agents', () => {
    const event = createMockEvent('wallet_activity');
    
    // Process through multiple agents
    MyFirstAgent.observe(event);
    AdvancedAgent.observe(event);
    
    // Verify signals from both agents
    expect(MyFirstAgent.lastSignal).toBeTruthy();
    expect(AdvancedAgent.lastSignal).toBeTruthy();
  });
  
  it('should share memory between agents', () => {
    const event = createMockEvent('contract_deploy');
    
    // First agent processes event
    AdvancedAgent.observe(event);
    
    // Second agent should see the memory
    const memory = AdvancedAgent.getMemory();
    expect(memory.some(m => m.includes('contract:'))).toBe(true);
  });
});
```

### 3. **Performance Testing**

```typescript
// test/performance/agent-performance.test.ts
describe('Agent Performance', () => {
  it('should process events within time limit', () => {
    const events = Array.from({ length: 1000 }, (_, i) => 
      createMockEvent('wallet_activity', { index: i })
    );
    
    const startTime = Date.now();
    
    for (const event of events) {
      MyFirstAgent.observe(event);
    }
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    
    // Should process 1000 events in less than 1 second
    expect(processingTime).toBeLessThan(1000);
  });
  
  it('should maintain memory size limits', () => {
    const events = Array.from({ length: 2000 }, (_, i) => 
      createMockEvent('wallet_activity', { index: i })
    );
    
    for (const event of events) {
      AdvancedAgent.observe(event);
    }
    
    const memory = AdvancedAgent.getMemory();
    
    // Memory should not exceed reasonable limits
    expect(memory.length).toBeLessThan(10000);
  });
});
```

## Agent Configuration

### 1. **Environment-Based Configuration**

```typescript
export const ConfigurableAgent: Agent = {
  // ... basic properties
  
  _config: {
    triggerThreshold: parseFloat(process.env.AGENT_TRIGGER_THRESHOLD || '0.7'),
    maxMemorySize: parseInt(process.env.AGENT_MAX_MEMORY_SIZE || '1000'),
    cleanupInterval: parseInt(process.env.AGENT_CLEANUP_INTERVAL || '300000'),
    enableLogging: process.env.AGENT_ENABLE_LOGGING === 'true'
  },
  
  constructor: function() {
    // Apply configuration
    this.triggerThreshold = this._config.triggerThreshold;
    
    if (this._config.enableLogging) {
      this.enableDebugLogging();
    }
  }
};
```

### 2. **Dynamic Configuration**

```typescript
export const DynamicAgent: Agent = {
  // ... basic properties
  
  updateConfiguration: function(newConfig) {
    // Update agent configuration at runtime
    if (newConfig.triggerThreshold !== undefined) {
      this.triggerThreshold = newConfig.triggerThreshold;
    }
    
    if (newConfig.watchType !== undefined) {
      this.watchType = newConfig.watchType;
    }
    
    // Log configuration change
    console.log('Agent configuration updated:', newConfig);
  },
  
  getConfiguration: function() {
    return {
      triggerThreshold: this.triggerThreshold,
      watchType: this.watchType,
      role: this.role,
      glyph: this.glyph
    };
  }
};
```

## Monitoring and Debugging

### 1. **Health Monitoring**

```typescript
export const MonitoredAgent: Agent = {
  // ... basic properties
  
  _health: {
    startTime: Date.now(),
    eventsProcessed: 0,
    signalsEmitted: 0,
    lastEventTime: null,
    errors: []
  },
  
  getHealth: function() {
    const uptime = Date.now() - this._health.startTime;
    
    return {
      agentId: this.id,
      uptime: uptime,
      eventsProcessed: this._health.eventsProcessed,
      signalsEmitted: this._health.signalsEmitted,
      eventsPerSecond: this._health.eventsProcessed / (uptime / 1000),
      lastEventTime: this._health.lastEventTime,
      errorCount: this._health.errors.length,
      memorySize: this.getMemory().length
    };
  },
  
  recordError: function(error) {
    this._health.errors.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    
    // Keep only last 100 errors
    if (this._health.errors.length > 100) {
      this._health.errors = this._health.errors.slice(-100);
    }
  }
};
```

### 2. **Debug Logging**

```typescript
export const DebugAgent: Agent = {
  // ... basic properties
  
  _debugMode: process.env.NODE_ENV === 'development',
  
  debugLog: function(message, data = {}) {
    if (this._debugMode) {
      console.log(`[${this.name}] ${message}`, {
        timestamp: new Date().toISOString(),
        agentId: this.id,
        ...data
      });
    }
  },
  
  observe: (event) => {
    this.debugLog('Processing event', {
      eventType: event.type,
      eventSource: event.source,
      timestamp: event.timestamp
    });
    
    try {
      // Process event
      this.processEvent(event);
      
      this.debugLog('Event processed successfully', {
        eventType: event.type,
        processingTime: Date.now() - event.timestamp
      });
    } catch (error) {
      this.debugLog('Error processing event', {
        error: error.message,
        eventType: event.type
      });
      
      this.recordError(error);
    }
  }
};
```

## Deployment and Scaling

### 1. **Agent Registration**

```typescript
// scripts/register-agent.ts
import { MyFirstAgent } from '../agents/myfirst';

export function registerAgent(agent: Agent) {
  // Register agent with the framework
  console.log(`Registering agent: ${agent.name} (${agent.id})`);
  
  // Validate agent
  if (!validateAgent(agent)) {
    throw new Error(`Invalid agent configuration: ${agent.name}`);
  }
  
  // Add to agent registry
  agentRegistry.set(agent.id, agent);
  
  console.log(`Agent registered successfully: ${agent.name}`);
}

function validateAgent(agent: Agent): boolean {
  // Check required properties
  if (!agent.id || !agent.name || !agent.observe) {
    return false;
  }
  
  // Check method implementations
  if (typeof agent.observe !== 'function') {
    return false;
  }
  
  return true;
}
```

### 2. **Agent Scaling**

```typescript
export const ScalableAgent: Agent = {
  // ... basic properties
  
  _instanceId: Math.random().toString(36).substr(2, 9),
  _maxConcurrent: parseInt(process.env.AGENT_MAX_CONCURRENT || '10'),
  _currentLoad: 0,
  
  observe: async function(event) {
    // Check if we can handle more load
    if (this._currentLoad >= this._maxConcurrent) {
      console.log(`Agent ${this.name} at capacity, queuing event`);
      this.queueEvent(event);
      return;
    }
    
    this._currentLoad++;
    
    try {
      await this.processEventAsync(event);
    } finally {
      this._currentLoad--;
    }
  },
  
  queueEvent: function(event) {
    // Implement event queuing logic
    this._eventQueue.push(event);
    
    // Process queue when capacity available
    if (this._currentLoad < this._maxConcurrent) {
      this.processQueuedEvents();
    }
  }
};
```

## Best Practices Summary

### 1. **Design Principles**
- **Single Responsibility**: Each agent should have one clear purpose
- **Loose Coupling**: Agents should not depend on each other directly
- **High Cohesion**: Related functionality should be grouped together
- **Fail Fast**: Detect and handle errors early

### 2. **Performance Guidelines**
- **Efficient Event Processing**: Process events quickly and efficiently
- **Memory Management**: Keep memory size reasonable and clean up regularly
- **Throttling**: Use throttling to prevent signal spam
- **Async Processing**: Use async operations for I/O-bound tasks

### 3. **Maintainability Tips**
- **Clear Naming**: Use descriptive names for agents and methods
- **Documentation**: Document complex logic and configuration options
- **Testing**: Write comprehensive tests for your agents
- **Monitoring**: Implement health monitoring and debugging

### 4. **Security Considerations**
- **Input Validation**: Validate all incoming events
- **Error Handling**: Don't expose sensitive information in errors
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Access Control**: Restrict access to agent configuration

## Related Documentation

- [Event System](events.md)
- [Signal System](signals.md)
- [Memory Management](memory.md)
- [Throttling System](throttle.md)
- [Performance Optimization](runtime.md)
- [Testing Guide](../tests/README.md)
