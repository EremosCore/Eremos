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

# Agents

_A concise guide to agent architecture, lifecycle, and authoring custom agents._

---

## At a Glance

- Scope: How agents run, emit signals, are configured, and are tested.
- Audience: Engineers implementing detection logic or extending the swarm.
- Prereqs: TypeScript, Node.js, and familiarity with the project layout.

---

## Overview

Agents are single-purpose modules that observe normalized chain events, apply heuristics, and emit structured signals. Agents should be small, deterministic, and easy to test.

---

## Core Concepts

### Lifecycle
1. initialize() — load config, metrics, and memory
2. start() — subscribe to event streams
3. handleEvent(event) — process and evaluate rules
4. emitSignal(signal) — publish structured signals
5. shutdown() — cleanup and persist state

### Agent Interface (summary)
- Required: id, initialize, start, handleEvent, shutdown
- Helpers: logger, metrics, memory/cache, config

---

## Authoring a Custom Agent

1. Add `/agents/my-agent.ts`.
2. Implement the Agent interface from `/types/agent.ts`.
3. Use shared helpers: `/utils/signal.ts`, `/utils/logging.ts`, `/utils/blockchain.ts`.
4. Add unit tests under `/tests/`.
5. Register the agent in the orchestrator/bootstrap.

Example skeleton:
```typescript
import { Agent } from '../types/agent';
import { emitSignal } from '../utils/signal';

export class MyAgent extends Agent {
  async initialize() { /* load config */ }
  async handleEvent(event) {
    const signal = { agent: 'MyAgent', type: 'example', confidence: 0.8, timestamp: new Date().toISOString() };
    emitSignal(signal);
  }
}
```

---

## Configuration

Key env/options:
- AGENT_POLL_INTERVAL (ms) — 5000
- CONFIDENCE_THRESHOLD — 0.7
- LOG_LEVEL — info

---

## Best Practices

- Keep agents single-responsibility.
- Favor deterministic heuristics and unit tests.
- Reuse utilities and types.
- Emit compact, typed signals (JSON).

---

## Troubleshooting

- Agent fails to start: run with LOG_LEVEL=debug and check env vars.
- High false positives: increase validation steps and lower thresholds.
- State drift: enable periodic memory checkpoints to Redis.

---

## Related Docs

- [Architecture](./architecture.md)
- [Signals](./signals.md)
- [Runtime](./runtime.md)

---

## Changelog

- 2025-08-18: Standardized doc and example skeleton.

## Agents

### Theron (Agent-000)
- Role: memory_vault  
- Glyph: Ϸ  
- Watches: anomaly_detection  

### Observer
- Role: surveillance  
- Glyph: Δ  
- Watches: wallet_activity  

### Harvester (new)
- Role: indexing  
- Glyph: λ  
- Watches: mint_activity  

//pending adjustments + adding more agents ^
