# 🌌 Eremos

![GitHub Repo stars](https://img.shields.io/github/stars/EremosCore/Eremos?style=social)
![GitHub forks](https://img.shields.io/github/forks/EremosCore/Eremos?style=social)
![License](https://img.shields.io/github/license/EremosCore/Eremos)
![Issues](https://img.shields.io/github/issues/EremosCore/Eremos)
![Pull Requests](https://img.shields.io/github/issues-pr/EremosCore/Eremos)

Eremos is an **open framework for agent-based systems** on Solana and beyond.  
It provides modular pieces for researchers, swarm builders, and developers to create and experiment with autonomous agents that watch on-chain activity and emit useful signals.

---

## 🚀 Features
- **TypeScript-first** — strongly typed logic across agents, utils, and infra  
- **Agent templates** — observers, triggers, responders you can extend  
- **Swarm-ready** — coordinate multiple agents in parallel  
- **Developer-friendly** — clear structure, onboarding, and scripts

---

## 📦 Getting Started

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

## 📂 Project Structure

- `/agents` — Agent templates + logic  
- `/utils` — Shared signal/logging utilities  
- `/types` — TypeScript interfaces + definitions  
- `/scripts` — Bootstrap and dev scripts  
- `/docs` — Swarm structure, architecture, & whitepaper/artwork

---

## 🧪 Example (observer stub)

```ts
// example.ts
import { Observer } from "./agents/example";

const obs = new Observer();
obs.listen("mempool:tx", (tx) => {
  console.log("Observed transaction:", tx);
});
```

---

## 🤝 Contributing

We welcome contributions!

1) ⭐ Star & Watch this repo  
2) Fork the repo  
3) Improve docs/formatting/onboarding, or add helpful tooling  
4) Open a clean Pull Request

Designers/artists/storytellers who align with the mythos are welcome too — say hi on X.

---

## 📎 Links

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Website:** [Eremos.io](https://www.eremos.io/)
- **Whitepaper:** [v1.0 PDF](docs/whitepaper.pdf)

---

## 📜 License
MIT © Eremos LLC  
Maintained with 💛 by the Eremos Core team.
