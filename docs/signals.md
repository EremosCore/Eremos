# Signal System

## Overview

Signals are the primary output mechanism of Eremos agents. They represent detected patterns, anomalies, or insights that agents discover while monitoring blockchain activity. Signals are structured, timestamped, and include confidence scores to help users understand the reliability of each detection.

## Signal Structure

### Basic Signal Format

```typescript
interface Signal {
  agent: string;           // Source agent identifier
  type: string;            // Signal category
  glyph: string;           // Visual identifier
  hash: string;            // Unique signal hash
  timestamp: string;       // ISO timestamp
  source: string;          // Event source
  confidence: number;      // Confidence score (0-1)
  data?: any;             // Additional signal data
  metadata?: {             // Optional metadata
    network: string;
    blockHeight: number;
    relatedEvents?: string[];
  };
}
```

### Signal Components

| Component | Description | Example |
|-----------|-------------|---------|
| **agent** | Agent that generated the signal | `"observer"`, `"harvester"` |
| **type** | Signal category identifier | `"launch_detected"`, `"anomaly"` |
| **glyph** | Visual symbol for quick identification | `"Δ"`, `"Ϸ"`, `"λ"` |
| **hash** | Unique identifier for the signal | `"sig_c7f9a3d2bc"` |
| **timestamp** | When the signal was generated | `"2025-06-12T04:41:25Z"` |
| **source** | Original event source | `"agent-observer"` |
| **confidence** | Reliability score (0-1) | `0.91`, `0.75` |

## Signal Types

### Core Signal Categories

#### 1. **Launch Detection Signals**
- **`early_cluster`** — Wallets forming suspicious groups
- **`stealth_spawn`** — Contract created with zero metadata
- **`funding_anomaly`** — Unusual funding patterns
- **`deploy_spike`** — Sudden increase in deployments

#### 2. **Anomaly Detection Signals**
- **`anomaly_delta`** — Repeating action across unrelated wallets
- **`behavior_shift`** — Sudden change in wallet behavior
- **`volume_spike`** — Unusual transaction volume
- **`timing_pattern`** — Suspicious timing patterns

#### 3. **Market Intelligence Signals**
- **`liquidity_event`** — Significant liquidity changes
- **`whale_movement`** — Large wallet transactions
- **`arbitrage_opportunity`** — MEV bundle detection
- **`market_manipulation`** — Suspicious trading patterns

#### 4. **Security Signals**
- **`rug_pull_indicator`** — Potential rug pull warning
- **`phishing_attempt`** — Suspicious contract interactions
- **`malware_contract`** — Known malicious contract
- **`social_engineering`** — Social media manipulation

## Signal Confidence Scoring

### Confidence Factors

The confidence score (0-1) is calculated based on multiple factors:

#### **High Confidence Indicators (0.8-1.0)**
- Multiple independent data sources
- Historical pattern confirmation
- Cross-agent validation
- High-quality event data
- Recent and relevant information

#### **Medium Confidence Indicators (0.5-0.79)**
- Single data source
- Partial pattern match
- Some historical context
- Moderate data quality
- Reasonable recency

#### **Low Confidence Indicators (0.1-0.49)**
- Limited data sources
- Weak pattern match
- No historical context
- Poor data quality
- Stale information

### Confidence Calculation Example

```typescript
function calculateConfidence(event, agent, context) {
  let confidence = 0.5; // Base confidence
  
  // Data source quality
  if (event.source === 'solana_rpc') confidence += 0.2;
  if (event.source === 'agent_observer') confidence += 0.1;
  
  // Pattern strength
  if (context.patternStrength > 0.8) confidence += 0.2;
  if (context.historicalConfirmation) confidence += 0.1;
  
  // Data freshness
  const ageMs = Date.now() - event.timestamp;
  if (ageMs < 60000) confidence += 0.1; // Less than 1 minute
  
  // Cross-validation
  if (context.crossAgentValidation) confidence += 0.1;
  
  return Math.min(confidence, 1.0); // Cap at 1.0
}
```

## Signal Generation

### Basic Signal Creation

```typescript
import { generateSignalHash } from '../utils/signal';
import { logSignal } from '../utils/logger';

function createSignal(agent, type, event, confidence) {
  const signal = {
    agent: agent.name,
    type: type,
    glyph: agent.glyph,
    hash: generateSignalHash(event),
    timestamp: new Date().toISOString(),
    source: `agent-${agent.name.toLowerCase()}`,
    confidence: confidence,
    data: {
      eventType: event.type,
      eventData: event.data
    }
  };
  
  return signal;
}
```

