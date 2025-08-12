# 🤖 Agent Development Guide

<div align="center">

**Complete guide to creating and deploying Eremos agents**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)

</div>

## ∴ Table of Contents

- [Ϸ Agent Fundamentals](#-agent-fundamentals)
- [⚙ Base Requirements](#-base-requirements)
- [⟩ Development Workflow](#-development-workflow)
- [Σ Active Agent Registry](#-active-agent-registry)
- [◎ Development Tips](#-development-tips)
- [∘ Testing & Validation](#-testing--validation)
- [∆ Performance Guidelines](#-performance-guidelines)

## Ϸ Agent Fundamentals

Eremos agents are **autonomous observers** that monitor blockchain activity and emit structured signals when specific patterns are detected. Each agent operates independently but shares common utilities and interfaces.

### Core Principles
- **Single Responsibility**: Each agent focuses on one specific detection pattern
- **Passive Observation**: Agents observe and react, they don't initiate blockchain actions
- **Confidence-Based Emission**: Signals include confidence scores (0-1) based on detection quality
- **Memory Optional**: Agents can maintain lightweight state for pattern recognition

## ⚙ Base Requirements

Every agent must implement the `Agent` interface:

```typescript
export type Agent = {
  id: string                    // Unique identifier (e.g., "agent-000")
  name: string                  // Human-readable name
  role: string                  // Agent category/purpose
  glyph: string                 // Visual symbol for identification
  watchType: string             // Type of events to monitor
  triggerThreshold: number      // Confidence threshold for emission
  lastSignal: string | null     // Last signal state
  originTimestamp: string       // Agent creation time
  description: string           // Purpose description
  observe: (event: any) => void // Main detection logic
  getMemory?: () => string[]    // Optional memory interface
}
```

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique agent identifier | `"agent-launch"` |
| `name` | `string` | Display name | `"LaunchTracker"` |
| `role` | `string` | Agent category | `"launch_monitor"` |
| `glyph` | `string` | Unicode symbol | `"Σ"` |
| `watchType` | `string` | Event type to observe | `"wallet_activity"` |
| `triggerThreshold` | `number` | Emission confidence threshold | `0.7` |
| `observe()` | `function` | Core detection logic | See examples below |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `getMemory()` | `function` | Returns array of memory tokens |
| `lastSignal` | `string \| null` | Last emission state |

## ⟩ Development Workflow

### 1. **Scaffold Creation**
```bash
# Use the example template
cp agents/example.ts agents/my-agent.ts

# Or generate with script
npm run agent:generate MyAgent
```

### 2. **Agent Implementation**
```typescript
import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const MyAgent: Agent = {
  id: "agent-myagent",
  name: "MyAgent",
  role: "custom_detection",
  watchType: "wallet_activity",
  glyph: "⚡",
  triggerThreshold: 0.75,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  
  description: "Detects custom patterns in wallet behavior",
  
  observe: (event) => {
    if (event?.type === "wallet_activity" && customLogic(event)) {
      const confidence = calculateConfidence(event);
      
      if (confidence > 0.75) {
        const hash = generateSignalHash(event);
        
        logSignal({
          agent: "MyAgent",
          type: "custom_pattern_detected",
          glyph: "⚡",
          hash,
          timestamp: new Date().toISOString(),
          confidence,
        });
      }
    }
  },
  
  getMemory: () => {
    return ["pattern_cache_001", "threshold_history"];
  }
};
```

### 3. **Testing & Validation**
```bash
# Test your agent
npm run agent:dev

# Validate configuration
npm run agent:validate agents/my-agent.ts

# List all agents
npm run agent:list
```

## Σ Active Agent Registry

<table>
<tr>
<th>Agent</th>
<th>ID</th>
<th>Glyph</th>
<th>Role</th>
<th>Watch Type</th>
<th>Threshold</th>
<th>Status</th>
</tr>
<tr>
<td><strong>Theron</strong></td>
<td><code>agent-000</code></td>
<td align="center">Ϸ</td>
<td>memory_vault</td>
<td>anomaly_detection</td>
<td>∞</td>
<td>🟢 Active</td>
</tr>
<tr>
<td><strong>LaunchTracker</strong></td>
<td><code>agent-launch</code></td>
<td align="center">Σ</td>
<td>launch_monitor</td>
<td>wallet_activity</td>
<td>0.7</td>
<td>🟢 Active</td>
</tr>
<tr>
<td><strong>Skieró</strong></td>
<td><code>agent-022</code></td>
<td align="center">ψ</td>
<td>dormant_wallet_monitor</td>
<td>wallet_activity</td>
<td>0.7</td>
<td>🟢 Active</td>
</tr>
<tr>
<td><strong>Observer</strong></td>
<td><code>agent-observer</code></td>
<td align="center">φ</td>
<td>surveillance</td>
<td>wallet_activity</td>
<td>0.6</td>
<td>🟢 Active</td>
</tr>
<tr>
<td><strong>Harvester</strong></td>
<td><code>agent-harvester</code></td>
<td align="center">λ</td>
<td>indexing</td>
<td>mint_activity</td>
<td>0.5</td>
<td>🟢 Active</td>
</tr>
</table>

> **Note**: Theron has `triggerThreshold: Infinity` and never emits signals - it only archives for memory.

## ◎ Development Tips

### ✅ Best Practices

- **Keep Logic Scoped**: Each agent should have a single, well-defined purpose
- **Use Shared Utilities**: Leverage `generateSignalHash()`, `logSignal()`, and other utils
- **Implement Confidence Scoring**: Include meaningful confidence calculations
- **Handle Edge Cases**: Gracefully handle malformed or unexpected events
- **Memory Management**: Use `getMemory()` for pattern recognition across events

### 🔧 Utility Functions

```typescript
// Signal hash generation
const hash = generateSignalHash(event);

// Structured logging
logSignal({
  agent: "MyAgent",
  type: "detection_type",
  glyph: "⚡",
  hash,
  timestamp: new Date().toISOString(),
  confidence: 0.85
});

// Throttling (prevent spam)
import { shouldEmit } from "../utils/throttle";
if (shouldEmit(agentId, 5000)) { // 5 second cooldown
  // Emit signal
}
```

### ⚠️ Common Pitfalls

- **Signal Spam**: Use throttling and confidence thresholds appropriately
- **Memory Leaks**: Keep memory tokens lightweight (strings only)
- **Blocking Operations**: Avoid synchronous heavy computations in `observe()`
- **Error Handling**: Wrap detection logic in try-catch blocks

## ∘ Testing & Validation

### Unit Testing
```typescript
// tests/my-agent.test.ts
import { MyAgent } from "../agents/my-agent";

describe("MyAgent", () => {
  it("should detect custom patterns", () => {
    const event = { type: "wallet_activity", customField: "value" };
    const result = MyAgent.observe(event);
    expect(result).toBeDefined();
  });
  
  it("should return memory snapshot", () => {
    const memory = MyAgent.getMemory();
    expect(Array.isArray(memory)).toBe(true);
  });
});
```

### Integration Testing
```bash
# Stress test with multiple events
npm run stress:test

# Simulate cluster behavior
npm run cluster:simulate

# Test signal emission
npm run signal:preview
```

## ∆ Performance Guidelines

### Confidence Scoring
- **0.9-1.0**: Extremely high confidence (rare, exceptional patterns)
- **0.7-0.9**: High confidence (typical emission threshold)
- **0.5-0.7**: Medium confidence (monitoring/logging only)
- **0.0-0.5**: Low confidence (debugging/analysis)

### Memory Usage
- Keep memory tokens under 50 items
- Use descriptive but concise string identifiers
- Clear stale memory periodically
- Avoid storing full event payloads

### Event Processing
- Process events in under 100ms
- Use early returns for uninteresting events
- Batch signal emissions when possible
- Implement appropriate cooldown periods

---

<div align="center">

**Ready to build your agent?** Start with [`agents/example.ts`](../agents/example.ts) and refer to this guide!

[![View Examples](https://img.shields.io/badge/View-Examples-blue?style=flat)](../agents/)
[![Join Community](https://img.shields.io/badge/Join-Community-green?style=flat)](https://x.com/EremosCore)

</div>
