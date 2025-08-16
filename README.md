# Eremos

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**


Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

## Table of Contents

- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Developer Guide](#developer-guide)
- [Architecture](#architecture)
- [Signal System](#signal-system)
- [Contributing](#contributing)
- [License](#license)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Solana RPC endpoint (optional: own RPC for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/AJibolaOnaneye/Eremos.git
cd Eremos

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development mode
npm run dev
```

### Running Your First Agent

```bash
# Run the example agent
npx ts-node agents/example.ts

# Or run Theron (Agent-000)
npx ts-node agents/theron.ts

# Validate agent configuration
npm run validate-agent theron
```

## Usage Examples

### CLI Usage

```bash
# Generate a new agent template
npm run generate-agent MyCustomAgent

# Export agent memory for analysis
npm run export-agent-memory theron --format json

# Simulate agent cluster
npm run simulate-cluster --agents 3 --duration 60s

# Stress test signal processing
npm run stress-test --signals 1000
```

### Integration Example

```typescript
import { Agent, SignalEmitter } from './types/agent';
import { createAgent } from './utils/lifecycle';

// Create a custom agent
const myAgent = createAgent({
  name: 'LaunchTracker',
  description: 'Tracks new token launches',
  handlers: {
    onWalletFunding: (event) => {
      // Custom logic here
      if (event.source === 'CEX') {
        return { confidence: 0.8, emit: true };
      }
    }
  }
});

// Start monitoring
myAgent.start();
```

### Webhook Integration

```typescript
// Pipe signals to external services
import { SignalProcessor } from './utils/signal';

const processor = new SignalProcessor({
  webhook: 'https://your-service.com/webhook',
  filters: ['launch_detected', 'anomaly_flagged'],
  threshold: 0.7
});

processor.start();
```

## Developer Guide

### Project Structure

```
Eremos/
├── agents/           # Agent implementations
│   ├── example.ts    # Template agent
│   ├── theron.ts     # Agent-000 (pattern detection)
│   ├── observer.ts   # Wallet activity monitor
│   └── harvester.ts  # Data collection agent
├── types/            # TypeScript definitions
│   ├── agent.ts      # Core agent interfaces
│   ├── signal.ts     # Signal type definitions
│   └── config.ts     # Configuration schemas
├── utils/            # Shared utilities
│   ├── signal.ts     # Signal processing
│   ├── metrics.ts    # Performance monitoring
│   ├── logger.ts     # Structured logging
│   └── eventParser.ts # Blockchain event parsing
├── scripts/          # Development tools
└── tests/            # Test suites
```

### Creating a New Agent

1. **Generate template:**
   ```bash
   npm run generate-agent YourAgentName
   ```

2. **Implement core methods:**
   ```typescript
   export class YourAgent implements Agent {
     async initialize(): Promise<void> {
       // Setup logic
     }
     
     async processEvent(event: BlockchainEvent): Promise<Signal | null> {
       // Event processing logic
       return this.shouldEmitSignal(event) ? this.createSignal(event) : null;
     }
   }
   ```

3. **Add configuration:**
   ```typescript
   // In types/config.ts
   export interface YourAgentConfig {
     watchAddresses: string[];
     confidenceThreshold: number;
     enableWebhooks: boolean;
   }
   ```

4. **Test your agent:**
   ```bash
   npm test -- --testNamePattern=YourAgent
   ```

### Dependencies & Tooling

- **Runtime:** Node.js with TypeScript
- **Blockchain:** Solana Web3.js
- **Testing:** Jest with TypeScript support
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode

### Development Commands

```bash
npm run dev            # Start development mode
npm run build          # Build for production
npm run test           # Run test suite
npm run lint           # Check code style
npm run lint:fix       # Fix linting issues
npm run type-check     # TypeScript validation
```

## Architecture

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

**Meet Theron - Agent-000**  
*The first deployed agent in the swarm. Passive. Pattern-sensitive.  
Modular and extendable by design.*


**Agent-001 Coming Soon** [Teaser #1](https://x.com/EremosCore/status/1949154939923833239), [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

---

## Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters
- **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.
- *+ More to come.*

**Core Principles:**
- **Modularity:** Each agent operates independently
- **Extensibility:** Easy to add new detection logic
- **Performance:** Minimal resource footprint
- **Reliability:** Fault-tolerant signal processing
- **Transparency:** Open-source with clear documentation

### Agent Lifecycle

1. **Initialization** → Load configuration and connect to data sources
2. **Monitoring** → Continuously process blockchain events
3. **Analysis** → Apply detection algorithms and heuristics
4. **Signal Emission** → Output structured signals when patterns match
5. **Cleanup** → Graceful shutdown and resource cleanup

## Signal System

### Example Signal Output

```typescript
// Real-time detection log

---

## Example Signal

An example signal emitted by an agent detecting a live token deployment:

```ts
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[agent-observer] → contract probing detected within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → 5 bundle-linked wallets interacted within 8s of deploy
[agent-observer] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)

// Structured signal object
{
  agent: "Observer",
  type: "launch_detected",
  glyph: "Δ",
  hash: "sig_c7f9a3d2bc",
  timestamp: "2025-06-12T04:41:25Z",
  source: "agent-observer",
  confidence: 0.91
}
```

---

## Signal Confidence

Each emitted signal includes a `confidence` score (0-1) based on behavioral heuristics:
- CEX-origin funding (e.g. Kraken, Coinbase)
- Time between funding → deploy
- Wallet linkage density (bundled activity)
- Token metadata validation

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (TypeScript-based agent runner)
- **Language:** TypeScript (typed logic across agents, utils, and infra)
- **Chain Layer:** RPC watchers, mempool filters, native triggers

---

## Getting Started

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

Set up your environment:

```bash
cp .env.example .env.local
npm run dev
```

---

## Key Folders

- `/agents` - Agent templates + logic  
- `/utils` - Shared signal/logging utilities  
- `/types` - TypeScript interfaces + definitions  
- `/scripts` - Bootstrap and dev scripts  
- `/docs` - Swarm structure, architecture, & our artwork/official whitepaper

---

## Contributing

We’re open to contributors. Please see our [Contributing Guide](CONTRIBUTING.md) for details. .  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.
If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)


### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests
4. Run linting: `npm run lint:fix`
5. Run tests: `npm test`
6. Commit with clear messages
7. Push and open a Pull Request

### Code Style

- Use TypeScript with strict type checking
- Follow Prettier formatting (configured in `.prettierrc`)
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

---

## License

MIT © Eremos LLC

---

## Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
