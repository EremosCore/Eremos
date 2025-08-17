# Eremos

![Eremos Banner](docs/banner2.png)

**Autonomous swarm agents for early on-chain signal detection**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)
[![Last Commit](https://img.shields.io/github/last-commit/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/commits/main)
[![Stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/stargazers)
[![Forks](https://img.shields.io/github/forks/EremosCore/Eremos?style=social)](https://github.com/EremosCore/Eremos/network/members)
[![Issues](https://img.shields.io/github/issues/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/issues)
[![Twitter Follow](https://img.shields.io/twitter/follow/EremosCore?style=social)](https://twitter.com/EremosCore)
[![Contributors](https://img.shields.io/github/contributors/EremosCore/Eremos)](https://github.com/EremosCore/Eremos/graphs/contributors)

## Overview

Eremos is an open-source framework for deploying autonomous "swarm agents" that monitor on-chain activity on Solana. Agents run independently, detecting funding flows, wallet clusters, contract deployments, bundling patterns, and dormant wallet reactivations surfacing signals before they're mainstream.

Lightweight and extensible, it's built for devs and analysts seeking low-noise insights. As a public good, it boosts Solana transparency, but it's early: expect iteration, potential bugs, and community-driven growth. If you're TypeScript-savvy and into blockchain monitoring, contribute; if not, it might not click yet.

<p align="center">
  <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

**Meet Theron - Agent-000**  
Passive, pattern-focused, and extensible. Agent-001 incoming - check [Teaser #1](https://x.com/EremosCore/status/1949154939923833239) and [Teaser #2](https://x.com/EremosCore/status/1954856345284567218).

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Example Signal](#example-signal)
- [Signal Confidence](#signal-confidence)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Repo Structure](#repo-structure)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Links](#links)

## Key Features

- **Modular Agents**: Scoped logic for wallets, deploys, anomalies customize without hassle.
- **Signal Emission**: JSON outputs for logs, alerts, or pipelines.
- **Swarm Design**: Independent agents, shared utils scalable, no single failure point.
- **Extensible Core**: Add triggers, watchers, or inference layers.
- **Minimal Noise**: Only meaningful signals emitted.
- **Launch Detection**: Tracks CEX-funded wallets, interactions, real-time deploy flags.
- **Ghost Watcher**: Spots dormant wallet activity useful for dev/rug detection.
- *More planned: See [Roadmap](#roadmap).*

## Example Signal

Agent detecting a token deploy:

```
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[agent-observer] → contract probing detected within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → 5 bundle-linked wallets interacted within 8s of deploy
[agent-observer] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)
```

JSON:

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

## Signal Confidence

Scores (0-1) from heuristics:
- Funding origin (CEX boosts).
- Funding-to-deploy timing.
- Wallet linkage/bundling.
- Metadata checks.

Rule-based for reliability which is expandable via contributions.

## Architecture

High-level swarm flow (GitHub supports Mermaid):

```mermaid
flowchart TD
    A[RPC/Mempool Watchers] --> B[Agent Swarm]
    B -->|Independent Processing| C[Theron (000)]
    B -->|Independent Processing| D[Observer]
    B -->|Independent Processing| E[Future Agents (001+)]
    C --> F[Signal Emission]
    D --> F
    E --> F
    F --> G[Logs/Alerts/Downstream Tools]
    H[Shared Utils: Logging, Metrics] --> B
    subgraph Extensibility
        I[Custom Triggers/Inference]
        I --> B
    end
```

Agents pull chain data, process patterns, emit signals that are modular for swarm growth.

## Tech Stack

| Component      | Tech                           | Notes                              |
|----------------|--------------------------------|------------------------------------|
| Language      | TypeScript                    | Typed agents/utils/infra.         |
| Runtime       | Node.js                       | Agent runner.                     |
| Chain Layer   | RPC watchers, mempool filters | On-chain monitoring.              |
| Frontend (opt)| Next.js + Tailwind CSS        | For extensions/UI.                |
| Testing       | Jest                          | Unit/integration.                 |
| Linting       | ESLint + Prettier             | Consistency (enforced via hooks). |

Minimal deps - Node v18+.

## Repo Structure

```
Eremos/
├── agents/                  # Agent templates/logic (e.g., theron.ts, observer.ts)
├── docs/                    # Docs/assets
│   ├── architecture.md      # Design overview
│   ├── deployment.md        # Guides
│   ├── contributing.md      # Rules
│   ├── env.md               # Env vars
│   ├── whitepaper.pdf       # v1.0
│   └── assets/              # Images (banner2.png, therontphd2.png)
├── scripts/                 # Scripts
│   ├── dev-agent.ts         # Dev helpers
│   ├── generate-agent.ts    # Codegen
│   ├── stress-test.ts       # Tests
│   └── ...                  # More utils
├── tests/                   # *.test.ts
├── types/                   # TS defs
├── utils/                   # Shared (logging, signals, metrics)
├── .env.example             # Env template
├── .gitignore               # Ignores
├── LICENSE                  # MIT
├── README.md                # This
└── package.json             # Deps/scripts
```

Built modular, open to improvements via PRs.

## Prerequisites

- Node.js v18+
- npm/yarn
- Solana RPC key (free tiers ok for dev)
- Git

## Quickstart

1. Clone:
   ```bash
   git clone https://github.com/EremosCore/Eremos.git
   cd Eremos
   ```

2. Install:
   ```bash
   npm install
   ```

3. Env setup:
   ```bash
   cp .env.example .env.local
    # Don’t forget to set SOLANA_RPC_URL=your_endpoint
    # For details, check docs/env.md

   ```

4. Run agent:
   ```bash
   npm run dev Theron
   ```

5. Tests:
   ```bash
   npm test
   ```

Expect signals in console.

## Troubleshooting

- **RPC Errors**: Check .env SOLANA_RPC_URL; use public endpoints like https://api.mainnet-beta.solana.com for testing.
- **Dep Install Fails**: Clear cache (`npm cache clean --force`), retry.
- **No Signals**: Ensure chain activity; test with mock data in tests/.
- **Type Errors**: Run `npm run lint`—fix via ESLint.
- Issues? Open one with logs/specs.

## Contributing

Selective: Quality > quantity. Untested/sloppy PRs closed; thoughtful ones merged with feedback.

- Fork, branch (`git checkout -b feat/(your-fix)`).
- Edit, test (add if code).
- Commit: `git commit -m "docs: add architecture diagram"`.
- Push, PR.

Priorities: Docs polish, agent extensions, bug fixes. See CONTRIBUTING.md. Active GitHub? Bonus. No merges guaranteed, if misaligned, we'll explain.

## Roadmap

From whitepaper/teasers:
- Agent-001 release.
- ML inference integration.
- UI dashboard.
- Community agents gallery.

Contribute ideas via issues/DM.

## License

MIT © Eremos LLC

## Links

- **Twitter/X**: [@EremosCore](https://x.com/EremosCore)
- **Website**: [eremos.io](https://www.eremos.io/)
- **Whitepaper**: [v1.0 PDF](docs/whitepaper.pdf)


💛 Eremos Core team.
