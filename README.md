# Eremos

![Eremos](docs/assets/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](CONTRIBUTING.md)
[![Last Commit](https://img.shields.io/github/last-commit/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/commits/main)
[![Stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/stargazers)

---

## 🚀 Overview

Eremos is a modular, open-source framework for deploying **autonomous swarm agents** that monitor on-chain activity across the Solana ecosystem.

Agents run independently and specialize in detecting:
- **Funding flows** (e.g., CEX → fresh wallets)
- **Contract deployments**
- **Wallet clusters & bundling behavior**
- **Dormant → active wallet signals**

The framework is **lightweight, extensible, and designed for early signals** — giving devs and analysts an edge before patterns become obvious.

---

## 📂 Repo Structure

```
src/                     # Main codebase
 ├─ agents/              # Agent templates + logic
 ├─ utils/               # Shared utilities
 ├─ types/               # TypeScript definitions
 ├─ scripts/             # CLI scripts split by category
 │   ├─ dev/             # Dev helpers (dev-agent.ts, agent-list.ts)
 │   ├─ test/            # Test helpers (stress-test.ts, signal-thresholds.ts)
 │   └─ generate/        # Codegen tools (generate-agent.ts, generate-signal.ts)
 └─ index.ts             # (optional) project entry point

tests/                   # Unit + integration tests
 └─ *.test.ts            # All test files follow consistent naming

docs/                    # Documentation only
 ├─ architecture.md
 ├─ deployment.md
 ├─ contributing.md
 ├─ env.md               # Environment variables guide
 └─ assets/              # Images + whitepaper
     ├─ banner2.png
     ├─ theronphd2.png
     ├─ glyphs.png
     └─ whitepaper.pdf

.env.example             # Example environment config
LICENSE
README.md
CONTRIBUTING.md
```

---

## ⚡ Quickstart

Clone and install dependencies:

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

Copy environment file:

```bash
cp .env.example .env.local
```

Run an example agent:

```bash
npm run dev Theron
```

Run tests:

```bash
npm test
```

---

## 🔍 Example Signal

When an agent detects a suspicious deployment:

```ts
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8)
[agent-observer] → contract probing within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → launch confidence spike (0.91) - emitting signal

{
  agent: "Observer",
  type: "launch_detected",
  glyph: "Δ",
  hash: "sig_c7f9a3d2bc",
  confidence: 0.91,
  timestamp: "2025-06-12T04:41:25Z"
}
```

---

## 🧠 Key Features

- **Modular Agents** – Scoped logic for wallets, deploys, anomalies
- **Signal Emission** – Structured JSON signals for downstream use
- **Swarm Design** – Agents run independently with shared core utils
- **Extensible Core** – Plug in custom triggers or inference layers
- **Minimal Noise** – Logs only meaningful signals

---

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Chain Layer:** RPC watchers, mempool filters, native triggers
- **Tooling:** Jest for testing, Prettier + ESLint (recommended)

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-improvement`)
3. Make changes & add tests if needed
4. Commit (`git commit -m "docs: improve README"`)
5. Push & open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📜 License

MIT © [Eremos LLC](LICENSE)

---

## 🌐 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/assets/whitepaper.pdf)

---

💛 Maintained by the **Eremos Core team**
