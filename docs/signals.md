# Signals

---

## Overview

Signals are structured outputs emitted by agents when they detect relevant patterns or anomalies in blockchain activity.

---

## Signal Structure

```typescript
{
  agent: string;        // Agent identifier
  type: string;         // Signal type
  glyph: string;        // Visual symbol
  hash: string;         // Unique identifier
  timestamp: string;    // ISO timestamp
  source: string;       // Source agent
  confidence: number;   // 0-1 confidence score
}
```

---

## Signal Types

- **`launch_detected`** - New token or contract deployment
- **`funding_detected`** - Fresh wallet funding
- **`anomaly_detected`** - Unusual activity patterns
- **`bundle_detected`** - Multi-wallet coordination

---

## Confidence Scoring

Signals include confidence scores (0-1) based on:
- **Source reliability** (CEX vs unknown)
- **Timing patterns** (funding → deploy speed)
- **Wallet linkage** (bundled activity density)
- **Metadata validation** (token contract analysis)

---

*For implementation details, see the [Agent Guide](agents.md).*
