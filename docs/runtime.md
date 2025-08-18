# Runtime

_Operational behavior for orchestrator, agents, and watchers at runtime._

---

## At a Glance

- Scope: Scheduling, concurrency, error handling, and lifecycle management.
- Audience: Engineers running or extending orchestrator/agents.

---

## Orchestrator Responsibilities

- Load and register agents.
- Route normalized events to agents based on interest.
- Provide per-agent memory and metrics.
- Enforce lifecycle hooks and graceful shutdown.

---

## Scheduling & Concurrency

- Agents run in isolated tasks/processes to avoid noisy-neighbor effects.
- Use worker pools for bounded concurrency.
- Apply backpressure on queues when downstream is overloaded.

---

## Error Handling

- Catch and log errors in agent event handlers; increment agent_errors_total.
- Implement retry/backoff for external calls (RPC).
- Isolate agent failures: one agent crash shouldn't stop others.

---

## Graceful Shutdown

- Stop accepting new events.
- Flush in-flight signals and checkpoint memory.
- Shutdown watchers and close DB/Broker connections.

---

## Diagnostics

- Expose /health and /ready endpoints.
- Use structured logs and traces for event→signal paths.

---

## Related Docs

- [Deployment](./deployment.md)
- [Metrics](./metrics.md)