### Advanced Signal Creation

```typescript
function createAdvancedSignal(agent, type, event, context) {
  const baseSignal = createSignal(agent, type, event, context.confidence);
  
  // Add enriched data
  const enrichedSignal = {
    ...baseSignal,
    data: {
      ...baseSignal.data,
      context: {
        marketConditions: context.marketConditions,
        networkStatus: context.networkStatus,
        historicalPatterns: context.historicalPatterns,
        riskAssessment: context.riskAssessment
      }
    },
    metadata: {
      network: context.network,
      blockHeight: context.blockHeight,
      relatedSignals: context.relatedSignals,
      processingTime: context.processingTime
    }
  };
  
  return enrichedSignal;
}
```

## Signal Processing Pipeline

### 1. **Signal Generation**
```typescript
// Agent detects pattern and generates signal
const signal = createSignal(agent, 'anomaly_detected', event, 0.85);
```

### 2. **Signal Validation**
```typescript
// Validate signal structure and data
if (!isValidSignal(signal)) {
  console.warn('Invalid signal generated:', signal);
  return;
}
```

### 3. **Signal Deduplication**
```typescript
// Check if similar signal was recently emitted
if (isDuplicateSignal(signal)) {
  console.log('Duplicate signal detected, skipping');
  return;
}
```

### 4. **Signal Emission**
```typescript
// Emit the signal through logging system
logSignal(signal);

// Optionally emit to external systems
if (shouldEmitExternally(signal)) {
  emitToExternalSystem(signal);
}
```

### 5. **Signal Storage**
```typescript
// Store signal for historical analysis
await storeSignal(signal);

// Update agent memory
agent.updateMemory(signal.hash);
```

## Signal Aggregation and Correlation

### Signal Clustering

```typescript
// Group related signals by type and time
function clusterSignals(signals, timeWindowMs = 300000) { // 5 minutes
  const clusters = new Map();
  
  for (const signal of signals) {
    const key = `${signal.type}_${Math.floor(signal.timestamp / timeWindowMs)}`;
    if (!clusters.has(key)) {
      clusters.set(key, []);
    }
    clusters.get(key).push(signal);
  }
  
  return clusters;
}
```

### Signal Correlation

```typescript
// Find signals that might be related
function correlateSignals(signals, correlationRules) {
  const correlations = [];
  
  for (const rule of correlationRules) {
    const matches = signals.filter(signal => 
      rule.condition(signal, signals)
    );
    
    if (matches.length >= rule.minMatches) {
      correlations.push({
        rule: rule.name,
        signals: matches,
        strength: rule.calculateStrength(matches)
      });
    }
  }
  
  return correlations;
}
```

## Signal Output Formats

### Console Output

```typescript
// Human-readable console output
[agent-observer] → fresh funding detected from kraken (wallet: 6Yxk...P2M8) at 04:41:12Z
[agent-observer] → contract probing detected within 4s (pump.fun interaction traced)
[agent-observer] → token created at 04:41:17Z (tx: 5gW...pump)
[agent-observer] → 5 bundle-linked wallets interacted within 8s of deploy
[agent-observer] → launch confidence spike (0.91) - emitting signal (elapsed: 13s)
```

### Structured Output

```typescript
// JSON-structured signal output
{
  agent: "Observer",
  type: "launch_detected",
  glyph: "Δ",
  hash: "sig_c7f9a3d2bc",
  timestamp: "2025-06-12T04:41:25Z",
  source: "agent-observer",
  confidence: 0.91,
  data: {
    fundingSource: "kraken",
    walletAddress: "6Yxk...P2M8",
    contractAddress: "5gW...pump",
    bundleWallets: 5,
    timeToDeploy: 13000
  }
}
```

### Machine-Readable Output

```typescript
// CSV format for data analysis
const csvOutput = [
  'timestamp,agent,type,confidence,hash,data',
  '2025-06-12T04:41:25Z,Observer,launch_detected,0.91,sig_c7f9a3d2bc,{"fundingSource":"kraken"}'
].join('\n');
```

## Signal Filtering and Prioritization

### Filter by Confidence

```typescript
// Only process high-confidence signals
const highConfidenceSignals = signals.filter(s => s.confidence >= 0.8);

// Filter by confidence range
const mediumConfidenceSignals = signals.filter(s => 
  s.confidence >= 0.5 && s.confidence < 0.8
);
```

### Filter by Type

```typescript
// Focus on specific signal types
const criticalSignals = signals.filter(s => 
  ['rug_pull_indicator', 'malware_contract'].includes(s.type)
);

// Exclude certain types
const filteredSignals = signals.filter(s => 
  !['debug', 'test'].includes(s.type)
);
```

