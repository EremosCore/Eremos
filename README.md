# Eremos

<div align="center">

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/network/members)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)

</div>

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
Designed for devs who want low-noise, early signals embedded into their workflows.

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🤖 Meet the Agents](#-meet-the-agents)
- [📊 Example Signal](#-example-signal)
- [🎚️ Signal Confidence](#️-signal-confidence)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Links](#-links)

## 🎯 Overview

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

**Meet Theron - Agent-000**  
*The first deployed agent in the swarm. Passive. Pattern-sensitive.  
Modular and extendable by design.*

**Agent-001 Coming Soon** → [Teaser](https://x.com/EremosCore/status/1949154939923833239)

## ✨ Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters
- **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.

## 🤖 Meet the Agents

**5 Active Agents** monitoring different aspects of Solana activity:

- **Ϸ Theron** (agent-000) - *Memory Vault* | Archives all patterns, never emits
- **Σ LaunchTracker** (agent-launch) - *Launch Monitor* | Detects fresh token deployments  
- **ψ Skieró** (agent-022) - *Ghost Watcher* | Tracks dormant wallet reactivations
- **φ Observer** (agent-observer) - *Surveillance* | Monitors wallet clustering patterns
- **λ Harvester** (agent-harvester) - *Indexing* | Processes mint data and volume spikes

> **📖 Learn More**: See the complete [Agent Guide](docs/agents.md) and [Glyph System](docs/glyphs.md) for detailed information.

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

## 🎚️ Signal Confidence

Each signal includes a **confidence score (0-1)** based on behavioral heuristics like CEX funding sources, timing patterns, wallet coordination, and metadata validation. Agents only emit signals when confidence exceeds their threshold.

**Confidence Ranges:**
- **0.9-1.0**: Extremely high confidence → Immediate alerts
- **0.7-0.9**: High confidence → Signal emission  
- **0.5-0.7**: Medium confidence → Monitoring only

> **📖 Learn More**: See the complete [Signal Taxonomy](docs/signals.md) for detailed confidence calculations and signal types.

## 🛠️ Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Node.js (TypeScript-based agent runner)
- **Language:** TypeScript (typed logic across agents, utils, and infra)
- **Chain Layer:** RPC watchers, mempool filters, native triggers

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **TypeScript** knowledge recommended
- **Solana** RPC endpoint (optional for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/EremosCore/Eremos.git
   cd Eremos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development mode**
   ```bash
   npm run dev
   ```

### Test an Agent

```bash
# Test the example agent
npx ts-node scripts/dev-agent.ts

# Validate agent configuration
npx ts-node scripts/validate-agent.ts agents/example.ts
```

## 📁 Project Structure

- `/agents` - Agent templates + logic  
- `/utils` - Shared signal/logging utilities  
- `/types` - TypeScript interfaces + definitions  
- `/scripts` - Bootstrap and dev scripts  
- `/docs` - Comprehensive documentation, architecture guides, and project assets

> **📖 Learn More**: See the [Architecture Guide](docs/architecture.md) for detailed system design and the [Documentation Index](docs/README.md) for all guides.

## 🤝 Contributing

We welcome contributions from the community! Here's how you can get involved:

### 🧠 Agent Development
- **Experienced TypeScript developers**: Check out the [Agent Development Guide](docs/agents.md) and start with `agents/example.ts`
- **Blockchain analysts**: Help improve detection algorithms and confidence scoring
- **Solana specialists**: Enhance chain-specific monitoring capabilities

### 🎨 Design & Creative
- **Designers & Artists**: We're looking for visual improvements and agent artwork
- **Writers**: Help improve documentation and agent descriptions
- **Mythbuilders**: Have ideas that fit the Eremos mythos? We'd love to hear them!

### 📋 How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-agent`)
3. Test your changes with the provided scripts
4. Submit a pull request with a clear description

### 💬 Get in Touch
Have questions or ideas? Reach out to us on Twitter: [@EremosCore](https://x.com/EremosCore)

## 📄 License

MIT © Eremos LLC

## 🔗 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

## 🚀 What's Next

- **Agent-001** is in development - follow our [Twitter](https://x.com/EremosCore) for updates
- **Visual Interface** for signal monitoring and agent behavior
- **Enhanced Detection** algorithms for better confidence scoring
- **Community Agents** - submit your own detection patterns

---

<div align="center">

**⚡ Built for the Solana ecosystem ⚡**

_Maintained by the Eremos Core team 💛_

[![GitHub](https://img.shields.io/badge/GitHub-EremosCore-000?style=flat&logo=github)](https://github.com/EremosCore/Eremos)
[![Website](https://img.shields.io/badge/Website-Eremos.io-FF6B6B?style=flat&logo=web)](https://www.eremos.io/)
[![Twitter](https://img.shields.io/badge/Twitter-@EremosCore-1DA1F2?style=flat&logo=twitter)](https://x.com/EremosCore)

</div>
