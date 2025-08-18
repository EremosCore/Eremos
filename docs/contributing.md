# Contributing to Eremos

_Procedures and expectations for contributors: agents, infra, docs, and UI._

---

## At a Glance

- Scope: How to contribute, test, and submit PRs.
- Audience: Developers, designers, and technical writers.
- Prereqs: Git, Node.js, basic TypeScript knowledge.

---

## How to Contribute

1. Star the repo.
2. Fork and create a feature branch.
3. Implement changes and keep commits focused.
4. Add or update tests for code changes.
5. Submit a PR with a clear description and testing notes.

---

## Contributing Areas

- Agents: `/agents/` — detection logic and tests (`/tests/`).
- Docs: `/docs/` — improve clarity and add examples.
- Frontend: `/src/` — UI improvements and metrics dashboards.
- Infra: `/scripts/`, deployment configs, and CI.

---

## Local Development & Testing

- Start dev site: npm install && npm run dev
- Run tests: npm test
- Format & lint: npm run lint

Use `scripts/dev-agent.ts` to simulate events when authoring agents.

---

## Guidelines & Standards

- Follow existing code style and lint rules.
- Write unit tests for all new heuristics.
- Keep PRs small and scoped; include repro steps.
- Be respectful and responsive in review discussions.

---

## Need Help?

- Search open issues and existing PRs.
- Open an issue if your change is large or needs design input.

---

## Related Docs

- [README](../README.md)
- [Agents](./agents.md)
- [Architecture](./architecture.md)

---

## Changelog

- 2025-08-18: Expanded contributor workflow and testing notes