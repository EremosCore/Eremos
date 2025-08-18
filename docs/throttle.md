# Throttle

_Throttling and rate-limiting policies to protect stability._

---

## At a Glance

- Scope: Rate-limiting for watchers, agents, and signal sinks.
- Audience: Infra engineers and agent authors.

---

## Why Throttle

- Prevent cascading overloads during chain spikes.
- Protect downstream sinks and databases.
- Ensure fair resource usage across agents.

---

## Policies

- Input throttling: shard watchers and apply per-subscription rate limits.
- Agent-level backpressure: limit events in-flight per agent.
- Output throttling: buffer and batch writes to persistence and webhooks.

---

## Implementation Patterns

- Token-bucket or leaky-bucket for per-source limits.
- Queue with max size + retry/backoff for transient failures.
- Circuit-breaker for persistent downstream errors.

---

## Config Examples

- MAX_IN_FLIGHT_PER_AGENT=50
- SIGNAL_BATCH_SIZE=100
- WATCHER_RATE_LIMIT=500req/s

---

## Troubleshooting

- Frequent throttling: increase worker pool or reduce processing per event.
- Throttling loops: add exponential backoff and increase observability.

---

## Related Docs

- [Runtime](./runtime.md)
- [Architecture](./architecture.md)
