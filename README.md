 🐝 Eremos

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)
![Stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=social)](https://twitter.com/EremosCore)

> A modular framework for deploying autonomous **swarm agents** that monitor on-chain activity across the Solana ecosystem.  
> Built as a **public good**, open-source and extendable.

## 📑 Table of Contents
1. [Quick Start](#⚡-quick-start)
2. [Features](#features)
3. [Architecture](#🧩Architecture)
4. [Example Signal](#Example-Signal)
5. [Signal Confidence](#Signal-Confidence)
6. [Tech Stack](#Tech-Stack)
7. [Key Folders](#Key-Folders)
8. [Contributing](#Contributing)
9. [License](#License)
10. [Links](#links)

---

## ⚡ Quick Start
Clone your fork
git clone https://github.com/YOUR-USERNAME/Eremos.git
cd Eremos

## Install dependencies
npm install

## Copy env file
cp .env.example .env.local

## Start dev mode
npm run dev


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
## 🧩 Architecture

**Eremos swarm agents follow a simple lifecycle:**
- **Observe** — watch Solana programs, wallets, and flows
- **Detect** — flag bundling behavior, deploys, funding anomalies
- **Signal** — emit structured alerts and insights
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

## Key Folders

- `/agents` - Agent templates + logic  
- `/utils` - Shared signal/logging utilities  
- `/types` - TypeScript interfaces + definitions  
- `/scripts` - Bootstrap and dev scripts  
- `/docs` - Swarm structure, architecture, & our artwork/official whitepaper

---

## Contributing

We welcome small, thoughtful contributions!
See CONTRIBUTING.md for full guidelines.

---

## License

MIT © Eremos LLC

---

## Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._

