# Eremos

![Eremos](docs/banner2.png)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)

</div>

<p align="center">
  <strong>🤖 Autonomous swarm agents for early on-chain signal detection</strong>
</p>

<p align="center">
  Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity—tracking wallet clusters, mint patterns, and contract anomalies. Designed for developers who want low-noise, early signals embedded into their workflows.
</p>

---

## 📑 Table of Contents

- [Features](#features)
- [Meet Theron (Agent-000)](#meet-theron-agent-000)
- [Quick Start](#quick-start)
- [Installation & Configuration](#installation--configuration)
- [Project Structure](#project-structure)
- [Signal Detection](#signal-detection)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Performance & Monitoring](#performance--monitoring)
- [Roadmap](#roadmap)
- [Links](#links)
- [License](#license)

---

## ✨ Features

### Core Capabilities
- 🤖 **Modular Agents:** Scoped logic for detecting wallet activity, contract spawns, and anomalies
- 📡 **Signal Emission:** Structured signals for logging, alerting, or downstream use  
- 🐝 **Swarm Design:** Each agent operates independently with shared utilities
- 🔧 **Extensible Core:** Plug in watchers, inference layers, or custom triggers
- 🎯 **Minimal Output:** Log only what matters

### Detection Modules
- 🚀 **Launch Wallet Detection:** Trace freshly funded wallets (e.g. from CEXs), track contract interactions, and flag high-confidence deploys in real time
- 👻 **Ghost Watcher:** Monitors long-dormant wallets that suddenly become active again
- 🌾 **Harvester Agent:** Advanced pattern recognition for complex trading behaviors
- 📊 **Observer Agent:** Real-time monitoring and signal correlation
- ⚡ **Skieró Agent:** Lightning-fast event detection and processing

---

## 🤖 Meet Theron (Agent-000)

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

Theron is the first deployed agent in the swarm. Passive, pattern-sensitive, modular, and extendable by design. Specializes in detecting early-stage token launches and suspicious wallet patterns across Solana.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Haleem001/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Solana RPC credentials

# Start development
npm run dev
```

Visit `http://localhost:3000` to access the dashboard.

---

## 📦 Installation & Configuration

### Prerequisites

- Node.js (v18+)
- npm (v8+)
- Git
- Solana RPC endpoint

### Environment Variables

| Variable                | Description                  | Required | Default   |
|-------------------------|-----------------------------|----------|-----------|
| `SOLANA_RPC_URL`        | Solana RPC endpoint         | ✅       | -         |
| `SOLANA_WEBSOCKET_URL`  | WebSocket endpoint          | ✅       | -         |
| `LOG_LEVEL`             | Logging verbosity           | ❌       | `info`    |
| `AGENT_POLL_INTERVAL`   | Agent polling interval (ms) | ❌       | `5000`    |
| `CONFIDENCE_THRESHOLD`  | Minimum confidence for signals | ❌    | `0.7`     |

Edit `.env.local` with your preferred settings.

---

## 📁 Project Structure

```
Eremos/
├── agents/         # Agent templates & logic
│   ├── example.ts
│   └── theron.ts
├── docs/           # Documentation & whitepaper
│   ├── whitepaper.pdf
│   └── architecture.md
├── scripts/        # Bootstrap and deployment scripts
│   ├── setup.js
│   └── deploy.js
├── tests/          #  Tests
│   ├── example.test.ts
│   └── throttle.test.ts
├── types/          #  TypeScript interfaces + definitions
│   ├── agent.ts
│   └── signal.ts
├── utils/          # Shared utilities
│   ├── signal.ts
│   ├── logging.ts
│   └── blockchain.ts
├── .env.example
├── package.json
├── LICENSE
└── tsconfig.json
```

---

## 📡 Signal Detection

### Example Output

```bash
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[agent-observer] → contract probing detected within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → 5 bundle-linked wallets interacted within 8s of deploy
[agent-observer] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)
```

### Signal Schema

```json
{
  "agent": "Observer",
  "type": "launch_detected",
  "glyph": "Δ",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-06-12T04:41:25Z",
  "source": "agent-observer",
  "confidence": 0.91
}
```

### Confidence Scoring

- CEX-origin funding: +0.2
- Time between funding → deploy: +0.15
- Wallet linkage density: +0.25
- Token metadata validation: +0.1
- Historical pattern matching: +0.3

---

## 🛠 Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| Frontend      | Next.js, Tailwind CSS, TypeScript             |
| Backend       | Node.js, TypeScript                           |
| Language      | TypeScript (typed logic across agents, utils, and infra) |
| Chain Layer   | RPC watchers, Mempool filters, native triggers|


---

## 🔧 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm test` | Run test suite |

### Creating Custom Agents

1. **Create Agent File:** Add a new TypeScript file in the `/agents/` directory
2. **Implement Interface:** Follow the agent interface defined in `/types/agent.ts`
3. **Register Agent:** Add your agent to the main configuration
4. **Test & Deploy:** Run tests and verify signal detection works as expected

See existing agents like [`theron.ts`](agents/theron.ts), [`observer.ts`](agents/observer.ts), or [`harvester.ts`](agents/harvester.ts) for implementation examples.

---

## 📊 Performance & Monitoring

- Real-time agent monitoring
- Signal latency tracking (<100ms)
- Memory-efficient design
- Configurable alerting

---


## 🔗 Links

- 🐦 [Twitter/X](https://x.com/EremosCore)
- 🌐 [Website](https://www.eremos.io/)
- 📄 [Whitepaper](./docs/whitepaper.pdf)
- 📚 [Documentation](./docs/)
- 🐙 [GitHub Repository](https://github.com/EremosCore/Eremos)

---

## 📄 License

MIT © Eremos LLC

---

<div align="center">
  <strong>Maintained by the Eremos Core team 💛</strong>
  <em>Building the future of on-chain intelligence</em>
</div>