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


**Agent-001 Coming Soon**

## 🎮 Interactive Playground

Experience Eremos agents in action with our **live visualization playground**:

**[▶️ Launch Agent Playground](playground/index.html)** - *Open in your browser*

- **Real-time agent visualization** with interactive 3D-style interface
- **Live signal monitoring** and confidence tracking
- **Performance metrics** dashboard
- **Simulation controls** to trigger events and test scenarios
- **Agent behavior analytics** with detailed logging

*Click agents to trigger events, watch signal flows, and monitor swarm intelligence in real-time!*

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

Each emitted signal includes a `confidence` score (0–1) based on behavioral heuristics:
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

## 🛠️ Developer Tools

### Agent Testing Suite

Advanced testing utility for comprehensive agent validation:

```bash
# Run full test suite on all agents
npx ts-node tools/agent-tester.ts

# Test specific agents directory
npx ts-node tools/agent-tester.ts ./custom-agents
```

**Features:**
- **Performance profiling** - Execution time & memory usage analysis
- **Confidence validation** - Signal quality assessment  
- **Error resilience testing** - Robustness under failure conditions
- **Concurrent processing** - Multi-threaded capability testing
- **Detailed reporting** - JSON output with actionable recommendations

The testing suite generates comprehensive reports including:
- Agent reliability scores
- Performance benchmarks  
- Memory efficiency analysis
- Confidence score distributions
- Optimization recommendations

---

## Getting Started

### Quick Demo

Experience Eremos features instantly with our interactive demo:

```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
chmod +x demo.sh && ./demo.sh
```

This will launch:
1. **Interactive Playground** - Visual agent simulation in your browser
2. **Testing Suite** - Comprehensive agent validation and profiling

### Standard Setup

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

MIT © Eremos

---

## Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

_Maintained by the Eremos Core team 💛._
