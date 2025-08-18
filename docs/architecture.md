# Eremos Architecture

## Overview

Eremos is a swarm-style agent framework designed for passive blockchain observation and intelligent signal generation. The architecture emphasizes modularity, scalability, and real-time processing capabilities while maintaining simplicity and extensibility.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Event Sources │    │   Agent Swarm   │    │  Signal Output  │
│                 │    │                 │    │                 │
│ • Solana RPC    │───▶│ • Observer      │───▶│ • Console Logs  │
│ • WebSocket     │    │ • Harvester     │    │ • API Endpoints │
│ • External APIs │    │ • Theron        │    │ • Webhooks      │
│ • Agent Events  │    │ • Custom Agents │    │ • Databases     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Event Parser   │    │  Memory System  │    │  Throttling     │
│                 │    │                 │    │                 │
│ • Validation    │    │ • State Storage │    │ • Rate Limiting │
│ • Normalization │    │ • Context       │    │ • Cooldowns     │
│ • Enrichment    │    │ • Persistence   │    │ • Batching      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

#### 1. **Event Sources**
- **Solana RPC**: Direct blockchain data access
- **WebSocket Streams**: Real-time transaction feeds
- **External APIs**: Third-party data sources
- **Agent Events**: Cross-agent communication

#### 2. **Agent Swarm**
- **Independent Operation**: Each agent runs autonomously
- **Specialized Roles**: Different agents for different purposes
- **Shared Utilities**: Common functionality across agents
- **Memory Sharing**: Context and state sharing

#### 3. **Signal Output**
- **Structured Logging**: Human-readable console output
- **API Endpoints**: RESTful interfaces for external systems
- **Webhooks**: Real-time notifications
- **Data Storage**: Persistent signal storage

## Agent Architecture

### Agent Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent                               │
├─────────────────────────────────────────────────────────────┤
│  Identity & Configuration                                  │
│  • id, name, role, glyph                                  │
│  • watchType, triggerThreshold                            │
│  • originTimestamp, description                           │
├─────────────────────────────────────────────────────────────┤
│  Core Logic                                               │
│  • observe(event) - Event processing                      │
│  • getMemory() - State retrieval                          │
│  • Custom methods - Pattern detection                     │
├─────────────────────────────────────────────────────────────┤
│  State Management                                         │
│  • Memory storage                                         │
│  • Configuration state                                     │
│  • Performance metrics                                     │
└─────────────────────────────────────────────────────────────┘
```

### Agent Communication

#### **Direct Communication**
```typescript
// Agent A can call methods on Agent B
const agentB = agentRegistry.get('agent-b');
const agentBMemory = agentB.getMemory();
```

#### **Event-Based Communication**
```typescript
// Agent A emits an event that Agent B observes
const event = {
  type: 'agent_signal',
  source: 'agent-a',
  data: { pattern: 'anomaly_detected' }
};

// Agent B receives this event
agentB.observe(event);
```

#### **Memory-Based Communication**
```typescript
// Agents share information through memory
const sharedMemory = agentA.getMemory().concat(agentB.getMemory());
const commonPatterns = findCommonPatterns(sharedMemory);
```

## Event Flow Architecture

### Event Processing Pipeline

```
1. Event Ingestion
   ↓
2. Event Validation
   ↓
3. Event Routing
   ↓
4. Agent Processing
   ↓
5. Signal Generation
   ↓
6. Signal Validation
   ↓
7. Signal Output
```

### Detailed Event Flow

#### **1. Event Ingestion**
```typescript
// Raw blockchain data comes in
const rawEvent = await solanaRPC.getTransaction(txHash);

// Transform to Eremos event format
const event = transformToEvent(rawEvent);
```

#### **2. Event Validation**
```typescript
// Validate event structure and data
if (!isValidEvent(event)) {
  console.warn('Invalid event received:', event);
  return;
}

// Check event freshness
if (isEventStale(event, 300000)) { // 5 minutes
  console.warn('Stale event received:', event);
  return;
}
```

#### **3. Event Routing**
```typescript
// Route to appropriate agents based on event type
const relevantAgents = getRelevantAgents(event.type);

