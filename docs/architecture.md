# Architecture

_A concise overview of Eremos system architecture, major components, data flows, and extension points._

---

## At a Glance

- Scope: Describe runtime components, how agents interact with chain data, and how signals propagate to consumers.
- Audience: Engineers extending agents, infra operators, and integrators.
- Prereqs: Familiarity with TypeScript, Node.js, RPC/WebSocket concepts, and basic deployment (Docker/K8s).

---

## High-level diagram

```
            +----------------------+        +--------------+
            |  Solana / RPC Nodes  | <----> |  Mempool /   |
            |  (RPC, WebSocket)    |        |  Transaction |
            +----------------------+        |  Sources     |
                     ^  ^                    +--------------+
                     |  |
            +--------+  +--------+
            |   Chain Watcher(s)   |  <-- transforms raw events into normalized events
            +----------------------+
                      |
                      v
            +-----------------------+
            |   Agent Orchestrator  |  <-- loads, schedules, and isolates agents
            |   - Agent registry    |
            |   - Scheduler         |
            |   - Memory / Cache    |
            +-----------------------+
                      |
                      v
            +-----------------------+       +-----------------+
            |       Agents          | <---- |  Shared utils   |
            |  (theron, observer…)  |       | (logging, types)|
            +-----------------------+       +-----------------+
                      |
                      v
            +-----------------------+
            |  Signal Bus / Broker  | -> downstream consumers (web UI, webhooks, alerting)
            +-----------------------+
                      |
                      v
        +-------------+-------------+
        | Frontend (Next.js) / API  |
        | Storage (DB / Blob / S3)  |
        | Metrics / Tracing / Logs  |
        +---------------------------+
```

---

## Core Components

- Chain Watchers
  - RPC and WebSocket listeners + optional mempool/proxy integrations.
  - Normalize raw transactions, signatures, and blocks into event objects.

- Agent Orchestrator
  - Loads agents, enforces lifecycle (initialize, start, handleEvent, shutdown).
  - Provides per-agent memory, configuration, and metrics registration.

- Agents
  - Single-purpose units implementing heuristics and detection rules.
  - Emit structured signals using the shared signal contract.

- Signal Bus
  - Lightweight pub/sub (in-process emitter, Redis, or Kafka depending on scale).
  - Delivers signals to persistence, UI, webhook sinks, and alerting.

- Utilities & Shared Types
  - Shared logging, metrics (Prometheus), signal typings, confidence scoring helpers.

- Storage & Persistence
  - Short-term memory: in-process cache (LRU) or Redis.
  - Long-term: Postgres / Timescale / object storage for artifacts.

- Observability
  - Metrics: latency, signal counts, false positive rates.
  - Tracing: distributed traces for event → signal paths.
  - Logs: structured JSON for easier parsing.

---

## Data / Signal Flow (step-by-step)

1. Chain Watcher detects new tx or account activity via RPC/WebSocket.
2. Watcher normalizes event and forwards to orchestrator.
3. Orchestrator routes event to relevant agents (filtering by interest).
4. Agent evaluates heuristics, consults memory/cache, and computes a confidence score.
5. On threshold pass, agent emits a signal object to Signal Bus.
6. Signal Bus fans out to: frontend API, persistent store, alerting webhooks, and metrics.

Sample signal payload:
```json
{
  "agent": "theron",
  "type": "launch_detected",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-06-12T04:41:25Z",
  "source": "chain:solana",
  "confidence": 0.91,
  "meta": { "tx": "5gW...pump", "suspect_wallets": ["6Yxk...P2M8"] }
}
```

---

## Deployment & Scaling

- Local / Dev: single-process Node, in-process signal bus, .env config.
- Production:
  - Containerize agents and orchestrator (Docker). Use K8s for horizontal scaling.
  - Use Redis or Kafka for Signal Bus at scale.
  - Use a managed Postgres or Timescale for historical signals.
  - Autoscale watchers and agents independently based on queue length / lag.

Scaling notes:
- Make chain watchers stateless; shard by account ranges or subscription topics.
- Keep agent instances idempotent and able to rehydrate memory from Redis/DB.
- Use rate-limits and backpressure on Signal Bus to avoid cascades.

---

## Failure Modes & Resilience

- RPC outages: fallback to alternative RPC providers and exponential backoff.
- High throughput bursts: enqueue normalized events and autoscale agents.
- State loss: persist critical memory checkpoints to Redis/Postgres at intervals.
- False positives: add confidence throttles and human-in-the-loop validation.

---

## Security & Hardening

- Protect RPC keys and WebSocket endpoints in vaults / environment secrets.
- Validate and sanitize all external inputs (transaction metadata).
- Run agents with least privileges; isolate runtimes per tenancy if multi-tenant.
- Audit logging for signal emissions and config changes.

---

## Extension Points

- Add new Chain Watcher adapters (Ethereum, Base) by implementing watcher interface.
- Swap Signal Bus implementation (in-process -> Redis -> Kafka) through a single broker adapter.
- Author custom agents in /agents using the Agent interface and shared utils.

---

## Operational Recommendations

- Enable LOG_LEVEL=debug for short debugging windows only.
- Instrument agents with Prometheus counters: processed_events_total, signals_emitted_total, avg_confidence.
- Use alerting rules for high error rates or signal surges.

Example env snippet:
```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WEBSOCKET_URL=wss://api.mainnet-beta.solana.com
AGENT_POLL_INTERVAL=5000
CONFIDENCE_THRESHOLD=0.7
```

---

## Related Docs

- [Agents](./agents.md)
- [Signals](./signals.md)
- [Runtime](./runtime.md)
- [Deployment](./deployment.md)
- [Metrics](./metrics.md)

---

## Changelog

- 2025-08-18: Consolidated architecture, added diagram, failure modes, and operational guidance.
