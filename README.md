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


**Agent-001 Coming Soon** [Teaser #1](https://x.com/EremosCore/status/1949154939923833239), [Teaser #2](https://x.com/EremosCore/status/1954856345284567218)

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


## Agents

The Eremos framework ships with several modular agents. Each one runs independently, watches a chain or activity type, and emits structured signals when something notable happens.

### SolanaWatcher (◎)
- **Role:** Blockchain Monitor  
- **WatchType:** `onchain_activity`  
- **Description:** Monitors Solana activity using **HTTP polling** (instead of WebSocket subscriptions for broader RPC compatibility).  
- **Behavior:** Emits `high_activity_detected` when a transaction logs at least `N` messages (default: 5).  
- **Configurable:** `SOLANA_RPC_URL`, `POLL_INTERVAL`, `ACTIVITY_THRESHOLD`  

### EthereumWatcher (Ξ)
- **Role:** Blockchain Monitor  
- **WatchType:** `onchain_activity`  
- **Description:** Polls Ethereum L1 blocks via ethers.js HTTP provider.  
- **Behavior:** Emits `high_block_activity` if a block has more than `N` transactions (default: 50).  
- **Configurable:** `ETH_RPC_URL`, `POLL_INTERVAL`, `ACTIVITY_THRESHOLD`


## Example Agent Output

With the new EthereumWatcher (Ξ) and SolanaWatcher (◎), signals are emitted in a clean narrative form followed by a structured JSON object for downstream use.

```ts
[SolanaWatcher] → emitting signal (high_activity_detected) at 2025-08-17T21:38:23.592Z
[SolanaWatcher] → signature: 5KdisD3hSpxfFvFvqrr9DwycJifiEkkmB25Wnx88DdNviaE8yA5Et7WqVPEceSCkKddNnhiXsGk6z4D6vokK6j2S
[SolanaWatcher] → logCount: 2
[SolanaWatcher] → slot: 360742065
[SolanaWatcher] → preview: ["Program 11111111111111111111111111111111 invoke [1]","Program 11111111111111111111111111111111 success"]

{
  "type": "high_activity_detected",
  "hash": "sig_eyJ0eXBlIj",
  "timestamp": "2025-08-17T21:38:23.592Z",
  "source": "SolanaWatcher",
  "details": {
    "signature": "5KdisD3hSpxfFvFvqrr9DwycJifiEkkmB25Wnx88DdNviaE8yA5Et7WqVPEceSCkKddNnhiXsGk6z4D6vokK6j2S",
    "logCount": 2,
    "slot": 360742065,
    "preview": [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success"
    ]
  },
  "agent": "SolanaWatcher",
  "glyph": "◎"
}

[EthereumWatcher] → emitting signal (high_block_activity) at 2025-08-17T21:39:43.933Z
[EthereumWatcher] → blockNumber: 23163521
[EthereumWatcher] → blockHash: 0xb2b47d3b60c24b2ea83cb3d51301be1d25fdd19451b48b1cf5272db016accaf0
[EthereumWatcher] → txCount: 241

{
  "type": "high_block_activity",
  "hash": "sig_eyJ0eXBlIj",
  "timestamp": "2025-08-17T21:39:43.933Z",
  "source": "EthereumWatcher",
  "details": {
    "blockNumber": 23163521,
    "blockHash": "0xb2b47d3b60c24b2ea83cb3d51301be1d25fdd19451b48b1cf5272db016accaf0",
    "txCount": 241
  },
  "agent": "EthereumWatcher",
  "glyph": "Ξ"
}
```

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

Edit .env.local 

# Solana RPC endpoint
SOLANA_RPC_URL=""

# Ethereum RPC endpoint
ETH_RPC_URL=""

# Run all agents (default)
npm run dev     

# Run only the Solana watcher (◎)
npm run dev sol

# Run only the Ethereum watcher (Ξ)
npm run dev eth
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
