# 📡 Signal Taxonomy

<div align="center">

**Comprehensive guide to Eremos signal types, structures, and processing**

[![Signals](https://img.shields.io/badge/Signal-Classification-orange?style=flat)](https://github.com/EremosCore/Eremos)
[![Real-time](https://img.shields.io/badge/Processing-Real--time-green?style=flat)](https://github.com/EremosCore/Eremos)

</div>

## ∴ Table of Contents

- [◉ Signal Overview](#-signal-overview)
- [⬢ Signal Structure](#-signal-structure)
- [∷ Signal Categories](#-signal-categories)
- [⟿ Detection Patterns](#-detection-patterns)
- [∆ Confidence Scoring](#-confidence-scoring)
- [⚡ Emission Patterns](#-emission-patterns)
- [∘ Testing Signals](#-testing-signals)

## ◉ Signal Overview

Signals are the primary output of the Eremos agent swarm - structured data packets that indicate detected patterns in blockchain activity. Each signal represents a **high-confidence detection** worthy of attention or action.

### Signal Philosophy
- **Quality over Quantity**: Only emit when confidence thresholds are met
- **Structured Format**: Consistent schema for downstream processing
- **Contextual Information**: Include relevant detection context
- **Deterministic Hashing**: Unique identifiers for deduplication

## ⬢ Signal Structure

### Standard Signal Format

Every signal emitted by any agent follows this standardized structure:

```typescript
interface Signal {
  agent: string                 // Source agent name
  type: string                  // Signal classification
  glyph: string                 // Agent visual identifier  
  hash: string                  // Unique signal hash (sig_xxxxxxx)
  timestamp: string             // ISO 8601 timestamp
  confidence?: number           // Detection confidence (0-1)
  details?: Record<string, any> // Additional context
  source?: string               // Data source identifier
}
```

### Signal Hash Generation

All signals include a deterministic hash generated from the source event:

```typescript
// Hash generation example
const event = {
  type: "wallet_activity",
  address: "7Yk...P2M8",
  timestamp: "2025-01-15T04:41:12Z"
};

const hash = generateSignalHash(event);
// Result: "sig_c7f9a3d2bc"
```

### Example Signal

```json
{
  "agent": "LaunchTracker",
  "type": "launch_detected",
  "glyph": "Σ",
  "hash": "sig_c7f9a3d2bc",
  "timestamp": "2025-01-15T04:41:25Z",
  "confidence": 0.91,
  "source": "agent-launch",
  "details": {
    "funding_source": "kraken",
    "wallet": "7Yk...P2M8",
    "deploy_time_seconds": 13,
    "bundle_count": 5,
    "token_address": "pump_5gW...abc"
  }
}
```

## ∷ Signal Categories

### Primary Signal Types

<table>
<tr>
<th>Signal Type</th>
<th>Source Agents</th>
<th>Description</th>
<th>Confidence Range</th>
<th>Frequency</th>
</tr>
<tr>
<td><code>launch_detected</code></td>
<td>LaunchTracker</td>
<td>New token deployment with CEX funding patterns</td>
<td>0.80-0.95</td>
<td>Medium</td>
</tr>
<tr>
<td><code>wallet_reactivated</code></td>
<td>Skieró (Ghost Watcher)</td>
<td>Long-dormant wallet (180+ days) becomes active</td>
<td>0.70-0.90</td>
<td>Low</td>
</tr>
<tr>
<td><code>cluster_formation</code></td>
<td>Observer</td>
<td>Coordinated wallet activity patterns</td>
<td>0.60-0.80</td>
<td>Medium</td>
</tr>
<tr>
<td><code>mint_spike</code></td>
<td>Harvester</td>
<td>Unusual minting volume or patterns</td>
<td>0.50-0.75</td>
<td>High</td>
</tr>
<tr>
<td><code>anomaly_delta</code></td>
<td>Multiple</td>
<td>Cross-wallet anomalous behavior</td>
<td>0.55-0.70</td>
<td>Variable</td>
</tr>
<tr>
<td><code>archival</code></td>
<td>Theron</td>
<td>Pattern storage (no confidence scoring)</td>
<td>N/A</td>
<td>Continuous</td>
</tr>
</table>

### Secondary Signal Types

| Signal Type | Description | Use Case |
|-------------|-------------|----------|
| `stealth_spawn` | Contract with minimal/zero metadata | MEV detection |
| `bundle_coordination` | Synchronized wallet interactions | Bot detection |
| `funding_pattern` | Unusual funding flows | Risk assessment |
| `metadata_anomaly` | Inconsistent token metadata | Scam detection |
| `volume_surge` | Sudden trading volume spikes | Market manipulation |
| `cross_chain_bridge` | Bridge activity patterns | Liquidity tracking |

## ⟿ Detection Patterns

### Launch Detection Patterns

**LaunchTracker** looks for this sequence:

1. **CEX Funding**: Fresh funding from known exchanges (Kraken, Coinbase, etc.)
2. **Contract Interaction**: Rapid interaction with deployment contracts
3. **Token Creation**: New token deployment within minutes
4. **Bundle Activity**: Coordinated wallet interactions
5. **Confidence Calculation**: Based on timing, funding source, and coordination

```typescript
// Launch detection logic example
if (
  event.source === "kraken" &&
  event.fundingDetected &&
  event.deployDetected &&
  event.bundleCount >= 3 &&
  event.deployTime < 300 // 5 minutes
) {
  const confidence = calculateLaunchConfidence(event);
  // confidence = 0.91
}
```

### Ghost Detection Patterns

**Skieró** monitors for wallet reactivation:

1. **Dormancy Period**: Wallet inactive for 180+ days
2. **Reactivation Event**: Sudden transaction activity
3. **Pattern Analysis**: Transaction type and volume
4. **Historical Context**: Previous wallet behavior

```typescript
// Ghost detection logic
if (
  event.type === "reactivation" &&
  event.walletAgeDays > 180 &&
  event.previousActivity === "dev_wallet"
) {
  const confidence = 0.78;
  // High value due to rarity
}
```

### Cluster Detection Patterns

**Observer** identifies coordinated behavior:

1. **Timing Correlation**: Actions within narrow time windows
2. **Address Similarity**: Pattern matching in wallet addresses
3. **Transaction Patterns**: Similar transaction structures
4. **Volume Coordination**: Synchronized volume patterns

## ∆ Confidence Scoring

### Confidence Ranges

| Range | Classification | Description | Action |
|-------|---------------|-------------|---------|
| **0.90-1.00** | Extremely High | Rare, exceptional patterns | Immediate alert |
| **0.70-0.89** | High | Typical emission threshold | Signal emission |
| **0.50-0.69** | Medium | Monitoring level | Logging only |
| **0.30-0.49** | Low | Noise level | Debug logging |
| **0.00-0.29** | Very Low | Background activity | Silent |

### Confidence Factors

Different signal types use different confidence calculations:

#### Launch Detection Confidence
```typescript
function calculateLaunchConfidence(event: Event): number {
  let confidence = 0.0;
  
  // CEX funding source (+0.3)
  if (event.source === "kraken" || event.source === "coinbase") {
    confidence += 0.3;
  }
  
  // Deploy timing (+0.2 for <5min, +0.1 for <15min)
  if (event.deployTime < 300) confidence += 0.2;
  else if (event.deployTime < 900) confidence += 0.1;
  
  // Bundle coordination (+0.1 per coordinated wallet, max +0.4)
  confidence += Math.min(event.bundleCount * 0.1, 0.4);
  
  // Metadata quality (+0.1 for complete metadata)
  if (event.hasMetadata) confidence += 0.1;
  
  return Math.min(confidence, 1.0);
}
```

#### Ghost Reactivation Confidence
```typescript
function calculateGhostConfidence(event: Event): number {
  let confidence = 0.5; // Base for any reactivation
  
  // Dormancy period bonus
  if (event.walletAgeDays > 365) confidence += 0.2;
  if (event.walletAgeDays > 180) confidence += 0.1;
  
  // Historical context
  if (event.previousRole === "dev_wallet") confidence += 0.15;
  if (event.previousRole === "team_wallet") confidence += 0.10;
  
  // Activity pattern
  if (event.highValueTransaction) confidence += 0.05;
  
  return Math.min(confidence, 0.9);
}
```

## ⚡ Emission Patterns

### Emission Frequency by Agent

<table>
<tr>
<th>Agent</th>
<th>Typical Frequency</th>
<th>Peak Frequency</th>
<th>Throttling</th>
</tr>
<tr>
<td><strong>LaunchTracker</strong></td>
<td>2-5 per hour</td>
<td>20 per hour</td>
<td>30s cooldown</td>
</tr>
<tr>
<td><strong>Skieró</strong></td>
<td>1-3 per day</td>
<td>10 per day</td>
<td>1h cooldown</td>
</tr>
<tr>
<td><strong>Observer</strong></td>
<td>5-15 per hour</td>
<td>50 per hour</td>
<td>10s cooldown</td>
</tr>
<tr>
<td><strong>Harvester</strong></td>
<td>10-30 per hour</td>
<td>100 per hour</td>
<td>5s cooldown</td>
</tr>
<tr>
<td><strong>Theron</strong></td>
<td>Continuous</td>
<td>Continuous</td>
<td>None</td>
</tr>
</table>

### Throttling Mechanisms

```typescript
// Throttling example
import { shouldEmit } from "../utils/throttle";

if (confidence > triggerThreshold && shouldEmit(agentId, cooldownMs)) {
  logSignal({
    agent: "MyAgent",
    type: "pattern_detected",
    // ... signal data
  });
}
```

## ∘ Testing Signals

### Generate Test Signals

```bash
# Generate a test signal
npm run signal:generate

# Preview signal hash generation
npm run signal:preview

# Stress test signal emission
npm run stress:test
```

### Manual Signal Creation

```typescript
// Generate a test signal manually
import { logSignal } from "../utils/logger";
import { generateSignalHash } from "../utils/signal";

const testEvent = {
  type: "wallet_activity",
  address: "test_wallet_123",
  timestamp: new Date().toISOString()
};

logSignal({
  agent: "TestAgent",
  type: "test_signal",
  glyph: "⚡",
  hash: generateSignalHash(testEvent),
  timestamp: new Date().toISOString(),
  confidence: 0.85
});
```

### Signal Validation

```typescript
// Validate signal format
function validateSignal(signal: any): boolean {
  return (
    typeof signal.agent === 'string' &&
    typeof signal.type === 'string' &&
    typeof signal.hash === 'string' &&
    signal.hash.startsWith('sig_') &&
    typeof signal.timestamp === 'string' &&
    (signal.confidence === undefined || 
     (typeof signal.confidence === 'number' && 
      signal.confidence >= 0 && 
      signal.confidence <= 1))
  );
}
```

---

<div align="center">

**Building intelligence from blockchain signals**

[![View Agents](https://img.shields.io/badge/View-Agents-blue?style=flat)](agents.md)
[![Architecture](https://img.shields.io/badge/Read-Architecture-purple?style=flat)](architecture.md)

</div>
