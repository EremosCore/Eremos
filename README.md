# Eremos

<div align="center">
  
![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

[🌐 Website](https://www.eremos.io/) • [📚 Documentation](docs/) • [🐦 Twitter](https://x.com/EremosCore) • [📄 Whitepaper](docs/whitepaper.pdf)

</div>

---

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

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
=======

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

- **🤖 Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **📡 Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **🔗 Swarm Design** - Each agent operates independently with shared utilities  
- **🧩 Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **📊 Minimal Output** - Log only what matters
- **🚀 Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **👻 Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.

---

## 📡 Example Signal

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

## 📊 Signal Confidence System

Each emitted signal includes a `confidence` score (0–1) based on behavioral heuristics:

- ✅ **CEX-origin funding** (e.g. Kraken, Coinbase)
- ⏱️ **Time between funding → deploy**
- 🔗 **Wallet linkage density** (bundled activity)
- 📋 **Token metadata validation**
=======
Each emitted signal includes a `confidence` score (0-1) based on behavioral heuristics:
- CEX-origin funding (e.g. Kraken, Coinbase)
- Time between funding → deploy
- Wallet linkage density (bundled activity)
- Token metadata validation

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js + TypeScript | Core agent execution environment |
| **Frontend** | Next.js + Tailwind CSS | Web dashboard and visualization |
| **Blockchain** | Solana Web3.js | On-chain data access and monitoring |
| **Testing** | Jest + TypeScript | Comprehensive test coverage |
| **Utilities** | Custom TypeScript modules | Signal processing and utilities |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Start development
npm run dev

# Run tests
npm test

# Validate an agent
npm run validate-agent agents/example.ts
```

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **TypeScript** >= 4.5.0

---

## 🏗️ Project Structure

```
📁 Eremos/
├── 🤖 agents/           # Agent templates + logic
├── 🔧 utils/            # Shared signal/logging utilities
├── 📝 types/            # TypeScript interfaces + definitions
├── ⚡ scripts/          # Bootstrap and dev scripts
├── 📚 docs/             # Architecture, whitepaper & artwork
└── 🧪 tests/            # Test suites for all components
```

### Key Components

| Directory | Description | Key Files |
|-----------|-------------|-----------|
| `agents/` | Autonomous monitoring agents | `theron.ts`, `observer.ts`, `example.ts` |
| `utils/` | Core utilities and helpers | `signal.ts`, `metrics.ts`, `logger.ts` |
| `types/` | TypeScript type definitions | `agent.ts`, `signal.ts`, `event.ts` |
| `scripts/` | Development and utility scripts | `generate-agent.ts`, `validate-agent.ts` |
| `docs/` | Comprehensive documentation | `architecture.md`, `whitepaper.pdf` |

---

## 🛠️ Development

### Creating Your First Agent

```typescript
import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";

export const MyCustomAgent: Agent = {
  id: "agent-custom",
  name: "CustomAgent", 
  role: "detector",
  watchType: "custom_activity",
  glyph: "🔍",
  triggerThreshold: 5,
  
  observe: (event) => {
    // Your custom detection logic here
    if (event?.type === "custom_activity") {
      // Emit signal when conditions are met
    }
  }
};
```

### Available Scripts

```bash
npm run dev              # Start development mode
npm run test             # Run test suite
npm run validate-agent   # Validate agent configuration
npm run generate-agent   # Generate new agent template
npm run simulate-cluster # Simulate agent cluster behavior
npm run stress-test      # Performance testing
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're a developer, designer, or researcher, there are many ways to contribute.

### For Developers
- 🔍 **Agent Development**: Create new monitoring agents for specific use cases
- 🛠️ **Utility Functions**: Improve core utilities and signal processing
- 🧪 **Testing**: Add comprehensive tests for existing functionality
- 📚 **Documentation**: Enhance docs with examples and guides

### For Designers & Artists
- 🎨 **Visual Assets**: Create agent artwork, diagrams, or UI components
- 📊 **Data Visualization**: Design better ways to present signal data
- 🎭 **Brand Assets**: Contribute to the Eremos visual identity

### Getting Started with Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-agent`)
3. **Commit** your changes (`git commit -m 'Add amazing new agent'`)
4. **Push** to the branch (`git push origin feature/amazing-agent`)
5. **Open** a Pull Request

For detailed guidelines, see our [Contributing Guide](docs/contributing.md).

### Community
- 🐦 **Twitter**: [@EremosCore](https://x.com/EremosCore) - Follow for updates
- 💬 **Discussions**: Use GitHub Discussions for questions and ideas
- 🐛 **Issues**: Report bugs or request features via GitHub Issues

---

## 🛡️ Security & Privacy

Eremos is designed with security and privacy in mind:

- **No Private Keys**: Agents only observe public blockchain data
- **Local Processing**: All analysis happens locally or in your infrastructure
- **Open Source**: Full transparency in all agent logic and signal processing
- **Configurable**: Control what data is logged and where signals are sent

---

## 🗺️ Roadmap

- [ ] **Enhanced Agent Templates** - More specialized monitoring agents
- [ ] **Real-time Dashboard** - Web interface for signal visualization
- [ ] **Multi-chain Support** - Expand beyond Solana to other ecosystems
- [ ] **ML Integration** - Advanced pattern recognition capabilities
- [ ] **API Endpoints** - RESTful API for external integrations
- [ ] **Docker Support** - Containerized deployment options

---

## 📈 Performance

Eremos is optimized for efficiency and scalability:

- **Low Memory Footprint**: < 50MB per agent instance
- **Fast Signal Processing**: < 100ms average signal generation
- **Configurable Throttling**: Prevent signal spam with built-in rate limiting
- **Horizontal Scaling**: Deploy multiple agent instances across infrastructure

---

## 📚 Documentation

Explore our comprehensive documentation:

- 📖 **[Architecture Guide](docs/architecture.md)** - System design and components
- 🤖 **[Agent Development](docs/agents.md)** - Creating custom monitoring agents  
- 📡 **[Signal System](docs/signals.md)** - Understanding signal types and processing
- ⚡ **[Event Handling](docs/events.md)** - Event processing and filtering
- 🎯 **[Metrics & Monitoring](docs/metrics.md)** - Performance tracking and analysis
- 🚀 **[Deployment Guide](docs/deployment.md)** - Production deployment strategies

---

## 📄 License

MIT © Eremos LLC

---

## 🔗 Links

- **🌐 Website:** [Eremos.io](https://www.eremos.io/)
- **🐦 Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **📄 Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

---

<div align="center">

_Maintained by the Eremos Core team 💛🗿_

**Star ⭐ this repo if you find it useful!**

</div>
