# Signals

_Specification for structured signals emitted by agents._

---

## At a Glance

- Scope: Signal schema, fields, and scoring guidance.
- Audience: Consumers of signals (UI, webhooks, alerting).

---

## Signal Schema

```json
{
  "agent": "theron",
  "type": "launch_detected",
  "glyph": "Δ",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-06-12T04:41:25Z",
  "source": "chain:solana",
  "confidence": 0.91,
  "meta": { "tx": "5gW...pump", "suspect_wallets": ["6Yxk...P2M8"] }
}
```

Fields:
- agent: identifier
- type: semantic signal type
- glyph: visual shorthand (optional)
- hash: signal UUID
- timestamp: ISO 8601
- source: origin (chain / watcher)
- confidence: 0.0–1.0
- meta: free-form typed metadata

---

## Confidence Scoring (guideline)

- CEX-origin funding: +0.2
- Funding→deploy delta small: +0.15
- Wallet linkage density: +0.25
- Metadata validation: +0.1
- Historical pattern match: +0.3

Normalize to 0–1 and document weight sources in agent code.

---

## Delivery & Consumers

- Signal Bus fanout: UI, webhook sinks, persistence.
- Signals should be idempotent and carry enough metadata for downstream filtering.

---

## Best Practices

- Emit signals only when above CONFIDENCE_THRESHOLD or for debug streams.
- Include source provenance and minimal PII (avoid storing full keys).
- Keep signals versioned if schema evolves.

---

## Related Docs

- [Agents](./agents.md)
- [Glyphs](./glyphs.md)
