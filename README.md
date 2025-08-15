# Eremos

<div align="center">

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenWe welcome contributions from the community! Whether you're:

- 🧑‍💻 **Developers:** Experienced in TypeScript and agent-based systems - check `agents/example.ts` and build your own observer
- 🎨 **Designers/Artists:** Have ideas that fit the mythos - send us a DM on [Twitter](https://x.com/EremosCore)
- 📝 **Documentation:** Help improve our guides and examples
- 🐛 **Bug Hunters:** Report issues or submit fixes

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Work on your changes in `/agents`, `/utils`, or `/docs`
4. Test your changes using `/scripts/dev-agent.ts` 
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Please ensure:** Clean commits, avoid bloat, and follow existing code patterns.

For detailed guidelines, see [`docs/contributing.md`](docs/contributing.md).

## 📄 License)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0+-green.svg)](https://nodejs.org/)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-purple.svg)](https://solana.com/)
[![GitHub stars](https://img.shields.io/github/stars/EremosCore/Eremos.svg?style=social&label=Star)](https://github.com/EremosCore/Eremos)

</div>

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

## 📋 Table of Contents

- [Features](#-features)
- [Example Signal](#-example-signal)
- [Signal Confidence](#-signal-confidence)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
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

## 🚀 Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters
- **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.
- *+ More to come.*


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

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (TypeScript-based agent runner)
- **Language:** TypeScript (typed logic across agents, utils, and infra)
- **Chain Layer:** RPC watchers, mempool filters, native triggers

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to Solana RPC endpoint

### Installation

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Start development mode
npm run dev
```

### Configuration

Edit `.env.local` to configure your Solana RPC endpoints and agent settings:

```bash
# Required: Solana RPC Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com

# Optional: Agent Configuration
AGENT_LOG_LEVEL=info
AGENT_UPDATE_INTERVAL=5000
```

---

## 📁 Project Structure

```
Eremos/
├── agents/           # Agent implementations and templates
│   ├── example.ts    # Template agent for custom development
│   ├── theron.ts     # Agent-000: Core monitoring agent
│   └── observer.ts   # Launch detection and wallet tracking
├── docs/             # Documentation and assets
│   ├── *.md          # Technical documentation
│   ├── whitepaper.pdf # Official whitepaper
│   └── *.png         # Visual assets and banners
├── scripts/          # Development and utility scripts
│   ├── dev-agent.ts  # Agent development helper
│   └── generate-*.ts # Code generation utilities
├── tests/            # Test suites
├── types/            # TypeScript type definitions
├── utils/            # Shared utilities and helpers
└── package.json      # Project configuration
```

### Key Directories

| Directory | Description |
|-----------|-------------|
| `/agents` | Agent templates and core logic implementations |
| `/utils` | Shared signal processing, logging, and utility functions |
| `/types` | TypeScript interfaces and type definitions |
| `/scripts` | Bootstrap, development, and maintenance scripts |
| `/docs` | Comprehensive documentation, architecture guides, and assets |
| `/tests` | Unit and integration test suites |

---

## 🔧 Development

### Creating Custom Agents

1. **Start with the example template:**
   ```bash
   cp agents/example.ts agents/my-agent.ts
   ```

2. **Customize the agent configuration:**
   ```typescript
   export const MyAgent: Agent = {
     id: "agent-my-unique-id",
     name: "MyAgent",
     role: "custom_monitor",
     watchType: "wallet_activity",
     glyph: "★",
     // ... implement your logic
   };
   ```

3. **Test your agent:**
   ```bash
   npm run dev-agent -- --agent=my-agent
   ```

### Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode |
| `npm run test` | Run test suite |
| `npm run validate-agent` | Validate agent configurations |
| `npm run simulate-cluster` | Simulate agent cluster behavior |

### Debugging

- Use `utils/debug.ts` for structured logging
- Check `docs/architecture.md` for system design details
- Review `docs/signals.md` for signal structure documentation

## 🤝 Contributing

We’re open to contributors.  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.
If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)

---

## License

MIT © Eremos LLC

---

## 🔗 Links

<div align="center">

[![Website](https://img.shields.io/badge/Website-eremos.io-blue?style=for-the-badge&logo=globe)](https://www.eremos.io/)
[![Twitter](https://img.shields.io/badge/Twitter-@EremosCore-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/EremosCore)
[![Whitepaper](https://img.shields.io/badge/Whitepaper-v1.0_PDF-red?style=for-the-badge&logo=adobe-acrobat-reader)](docs/whitepaper.pdf)

</div>

---

<div align="center">
<em>Maintained by the Eremos Core team 💛</em>
</div>
