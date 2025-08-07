<div align="center">

# Eremos

![Eremos](docs/banner2.png)

**🤖 Autonomous swarm agents for early on-chain signal detection**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/EremosCore/Eremos/workflows/CI/badge.svg)](https://github.com/EremosCore/Eremos/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=social)](https://x.com/EremosCore)

Eremos is a lightweight, modular framework for deploying autonomous agents that monitor blockchain activity across the Solana ecosystem. Track wallet clusters, mint patterns, contract anomalies, and emerging opportunities with precision-engineered signal detection.

**🎯 Built for developers who need signals before the noise begins.**

[🚀 Get Started](#-quick-start) · [📖 Documentation](#-documentation) · [🤖 Agents](#-agent-gallery) · [🔗 Website](https://www.eremos.io) · [📄 Whitepaper](docs/whitepaper.pdf)

</div>

---

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

**Meet Theron - Agent-000**  
*The first deployed agent in the swarm. Passive. Pattern-sensitive.  
Modular and extendable by design.*


**Agent-001 Coming Soon** [Teaser](https://x.com/EremosCore/status/1949154939923833239)

---

## ✨ Features

### 🏗️ **Core Architecture**
- **🔧 Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **📡 Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **🐝 Swarm Design** - Each agent operates independently with shared utilities  
- **🔌 Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **🎯 Minimal Output** - Log only what matters, when it matters

### 🔍 **Detection Capabilities**
- **🚀 Launch Wallet Detection** - Trace freshly funded wallets (CEX → DEX), track contract interactions, flag high-confidence deploys in real-time
- **👻 Ghost Watcher** - Monitor long-dormant wallets that suddenly reactivate (useful for old dev wallets, rug setups)
- **⚡ Pattern Recognition** - Detect bundled activities, coordinated movements, and anomalous behaviors
- **📊 Confidence Scoring** - Smart confidence ratings based on behavioral heuristics


---

## Example Signal

An example signal emitted by an agent detecting a live token deployment:

```ts
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

---

## Signal Confidence

Each emitted signal includes a `confidence` score (0–1) based on behavioral heuristics:
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

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** 8+
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment (optional - no required variables yet)
cp .env.example .env.local

# Build the project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### 🎯 Your First Agent

Create a simple monitoring agent:

```typescript
import { Agent } from "./types/agent";
import { generateSignalHash } from "./utils/signal";
import { logSignal } from "./utils/logger";

export const MyAgent: Agent = {
  id: "agent-001",
  name: "MyFirstAgent",
  role: "observer",
  watchType: "wallet_activity",
  glyph: "Ψ",
  triggerThreshold: 0.7,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "Monitors wallet activity for suspicious patterns",
  
  observe: (event) => {
    if (event?.type === "large_transfer") {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "MyFirstAgent",
        type: "suspicious_activity",
        glyph: "Ψ",
        hash,
        timestamp: new Date().toISOString(),
        confidence: 0.85
      });
    }
  }
};
```

### 🧪 Testing Your Agent

```bash
# Validate agent structure
npm run validate-agents

# Run agent simulation
npm run simulate-cluster

# Run specific tests
npm test -- --testNamePattern="MyAgent"
```

---

## 📁 Repository Structure

```
Eremos/
├── 🤖 agents/           # Agent implementations and templates
│   ├── theron.ts        # Agent-000: Memory vault and archival
│   ├── observer.ts      # Basic observation agent
│   ├── launchtracker.ts # Token launch detection
│   └── example.ts       # Agent development template
├── 🔧 utils/            # Shared utilities and helpers
│   ├── signal.ts        # Signal generation and hashing
│   ├── logger.ts        # Logging and output management
│   └── metrics.ts       # Performance and monitoring
├── 📝 types/            # TypeScript definitions
│   ├── agent.ts         # Agent interface specifications
│   ├── signal.ts        # Signal type definitions
│   └── event.ts         # Event structure definitions
├── 🧪 tests/            # Test suites and validation
├── ⚙️ scripts/          # Development and deployment tools
├── 📚 docs/             # Documentation and resources
│   ├── whitepaper.pdf   # Official Eremos whitepaper
│   ├── architecture.md  # System architecture guide
│   └── *.md            # Additional documentation
└── 📦 Package files     # npm configuration and dependencies
```

---

## 🤖 Agent Gallery

Meet the current swarm members:

| Agent | Role | Purpose | Status |
|-------|------|---------|--------|
| **Theron** | `memory_vault` | Primordial memory stack, archives anomalies | ✅ Active |
| **Observer** | `observer` | Basic event observation and logging | ✅ Active |
| **LaunchTracker** | `tracker` | Token launch detection and analysis | ✅ Active |
| **Harvester** | `harvester` | Data collection and aggregation | ✅ Active |
| **Skieró** | `analyzer` | Advanced pattern recognition | ✅ Active |
| **Agent-001** | `TBA` | Next generation agent | 🔄 Coming Soon |

## 📖 Documentation

- **[🚀 Getting Started](docs/contributing.md)** - Complete setup and development guide
- **[🏗️ Architecture](docs/architecture.md)** - System design and agent communication
- **[📡 Signals](docs/signals.md)** - Signal types and emission patterns  
- **[🧠 Memory](docs/memory.md)** - Agent memory management
- **[📊 Metrics](docs/metrics.md)** - Performance monitoring and analytics
- **[📄 Whitepaper](docs/whitepaper.pdf)** - Official Eremos documentation

## 🤝 Contributing

We welcome contributions from developers, researchers, and blockchain enthusiasts!

### 🎯 **Priority Areas**
- **🤖 New Agents**: Specialized monitoring for DeFi protocols
- **📡 Signal Processing**: Enhanced validation and processing logic
- **⚡ Performance**: Optimization and efficiency improvements
- **📚 Documentation**: Guides, examples, and tutorials

### 🚀 **Quick Contribution Guide**
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-agent`
3. Check out our [Contributing Guide](docs/contributing.md)
4. Make your changes and add tests
5. Submit a pull request

**Experienced in TypeScript and agent systems?** Start with `agents/example.ts` and build your own observer.

**Designer, artist, or have creative ideas?** We'd love to hear from you! DM us on Twitter [@EremosCore](https://x.com/EremosCore).

---

## License

MIT © Eremos

---

## 🔗 Links & Community

<div align="center">

[![Website](https://img.shields.io/badge/🌐_Website-eremos.io-blue)](https://www.eremos.io/)
[![Twitter](https://img.shields.io/badge/🐦_Twitter-@EremosCore-1DA1F2)](https://x.com/EremosCore)
[![Whitepaper](https://img.shields.io/badge/📄_Whitepaper-v1.0_PDF-red)](docs/whitepaper.pdf)
[![GitHub Discussions](https://img.shields.io/badge/💬_Discussions-GitHub-orange)](https://github.com/EremosCore/Eremos/discussions)

</div>

### 🌟 **Stay Connected**
- **🐦 [Twitter/X](https://x.com/EremosCore)** - Latest updates and announcements
- **🌐 [Website](https://www.eremos.io/)** - Official project homepage
- **📄 [Whitepaper](docs/whitepaper.pdf)** - Technical documentation and vision
- **💬 [GitHub Discussions](https://github.com/EremosCore/Eremos/discussions)** - Community chat and Q&A
- **📧 Email** - hello@eremos.io

### 📊 **Project Stats**

- **🤖 Agents**: 5 active, 1 in development
- **📡 Signal Types**: 6 core types, extensible
- **🔧 Language**: TypeScript with strict typing
- **⚡ Blockchain**: Solana ecosystem focus
- **📜 License**: MIT - fully open source

---

<div align="center">

**🚀 Built for the Solana ecosystem • 🤖 Powered by autonomous agents • 💛 Made with passion**

_Maintained by the Eremos Core team_

**[⭐ Star us on GitHub](https://github.com/EremosCore/Eremos) • [🔗 Visit our website](https://www.eremos.io/) • [🐦 Follow us on Twitter](https://x.com/EremosCore)**

</div>
