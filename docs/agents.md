# Agent Development Guide 🤖

This guide covers everything you need to know about developing agents for the Eremos framework.

## 📋 Table of Contents

- [Agent Overview](#agent-overview)
- [Agent Interface](#agent-interface)
- [Creating Your First Agent](#creating-your-first-agent)
- [Agent Types & Roles](#agent-types--roles)
- [Signal Generation](#signal-generation)
- [Memory Management](#memory-management)
- [Testing Agents](#testing-agents)
- [Best Practices](#best-practices)
- [Current Agents](#current-agents)

## 🎯 Agent Overview

Agents are the core components of the Eremos framework. Each agent is an independent module that:

- **Observes** specific types of blockchain events
- **Processes** events using custom logic
- **Emits** structured signals when conditions are met
- **Maintains** internal state and memory
- **Operates** independently within the swarm

## 🔧 Agent Interface

All agents must implement the `Agent` interface:

```typescript
export type Agent = {
  id: string; // Unique agent identifier
  name: string; // Human-readable name
  role: string; // Agent role (surveillance, memory, etc.)
  glyph: string; // Visual symbol for the agent
  watchType: string; // Type of events to watch
  triggerThreshold: number; // Confidence threshold (0-1)
  lastSignal: string | null; // Timestamp of last signal
  originTimestamp: string; // Agent creation timestamp
  description: string; // Agent description
  observe: (event: any) => void; // Main observation logic
  getMemory?: () => string[]; // Optional memory snapshot
};
```

## 🚀 Creating Your First Agent

### Step 1: Use the Template

Start with the example agent template:

```bash
# Copy the example agent
cp agents/example.ts agents/my-agent.ts
```

### Step 2: Customize Your Agent

```typescript
import { Agent } from '../types/agent';
import { generateSignalHash, logSignal } from '../utils/signal';

export const myAgent: Agent = {
  id: 'my-agent',
  name: 'My Custom Agent',
  role: 'surveillance',
  glyph: '🔍',
  watchType: 'wallet_activity',
  triggerThreshold: 0.8,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: 'Monitors specific wallet patterns and emits signals',

  observe: (event: any) => {
    // Your custom detection logic here
    const confidence = calculateConfidence(event);

    if (confidence >= myAgent.triggerThreshold) {
      const signal = {
        agent: myAgent.name,
        type: 'custom_detection',
        glyph: myAgent.glyph,
        hash: generateSignalHash(),
        timestamp: new Date().toISOString(),
        source: `agent-${myAgent.id}`,
        confidence: confidence,
        data: {
          wallet: event.wallet,
          pattern: event.pattern,
        },
      };

      logSignal(signal);
      myAgent.lastSignal = signal.timestamp;
    }
  },

  getMemory: () => {
    // Return memory snapshot
    return [
      `Last signal: ${myAgent.lastSignal}`,
      `Total observations: ${observationCount}`,
    ];
  },
};
```

### Step 3: Add Tests

Create tests for your agent:

```typescript
// tests/my-agent.test.ts
import { myAgent } from '../agents/my-agent';

describe('My Agent', () => {
  test('should emit signal when confidence threshold is met', () => {
    const mockEvent = {
      wallet: 'test-wallet',
      pattern: 'suspicious-activity',
    };

    myAgent.observe(mockEvent);

    // Assert signal was emitted
    expect(myAgent.lastSignal).toBeTruthy();
  });
});
```

## 🎭 Agent Types & Roles

### Surveillance Agents

Monitor specific patterns and emit signals when detected.

**Examples:**

- Wallet activity monitoring
- Contract deployment detection
- Anomaly detection

**Characteristics:**

- High-frequency observation
- Real-time signal emission
- Low memory footprint

### Memory Agents

Store and analyze historical data for pattern recognition.

**Examples:**

- Historical wallet analysis
- Pattern correlation
- Trend detection

**Characteristics:**

- Persistent memory storage
- Batch processing
- Complex analysis

### Trigger Agents

Act as gatekeepers, emitting signals only when specific conditions are met.

**Examples:**

- Threshold-based alerts
- Multi-agent coordination
- Conditional logic

**Characteristics:**

- Conditional signal emission
- Multi-input processing
- State management

## 📡 Signal Generation

### Signal Structure

All signals follow a consistent structure:

```typescript
interface Signal {
  agent: string; // Agent name
  type: string; // Signal type
  glyph: string; // Visual symbol
  hash: string; // Unique identifier
  timestamp: string; // ISO timestamp
  source: string; // Source identifier
  confidence: number; // Confidence score (0-1)
  data?: any; // Additional data
}
```

### Generating Signals

Use the utility functions for consistent signal generation:

```typescript
import { generateSignalHash, logSignal } from '../utils/signal';

const signal = {
  agent: agent.name,
  type: 'detection_type',
  glyph: agent.glyph,
  hash: generateSignalHash(),
  timestamp: new Date().toISOString(),
  source: `agent-${agent.id}`,
  confidence: calculatedConfidence,
  data: {
    // Additional context
  },
};

logSignal(signal);
```

### Confidence Scoring

Implement confidence scoring based on:

- **Event frequency** - How often the pattern occurs
- **Pattern strength** - How strong the detected pattern is
- **Historical context** - Comparison with past events
- **External factors** - Market conditions, time of day, etc.

```typescript
function calculateConfidence(event: any): number {
  let confidence = 0;

  // Base confidence from event strength
  confidence += event.strength * 0.3;

  // Frequency bonus
  if (event.frequency > 10) confidence += 0.2;

  // Historical context
  if (isHistoricalPattern(event)) confidence += 0.3;

  // External factors
  if (isMarketActive()) confidence += 0.2;

  return Math.min(confidence, 1.0);
}
```

## 🧠 Memory Management

### Memory Interface

Agents can implement optional memory management:

```typescript
getMemory: () => string[] {
  return [
    `Total observations: ${this.observationCount}`,
    `Last signal: ${this.lastSignal}`,
    `Average confidence: ${this.averageConfidence}`,
    `Patterns detected: ${this.patterns.join(', ')}`
  ];
}
```

### Memory Best Practices

- **Keep it lightweight** - Don't store large datasets in memory
- **Use external storage** - For large datasets, use databases
- **Implement cleanup** - Regularly clear old memory entries
- **Structure your data** - Use consistent formats for memory entries

## 🧪 Testing Agents

### Unit Testing

Test individual agent functions:

```typescript
describe('Agent Logic', () => {
  test('should calculate confidence correctly', () => {
    const event = { strength: 0.8, frequency: 15 };
    const confidence = calculateConfidence(event);
    expect(confidence).toBeGreaterThan(0.7);
  });

  test('should emit signal when threshold met', () => {
    const mockEvent = createMockEvent();
    agent.observe(mockEvent);
    expect(agent.lastSignal).toBeTruthy();
  });
});
```

### Integration Testing

Test agent interactions:

```typescript
describe('Agent Integration', () => {
  test('should coordinate with other agents', () => {
    const event = createTestEvent();
    observerAgent.observe(event);
    memoryAgent.observe(event);

    // Verify coordination
    expect(memoryAgent.getMemory()).toContain('coordinated');
  });
});
```

### Performance Testing

Test agent performance under load:

```typescript
describe('Agent Performance', () => {
  test('should handle high event volume', () => {
    const events = generateTestEvents(1000);

    const startTime = Date.now();
    events.forEach((event) => agent.observe(event));
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds
  });
});
```

## ✅ Best Practices

### Code Quality

- **Use TypeScript** - Leverage type safety
- **Follow naming conventions** - Use descriptive names
- **Add JSDoc comments** - Document complex logic
- **Keep functions small** - Single responsibility principle

### Performance

- **Optimize hot paths** - Profile and optimize critical code
- **Use efficient data structures** - Choose appropriate collections
- **Implement caching** - Cache expensive calculations
- **Monitor memory usage** - Avoid memory leaks

### Reliability

- **Handle errors gracefully** - Don't let exceptions crash the agent
- **Validate inputs** - Check event data before processing
- **Add logging** - Log important events and errors
- **Test edge cases** - Test unusual scenarios

### Maintainability

- **Write tests** - Comprehensive test coverage
- **Document decisions** - Explain complex logic
- **Use constants** - Define magic numbers as constants
- **Follow patterns** - Use established patterns from existing agents

## 🤖 Current Agents

### Theron (Agent-000) - Memory Vault

- **Role:** `memory_vault`
- **Glyph:** `Ϸ`
- **Watch Type:** `anomaly_detection`
- **Description:** Stores and analyzes historical patterns for anomaly detection
- **Status:** ✅ Active

### Observer (Agent-001) - Surveillance

- **Role:** `surveillance`
- **Glyph:** `Δ`
- **Watch Type:** `wallet_activity`
- **Description:** Monitors wallet activity and detects suspicious patterns
- **Status:** ✅ Active

### Harvester (Agent-002) - Indexing

- **Role:** `indexing`
- **Glyph:** `λ`
- **Watch Type:** `mint_activity`
- **Description:** Indexes and tracks mint activities across the network
- **Status:** ✅ Active

### Skieró (Agent-003) - Launch Tracker

- **Role:** `launch_tracker`
- **Glyph:** `⚡`
- **Watch Type:** `contract_deployments`
- **Description:** Tracks contract deployments and launch events
- **Status:** ✅ Active

## 🚀 Next Steps

1. **Choose your agent type** - Decide on surveillance, memory, or trigger
2. **Use the template** - Start with `/agents/example.ts`
3. **Implement your logic** - Add your custom detection logic
4. **Add tests** - Create comprehensive test coverage
5. **Document your agent** - Update this guide with your agent details
6. **Submit a PR** - Follow the contributing guidelines

---

**Ready to build the next great agent?** 🚀

_Check out the [Contributing Guide](contributing.md) for detailed development workflow._
