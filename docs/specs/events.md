# Events in Eremos

Events are the unit of observation for Eremos agents. Each event represents a blockchain occurrence (e.g., wallet activity, mint, contract call) ingested by watchers and fed into agent `observe()` functions.

## Canonical schema

```ts
{
  type: string,                 // e.g. "wallet_activity" | "mint_activity" | "contract_call" | "anomaly" | "reactivation"
  address?: string,             // wallet or program id
  cluster?: string | string[],  // linkage identifiers / clusters
  source?: string,              // e.g. "kraken", "coinbase", "rpc", "webhook"
  amount?: number,              // e.g. mint count, transfer amount, etc.
  timestamp: string,            // ISO-8601 (UTC)
  // ... additional fields as needed by agents
}
```

### Canonical event types (non‑exhaustive)
- `wallet_activity` — transfers, bundled interactions, probing behavior
- `mint_activity` — collection or token mint spikes
- `contract_call` — program interactions worth observing
- `anomaly` — irregular patterns, unexpected flows, or heuristics triggers
- `reactivation` — dormant wallet becomes active again

### Provenance
Events can originate from RPC subscriptions, indexers, or webhook integrations. Always include the most relevant `source` when available.

### Timestamp conventions
- Prefer ISO‑8601 UTC strings (e.g., `2025-06-12T04:41:25Z`).
- If numeric epochs are used internally, normalize to ISO strings before signal emission.

## Example
```ts
{
  type: "wallet_activity",
  address: "So1anaUser123",
  cluster: "cluster_04",
  source: "kraken",
  timestamp: "2025-06-12T04:41:12Z"
}
```
