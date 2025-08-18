# Memory

_Design and usage of per-agent memory and caching._

---

## At a Glance

- Scope: Short-term and persistent memory strategies.
- Audience: Agent authors and operators.
- Prereqs: Redis basics (optional).

---

## Memory Types

- In-process cache — LRU or small maps for ephemeral state.
- Redis — shared, short-term state across processes.
- Persistent DB — Postgres/Timescale for long-term artifacts and history.

---

## Recommended Patterns

- Keep memory minimal; store only what’s needed for heuristics (e.g., recent tx hashes, wallet clustering).
- Use TTLs for ephemeral entries.
- Checkpoint important state periodically to Redis/Postgres.

---

## Example (pseudo)

```ts
// memory usage pattern
const recentTxs = memory.get('recentTxs') ?? new Map();
recentTxs.set(txHash, Date.now());
memory.set('recentTxs', recentTxs, { ttl: 600_000 });
```

---

## Failure & Recovery

- On restart, rehydrate necessary state from Redis or DB.
- Accept eventual consistency for non-critical memory.

---

## Related Docs

- [Agents](./agents.md)
- [Architecture](./architecture.md)
