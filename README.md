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


**Agent-001 Coming Soon** [Teaser](https://x.com/EremosCore/status/1949154939923833239)

---

## Features

- **Modular Agents** - Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **Signal Emission** - Structured signals for logging, alerting, or downstream use  
- **Swarm Design** - Each agent operates independently with shared utilities  
- **Extensible Core** - Plug in watchers, inference layers, or custom triggers  
- **Minimal Output** - Log only what matters
- **Launch Wallet Detection** - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time
- **Ghost Watcher** - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.


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



## Architecture

Key Components & Architecture
The Eremos architecture is a layered system that processes on-chain data to produce actionable signals. The flow begins with raw blockchain data and culminates in structured outputs
```text
[Chain Layer]
   ├─ RPC Watchers
   ├─ Mempool Filters
   └─ Native Triggers
        |
        v
[Ingest & Normalize]
   ├─ Event Normalizer
   ├─ Deduper / Sequencer
   └─ Feature Tagger
        |
        v
[Event Bus] ---> [Entity Graph / Feature Store / Token Metadata Cache]
        |
        v
[Agent Swarm]
   ├─ Launch Wallet Detector
   ├─ Ghost Watcher
   └─ (Custom Agents)
        |
        v
[Signal Engine]
   ├─ Confidence Scorer
   ├─ Router
   └─ Storage
        |
        v
[Outputs]
   ├─ Slack / Telegram / Webhooks
   ├─ Downstream Systems
   └─ Audit Ledger |
| `&nbsp;&nbsp;&nbsp;└─ Audit Ledger` |

---

## Getting Started

<p align="center">
<img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
<em>Theron - Agent (000)</em>
</p>
```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```


To provide more context, here's a brief explanation of each layer:
Chain Layer: The entry point for real-time blockchain data. This layer uses various watchers and triggers to gather events as they happen.

Ingest & Normalize: Raw data is processed here. This layer cleans, deduplicates, and adds a Feature Tagger to prepare the data for the swarm.

Event Bus: The central nervous system. It routes normalized events to the agents and updates the data caches like the Entity Graph and Token Metadata.

Agent Swarm: The core of Eremos. This is where your custom-built agents live, each with its own logic for detecting specific patterns.

Signal Engine: Takes the raw signals from the agents, assigns a confidence score, and routes them to their final destination.

Outputs: The final layer where signals are delivered to external systems like messaging apps, custom dashboards, or audit logs



FEATURES

Modular Agents - Scoped logic for detecting wallet activity, contract spawns, and anomalies.
Signal Emission - Structured signals for logging, alerting, or downstream use.
Swarm Design - Each agent operates independently with shared utilities.
Extensible Core - Plug in watchers, inference layers, or custom triggers.
Minimal Output - Log only what matters.
Launch Wallet Detection - Agents can trace freshly funded wallets (e.g. from CEXs), track their contract interactions, and flag high-confidence deploys in real time.
Ghost Watcher - Monitors long-dormant wallets that suddenly become active again. Useful for tracing old dev wallets or rug setups.
Advanced Analytic Dashboards - Provides users with a visual interface to explore historical signals, agent performance, and on-chain trends.
Enhanced AI/ML Integration - Integrates machine learning models to detect more complex and subtle patterns that are difficult to define with rule-based logic alone.
Cross-Chain and Sidechain Support - Expands the framework to monitor and detect signals across multiple blockchains, not just the primary chain


Set up your environment:

```bash
cp .env.example .env.local
npm run dev
```

---

## Key Folders

- `/agents` - Agent templates + logic  
- `/utils` - Shared signal/logging utilities  
- `/types` - TypeScript interfaces + definitions  
- `/scripts` - Bootstrap and dev scripts  
- `/docs` - Swarm structure, architecture, & our artwork/official whitepaper

---

## Contributing

We’re open to contributors.  
If you are experienced in TypeScript and like agent-based systems, check `example.ts` and build your own observer.
If you're a designer, artist, or just have ideas that fit the mythos - send us a DM on Twitter. [@EremosCore](https://x.com/EremosCore)

---

## License

MIT © Eremos LLC

---

## Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
