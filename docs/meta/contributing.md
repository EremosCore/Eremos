# Contributing to Eremos

We welcome contributions—especially new agents and documentation improvements.

## Overview
- Small, focused PRs are easiest to review.
- Docs‑only PRs are encouraged for clarity, onboarding, and polish.
- Keep original wording where requested; additively enhance structure and navigation.

## Prerequisites
- GitHub account with a fork of the repo
- Node.js 18+ (for running scripts locally, if needed)

## Branching
1. Fork the repo and create a branch from `main`.
2. Use a short, meaningful branch name (e.g., `lore`, `docs-signals`, `agents-harvester-notes`).
3. Keep commits small and descriptive.

## Commit style
- Use concise, imperative commit messages:
  - `docs: expand signals spec examples`
  - `guides: add agent catalog schema`
  - `meta: add roadmap phase checkboxes`
- Prefer multiple small commits over one large commit.

## What to include in your PR
- A clear title and description of what changed and why
- Affected files list (e.g., `README.md`, `docs/specs/signals.md`)
- Screenshots for README visuals (if applicable)
- Link any related issues or discussions

## Submission checklist
- [ ] Markdown headings and tables render correctly on GitHub
- [ ] Code fences have the right language hints (`ts`, `json`, `bash`)
- [ ] Images include alt text and reasonable width
- [ ] Links are relative and valid after any file moves
- [ ] No unrelated reformatting or mixed indentation

## Docs‑only contributions
- Safe areas to improve include:
  - `README.md` (structure, navigation, badges)
  - `docs/README.md` (index), `docs/concepts/*`, `docs/guides/*`, `docs/specs/*`, `docs/meta/*`
  - `.env.example` clarity and comments
- Avoid changing code unless absolutely necessary for documentation accuracy.

## Development helpers
- Explore `/scripts` for dev aids like `dev-agent.ts`, `generate-signal.ts`, and `validate-agent.ts`.

## Code of Conduct & Security
- Be respectful and constructive in discussions and reviews.
- For security concerns, please open a private report or follow the repository’s security policy if provided.

Thank you for contributing to the swarm.
