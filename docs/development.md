# Development Guide

This guide covers development workflows, tooling, and best practices for working with Eremos.

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm 8+
- TypeScript 4.9+

### Installation
```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

### Environment Setup
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode |
| `npm run build` | Build TypeScript files |
| `npm test` | Run all tests |
| `npm run test:agent` | Test a specific agent |
| `npm run validate` | Validate agent configuration |
| `npm run simulate` | Run cluster simulation |
| `npm run stress-test` | Run stress tests |
| `npm run generate:agent` | Generate new agent template |
| `npm run generate:signal` | Generate test signals |
| `npm run lint` | Lint code (placeholder) |
| `npm run clean` | Clean build artifacts |

## 🧪 Testing Workflow

### Testing Individual Agents
```bash
# Test example agent
npm run test:agent example

# Test with custom event data
node -r ts-node/register scripts/dev-agent.ts
```

### Validating Agents
```bash
# Validate agent structure
npm run validate agents/theron.ts

# Validate all agents
npm run validate agents/*.ts
```

### Simulation Scripts
```bash
# Simulate wallet cluster activity
npm run simulate

# Run stress tests
npm run stress-test

# Test signal thresholds
node -r ts-node/register scripts/test-signal-thresholds.ts
```

## 🤖 Agent Development

### Creating a New Agent

1. **Generate from template:**
   ```bash
   npm run generate:agent MyAgent
   ```

2. **Or copy from example:**
   ```bash
   cp agents/example.ts agents/my-agent.ts
   ```

3. **Update agent configuration:**
   ```typescript
   export const MyAgent: Agent = {
     id: "agent-unique-id",
     name: "MyAgent", 
     role: "surveillance",
     watchType: "wallet_activity",
     glyph: "μ",
     triggerThreshold: 0.7,
     // ... rest of config
   }
   ```

### Agent Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (e.g., "agent-001") |
| `name` | `string` | Human-readable name |
| `role` | `string` | Agent's role in the swarm |
| `watchType` | `string` | Type of events to observe |
| `glyph` | `string` | Unicode symbol for visual identification |
| `triggerThreshold` | `number` | Confidence threshold for signal emission |
| `lastSignal` | `string \| null` | Last emitted signal ID |
| `originTimestamp` | `string` | Agent creation timestamp |
| `description` | `string` | Agent purpose and behavior |
| `observe` | `function` | Event observation logic |
| `getMemory` | `function` | Memory state retrieval (optional) |

### Event Processing
```typescript
observe: (event) => {
  // 1. Validate event type
  if (event?.type !== 'wallet_activity') return;
  
  // 2. Apply detection logic
  const isRelevant = yourDetectionLogic(event);
  
  // 3. Calculate confidence
  const confidence = calculateConfidence(event);
  
  // 4. Emit signal if threshold met
  if (isRelevant && confidence > this.triggerThreshold) {
    const hash = generateSignalHash(event);
    logSignal({
      agent: this.name,
      type: "your_signal_type",
      glyph: this.glyph,
      hash,
      timestamp: new Date().toISOString(),
      confidence
    });
  }
}
```

## 🔧 Utilities

### Signal Generation
```typescript
import { generateSignalHash } from '../utils/signal';

const hash = generateSignalHash(eventData);
// Returns: "sig_AbC123XyZ9"
```

### Logging
```typescript
import { logSignal } from '../utils/logger';

logSignal({
  agent: "AgentName",
  type: "detection_type", 
  glyph: "Δ",
  hash: signalHash,
  timestamp: new Date().toISOString(),
  details: { /* optional context */ }
});
```

### Throttling
```typescript
import { shouldEmit } from '../utils/throttle';

if (shouldEmit(agentId, 5000)) { // 5 second cooldown
  // Emit signal
}
```

### Metrics
```typescript
import { recordCall, getCallCount } from '../utils/metrics';

recordCall(agentId);
const callCount = getCallCount(agentId);
```

## 🧹 Code Quality

### TypeScript Configuration
- Strict mode enabled
- ES6 target
- CommonJS modules
- Import/export validation

### File Structure
```
agents/
├── example.ts          # Template agent
├── theron.ts          # Memory vault agent  
├── observer.ts        # Surveillance agent
└── my-agent.ts        # Your new agent

utils/
├── signal.ts          # Signal generation
├── logger.ts          # Logging utilities
├── throttle.ts        # Rate limiting
└── metrics.ts         # Performance tracking
```

### Naming Conventions
- **Agents**: PascalCase (e.g., `MyAgent`)
- **Files**: kebab-case (e.g., `my-agent.ts`)
- **IDs**: lowercase with hyphens (e.g., `agent-001`)
- **Types**: PascalCase (e.g., `WalletEvent`)
- **Functions**: camelCase (e.g., `generateSignalHash`)

## 🐛 Debugging

### Debug Logging
```typescript
import { debug } from '../utils/debug';

debug('agent-name', 'Processing wallet event...');
```

### Error Handling
```typescript
import { logAgentError } from '../utils/error';

try {
  // Agent logic
} catch (error) {
  logAgentError(this.name, error);
}
```

### Memory Inspection
```typescript
// Check agent memory state
const memory = agent.getMemory();
console.log('Agent memory:', memory);
```

## 📈 Performance

### Optimization Tips
- Use efficient detection algorithms
- Implement proper throttling for high-volume events
- Cache expensive computations
- Monitor agent call frequencies

### Profiling
```typescript
import { recordCall } from '../utils/metrics';

observe: (event) => {
  recordCall(this.id);
  // ... detection logic
}
```

## 🔍 Best Practices

1. **Keep agents focused** - Each agent should have a single, well-defined purpose
2. **Use proper typing** - Leverage TypeScript for type safety  
3. **Handle edge cases** - Validate inputs and handle errors gracefully
4. **Document behavior** - Write clear descriptions and comments
5. **Test thoroughly** - Use simulation scripts to validate behavior
6. **Follow conventions** - Use established patterns and naming schemes

---

Happy coding! 🚀
