# Eremos

<div align="center">

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

We're open to contributors! Here's how to get started:

1. **Fork the repo** and create your feature branch  
2. **Test your changes** with `npm test` and `npm run validate`  
3. **Follow our coding standards** - run `npm run lint`  
4. **Submit a clean PR** with a clear description  

**For Agent Developers:** Check out `example.ts` and build your own observer.  
**For Designers/Artists:** Have ideas that fit the mythos? DM us on [Twitter](https://x.com/EremosCore).

See our [Contributing Guide](docs/contributing.md) for detailed guidelines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com/)
[![GitHub stars](https://img.shields.io/github/stars/krishvsoni/Eremos?style=social)](https://github.com/krishvsoni/Eremos/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=social)](https://twitter.com/EremosCore)

</div>

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.  
Designed for devs who want low-noise, early signals embedded into their workflows.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Example Signal](#-example-signal)
- [Signal Confidence](#-signal-confidence)
- [Architecture](#-architecture)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Links](#-links)

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

## 🚀 Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters  
- **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time  
- **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.

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

## 🏗️ Architecture

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (TypeScript-based agent runner)
- **Language:** TypeScript (typed logic across agents, utils, and infra)
- **Chain Layer:** RPC watchers, mempool filters, native triggers

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Solana RPC endpoint (or use default public endpoint)

### Installation

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

### Configuration

Set up your environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Run Development Mode

```bash
npm run dev
```

### Validate Your Setup

```bash
npm run validate
```

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development mode with hot reload |
| `npm run build` | Build the project for production |
| `npm test` | Run the test suite |
| `npm run lint` | Check code quality and style |
| `npm run validate` | Validate agent configurations |
| `npm run generate:agent` | Generate a new agent template |
| `npm run simulate` | Run cluster simulation |
| `npm run stress-test` | Performance testing |

---

## 📁 Project Structure

```
Eremos/
├── agents/           # Agent templates & logic
├── utils/            # Shared signal/logging utilities
├── types/            # TypeScript interfaces & definitions
├── scripts/          # Bootstrap and dev scripts
├── tests/            # Test suites for all components
├── docs/             # Architecture, guides & whitepaper
├── .github/          # GitHub templates & workflows
└── package.json      # Dependencies & scripts
```

**Key Directories:**  
- `/agents` - Core agent implementations and templates  
- `/utils` - Shared utilities for signals, logging, and monitoring  
- `/types` - TypeScript type definitions for the framework  
- `/scripts` - Development and operational scripts  
- `/docs` - Comprehensive documentation and architecture guides

**Pro Tips:**  
- Start with `agents/example.ts` to understand the agent pattern  
- Use `npm run generate:agent` to scaffold new agents quickly  
- Check `/docs/architecture.md` for system design insights

---

## 🤝 Contributing

We’re open to contributors.  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.  
If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)

---

## License

MIT © Eremos LLC

---

## 🔗 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
