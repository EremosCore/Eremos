# Signals

Structured signals are the primary outputs of Eremos agents. They are sparse, intentional, and designed for logging, routing to webhooks, or downstream automations.

## Canonical schema

```ts
// All fields are required unless marked optional
{
  agent: string,               // e.g. "LaunchTracker"
  type: string,                // e.g. "launch_detected" | "archival" | "wallet_reactivated" | "template_log"
  glyph: string,               // e.g. "Σ", "Ϸ", "ψ", "x"
  hash: string,                // e.g. "sig_c7f9a3d2bc" (see hashing)
  timestamp: string,           // ISO-8601 (UTC)
  confidence?: number,         // 0..1 (optional, when agent computes a score)
  details?: Record<string, any>// optional contextual payload
}
```

### Hashing
`hash` is generated from the source event and wall‑clock time using `utils/signal.ts::generateSignalHash(event)`. It is a short, base64‑derived identifier prefixed with `sig_`.

### Types (non‑exhaustive)
- `launch_detected` — emitted when a high‑confidence launch pattern is observed
- `archival` — emitted for memory/archive‑class events
- `wallet_reactivated` — dormant wallet observed active again
- `template_log` — example/template signals

## Examples

Launch detection:
```json
{
  "agent": "LaunchTracker",
  "type": "launch_detected",
  "glyph": "Σ",
  "hash": "sig_ab12cd34ef",
  "timestamp": "2025-06-12T04:41:25Z",
  "confidence": 0.91,
  "details": {
    "source": "kraken",
    "bundleCount": 5,
    "deployLatencySeconds": 13
  }
}
```

Archival (Theron):
```json
{
  "agent": "Theron",
  "type": "archival",
  "glyph": "Ϸ",
  "hash": "sig_998877aa00",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

Dormant wallet reactivation:
```json
{
  "agent": "Skieró",
  "type": "wallet_reactivated",
  "glyph": "ψ",
  "hash": "sig_ff00ee11dd",
  "timestamp": "2025-07-03T12:00:00Z",
  "confidence": 0.78,
  "details": {
    "walletAgeDays": 245
  }
}
```

## Throttling & metrics

- Agents can implement cooldowns and minimum thresholds using `utils/throttle.ts` and `triggerThreshold`.
- Metrics (e.g., invocation counts) can be tracked to monitor agent chatter and performance. See `docs/metrics.md`.

## Best practices
- Keep `details` compact and interpretable.
- Include `confidence` only when the score is meaningful.
- Avoid emitting multiple signals for the same underlying event unless necessary.
