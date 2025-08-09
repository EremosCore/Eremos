# Agent Guide

---

## 🏗️ Base Requirements

Each agent must implement the following interface:

```typescript
interface Agent {
  description: string;
  watchType: string;
  glyph: string;
  triggerThreshold: number;
  
  observe(event: Event): void;
  getMemory(): AgentMemory;
}
```

### Required Methods

- **`observe(event)`** — Core detection logic for processing blockchain events
- **`getMemory()`** — Returns current memory snapshot for persistence
- **`description`** — Human-readable agent description
- **`watchType`** — Type of events this agent monitors
- **`glyph`** — Unique symbol for agent identification
- **`triggerThreshold`** — Confidence threshold for signal emission

---

## 🚀 Development Tips

### Best Practices

- **Keep logic scoped and clean** - Each agent should have a single responsibility
- **Use `generateSignalHash()`** - Always generate unique hashes for all signal outputs
- **Log using shared utilities** - Use the shared `logSignal()` utility for consistent logging
- **Test thoroughly** - Use `/scripts/dev-agent.ts` or create your own mock scenarios
- **Follow naming conventions** - Use descriptive names for agents and methods

### Testing Your Agent

```bash
# Test a specific agent
npm run dev

# Or use the dev script directly
npx ts-node scripts/dev-agent.ts
```

---

## 🤖 Available Agents

### Theron (Agent-000)
- **Role**: `memory_vault`
- **Glyph**: `Ϸ`
- **Watches**: `anomaly_detection`
- **Status**: Active
- **Description**: The first deployed agent in the swarm. Passive and pattern-sensitive.

### Observer
- **Role**: `surveillance`
- **Glyph**: `Δ`
- **Watches**: `wallet_activity`
- **Status**: Active
- **Description**: Monitors wallet activity and detects suspicious patterns.

### Harvester
- **Role**: `indexing`
- **Glyph**: `λ`
- **Watches**: `mint_activity`
- **Status**: Active
- **Description**: Tracks mint patterns and token creation events.

### Skieró
- **Role**: `launch_tracker`
- **Glyph**: `Σ`
- **Watches**: `contract_deployment`
- **Status**: Active
- **Description**: Monitors contract deployments and launch events.

### LaunchTracker
- **Role**: `launch_detection`
- **Glyph**: `Ω`
- **Watches**: `fresh_funding`
- **Status**: Active
- **Description**: Detects freshly funded wallets and tracks their activities.

---

## 📝 Creating a New Agent

### Step 1: Use the Template

Copy `/agents/example.ts` as your starting point:

```typescript
import { Agent, Event, AgentMemory } from '../types/agent';

export class YourAgent implements Agent {
  description = 'Your agent description';
  watchType = 'your_watch_type';
  glyph = '⚡';
  triggerThreshold = 0.8;

  observe(event: Event): void {
    // Your detection logic here
  }

  getMemory(): AgentMemory {
    return {
      // Your memory snapshot
    };
  }
}
```

### Step 2: Implement Core Logic

Focus on these key areas:

1. **Event Processing** - Handle incoming blockchain events
2. **Pattern Detection** - Identify relevant patterns in the data
3. **Signal Generation** - Emit signals when thresholds are met
4. **Memory Management** - Maintain state for pattern recognition

### Step 3: Add Tests

Create tests in the `/tests/` directory:

```typescript
// tests/your-agent.test.ts
import { YourAgent } from '../agents/your-agent';

describe('YourAgent', () => {
  let agent: YourAgent;

  beforeEach(() => {
    agent = new YourAgent();
  });

  test('should detect expected patterns', () => {
    // Your test logic
  });
});
```

---

## 🔧 Agent Configuration

### Environment Variables

Agents can be configured using environment variables:

```bash
# Agent-specific settings
AGENT_THERON_ENABLED=true
AGENT_OBSERVER_THRESHOLD=0.85
AGENT_HARVESTER_INTERVAL=5000
```

### Memory Persistence

Agent memory is automatically persisted and can be exported:

```bash
# Export agent memory
npm run export-memory -- --agent=theron
```

---

## 📊 Monitoring & Metrics

### Agent Health

Monitor agent performance and health:

```bash
# Check agent status
npm run agent-status

# View agent metrics
npm run agent-metrics
```

### Signal Analytics

Track signal quality and performance:

```bash
# Analyze signal patterns
npm run signal-analysis

# Test signal thresholds
npm run test-signal-thresholds
```

---

*For more detailed information about specific agents, check their individual files in the `/agents/` directory.*