### Filter by Time

```typescript
// Recent signals only
const recentSignals = signals.filter(s => {
  const signalTime = new Date(s.timestamp).getTime();
  const cutoffTime = Date.now() - (60 * 60 * 1000); // 1 hour
  return signalTime > cutoffTime;
});
```

## Signal Monitoring and Alerting

### Signal Rate Monitoring

```typescript
// Monitor signal generation rate
class SignalMonitor {
  constructor() {
    this.signalCounts = new Map();
    this.lastReset = Date.now();
  }
  
  recordSignal(type) {
    const count = this.signalCounts.get(type) || 0;
    this.signalCounts.set(type, count + 1);
    
    // Check for unusual rates
    if (count > 100) { // More than 100 signals of this type
      this.alertHighSignalRate(type, count);
    }
  }
  
  resetCounts() {
    this.signalCounts.clear();
    this.lastReset = Date.now();
  }
}
```

### Confidence Threshold Alerts

```typescript
// Alert on low-confidence signals
function checkSignalConfidence(signal) {
  if (signal.confidence < 0.3) {
    console.warn(`Low confidence signal detected: ${signal.type} (${signal.confidence})`);
    
    // Send alert to monitoring system
    sendAlert({
      type: 'low_confidence_signal',
      signal: signal,
      timestamp: Date.now()
    });
  }
}
```

## Signal Testing and Validation

### Mock Signal Generation

```typescript
// Create test signals for development
function createMockSignal(type, confidence = 0.8) {
  return {
    agent: "TestAgent",
    type: type,
    glyph: "T",
    hash: `sig_test_${Date.now()}`,
    timestamp: new Date().toISOString(),
    source: "agent-test",
    confidence: confidence,
    data: {
      test: true,
      mockData: "sample data"
    }
  };
}
```

### Signal Validation Testing

```typescript
// Test signal validation
describe('Signal Validation', () => {
  it('should validate valid signals', () => {
    const validSignal = createMockSignal('test_signal');
    expect(isValidSignal(validSignal)).toBe(true);
  });
  
  it('should reject signals with missing fields', () => {
    const invalidSignal = { type: 'test' };
    expect(isValidSignal(invalidSignal)).toBe(false);
  });
  
  it('should validate confidence range', () => {
    const signal = createMockSignal('test', 1.5); // Invalid confidence
    expect(isValidSignal(signal)).toBe(false);
  });
});
```

## Performance Optimization

### Signal Batching

```typescript
// Batch multiple signals for efficient processing
class SignalBatcher {
  constructor(batchSize = 100, batchTimeout = 5000) {
    this.batchSize = batchSize;
    this.batchTimeout = batchTimeout;
    this.currentBatch = [];
    this.batchTimer = null;
  }
  
  addSignal(signal) {
    this.currentBatch.push(signal);
    
    if (this.currentBatch.length >= this.batchSize) {
      this.processBatch();
    } else if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => this.processBatch(), this.batchTimeout);
    }
  }
  
  processBatch() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    if (this.currentBatch.length > 0) {
      processSignalsBatch(this.currentBatch);
      this.currentBatch = [];
    }
  }
}
```

### Signal Caching

```typescript
// Cache recent signals to avoid reprocessing
class SignalCache {
  constructor(maxSize = 1000, ttlMs = 300000) { // 5 minutes TTL
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    });
  }
}
```

## Troubleshooting

### Common Issues

1. **Signals not being generated**
   - Check agent configuration
   - Verify event processing pipeline
   - Monitor agent health status

2. **Low confidence scores**
   - Review confidence calculation logic
   - Check data quality and freshness
   - Verify pattern detection algorithms

3. **Signal duplication**
   - Implement proper deduplication logic
   - Check signal hash generation
   - Review agent memory management

### Debug Commands

```typescript
// Enable signal debugging
const DEBUG_SIGNALS = true;

if (DEBUG_SIGNALS) {
  console.log('Signal generated:', {
    agent: signal.agent,
    type: signal.type,
    confidence: signal.confidence,
    hash: signal.hash
  });
}

// Monitor signal processing performance
const startTime = Date.now();
processSignal(signal);
const processingTime = Date.now() - startTime;
console.log(`Signal processed in ${processingTime}ms`);
```

## Related Documentation

- [Agent Development Guide](agents.md)
- [Event System](events.md)
- [Memory Management](memory.md)
- [Throttling System](throttle.md)
- [Performance Optimization](runtime.md)