for (const agent of relevantAgents) {
  // Check if agent is healthy and can process events
  if (agent.isHealthy() && agent.canProcessEvent(event)) {
    agent.observe(event);
  }
}
```

#### **4. Agent Processing**
```typescript
// Agent processes the event
export const MyAgent: Agent = {
  observe: (event) => {
    if (event.type === 'wallet_activity') {
      // Analyze the event
      const analysis = this.analyzeEvent(event);
      
      // Check if we should emit a signal
      if (analysis.confidence >= this.triggerThreshold) {
        this.emitSignal(analysis);
      }
      
      // Update memory
      this.updateMemory(event, analysis);
    }
  }
};
```

#### **5. Signal Generation**
```typescript
// Generate signal based on analysis
const signal = {
  agent: this.name,
  type: analysis.signalType,
  glyph: this.glyph,
  hash: generateSignalHash(event),
  timestamp: new Date().toISOString(),
  source: `agent-${this.name.toLowerCase()}`,
  confidence: analysis.confidence,
  data: analysis.data
};
```

#### **6. Signal Validation**
```typescript
// Validate signal before output
if (!isValidSignal(signal)) {
  console.warn('Invalid signal generated:', signal);
  return;
}

// Check for duplicates
if (isDuplicateSignal(signal)) {
  console.log('Duplicate signal detected, skipping');
  return;
}
```

#### **7. Signal Output**
```typescript
// Output signal through multiple channels
logSignal(signal);                    // Console logging
emitToAPI(signal);                    // API endpoints
sendWebhook(signal);                  // Webhook notifications
storeSignal(signal);                  // Persistent storage
```

## Memory Architecture

### Memory System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory System                           │
├─────────────────────────────────────────────────────────────┤
│  Agent Memory                                             │
│  • Local state storage                                    │
│  • Pattern recognition                                    │
│  • Context maintenance                                    │
├─────────────────────────────────────────────────────────────┤
│  Shared Memory                                            │
│  • Cross-agent communication                              │
│  • Pattern correlation                                    │
│  • Historical context                                     │
├─────────────────────────────────────────────────────────────┤
│  Persistent Memory                                        │
│  • Database storage                                       │
│  • File system storage                                    │
│  • Recovery mechanisms                                    │
└─────────────────────────────────────────────────────────────┘
```

### Memory Types

#### **1. Agent Memory**
- **Local State**: Agent-specific information
- **Pattern History**: Previously seen patterns
- **Configuration**: Agent settings and preferences

#### **2. Shared Memory**
- **Cross-Agent Data**: Information shared between agents
- **Global Patterns**: System-wide pattern recognition
- **Common Context**: Shared blockchain context

#### **3. Persistent Memory**
- **Long-term Storage**: Historical data and analysis
- **Recovery Data**: System state for restart
- **Analytics Data**: Performance and usage metrics

## Signal Architecture

