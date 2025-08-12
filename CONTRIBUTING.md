# Contributing to Eremos

Thanks for your interest in contributing. Eremos is an open-source, modular framework for deploying autonomous "swarm agents" that monitor on-chain activity on Solana. We welcome improvements of all sizes: docs, examples, agent logic, utilities, and developer experience.

## Quick Start

1. Fork the repository to your own GitHub account.
2. Clone your fork locally and create a branch:
   - `git checkout -b feat/your-descriptive-branch`
3. Install dependencies and run the dev flow:
   - `npm install`
   - `npm run dev`
4. Make your changes and push your branch to your fork.
5. Open a Pull Request back to the upstream repo.

## Ways to Contribute

- Documentation: clarify onboarding, improve formatting, add diagrams, fix typos.
- New agents or agent enhancements: add logic, heuristics, or utilities under `agents/`.
- Scripts and DX: improve developer tooling in `scripts/`, add helpful npm scripts.
- Tests: add or improve tests in `tests/` for agents and utilities.
- Repo organization: clearer structure, better README sections, badges.

If you're participating in a bounty, small and thoughtful improvements are encouraged.

## Project Structure

- `agents/` — Agent implementations and examples.
- `utils/` — Shared utilities for signals, metrics, lifecycle, throttle, etc.
- `types/` — TypeScript interfaces for agents, events, config, and signals.
- `scripts/` — Developer scripts for generating agents/signals and running simulations.
- `docs/` — Architecture and conceptual documentation.
- `tests/` — Unit and behavior tests covering core utilities and agents.

## Development Workflow

1. Choose a scope (docs, agent, util, script).
2. Create a feature branch: `git checkout -b feat/add-theron-helper`.
3. Make small, focused commits:
   - Prefer Conventional Commits for readability: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
4. Run relevant scripts locally (see below) and ensure changes pass type checks/tests if applicable.
5. Open a PR with a clear title and description.

### Helpful Scripts

The `scripts/` directory contains utilities you can run with `ts-node` or your preferred runner:

- `scripts/dev-agent.ts` — Run or simulate a local agent loop during development.
- `scripts/generate-agent.ts` — Scaffold a new agent from a template.
- `scripts/validate-agent.ts` — Validate agent structure/shape.
- `scripts/generate-signal.ts` — Create a new signal template.
- `scripts/simulate-cluster.ts` — Simulate multiple agents.

Note: Some scripts assume a TypeScript runtime. If you prefer, transpile first or use a local ts runner.

## Coding Guidelines

- TypeScript strict mode is enabled. Keep types clear and explicit for public APIs.
- Prefer descriptive names over abbreviations. Avoid single-letter variables.
- Use early returns and keep control flow shallow.
- Handle edge cases and avoid catching errors without meaningful handling.
- Match existing formatting; avoid unrelated refactors in the same PR.

## Adding a New Agent

1. Use `scripts/generate-agent.ts` to scaffold, or copy `agents/example.ts`.
2. Implement your agent logic with clear, modular functions.
3. Emit signals using utilities from `utils/signal.ts` and follow the types in `types/`.
4. Add tests (see `tests/`) to validate behavior or scoring if applicable.
5. Document any new configuration or environment variables in the README or `docs/`.

## Documentation Contributions

- Keep language concise and actionable.
- Use headings and lists for skimmability.
- Link to relevant files like `agents/observer.ts` or `utils/metrics.ts` when useful.
- Add diagrams or examples when they clarify complex flows.

## Pull Request Guidelines

- Scope: keep PRs focused and small when possible.
- Description: include what changed, why, and how to test.
- Checklists: confirm docs/tests/typing are updated as relevant.
- Screenshots or logs: include when helpful (especially for DX or formatting changes).

## Issue Labels (suggested)

- good first issue — Small, well-scoped tasks for newcomers.
- docs — Documentation-only changes.
- agents — Agent logic or templates.
- utils — Shared utilities and helpers.
- dx — Developer experience and tooling.

## Community and Support

- X/Twitter: `@EremosCore`
- Website: `https://www.eremos.io/`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


