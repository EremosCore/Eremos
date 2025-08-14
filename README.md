# Eremos

<p align="center">
  <img alt="Eremos banner" src="./docs/banner2.png" width="900">
</p>
<p align="center">
  <a href="https://www.eremos.io/"><strong>Website</strong></a> ·
  <a href="./docs/README.md"><strong>Docs</strong></a> ·
  <a href="./docs/agents.md#theron-agent-000"><strong>Agent‑000: Theron</strong></a> ·
  <a href="./docs/ROADMAP.md"><strong>Roadmap</strong></a> ·
  <a href="./docs/whitepaper.pdf"><strong>Whitepaper</strong></a>
</p>

**Autonomous swarm agents for early on-chain signal detection**

Eremos is a lightweight framework for deploying modular agents that monitor blockchain activity—tracking wallet clusters, mint patterns, launches, and contract anomalies. Designed for developers and analysts who need low‑noise, early signals embedded into their workflows.

> If this project helps you, please Star ⭐ and Watch 👀 the repo.

---

<p align="center">
  <img src="./docs/therontphd2.png" alt="Agent Theron illustration" width="155"/><br/>
  <em>Theron — Agent (000)</em>
</p>

## Table of Contents
- [Highlights](#highlights)
- [Use cases](#use-cases)
- [Example Signal](#example-signal)
- [Signal Confidence](#signal-confidence)
- [Tech Stack](#tech-stack)
- [Try it quickly](#try-it-quickly)
- [Key Folders](#key-folders)
- [Contributing](#contributing)
- [License](#license)
- [Links](#links)

---

## Highlights

- **Modular swarm agents** — Scoped logic for wallet activity, deploy patterns, and anomalies
- **Structured signal emission** — JSON signals for logging, alerting, or downstream automations
- **Confidence scoring** — Behavior‑driven confidence attached to important signals
- **Quiet until necessary** — Designed to avoid noise; throttle and thresholds built in
- **Extensible core** — Plug in watchers, memory, or inference modules as needed

## Use cases

- **Launch wallet tracing**: Detect CEX‑funded wallets that probe and deploy rapidly
- **Bundling behavior**: Catch coordinated interactions across linked wallets
- **Dormant wallet reactivation**: Surface long‑silent wallets that awaken
- **Contract irregularities**: Flag suspicious call patterns or metadata anomalies

---

## Example Signal

An example signal emitted by LaunchTracker when a high-confidence launch pattern is detected:

```ts
[launch-tracker] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[launch-tracker] → contract probing detected within 4s (pump.fun interaction traced)
[launch-tracker] → token created at 04:41:17Z (tx: 5gW...pump)
[launch-tracker] → 5 bundle-linked wallets interacted within 8s of deploy
[launch-tracker] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)

{
  agent: "LaunchTracker",
  type: "launch_detected",
  glyph: "Σ",
  hash: "sig_c7f9a3d2bc",
  timestamp: "2025-06-12T04:41:25Z",
  confidence: 0.91
}
```

---

## Signal Confidence

Each emitted signal can include a `confidence` score (0–1) based on behavioral heuristics, such as:
- CEX‑origin funding (e.g., Kraken, Coinbase)
- Time from funding → deploy
- Linkage density (bundled wallet activity)
- Token/contract metadata validation

Confidence is computed agent‑side and logged alongside the signal.

---

## Tech Stack

- **Language/Runtime:** TypeScript on Node.js
- **This repository is headless.** The public website/UI lives at `eremos.io` and is not part of this codebase.
- **Chain Layer:** RPC watchers, lightweight filters, and agent‑side triggers

---

## Try it quickly

Requirements: Node.js 18+ and `npx`.

```bash
npm install

# Run the example agent in-place with TypeScript support
npx tsx scripts/dev-agent.ts

# Alternative (if you prefer ts-node)
# npx ts-node --transpile-only scripts/dev-agent.ts
```

Expected output: a sample agent action and/or a logged signal hash.

> Tip: Explore `/scripts` for additional dev helpers like `generate-signal.ts`, `simulate-cluster.ts`, or `validate-agent.ts`.

---

## Key Folders

- `/agents` — Agent templates and logic
- `/utils` — Shared signal/logging utilities
- `/types` — TypeScript interfaces and definitions
- `/scripts` — Bootstrap and dev scripts
- `/docs` — Architecture, agent guide, specs, and whitepaper

---

## Contributing

We welcome contributions—especially new agents and documentation. See [`docs/contributing.md`](./docs/contributing.md) for guidelines.

---

## License

MIT © Eremos LLC

---

## Links

- **X (Twitter):** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](./docs/whitepaper.pdf)

_Maintained by the Eremos Core team._