### Signal System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Signal System                           │
├─────────────────────────────────────────────────────────────┤
│  Signal Generation                                        │
│  • Pattern detection                                      │
│  • Confidence calculation                                 │
│  • Data enrichment                                        │
├─────────────────────────────────────────────────────────────┤
│  Signal Processing                                        │
│  • Validation                                             │
│  • Deduplication                                          │
│  • Throttling                                             │
├─────────────────────────────────────────────────────────────┤
│  Signal Output                                            │
│  • Multiple formats                                       │
│  • Multiple channels                                      │
│  • Storage and retrieval                                  │
└─────────────────────────────────────────────────────────────┘
```

### Signal Flow

#### **1. Signal Generation**
```typescript
// Agent detects pattern and generates signal
const signal = createSignal(agent, type, event, confidence);
```

#### **2. Signal Processing**
```typescript
// Process signal through pipeline
const processedSignal = processSignal(signal);
```

#### **3. Signal Output**
```typescript
// Output signal in multiple formats
outputSignal(processedSignal, {
  console: true,
  api: true,
  webhook: true,
  storage: true
});
```

## Scalability Architecture

### Horizontal Scaling

#### **Agent Replication**
```typescript
// Multiple instances of the same agent
const agentInstances = [
  createAgentInstance('observer', { instanceId: 'observer-1' }),
  createAgentInstance('observer', { instanceId: 'observer-2' }),
  createAgentInstance('observer', { instanceId: 'observer-3' })
];
```

#### **Load Balancing**
```typescript
// Distribute events across agent instances
function distributeEvent(event, agentInstances) {
  const instanceIndex = event.hash % agentInstances.length;
  const targetInstance = agentInstances[instanceIndex];
  
  targetInstance.observe(event);
}
```

### Vertical Scaling

#### **Resource Optimization**
```typescript
// Optimize agent performance
export const OptimizedAgent: Agent = {
  // ... basic properties
  
  _eventBuffer: [],
  _processingBatch: false,
  
  observe: function(event) {
    this._eventBuffer.push(event);
    
    if (!this._processingBatch) {
      this.processBatch();
    }
  },
  
  processBatch: async function() {
    this._processingBatch = true;
    
    while (this._eventBuffer.length > 0) {
      const batch = this._eventBuffer.splice(0, 100);
      await this.processEventsBatch(batch);
    }
    
    this._processingBatch = false;
  }
};
```

## Security Architecture

### Security Layers

#### **1. Input Validation**
```typescript
// Validate all incoming events
function validateEvent(event) {
  // Check event structure
  if (!event || typeof event !== 'object') {
    throw new Error('Invalid event structure');
  }
  
  // Check required fields
  if (!event.type || !event.timestamp) {
    throw new Error('Missing required event fields');
  }
  
  // Check data types
  if (typeof event.type !== 'string' || typeof event.timestamp !== 'number') {
    throw new Error('Invalid event field types');
  }
  
  // Check timestamp validity
  if (event.timestamp < 0 || event.timestamp > Date.now() + 60000) {
    throw new Error('Invalid event timestamp');
  }
  
  return true;
}
```

#### **2. Access Control**
```typescript
// Implement access control for agent operations
class AgentAccessControl {
  constructor(agent) {
    this.agent = agent;
    this.permissions = new Set();
  }
  
  canAccessMethod(methodName, context) {
    // Check if agent has permission for this method
    if (!this.permissions.has(methodName)) {
      return false;
    }
    
    // Check context-based permissions
    if (methodName === 'updateConfiguration') {
      return context.isAdmin || context.isOwner;
    }
    
    return true;
  }
}
```

#### **3. Rate Limiting**
```typescript
// Implement rate limiting for agent operations
class AgentRateLimiter {
  constructor(agent, limits) {
    this.agent = agent;
    this.limits = limits;
    this.counters = new Map();
  }
  
  canPerformAction(action) {
    const now = Date.now();
    const counter = this.counters.get(action) || { count: 0, resetTime: now + this.limits[action].window };
    
    // Reset counter if window expired
    if (now > counter.resetTime) {
      counter.count = 0;
      counter.resetTime = now + this.limits[action].window;
    }
    
    // Check if action is allowed
    if (counter.count >= this.limits[action].max) {
      return false;
    }
    
    // Increment counter
    counter.count++;
    this.counters.set(action, counter);
    
    return true;
  }
}
```

## Performance Architecture

### Performance Optimization Strategies

#### **1. Event Batching**
```typescript
// Batch events for efficient processing
class EventBatcher {
  constructor(batchSize = 100, batchTimeout = 5000) {
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
    this.currentBatch = [];
    this.batchTimer = null;
  }
  
  addEvent(event) {
    this.currentBatch.push(event);
    
    if (this.currentBatch.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.processBatch(), this.batchTimeout);
    }
  }
  
  processBatch() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    if (this.currentBatch.length > 0) {
      this.processEventsBatch(this.currentBatch);
      this.currentBatch = [];
    }
  }
}
```

#### **2. Caching**
```typescript
// Implement caching for frequently accessed data
class AgentCache {
  constructor(maxSize = 1000, ttlMs = 300000) { // 5 minutes TTL
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }
}
```

#### **3. Async Processing**
```typescript
// Use async processing for I/O operations
export const AsyncAgent: Agent = {
  // ... basic properties
  
  observe: async function(event) {
    try {
      // Process event asynchronously
      const result = await this.processEventAsync(event);
      
      if (result.shouldEmitSignal) {
        await this.emitSignalAsync(result.signal);
      }
      
      // Update memory asynchronously
      await this.updateMemoryAsync(event, result);
      
    } catch (error) {
      console.error('Error processing event:', error);
      this.recordError(error);
    }
  }
};
```

## Monitoring Architecture

### Health Monitoring

#### **1. Agent Health Checks**
```typescript
// Implement health monitoring for agents
class AgentHealthMonitor {
  constructor(agent) {
    this.agent = agent;
    this.healthMetrics = {
      startTime: Date.now(),
      eventsProcessed: 0,
      signalsEmitted: 0,
      errors: [],
      lastEventTime: null,
      memoryUsage: 0
    };
  }
  
