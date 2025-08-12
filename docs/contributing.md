# Contributing to Eremos

Thanks for your interest in improving Eremos! 💛

## We welcome:
- **Signal logic** improvements
- **New agents** with unique detection patterns
- **Utility extensions** for swarm functionality
- **Docs & tooling enhancements** to make Eremos better for everyone

---

## Getting Started

### 1. Fork & Clone

1. Click **Fork** on the [Eremos GitHub repo](https://github.com/EremosCore/Eremos).
2. Clone your fork:
```bash
    git clone https://github.com/YOUR_USERNAME/Eremos.git
    
    cd Eremos
```

3. Install Dependencies
```bash
    npm install
```

4. Set Up Environment
Copy the example environment file:

```bash
    cp .env.example .env.local
```
Fill in any required values for your setup.

5. Run in Dev Mode
Start the development runner:

```bash
    npm run dev
```

### Working on Agents
    All agents live in /agents.

    Use /scripts/dev-agent.ts to simulate and debug your agent locally.

Keep each agent modular and self-contained.

    Push clean commits — avoid unnecessary bloat.

### 🧪 Testing & Linting
    Before opening a PR:

```bash
    npm run lint
    npm run test   # if applicable
```

### 📌 Submitting a Pull Request
    Create a new branch:

```bash
    git checkout -b feature/your-feature-name
```
   
    Make your changes.
Commit clearly:

```bash
    git commit -m "feat: add Agent-002 wallet anomaly detector"
```

Push your branch:
```bash
    git push origin feature/your-feature-name
```

Open a PR to the main branch of the original repo.


## ⚡ Quick Start (for New Contributors)
```bash
    git clone https://github.com/EremosCore/Eremos
    cd Eremos
    npm install
    cp .env.example .env.local
    npm run dev
```

### 🤝 Code of Conduct
    
    By contributing, you agree to follow our future Code of Conduct.

    Maintained by the Eremos Core team 🗿