# Eremos

<div align="center">

![Eremos](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Solana](https://img.shields.io/badge/Solana-9945FF?logo=solana&logoColor=white)](https://solana.com)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org)

[Website](https://www.eremos.io/) • [Whitepaper](docs/whitepaper.pdf) • [Documentation](docs/) • [Twitter](https://x.com/EremosCore)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Agent Examples](#agent-examples)
- [Signal System](#signal-system)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Links](#links)

---

## Overview

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies on Solana. Designed for developers who want low-noise, early signals embedded into their workflows.

**Key Benefits:**
- 🔍 **Early Signal Detection**: Catch on-chain activity before it becomes public knowledge
- 🏗️ **Modular Architecture**: Each agent handles specific detection patterns
- ⚡ **Lightweight & Fast**: Minimal resource usage with maximum insight
- 🔧 **Developer-Friendly**: TypeScript-first with comprehensive documentation
- 🌐 **Extensible**: Easy to add custom agents and detection logic

---

<div align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000) - The first deployed agent in the swarm</em>
</div>

**Meet Theron - Agent-000**  
*Passive. Pattern-sensitive. Modular and extendable by design.*

**Agent-001 Coming Soon** [Teaser #1](https://x.com/EremosCore/status/1949154939923833239), [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

---

## Features

### 🤖 **Autonomous Agents**
- **Modular Design** - Scoped logic for detecting wallet activity, contract spawns, and anomalies
- **Swarm Intelligence** - Each agent operates independently with shared utilities
- **Real-time Monitoring** - Continuous blockchain observation with intelligent filtering

### 📡 **Signal System**
- **Structured Signals** - Consistent output format for logging, alerting, or downstream use
- **Confidence Scoring** - Each signal includes reliability metrics (0-1 scale)
- **Minimal Output** - Log only what matters, reduce noise

### 🎯 **Detection Capabilities**
- **Launch Wallet Detection** - Trace freshly funded wallets from CEXs, track interactions, flag high-confidence deploys
- **Ghost Watcher** - Monitor long-dormant wallets that suddenly become active
- **Mint Pattern Analysis** - Detect suspicious token creation patterns
- **Wallet Cluster Tracking** - Identify related wallet activities and bundle operations

### 🔧 **Developer Experience**
- **TypeScript-First** - Full type safety and excellent IDE support
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers
- **Easy Configuration** - Environment-based setup with sensible defaults
- **Comprehensive Documentation** - Detailed guides and examples

---

## Quick Start

Get up and running with Eremos in under 5 minutes:

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

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) - Comes with Node.js
- **Git** - [Download here](https://git-scm.com/)
- **Solana CLI** (optional, for advanced usage) - [Installation guide](https://docs.solana.com/cli/install-solana-cli-tools)

### System Requirements

- **Memory**: 2GB RAM minimum, 4GB recommended
- **Storage**: 1GB free space
- **Network**: Stable internet connection for RPC calls
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```bash
# Solana RPC endpoint (required)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Optional: Custom RPC for better performance
# SOLANA_RPC_URL=https://solana-api.projectserum.com

# Agent configuration
AGENT_LOG_LEVEL=info
SIGNAL_OUTPUT_PATH=./signals

# Optional: Webhook notifications
WEBHOOK_URL=https://your-webhook-endpoint.com
```

### 4. Verify Installation

```bash
npm run test
```

---

## Usage

### Running Agents

Start the agent framework:

```bash
npm run dev
```

### Running Specific Agents

Execute individual agents for testing:

```bash
# Run the Theron agent (Agent-000)
npm run agent:theron

# Run the Launch Tracker agent
npm run agent:launch-tracker

# Run the Observer agent
npm run agent:observer
```

### Configuration Options

Customize agent behavior through environment variables:

```bash
# Set custom confidence threshold
CONFIDENCE_THRESHOLD=0.8

# Enable detailed logging
DEBUG=eremos:*

# Set custom polling interval (milliseconds)
POLLING_INTERVAL=5000
```

---

## Architecture

Eremos follows a modular, swarm-based architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Eremos Framework                         │
├─────────────────────────────────────────────────────────────┤
│  Agent Layer                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Theron    │ │ LaunchTracker│ │  Observer   │   ...    │
│  │ (Agent-000) │ │              │ │             │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Signal Processing Layer                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Emitter   │ │  Processor  │ │   Logger    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Core Utilities                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ RPC Manager │ │   Memory    │ │  Validators │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Solana Blockchain                                          │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

- **Agents**: Autonomous monitoring units with specific detection logic
- **Signals**: Structured output format for detected events
- **Utils**: Shared utilities for RPC calls, logging, and data processing
- **Types**: TypeScript definitions for consistent data structures

For detailed architecture information, see [docs/architecture.md](docs/architecture.md).

---

## Agent Examples

### Basic Agent Structure

```typescript
import { Agent, Signal } from '../types';
import { emitSignal } from '../utils';

export class CustomAgent implements Agent {
  name = 'CustomAgent';
  
  async initialize(): Promise<void> {
    console.log(`[${this.name}] Initializing...`);
  }
  
  async monitor(): Promise<void> {
    // Your detection logic here
    const detectedEvent = await this.checkForActivity();
    
    if (detectedEvent) {
      const signal: Signal = {
        agent: this.name,
        type: 'custom_detection',
        glyph: '⚡',
        hash: this.generateHash(detectedEvent),
        timestamp: new Date().toISOString(),
        source: 'custom-agent',
        confidence: 0.85
      };
      
      emitSignal(signal);
    }
  }
}
```

### Agent Configuration

Each agent can be configured through the environment or configuration files:

```typescript
// agents/config.ts
export const AgentConfig = {
  theron: {
    enabled: true,
    interval: 5000,
    confidenceThreshold: 0.7
  },
  launchTracker: {
    enabled: true,
    interval: 3000,
    confidenceThreshold: 0.8
  }
};
```

---

## Signal System

### Signal Structure

Every signal emitted by Eremos agents follows this structure:

```typescript
interface Signal {
  agent: string;        // Agent identifier
  type: string;         // Signal type (launch_detected, wallet_activity, etc.)
  glyph: string;        // Visual identifier (Δ, ⚡, 👁️, etc.)
  hash: string;         // Unique signal hash
  timestamp: string;    // ISO 8601 timestamp
  source: string;       // Signal source identifier
  confidence: number;   // Confidence score (0-1)
  data?: any;          // Optional additional data
}
```

### Example Signal Output

```typescript
{
  agent: "Observer",
  type: "launch_detected",
  glyph: "Δ",
  hash: "sig_c7f9a3d2bc",
  timestamp: "2025-06-12T04:41:25Z",
  source: "agent-observer",
  confidence: 0.91,
  data: {
    wallet: "6Yxk...P2M8",
    token: "5gW...pump",
    fundingSource: "kraken",
    timeToLaunch: 13
  }
}
```

### Confidence Scoring

Confidence scores are calculated based on:
- **Funding Source** (0.1-0.3): CEX origins score higher
- **Timing Patterns** (0.1-0.2): Faster deployment increases confidence
- **Wallet Linkage** (0.1-0.3): Bundle activity correlations
- **Metadata Quality** (0.1-0.2): Token information completeness

---

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Getting Started](docs/getting-started.md)** - Detailed setup and first steps
- **[Architecture](docs/architecture.md)** - System design and components
- **[API Reference](docs/api-reference.md)** - TypeScript interfaces and methods
- **[Agent Development](docs/agents.md)** - Creating custom agents
- **[Signal System](docs/signals.md)** - Understanding signal formats
- **[Examples](docs/examples.md)** - Real-world usage examples
- **[Contributing](docs/contributing.md)** - Contribution guidelines
- **[Troubleshooting](docs/troubleshooting.md)** - Common issues and solutions

---

## Contributing

We welcome contributions from the community! Whether you're a developer, designer, or blockchain enthusiast, there are many ways to contribute.

### Quick Contributing Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Areas

- 🔧 **Agent Development**: Create new monitoring agents
- 📚 **Documentation**: Improve guides and examples
- 🐛 **Bug Fixes**: Help resolve issues
- ✨ **Features**: Add new framework capabilities
- 🎨 **Design**: UI/UX improvements for tooling

For detailed contributing guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Troubleshooting

### Common Issues

#### Installation Problems

**Node.js Version Issues**
```bash
# Check your Node.js version
node --version

# If version is below 18.0.0, update Node.js
# Use nvm for version management
nvm install 18
nvm use 18
```

#### Runtime Issues

**RPC Connection Errors**
```bash
# Verify your RPC endpoint
curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' $SOLANA_RPC_URL
```

**Permission Errors**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Agent Issues

**Agents Not Starting**
1. Check environment configuration in `.env.local`
2. Verify RPC endpoint connectivity
3. Ensure proper TypeScript compilation
4. Check log output for specific errors

For more troubleshooting help, see [docs/troubleshooting.md](docs/troubleshooting.md) or [open an issue](https://github.com/EremosCore/Eremos/issues).

---

## License

MIT © Eremos LLC

See [LICENSE](LICENSE) for full details.

---

## Links

- **🌐 Website**: [Eremos.io](https://www.eremos.io/)
- **🐦 Twitter/X**: [@EremosCore](https://x.com/EremosCore)
- **📄 Whitepaper**: [v1.0 PDF](docs/whitepaper.pdf)
- **📚 Documentation**: [docs/](docs/)
- **🐛 Issues**: [GitHub Issues](https://github.com/EremosCore/Eremos/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/EremosCore/Eremos/discussions)

---

<div align="center">

**Built with ❤️ by the Eremos Core team**

*Maintained by the Eremos Core team 💛*

</div>