  recordEvent() {
    this.healthMetrics.eventsProcessed++;
    this.healthMetrics.lastEventTime = Date.now();
  }
  
  recordSignal() {
    this.healthMetrics.signalsEmitted++;
  }
  
  recordError(error) {
    this.healthMetrics.errors.push({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack
    });
    
    // Keep only last 100 errors
    if (this.healthMetrics.errors.length > 100) {
      this.healthMetrics.errors = this.healthMetrics.errors.slice(-100);
    }
  }
  
  getHealthStatus() {
    const uptime = Date.now() - this.healthMetrics.startTime;
    const errorRate = this.healthMetrics.errors.length / (uptime / 1000);
    
    return {
      status: errorRate < 0.1 ? 'healthy' : 'degraded',
      uptime: uptime,
      eventsPerSecond: this.healthMetrics.eventsProcessed / (uptime / 1000),
      errorRate: errorRate,
      memoryUsage: this.healthMetrics.memoryUsage
    };
  }
}
```

#### **2. System Health Monitoring**
```typescript
// Monitor overall system health
class SystemHealthMonitor {
  constructor() {
    this.agents = new Map();
    this.systemMetrics = {
      totalEvents: 0,
      totalSignals: 0,
      activeAgents: 0,
      systemUptime: Date.now()
    };
  }
  
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    this.systemMetrics.activeAgents = this.agents.size;
  }
  
  getSystemHealth() {
    const agentHealth = Array.from(this.agents.values()).map(agent => ({
      id: agent.id,
      name: agent.name,
      health: agent.getHealthStatus()
    }));
    
    const healthyAgents = agentHealth.filter(a => a.health.status === 'healthy').length;
    const totalAgents = agentHealth.length;
    
    return {
      systemStatus: healthyAgents === totalAgents ? 'healthy' : 'degraded',
      healthyAgents: healthyAgents,
      totalAgents: totalAgents,
      agentHealth: agentHealth,
      systemMetrics: this.systemMetrics
    };
  }
}
```

## Deployment Architecture

### Deployment Models

#### **1. Single Instance**
```typescript
// Single instance deployment
const agent = createAgent('observer');
agent.start();
```

#### **2. Multi-Instance**
```typescript
// Multiple instances for load distribution
const instances = [];
for (let i = 0; i < 3; i++) {
  const instance = createAgent('observer', { instanceId: `observer-${i}` });
  instances.push(instance);
  instance.start();
}
```

#### **3. Containerized Deployment**
```dockerfile
# Dockerfile for agent deployment
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY config/ ./config/

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

#### **4. Kubernetes Deployment**
```yaml
# kubernetes-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: eremos-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: eremos-agent
  template:
    metadata:
      labels:
        app: eremos-agent
    spec:
      containers:
      - name: eremos-agent
        image: eremos/agent:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: AGENT_TYPE
          value: "observer"
```

## Future Architecture Considerations

### Planned Enhancements

#### **1. Agent Orchestration**
- **Centralized Coordination**: Central agent management
- **Dynamic Scaling**: Automatic agent scaling based on load
- **Load Balancing**: Intelligent event distribution

#### **2. Advanced Memory Systems**
- **Distributed Memory**: Shared memory across instances
- **Memory Persistence**: Long-term memory storage
- **Memory Compression**: Efficient memory usage

#### **3. Enhanced Signal Processing**
- **Signal Correlation**: Cross-signal pattern detection
- **Machine Learning**: AI-powered pattern recognition
- **Predictive Analytics**: Future event prediction

#### **4. Integration Capabilities**
- **Plugin System**: Third-party agent extensions
- **API Gateway**: Unified external interface
- **Event Streaming**: Real-time event distribution

## Related Documentation

- [Agent Development Guide](agents.md)
- [Event System](events.md)
- [Signal System](signals.md)
- [Memory Management](memory.md)
- [Performance Optimization](runtime.md)
- [Deployment Guide](deployment.md)
