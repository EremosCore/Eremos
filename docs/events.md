# Events

_Definition of normalized events produced by Chain Watchers and consumed by agents._

---

## At a Glance

- Scope: Event shapes, fields, and routing.
- Audience: Agent authors and integrators.
- Prereqs: Basic understanding of transactions and accounts.

---

## Event Shape (example)

```json
{
  "type": "transaction",
  "source": "solana-rpc",
  "slot": 12345678,
  "timestamp": "2025-08-18T12:34:56Z",
  "tx": { /* normalized transaction payload */ },
  "meta": { /* derived metadata */ }
}
```

---

## Common Event Types

- transaction — normalized tx + instructions
- account_update — account state change
- signature_status — signature confirmation updates
- mempool_observed — unconfirmed txs (if supported)

---

## Event Routing

- Watchers produce normalized events to the orchestrator.
- Orchestrator filters and dispatches events to only interested agents.
- Events carry minimal, canonical fields to avoid per-agent parsing logic.

---

## Best Practices

- Keep events small and canonical.
- Attach derived metadata (e.g., token_mint, program_id) to ease agent logic.
- Use consistent timestamping (ISO 8601).

---

## Troubleshooting

- Missing fields: ensure watcher adapters fill required normalizations.
- High volume: use sampling or early filters at watcher level.

---

## Related Docs

- [Agents](./agents.md)
- [Signals](./signals.md)
