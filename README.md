# # Eremos 🤖⚡

[![Solana](https://img.shields.io/badge/Built%20on-Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=for-the-badge)](https://github.com/EremosCore/Eremos/stargazers)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=for-the-badge&logo=twitter)](https://twitter.com/EremosCore)

![Eremos](docs/banner2.png)

> **Autonomous swarm agents for early on-chain signal detection**

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

---

## 📋 Table of Contents

- [🤖 Meet the Agents](#-meet-the-agents)
- [✨ Features](#-features)
- [📊 Example Signal](#-example-signal)
- [🎯 Signal Confidence](#-signal-confidence)
- [🛠 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Links](#-links)



## 🤖 Meet the Agents

### Agent Theron - Agent-000
![Theron Agent]
<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>


### Agent-001 
*Coming Soon* 🔮 [Teaser](https://x.com/EremosCore/status/1949154939923833239)

---

## ✨ Features

- 🧩 **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies
- 📡 **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- 🐝 **Swarm Design** - Each agent operates independently with shared utilities
- 🔧 **Extensible Core** - Plug in watchers, inference layers, or custom triggers
- 🎯 **Minimal Output** - Log only what matters
- 🚀 **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- 👻 **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.

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

- 🏦 **CEX-origin funding** (e.g. Kraken, Coinbase)
- ⏱️ **Time between funding → deploy**
- 🔗 **Wallet linkage density** (bundled activity)  
- 📝 **Token metadata validation**

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## 🛠 Tech Stack

| Component       | Technology                                               |
|-----------------|----------------------------------------------------------|
| **Frontend**    | Next.js, Tailwind CSS                                    |
| **Backend**     | Node.js (TypeScript-based agent runner)                  |
| **Language**    | TypeScript (typed logic across agents, utils, and infra) |
| **Chain Layer** | RPC watchers, mempool filters, native triggers           |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Solana RPC endpoint

### Installation

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
# Install dependencies
npm install

# Set up your environment
cp .env.example .env.local

# Start development server
npm run dev
```

---

## 📁 Project Structure

```
Eremos/
├── 🤖 agents/          # Agent templates + logic
├── 📚 docs/            # Swarm structure, architecture, & official whitepaper
├── 🎬 scripts/         # Bootstrap and dev scripts
├── 🧪 tests/           # Test files and test utilities
├── 📝 types/           # TypeScript interfaces + definitions
├── 🛠️ utils/           # Shared signal/logging utilities
├── 🚫 .gitignore       # Git ignore patterns
├── 📄 LICENSE          # MIT license file
├── 📖 README.md        # Project documentation (you are here)
├── 📦 package.json     # Dependencies and scripts
└── ⚙️ tsconfig.json    # TypeScript configuration
```

## 🤝 Contributing

We're open to contributors! 

**For Developers:**
- Experienced in TypeScript and like agent-based systems? 
- Check `example.ts` and build your own observer
- Submit PRs for new agent types or core improvements

**For Creators:**
- Designer, artist, or have ideas that fit the mythos?
- Send us a DM on [Twitter](https://twitter.com/EremosCore)

---

## 📄 License

MIT © Eremos LLC

---

## 🔗 Links

| Platform          | Link                                          |
|-------------------|-----------------------------------------------|
| 🌐 **Website**    | [Eremos.io](https://eremos.io)                |
| 🐦 **Twitter/X**  | [@EremosCore](https://twitter.com/EremosCore) |
| 📄 **Whitepaper** | [v1.0 PDF](https://eremos.io/whitepaper)      |

_Maintained by the Eremos Core team 💛._
