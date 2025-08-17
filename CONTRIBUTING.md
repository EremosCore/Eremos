# Contributing to Eremos

First off – thanks for taking the time to contribute 🙌  
Eremos is designed as a **public good** for the Solana ecosystem, and small improvements go a long way to making it more accessible to future devs, researchers, and swarm builders.  

This bounty is about polishing the repo: better documentation, cleaner structure, and clearer onboarding.

---

## 🛠️ How You Can Contribute

### 1. Fork & Clone
```bash
git clone https://github.com/EremosCore/Eremos.git
cd Eremos
npm install
```

### 2. Create a Branch
```bash
git checkout -b docs/readme-improvement
```

Branch naming:
- `docs/...` → Documentation or README changes
- `chore/...` → Cleanup, structure, or scripts
- `feat/...` → New functionality (e.g. new agent template)

### 3. Make Thoughtful Changes
Examples of good contributions for this bounty:
- **Docs polish**: Add badges, improve README flow, fix formatting
- **Onboarding clarity**: Add missing setup steps, better quickstart examples
- **Repo organization**: Move stray files into `docs/` or `scripts/`, clarify folder roles
- **Tooling cleanup**: Add `.gitignore` entries, Prettier config, or helpful npm scripts

Keep changes small, focused, and useful.

### 4. Test Before Submitting
Run tests to confirm nothing broke:
```bash
npm test
```

### 5. Commit & Push
Follow [Conventional Commits](https://www.conventionalcommits.org/) style:
```
docs(readme): polish quickstart section
chore(repo): move whitepaper.pdf into docs/assets
fix(utils): handle null RPC response
```

Push your branch:
```bash
git push origin docs/readme-improvement
```

### 6. Open a Pull Request
- Clearly explain **what you changed** and **why it matters**
- Keep the PR clean (no unrelated edits)
- Link to screenshots/logs if you improved onboarding UX

---

## 📂 Repo Standards

- `src/agents/` → Agent logic only  
- `src/utils/` → Shared helpers/utilities  
- `tests/` → Unit + integration tests  
- `docs/` → Documentation, architecture, whitepaper, assets  

**Rule of thumb:** Code in `src/`, writing/artifacts in `docs/`.

---

## 💡 Good First Ideas
- Add a **Quickstart** section to README
- Add missing badges (license, last commit, stars)
- Create a **CONTRIBUTING.md** (this file ✅)
- Move whitepaper + images into `docs/assets/`
- Add `docs/env.md` explaining environment variables
- Improve repo scripts (separate `dev/`, `test/`, `generate/`)

---

## 📜 License
By contributing, you agree that your changes are licensed under [MIT](LICENSE).

---

💛 Thanks again for helping polish Eremos. Even small contributions keep the swarm sharp.
