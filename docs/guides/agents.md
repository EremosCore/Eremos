# Agent Guide

## Agent schema
Every agent should define the following fields:

- `id`: string — stable identifier
- `name`: string — human‑readable name
- `role`: string — functional category (e.g., `surveillance`, `memory_vault`, `indexing`)
- `glyph`: string — symbolic marker used in logs/signals
- `watchType`: string — primary event category the agent observes
- `triggerThreshold`: number — emission sensitivity or cooldown marker
- `lastSignal`: string | null — recent emission metadata
- `originTimestamp`: string — ISO‑8601 creation timestamp
- `description`: string — short purpose statement
- `observe(event)`: function — detection logic
- `getMemory?(): string[]` — optional memory snapshot

Use `/agents/example.ts` as a scaffold.

---

## Agents

### Theron (Agent‑000)
<a id="theron-agent-000"></a>

- **Role**: `memory_vault`
- **Glyph**: `Ϸ`
- **Watch type**: `anomaly_detection`
- **Emitted signals**: `archival` (rare)
- **Confidence inputs**: anomaly category, recurrence, cross‑agent references
- **Throttling**: effectively non‑emitting (very high threshold)
- **Example output**:
```ts
{
  agent: "Theron",
  type: "archival",
  glyph: "Ϸ",
  hash: "sig_...",
  timestamp: "2025-01-01T00:00:00.000Z"
}
```
- **Notes**: First deployed entity of the swarm. Holds fragments via `getMemory()`.

### Observer

- **Role**: `surveillance`
- **Glyph**: `φ`
- **Watch type**: `wallet_activity`
- **Emitted signals**: none by default (logs clustering observations)
- **Confidence inputs**: cluster size, interaction density
- **Throttling**: `triggerThreshold: 3` (log‑oriented)
- **Example dev output**: `Observed cluster: [ ... ]`
- **Notes**: Good starting point for building custom detectors.

### Harvester

- **Role**: `indexing`
- **Glyph**: `λ`
- **Watch type**: `mint_activity`
- **Emitted signals**: none by default (indexes high‑volume mints)
- **Confidence inputs**: mint rate, distribution skew
- **Throttling**: `triggerThreshold: 2`
- **Example dev output**: `Mint spike detected: 42`

### GhostWatcher ("Skiero" — docs alias)

- **Role**: `dormant_wallet_monitor`
- **Glyph**: `ψ`
- **Watch type**: `wallet_activity` (reactivation events)
- **Emitted signals**: `wallet_reactivated` (includes `confidence`)
- **Confidence inputs**: wallet dormancy duration, funding source, first actions
- **Throttling**: moderate; avoids repeat emissions for the same wallet
- **Example output**:
```ts
{
  agent: "Skieró",
  type: "wallet_reactivated",
  glyph: "ψ",
  hash: "sig_...",
  timestamp: "2025-07-03T12:00:00.000Z",
  confidence: 0.78
}
```
- **Notes**: Non‑ASCII name is aliased as "Skiero" in docs for easy copy/paste.

### LaunchTracker (experimental)

- **Role**: `launch_monitor`
- **Glyph**: `Σ`
- **Watch type**: `wallet_activity`
- **Emitted signals**: `launch_detected` (includes `confidence`)
- **Confidence inputs**: CEX‑funded wallet, rapid deploy detection, bundle count
- **Throttling**: tuned to avoid spam during volatile windows
- **Example output**:
```ts
{
  agent: "LaunchTracker",
  type: "launch_detected",
  glyph: "Σ",
  hash: "sig_...",
  timestamp: "2025-06-12T04:41:25Z",
  confidence: 0.91
}
```

---

## Development Tips
- Keep logic scoped and readable
- Use `generateSignalHash()` for all outputs
- Log signals with `logSignal()`
- Use `/scripts/dev-agent.ts` to simulate
