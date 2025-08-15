# Signal Taxonomy

## Signal Types

- `early_cluster` — Wallets forming suspicious groups
- `stealth_spawn` — Contract created with zero metadata
- `anomaly_delta` — Repeating action across unrelated wallets

## Signal Structure

All signals include:
- **type** - Signal classification
- **timestamp** - Event occurrence time
- **source agent** - Originating agent identifier
- **hashed event ID** - Unique event reference

## Example Signal Format

```json
{
  "agent": "Observer",
  "type": "launch_detected",
  "glyph": "Δ",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-06-12T04:41:25Z",
  "source": "agent-observer",
  "confidence": 0.91
}
```

---

*For more details, see the [main documentation](index.md)*
