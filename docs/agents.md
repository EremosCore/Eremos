# Agent Guide

## Base Requirements

Each agent must include:

- `observe(event)` — detection logic
- `getMemory()` — memory snapshot
- `description`, `watchType`, `glyph`, and `triggerThreshold`

Use `/agents/example.ts` as a scaffold.

## Development Tips

- Keep logic scoped and clean
- Use `generateSignalHash()` for all outputs
- Log using the shared `logSignal()` util

You can test agents using `/scripts/dev-agent.ts` or create your own mock.

## Agents

| Agent Name         | Role         | Glyph | Watches           | Description                                         |
| ------------------ | ------------ | ----- | ----------------- | --------------------------------------------------- |
| Theron (Agent-000) | memory_vault | Ϸ     | anomaly_detection | Detects unusual spikes and anomalies in memory data |
| Observer           | surveillance | Δ     | wallet_activity   | Tracks wallet transactions and suspicious patterns  |
| Harvester _(new)_  | indexing     | λ     | mint_activity     | Indexes and records new mint events for analytics   |

//pending adjustments + adding more agents ^
