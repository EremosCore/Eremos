# Eremos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/EremosCore/Eremos)
[![Solana](https://img.shields.io/badge/Solana-14FDFF?logo=solana&logoColor=white)](https://solana.com/)

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

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

## 🚀 Quick Start

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
npm run dev
```

---

## ✨ Features

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

Each emitted signal includes a `confidence` score (0–1) based on behavioral heuristics:
- CEX-origin funding (e.g. Kraken, Coinbase)
- Time between funding → deploy
- Wallet linkage density (bundled activity)
- Token metadata validation

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (TypeScript-based agent runner)
- **Language:** TypeScript (typed logic across agents, utils, and infra)
- **Chain Layer:** RPC watchers, mempool filters, native triggers

---

## 📁 Project Structure

```
Eremos/
├── agents/          # Agent templates + logic
├── utils/           # Shared signal/logging utilities
├── types/           # TypeScript interfaces + definitions
├── scripts/         # Bootstrap and dev scripts
├── docs/            # Swarm structure, architecture, & artwork
└── tests/           # Test suites for agents and utilities
```

---

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development mode
npm run build        # Build TypeScript
npm run test         # Run test suite
npm run lint         # Lint code
npm run clean        # Clean build artifacts
npm run setup        # Setup development environment
```

### Environment Setup

```bash
cp .env.example .env.local
npm run dev
```

---

## 🤝 Contributing

We're open to contributors! Check out our [Contributing Guide](docs/contributing.md) for details.

**For Developers:**
- If you're experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer
- Use `/scripts/dev-agent.ts` to test your agents
- Follow our [Agent Guide](docs/agents.md) for development patterns

**For Designers & Artists:**
- If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter

---

## 📄 License

MIT © Eremos

---

## 🔗 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

*Maintained by the Eremos Core team 💛.*

