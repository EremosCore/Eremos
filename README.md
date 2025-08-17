# Eremos

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


**Agent-001 Coming Soon** [Teaser #1](https://x.com/EremosCore/status/1949154939923833239), [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- TypeScript knowledge recommended

### Installation

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up your environment
cp .env.example .env.local

# Start development
npm run dev
```

### Available Scripts

```bash
npm run dev          # Run a development agent
npm run build        # Build the project
npm run test         # Run test suite
npm run lint         # Lint the codebase
npm run agent:list   # List all available agents
npm run simulate     # Run agent simulation
```

---

## ✨ Features

- **🤖 Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **📡 Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **🐝 Swarm Design** - Each agent operates independently with shared utilities  
- **🔧 Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **📊 Minimal Output** - Log only what matters
- **💰 Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **👻 Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.
- *+ More to come.*

---

## 📊 Example Signal

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

## 🎯 Signal Confidence

Each emitted signal includes a `confidence` score (0-1) based on behavioral heuristics:
- CEX-origin funding (e.g. Kraken, Coinbase)
- Time between funding → deploy
- Wallet linkage density (bundled activity)
- Token metadata validation

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## 🛠 Tech Stack

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
├── tests/           # Test suite
├── docs/            # Documentation & whitepaper
├── package.json     # Project configuration
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

### Key Folders

- **`/agents`** - Agent templates + logic  
- **`/utils`** - Shared signal/logging utilities  
- **`/types`** - TypeScript interfaces + definitions  
- **`/scripts`** - Bootstrap and dev scripts  
- **`/docs`** - Swarm structure, architecture, & our artwork/official whitepaper

---

## 🤝 Contributing

We're open to contributors!

- If you are experienced in TypeScript and like agent-based systems, check `agents/example.ts` and build your own observer
- If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter [@EremosCore](https://x.com/EremosCore)

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-agent`
3. Make your changes and test: `npm test`
4. Lint your code: `npm run lint`
5. Submit a pull request

---

## 📄 License

MIT © Eremos LLC

---

## 🔗 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

---

*Maintained by the Eremos Core team 💛*

> **Note**: Eremos is a decentralized observer system built for Solana - designed to detect early signals from the edges of on-chain noise. Use it, fork it, fragment it, build your own swarm.