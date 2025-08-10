# 🗿 Eremos

![Eremos Banner](https://github.com/EremosCore/Eremos/raw/main/docs/banner2.png)

<p align="center">
  <a href="https://github.com/EremosCore/Eremos/stargazers">
    <img src="https://img.shields.io/github/stars/EremosCore/Eremos?style=for-the-badge&color=gold" alt="Stars Badge"/>
  </a>
  <a href="https://github.com/EremosCore/Eremos/network/members">
    <img src="https://img.shields.io/github/forks/EremosCore/Eremos?style=for-the-badge&color=orange" alt="Forks Badge"/>
  </a>
  <a href="https://github.com/EremosCore/Eremos/issues">
    <img src="https://img.shields.io/github/issues/EremosCore/Eremos?style=for-the-badge&color=red" alt="Issues Badge"/>
  </a>
  <a href="https://github.com/EremosCore/Eremos/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/EremosCore/Eremos?style=for-the-badge&color=blue" alt="License Badge"/>
  </a>
</p>

---

## 📜 What is Eremos?

**Eremos** is a **modular framework** for deploying autonomous “swarm agents” that monitor **on-chain activity** across the **Solana ecosystem**.  
These agents run independently, observing funding flows, bundling behavior, deploy patterns, and more — **surfacing early signals before they’re obvious**.

Built as a **public good**, Eremos aims to enhance transparency and insight across Solana. It is **fully open-source**, **easily extendable**, and designed to **plug into developer or analyst workflows**.

🔗 **Learn more:** [GitHub](https://github.com/EremosCore/Eremos) | [Twitter](https://x.com/EremosCore) | [Website](https://www.eremos.io)

---

<p align="center">
  <img src="https://github.com/EremosCore/Eremos/raw/main/docs/therontphd2.png" alt="Agent Theron" width="155"/><br/>
  <em>Theron - Agent (000)</em>
</p>

**Meet Theron - Agent-000**  
*The first deployed agent in the swarm. Passive. Pattern-sensitive.  
Modular and extendable by design.*

🆕 **Agent-001 Coming Soon:** [Teaser](https://x.com/EremosCore/status/1949154939923833239)

---

## ✨ Features

- **🧩 Modular Agents** – Scoped logic for detecting wallet activity, contract spawns, and anomalies  
- **📡 Signal Emission** – Structured signals for logging, alerting, or downstream use  
- **🐝 Swarm Design** – Each agent operates independently with shared utilities  
- **🔌 Extensible Core** – Plug in watchers, inference layers, or custom triggers  
- **📉 Minimal Output** – Log only what matters  
- **🚀 Launch Wallet Detection** – Trace freshly funded wallets (e.g., from CEXs), track their contract interactions, and flag high-confidence deploys in real-time  
- **👻 Ghost Watcher** – Detects long-dormant wallets that suddenly become active again (useful for tracing old dev wallets or rug setups)  

---

## 📊 Example Signal

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
````

---

## 🎯 Signal Confidence

Each emitted signal includes a **confidence score** (0-1) based on behavioral heuristics:

* 🏦 CEX-origin funding (e.g., Kraken, Coinbase)
* ⏳ Time between funding → deploy
* 🔗 Wallet linkage density (bundled activity)
* 📝 Token metadata validation

Confidence is computed via agent-side scoring and logged alongside the signal.

---

## 🛠 Tech Stack

* **Frontend:** Next.js, Tailwind CSS
* **Backend:** Node.js (TypeScript-based agent runner)
* **Language:** TypeScript (typed logic across agents, utils, and infra)
* **Chain Layer:** RPC watchers, mempool filters, native triggers

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run the project in development mode
npm run dev
```

---

## 📂 Key Folders

* `/agents` – Agent templates + logic
* `/utils` – Shared signal/logging utilities
* `/types` – TypeScript interfaces + definitions
* `/scripts` – Bootstrap and dev scripts
* `/docs` – Swarm structure, architecture, & artwork

---

## 🤝 Contributing

We’re open to contributors! To participate in the bounty:

1. ⭐ Star and 👀 Watch the [Eremos repo](https://github.com/EremosCore/Eremos)
2. 🍴 Fork the repo and make your visual or structural improvements (README, docs, tooling, repo organization, badges)
3. 📬 Open a clean, descriptive Pull Request
4. 🔗 Submit your PR link on Superteam Earn (max 1 submission)

*Bonus:* A GitHub profile with a strong contribution history will increase your chances!

If you are experienced in TypeScript and agent systems, check `example.ts` to build your own observer.
If you're a designer or artist with ideas fitting the Eremos mythos, reach out on Twitter: [@EremosCore](https://x.com/EremosCore).

---

## 📜 License

MIT © Eremos LLC

---

## 🔗 Useful Links

* 🐦 **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
* 🌐 **Website:** [https://www.eremos.io/](https://www.eremos.io/)
* 📄 **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

---

*Maintained by the Eremos Core team 💛*

```

---

If you want, I can also help you add some **animated badges or GitHub Action status** badges as a bonus! Just ask.
```
