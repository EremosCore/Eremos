# Eremos

<div align="center">
  
![Eremos](docs/banner2.png)

<p align="center">
  <a href="https://github.com/EremosCore/Eremos/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/version-0.1.0-brightgreen.svg" alt="Version" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/Solana-Powered-purple?logo=solana" alt="Solana Powered" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript" alt="TypeScript Ready" />
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </a>
</p>

<h3 align="center">🔮 Autonomous swarm agents for early on-chain signal detection 🔮</h3>

<p align="center">
  <b>Eremos</b> is a lightweight framework for deploying modular agents that monitor blockchain activity - tracking wallet clusters, mint patterns, and contract anomalies.
  <br/>
  Designed for devs who want low-noise, early signals embedded into their workflows.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#getting-started">Quick Start</a> •
  <a href="#example-signal">Signals</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a>
</p>

</div>

---

## 🎯 What is Eremos?

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <h3>🔍 Problem</h3>
        <p>On-chain activities like token launches, wallet movements, and contract deployments often go unnoticed until it's too late to act.</p>
      </td>
      <td align="center" width="50%">
        <h3>💡 Solution</h3>
        <p>Eremos deploys autonomous agents that monitor blockchain activities 24/7 and alert you about significant events before they become obvious.</p>
      </td>
    </tr>
  </table>
</div>

## ⚡ How It Works

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>1️⃣</h3>
        <b>Monitor</b>
        <p>Agents continuously watch on-chain activities</p>
      </td>
      <td align="center">
        <h3>2️⃣</h3>
        <b>Analyze</b>
        <p>Pattern detection & behavioral analysis</p>
      </td>
      <td align="center">
        <h3>3️⃣</h3>
        <b>Score</b>
        <p>Calculate confidence based on multiple factors</p>
      </td>
      <td align="center">
        <h3>4️⃣</h3>
        <b>Alert</b>
        <p>Emit high-confidence signals to your workflow</p>
      </td>
    </tr>
  </table>

  ```mermaid
  graph LR
    A[On-chain Activity] --> B[Swarm Agents]
    B --> C[Pattern Detection]
    C --> D[Confidence Scoring]
    D --> E[Signal Emission]
    style A fill:#ff9900
    style B fill:#3498db
    style C fill:#2ecc71
    style D fill:#9b59b6
    style E fill:#e74c3c
  ```
</div>

## 🎮 Use Cases

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>👥</h3>
        <b>Developers</b>
        <p>Monitor contract deployments & track wallet patterns</p>
      </td>
      <td align="center">
        <h3>📊</h3>
        <b>Analysts</b>
        <p>Track emerging trends & token launches</p>
      </td>
      <td align="center">
        <h3>🔒</h3>
        <b>Security Teams</b>
        <p>Detect suspicious wallet activities & potential threats</p>
      </td>
    </tr>
  </table>
</div>

---

<div align="center">
  <table>
    <tr>
      <td align="center" width="400px">
        <img src="docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
        <h3>🌟 Meet Theron - Agent-000</h3>
        <p><i>The first deployed agent in the swarm</i></p>
        <table>
          <tr>
            <td>Status</td>
            <td><img src="https://img.shields.io/badge/status-active-success.svg"/></td>
          </tr>
          <tr>
            <td>Type</td>
            <td><img src="https://img.shields.io/badge/type-pattern%20detection-blue.svg"/></td>
          </tr>
          <tr>
            <td>Role</td>
            <td><img src="https://img.shields.io/badge/role-passive%20observer-yellow.svg"/></td>
          </tr>
        </table>
      </td>
      <td align="center" width="400px">
        <h3>🔜 Agent-001</h3>
        <p><i>Coming Soon</i></p>
        <a href="https://x.com/EremosCore/status/1949154939923833239">
          <img src="https://img.shields.io/badge/status-teaser-orange.svg"/>
        </a>
        <p>Get ready for the next evolution<br/>in our swarm intelligence</p>
      </td>
    </tr>
  </table>
</div>

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center">
        <h3>🤖</h3>
        <b>Modular Agents</b>
        <p>Scoped logic for detecting wallet activity, contract spawns, and anomalies</p>
      </td>
      <td align="center">
        <h3>📡</h3>
        <b>Signal Emission</b>
        <p>Structured signals for logging, alerting, or downstream use</p>
      </td>
      <td align="center">
        <h3>🌐</h3>
        <b>Swarm Design</b>
        <p>Each agent operates independently with shared utilities</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <h3>🔌</h3>
        <b>Extensible Core</b>
        <p>Plug in watchers, inference layers, or custom triggers</p>
      </td>
      <td align="center">
        <h3>📊</h3>
        <b>Minimal Output</b>
        <p>Log only what matters - high signal, low noise</p>
      </td>
      <td align="center">
        <h3>🎯</h3>
        <b>Launch Detection</b>
        <p>Trace fresh wallets & flag high-confidence deploys in real time</p>
      </td>
    </tr>
  </table>
</div>

### 👻 Ghost Watcher
<p align="center">
  <i>Monitors long-dormant wallets that suddenly become active again. <br/>
  Perfect for tracing old dev wallets or detecting potential rug setups.</i>
</p>


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
