<div align="center">

# Eremos

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?style=flat-square)](https://github.com/EremosCore/Eremos/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

[![GitHub stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=flat-square&logo=github)](https://github.com/EremosCore/Eremos/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/EremosCore/Eremos?style=flat-square&logo=github)](https://github.com/EremosCore/Eremos/network)
[![GitHub issues](https://img.shields.io/github/issues/EremosCore/Eremos?style=flat-square&logo=github)](https://github.com/EremosCore/Eremos/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=flat-square&logo=twitter)](https://twitter.com/EremosCore)

*A lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies. Designed for developers who want low-noise, early signals embedded into their workflows.*

</div>

---

## 📋 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [✨ Features](#-features)
- [🔍 How It Works](#-how-it-works)
- [📊 Example Signal](#-example-signal)
- [🎯 Signal Confidence](#-signal-confidence)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Links](#-links)

## 🚀 Quick Start

Get up and running with Eremos in minutes:

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up your environment
cp .env.example .env.local

# Start development mode
npm run dev
```

> **💡 New to Eremos?** Check out our [Agent Development Guide](docs/agents.md) to learn how to create your first agent.

---

## ✨ Features

### 🤖 Agent System
- **Modular Architecture** - Scoped logic for detecting wallet activity, contract spawns, and anomalies
- **Swarm Design** - Each agent operates independently with shared utilities
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers

### 🎯 Detection Capabilities
- **Launch Wallet Detection** - Trace freshly funded wallets from CEXs and track contract interactions
- **Ghost Watcher** - Monitor long-dormant wallets that suddenly become active
- **Pattern Recognition** - Identify wallet clusters, mint patterns, and behavioral anomalies

### 📡 Signal Processing
- **Structured Signals** - Clean, actionable data for logging, alerting, or downstream use
- **Confidence Scoring** - AI-powered confidence metrics for signal reliability
- **Minimal Noise** - Log only what matters with intelligent filtering

### 🔧 Developer Experience
- **TypeScript First** - Full type safety across agents, utilities, and infrastructure
- **Hot Reloading** - Rapid development with instant feedback
- **Comprehensive Testing** - Built-in testing utilities for agent validation

---

## 🔍 How It Works

<div align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Meet Theron - Agent 000</em>
</div>

**Theron** is the first deployed agent in the swarm - passive, pattern-sensitive, and modular by design. Each agent in the Eremos ecosystem operates independently while sharing core utilities for maximum efficiency.

> **🔥 Coming Soon:** Agent-001 is in development! Follow our progress: [Teaser #1](https://x.com/EremosCore/status/1949154939923833239) | [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

---

## 📊 Example Signal

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

## 🎯 Signal Confidence

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
| **Core Runtime** | Node.js + TypeScript | Agent execution and orchestration |
| **Frontend** | Next.js + Tailwind CSS | Dashboard and monitoring interface |
| **Chain Integration** | RPC watchers, mempool filters | Real-time blockchain monitoring |
| **Signal Processing** | Custom TypeScript framework | Structured data emission and filtering |
| **Testing** | Jest + Custom utilities | Agent validation and behavior testing |

---

## 📁 Project Structure

```
eremos/
├── 📁 agents/          # Agent implementations and templates
│   ├── example.ts      # Sample agent for learning
│   ├── theron.ts       # Agent-000: Pattern detection
│   └── observer.ts     # Launch detection specialist
├── 📁 utils/           # Shared utilities and frameworks
│   ├── signal.ts       # Signal emission and processing
│   ├── logger.ts       # Structured logging system
│   └── metrics.ts      # Performance and health metrics
├── 📁 types/           # TypeScript definitions
│   ├── agent.ts        # Agent interfaces and contracts
│   ├── signal.ts       # Signal type definitions
│   └── event.ts        # Event system types
├── 📁 scripts/         # Development and deployment tools
│   ├── generate-agent.ts    # Agent scaffolding utility
│   └── validate-agent.ts    # Agent compliance checker
├── 📁 tests/           # Comprehensive test suite
└── 📁 docs/            # Documentation and resources
    ├── agents.md       # Agent development guide
    ├── architecture.md # System architecture overview
    └── whitepaper.pdf  # Official project whitepaper
```

> **📖 Documentation:** Explore our comprehensive guides in the [`/docs`](docs/) directory

---

## 🤝 Contributing

We welcome contributions from developers, designers, and blockchain enthusiasts! Here's how you can get involved:

### 🧑‍💻 For Developers
- **Start with [`example.ts`](agents/example.ts)** - Learn the agent pattern
- **Read our [Contributing Guide](docs/contributing.md)** - Development workflow and standards
- **Check [open issues](https://github.com/EremosCore/Eremos/issues)** - Find tasks that match your skills

### 🎨 For Designers & Artists
- **Visual Identity** - Help evolve the Eremos aesthetic
- **Documentation Design** - Improve our guides and diagrams
- **Agent Personas** - Design characters for new agents

### 💡 For Everyone
- **Feature Ideas** - Share your vision for new agent capabilities
- **Bug Reports** - Help us improve reliability and performance
- **Community Building** - Spread the word about Eremos

> **Get Started:** Fork the repo, make your changes, and submit a PR. We review all contributions promptly!

---

## 📄 License

MIT © [Eremos LLC](https://www.eremos.io/)

---

## 🔗 Links

<div align="center">

[![Website](https://img.shields.io/badge/Website-eremos.io-blue?style=flat-square&logo=globe)](https://www.eremos.io/)
[![Twitter](https://img.shields.io/badge/Twitter-@EremosCore-1DA1F2?style=flat-square&logo=twitter)](https://x.com/EremosCore)
[![Whitepaper](https://img.shields.io/badge/Whitepaper-v1.0-red?style=flat-square&logo=adobe-acrobat-reader)](docs/whitepaper.pdf)
[![Documentation](https://img.shields.io/badge/Docs-Architecture-green?style=flat-square&logo=gitbook)](docs/)

</div>

---

<div align="center">
  <sub>Built with ❤️ by the <a href="https://www.eremos.io/">Eremos Core</a> team</sub>
</div>