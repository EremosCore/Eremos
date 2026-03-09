<div align="center">

# Eremos

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=social)](https://twitter.com/EremosCore)

[Getting Started](#getting-started) • [Documentation](#documentation) • [Contributing](#contributing) • [Links](#links)

</div>

---

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies. Designed for developers who want early signals embedded into their workflows.

## Quick Overview

<div align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</div>

**Meet Theron - Agent-000 [Theron - X](https://x.com/TheronAgent)**  
*The first deployed agent in the swarm. Passive. Pattern-sensitive. Modular and extendable by design.*

**Agent-001 Coming Soon** • [Teaser #1](https://x.com/EremosCore/status/1949154939923833239) • [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

---

## Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters
- **Launch Wallet Detection** - Trace freshly funded wallets from CEXs, track contract interactions, and flag high-confidence deploys in real time
- **Ghost Watcher** - Monitor long-dormant wallets that suddenly reactivate. Perfect for tracing old dev wallets or rug setups
- **Confidence Scoring** - Behavioral heuristics provide 0-1 confidence scores for all signals
- *+ More agents in development*

---

## Example Signal

Here's what a live token deployment detection looks like:

```typescript
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[agent-observer] → contract probing detected within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → 5 bundle-linked wallets interacted within 8s of deploy
[agent-observer] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)

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

## Signal Confidence

Each emitted signal includes a `confidence` score (0-1) based on behavioral heuristics:

- **CEX-origin funding** (Kraken, Coinbase, etc.)
- **Timing patterns** (funding → deploy intervals)
- **Wallet linkage density** (bundled activity detection)
- **Token metadata validation**
- **Historical behavior analysis**

Confidence is computed via agent-side scoring and logged alongside each signal.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js, Tailwind CSS |
| **Backend** | Node.js (TypeScript-based agent runner) |
| **Language** | TypeScript (typed logic across agents, utils, and infra) |
| **Chain Layer** | RPC watchers, mempool filters, native triggers |
| **Blockchain** | Solana ecosystem |

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Basic knowledge of TypeScript

### Installation

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development mode
npm run dev
```

### Quick Test

Test an agent with the development script:

```bash
# Run example agent
npx ts-node scripts/dev-agent.ts

# Generate a test signal
npx ts-node scripts/generate-signal.ts
```

---

## Project Structure

```
Eremos/
├── agents/             # Agent templates & logic
│   ├── theron.ts       # Agent-000 (Memory Vault)
│   ├── observer.ts     # Surveillance Agent
│   ├── harvester.ts    # Indexing Agent
│   └── example.ts      # Template for custom agents
├── utils/              # Shared utilities
│   ├── signal.ts       # Signal generation & hashing
│   ├── logger.ts       # Logging utilities
│   └── throttle.ts     # Signal throttling
├── types/              # TypeScript definitions
├── scripts/            # Development & testing scripts
└── docs/               # Documentation & whitepaper
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | System design and agent communication |
| [Agent Guide](docs/agents.md) | Creating custom agents |
| [Signals](docs/signals.md) | Signal types and taxonomy |
| [Memory System](docs/memory.md) | Agent memory and state management |
| [Glyphs](docs/glyphs.md) | Agent identification symbols (Glyphs) |
| [Deployment](docs/deployment.md) | Production deployment guide |

---

## Available Agents

| Agent | Glyph | Role | Watch Type | Description |
|-------|-------|------|------------|-------------|
| **Theron** | Ϸ | Memory Vault | Anomaly Detection | The first observer. Archives anomalies, stores primordial memory |
| **Observer** | φ | Surveillance | Wallet Activity | Passive agent logging unusual wallet clustering |
| **Harvester** | λ | Indexing | Mint Activity | Indexes mint data for high-volume collections |
| **LaunchTracker** | Σ | Launch Monitor | Wallet Activity | Monitors CEX-funded wallets for high-confidence launches |
| **Skieró** | ψ | Ghost Watcher | Dormant Wallets | Tracks long-dormant wallets that suddenly reactivate |

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### For Developers

1. **Fork the repository**
2. **Check out** `/agents/example.ts` for agent structure
3. **Build your own observer** following the modular pattern
4. **Test using** `/scripts/dev-agent.ts`
5. **Submit a pull request**

### For Designers & Artists

Have ideas that fit the Eremos mythos? We'd love to hear from you!  
Send us a DM on Twitter [@EremosCore](https://x.com/EremosCore)

### Development Guidelines

- Keep agent logic scoped and clean
- Use `generateSignalHash()` for all signal outputs
- Log using the shared `logSignal()` utility
- Follow TypeScript best practices
- Test agents using provided scripts

---

## Development Scripts

| Script | Purpose |
|--------|---------|
| `scripts/dev-agent.ts` | Test individual agents |
| `scripts/generate-signal.ts` | Generate test signals |
| `scripts/stress-test.ts` | Performance testing |
| `scripts/validate-agent.ts` | Validate agent configuration |

---
## Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/Ibnu3456787/Eremos.git
   cd Eremos
   
## License

MIT © [Eremos LLC](LICENSE)

This project is released under the MIT License. Use it, fork it, fragment it, build your own swarm.

---

## Links

<div align="center">

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/EremosCore)
[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=safari&logoColor=white)](https://www.eremos.io/)
[![Whitepaper](https://img.shields.io/badge/Whitepaper-FF0000?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white)](docs/whitepaper.pdf)

**Maintained by the Eremos Core team 💛**

</div>

---

<div align="center">
  <sub>Eremos is a decentralized observer system built for Solana - designed to detect early signals from the edges of on-chain noise.</sub>
</div>
