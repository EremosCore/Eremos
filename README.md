# Eremos

[![NPM Version](https://img.shields.io/npm/v/eremos?color=blue)](https://www.npmjs.com/package/eremos)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/stargazers)
[![Build Status](https://img.shields.io/github/actions/workflow/status/EremosCore/Eremos/ci.yml?branch=main)](https://github.com/EremosCore/Eremos/actions)
[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](#project-status)

---

## Table of Contents

- [What is Eremos?](#what-is-eremos)
- [Project Status](#project-status)
- [Quickstart for Contributors](#quickstart-for-contributors)
- [Why Eremos?](#why-eremos)
- [Use Cases](#use-cases)
- [Screenshots & Visuals](#screenshots--visuals)
- [Features](#features)
- [Example Signal](#example-signal)
- [Signal Confidence](#signal-confidence)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Key Folders](#key-folders)
- [How to Contribute](#how-to-contribute)
- [Contributing](#contributing)
- [Community & Support](#community--support)
- [FAQ](#faq)
- [License](#license)
- [Links](#links)

---

## What is Eremos?

**Eremos is a modular framework for deploying autonomous “swarm agents” that monitor on-chain activity across the Solana ecosystem.**  
These agents run independently, observe funding flows, bundling behavior, deploy patterns, and more—surfacing early signals before they’re obvious.

Built as a public good, Eremos aims to enhance transparency and insight across Solana.  
It’s fully open-source, easily extendable, and designed to plug into dev or analyst workflows.

> **Learn more:** [GitHub](https://github.com/EremosCore/Eremos) · [Twitter/X](https://x.com/EremosCore) · [Website](https://www.eremos.io/)

---

## Project Status

[![Project Status](https://img.shields.io/badge/status-active-brightgreen.svg)](#project-status)

Eremos is **actively maintained** and open to contributors.  
We welcome PRs, suggestions, and new agent ideas!

---

## Quickstart for Contributors

Want to contribute? Here’s how to get started in **less than 2 minutes**:

- [x] **Star** ⭐ and **Watch** 👀 the repo
- [x] **Fork** this repository
- [x] **Clone** your fork locally
- [x] **Create a new branch** for your changes
- [x] **Make improvements** (README, docs, code, etc.)
- [x] **Commit & push** your branch
- [x] **Open a Pull Request** with a clear description
- [x] **Paste your PR link** as your Superteam Earn submission

---

## Why Eremos?

- **Early Signal Detection:** Get actionable insights before they’re obvious to the broader ecosystem.
- **Transparency:** Open-source and public-good ethos for the Solana community.
- **Modularity:** Easily extend or create new agents for custom monitoring needs.
- **Plug & Play:** Integrates into developer and analyst workflows with minimal setup.

---

## Use Cases

- **Token Launch Monitoring:** Detect new token launches and associated wallet activity in real time.
- **CEX Funding Tracing:** Track wallets funded from centralized exchanges and their subsequent on-chain actions.
- **Dormant Wallet Alerts:** Get notified when long-inactive wallets become active again.
- **Contract Anomaly Detection:** Surface unusual contract deployments or interactions.
- **Bundle Activity Tracking:** Identify clusters of wallets acting in coordination.

---

## Screenshots & Visuals

![Eremos Banner](docs/banner2.png)

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

---

## Features

- **Modular Agents** – Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** – Structured signals for logging, alerting, or downstream use  
- **Swarm Design** – Each agent operates independently with shared utilities  
- **Extensible Core** – Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** – Log only what matters  
- **Launch Wallet Detection** – Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time  
- **Ghost Watcher** – Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.

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

## Getting Started

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

Set up your environment:

```bash
cp .env.example .env.local
npm run dev
```

---

## Key Folders

- `/agents` – Agent templates + logic  
- `/utils` – Shared signal/logging utilities  
- `/types` – TypeScript interfaces + definitions  
- `/scripts` – Bootstrap and dev scripts  
- `/docs` – Swarm structure, architecture, & our artwork/official whitepaper

---

## How to Contribute

See the [Quickstart for Contributors](#quickstart-for-contributors) above, or:

1. **Star** ⭐ and **Watch** 👀 the [GitHub repo](https://github.com/EremosCore/Eremos).
2. **Fork** the repository.
3. **Create a new branch** for your improvement.
4. **Make your changes** (README, docs, code, etc.).
5. **Commit and push** your branch.
6. **Open a Pull Request** with a clear description.
7. **Paste your PR link** as your Superteam Earn submission.

---

## Contributing

We’re open to contributors.  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.  
If you're a designer, artist, or just have ideas that fit the mythos—send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)

---

## Community & Support

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **GitHub Discussions:** [EremosCore/Eremos Discussions](https://github.com/EremosCore/Eremos/discussions)
- **Website:** [eremos.io](https://www.eremos.io/)

Feel free to open an [issue](https://github.com/EremosCore/Eremos/issues) for bugs or feature requests.

---

## FAQ

**Q: Can I build my own agent?**  
A: Yes! See `/agents` and `example.ts` for templates.

**Q: Is this production-ready?**  
A: The core is stable, but agents are evolving. Use at your own risk.

**Q: How do I get support?**  
A: Open an issue or DM us on Twitter.

---

## License

MIT © Eremos LLC

---

## Links

- **GitHub:** [EremosCore/Eremos](https://github.com/EremosCore/Eremos)
- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
