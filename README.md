# Eremos

![Eremos](docs/banner2.png)

> **Autonomous swarm agents for early on-chain signal detection**

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

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Contributors](https://img.shields.io/github/contributors/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/stargazers)
[![Forks](https://img.shields.io/github/forks/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/network/members)

---

## Table of Contents

- [Features](#features)
- [Example Signal](#example-signal)
- [Signal Confidence](#signal-confidence)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Key Folders](#key-folders)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

---

## Features

- **Modular Agent Swarm** - Independent agents with scoped logic for detecting wallet activity, contract spawns, and anomalies
- **Signal Emission** - Structured, deterministic signals for logging, alerting, or downstream integration
- **Launch Detection** - Trace freshly funded wallets from CEXs, track contract interactions, and flag high-confidence deploys in real-time
- **Ghost Watcher** - Monitor long-dormant wallets that suddenly become active (useful for tracing old dev wallets or rug setups)
- **Minimal Output** - Log only what matters with confidence scoring
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers
- **High Precision** - Confidence scoring (0-1) based on behavioral heuristics

---

## Example Signal

An example signal emitted by an agent detecting a live token deployment:

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

---

## Signal Confidence

Each emitted signal includes a `confidence` score (0–1) based on behavioral heuristics:

- **CEX-origin funding** (e.g., Kraken, Coinbase) - Higher confidence
- **Time between funding → deploy** - Shorter intervals = higher confidence
- **Wallet linkage density** (bundled activity) - More linked wallets = higher confidence
- **Token metadata validation** - Valid metadata increases confidence

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
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install

cp .env.example .env.local
```

### Development

```bash
# Start development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Agent Development

```bash
# Test a specific agent
npm run dev:agent -- --agent=observer

# Generate a new agent
npm run generate:agent -- --name=my-agent

# Validate agent configuration
npm run validate:agent -- --agent=theron
```

---

## Key Folders

```
Eremos/
├── 📁 agents/          # Agent implementations
│   ├── theron.ts       # Memory vault agent
│   ├── observer.ts     # Surveillance agent
│   ├── harvester.ts    # Indexing agent
│   └── example.ts      # Agent template
├── 📁 types/           # TypeScript definitions
│   ├── agent.ts        # Agent interface
│   ├── signal.ts       # Signal types
│   └── event.ts        # Event types
├── 📁 utils/           # Shared utilities
│   ├── signal.ts       # Signal generation
│   ├── metrics.ts      # Performance tracking
│   └── logger.ts       # Logging utilities
├── 📁 scripts/         # Development tools
│   ├── dev-agent.ts    # Agent testing
│   └── generate-agent.ts # Agent scaffolding
├── 📁 docs/            # Documentation
│   ├── architecture.md # System architecture
│   ├── agents.md       # Agent guide
│   └── contributing.md # Contribution guidelines
└── 📁 tests/           # Test suites
    └── *.test.ts       # Unit tests
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🎯 Areas of Focus

- **Agent Development** - Create new agents for specific detection patterns
- **Signal Logic** - Improve detection algorithms and confidence scoring
- **Documentation** - Enhance guides, examples, and architecture docs
- **Tooling** - Add development utilities and testing frameworks
- **Performance** - Optimize agent performance and memory usage

### 📋 Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### 🧪 Development Workflow

```bash
# Test your agent
npm run dev:agent -- --agent=your-agent-name

# Run the full test suite
npm test

# Validate your changes
npm run validate
```

### 📝 Code Standards

- Use TypeScript for all new code
- Follow the existing agent patterns in `/agents/example.ts`
- Add comprehensive tests for new functionality
- Update documentation for any API changes
- Keep commits atomic and well-described

---

## 📚 Documentation

- **[Architecture Guide](docs/architecture.md)** - System design and agent communication
- **[Agent Development](docs/agents.md)** - How to create and deploy agents
- **[Signal Reference](docs/signals.md)** - Signal types and confidence scoring
- **[Contributing Guide](docs/contributing.md)** - Development workflow and standards
- **[Deployment Guide](docs/deployment.md)** - Production deployment instructions

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **🌐 Website:** [Eremos.io](https://www.eremos.io/)
- **🐦 Twitter:** [@EremosCore](https://x.com/EremosCore)
- **📄 Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)
- **📧 Contact:** [@EremosCore](https://x.com/EremosCore)

---

<div align="center">

**Built with ❤️ by the Eremos Core team**

_Enhancing transparency and insight across Solana_

</div>
