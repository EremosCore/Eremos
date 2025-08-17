# Eremos

<div align="center">

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![MIT License](https://im---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [🏗️ Architecture](docs/architecture.md) | System design and agent patterns |
| [🤖 Agent Guide](docs/agents.md) | Creating and managing agents |
| [🔧 Development](docs/development.md) | Development setup and workflows |
| [🎯 Events](docs/events.md) | Event types and processing |
| [🔤 Glyphs](docs/glyphs.md) | Agent symbols and meanings |
| [💾 Memory](docs/memory.md) | Agent memory system |
| [📊 Metrics](docs/metrics.md) | Performance tracking |
| [🚀 Runtime](docs/runtime.md) | Runtime coordination |
| [📡 Signals](docs/signals.md) | Signal types and taxonomy |
| [⏱️ Throttling](docs/throttle.md) | Rate limiting and cooldowns |
| [🚀 Deployment](docs/deployment.md) | Production deployment |

---

## 🤝 Contributing

We're open to contributors! Whether you're experienced in TypeScript, passionate about agent-based systems, or have ideas that fit the mythos - we'd love to have you contribute.

**Quick contribution ideas:**
- 🐛 Fix bugs or improve existing agents
- 🤖 Create new agents for different detection patterns  
- 📚 Improve documentation and examples
- 🔧 Add development tooling and utilities
- 🎨 Enhance visual design and repo structure

**Get started:**
1. ⭐ Star and 👀 Watch this repository
2. 🍴 Fork the repo and create your feature branch
3. 📖 Read our [Contributing Guide](docs/contributing.md)
4. 🚀 Submit a pull request with your improvements

**Need ideas?** Check out our [issues](https://github.com/EremosCore/Eremos/issues) or suggest new features!

For design, artwork, or mythos contributions: [@EremosCore](https://x.com/EremosCore)

---.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com/)

[🌐 Website](https://www.eremos.io/) • [📖 Whitepaper](docs/whitepaper.pdf) • [🐦 Twitter](https://x.com/EremosCore) • [📚 Docs](docs/)

</div>

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

## 📋 Table of Contents

- [Features](#-features)
- [Example Signal](#-example-signal)
- [Signal Confidence](#-signal-confidence)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Links](#-links)

---

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

## 🚀 Quick Start

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

### Development Setup

1. **Copy the environment template:**
```bash
cp .env.example .env.local
```

2. **Run development mode:**
```bash
npm run dev
```

3. **Test an agent:**
```bash
npm run test:agent example
```

4. **Validate agent config:**
```bash
npm run validate agents/example.ts
```

---

## 📁 Project Structure

```
Eremos/
├── agents/          # Agent implementations
├── types/           # TypeScript definitions  
├── utils/           # Shared utilities
├── scripts/         # Development & testing tools
├── tests/           # Unit tests
└── docs/            # Documentation & assets
```

---

## Contributing

We’re open to contributors.  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.
If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)

---

## License

MIT © Eremos LLC

---

## Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
