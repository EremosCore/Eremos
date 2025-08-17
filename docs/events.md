# Events in Eremos

## Overview

Events are the core unit of observation for Eremos agents. Each event represents a blockchain occurrence that agents can monitor, analyze, and respond to. Events serve as the input data that drives agent behavior and signal generation.

## Event Structure

### Basic Event Format

```typescript
interface Event {
  type: string;           // Event category identifier
  timestamp: number;      // Unix timestamp of occurrence
  source: string;         // Origin of the event
  data: any;             // Event-specific payload
  metadata?: {            // Optional additional context
    network: string;
    blockHeight: number;
    transactionHash?: string;
  };
}
```

### Standard Event Types

| Event Type | Description | Use Case |
|------------|-------------|----------|
| `wallet_activity` | Wallet transactions and interactions | Monitor suspicious behavior |
| `contract_deploy` | New contract deployments | Track new projects |
| `token_mint` | Token creation and minting | Detect new tokens |
| `funding_flow` | Wallet funding patterns | Identify CEX flows |
| `bundle_activity` | MEV bundle interactions | Monitor arbitrage |
| `anomaly` | Unusual blockchain activity | Flag suspicious behavior |

## Event Examples

### Wallet Activity Event

```typescript
{
  type: "wallet_activity",
  timestamp: 1717201922,
  source: "solana_rpc",
  data: {
    address: "So1anaUser123",
    cluster: "cluster_04",
    transactionCount: 15,
    totalVolume: "150.5 SOL",
    interactions: [
      "pump.fun",
      "raydium.io",
      "jupiter.ag"
    ]
  },
  metadata: {
    network: "mainnet-beta",
    blockHeight: 234567890,
    transactionHash: "5gW...pump"
  }
}
```

### Contract Deploy Event

```typescript
{
  type: "contract_deploy",
  timestamp: 1717201925,
  source: "agent_observer",
  data: {
    contractAddress: "ContractABC123",
    deployer: "DeployerWallet456",
    contractType: "token",
    metadata: {
      name: "Example Token",
      symbol: "EXT",
      decimals: 9
    },
    gasUsed: "0.001 SOL"
  },
  metadata: {
    network: "mainnet-beta",
    blockHeight: 234567891
  }
}
```

### Token Mint Event

```typescript
{
  type: "token_mint",
  timestamp: 1717201930,
  source: "agent_harvester",
  data: {
    tokenAddress: "TokenXYZ789",
    minter: "MinterWallet101",
    amount: "1000000000",
    recipient: "RecipientWallet202",
    mintAuthority: "MintAuth303"
  },
  metadata: {
    network: "mainnet-beta",
    blockHeight: 234567892
  }
}
```

## Event Sources

### 1. **RPC Endpoints**
- Direct Solana RPC connections
- Real-time blockchain monitoring
- High-frequency event detection

### 2. **WebSocket Streams**
- Live transaction feeds
- Block notifications
- Account change subscriptions

### 3. **Agent-Generated Events**
- Cross-agent communication
- Derived event synthesis
- Pattern recognition outputs

### 4. **External APIs**
- Third-party blockchain data
- Market data feeds
- Social sentiment indicators

## Event Processing Pipeline

### 1. **Event Ingestion**
```typescript
// Raw blockchain data comes in
const rawEvent = await solanaRPC.getTransaction(txHash);

// Transform to Eremos event format
const event = transformToEvent(rawEvent);
```

### 2. **Event Validation**
```typescript
// Validate event structure
if (!isValidEvent(event)) {
  console.warn('Invalid event received:', event);
  return;
}

// Check event freshness
if (isEventStale(event, 300000)) { // 5 minutes
  console.warn('Stale event received:', event);
  return;
}
```

### 3. **Event Routing**
```typescript
// Route to appropriate agents
const relevantAgents = getRelevantAgents(event.type);
for (const agent of relevantAgents) {
  agent.observe(event);
}
```

### 4. **Event Processing**
```typescript
// Agent processes the event
export const MyAgent: Agent = {
  observe: (event) => {
    if (event.type === 'wallet_activity') {
      // Process wallet activity
      const signal = analyzeWalletActivity(event);
      if (signal) {
        emitSignal(signal);
      }
    }
  }
};
```

## Event Filtering and Prioritization

### Filter by Event Type

```typescript
// Only process specific event types
const allowedTypes = ['wallet_activity', 'contract_deploy'];
if (!allowedTypes.includes(event.type)) {
  return; // Skip this event
}
```

### Filter by Source

```typescript
// Trust only specific sources
const trustedSources = ['solana_rpc', 'agent_observer'];
if (!trustedSources.includes(event.source)) {
  return; // Skip untrusted sources
}
```

### Filter by Time

```typescript
// Only process recent events
const maxAgeMs = 60000; // 1 minute
if (Date.now() - event.timestamp > maxAgeMs) {
  return; // Skip old events
}
```

### Filter by Data Quality

```typescript
// Check data completeness
if (!event.data || !event.data.address) {
  return; // Skip incomplete events
}
```

## Event Enrichment

### Add Context Information

```typescript
// Enrich event with additional context
const enrichedEvent = {
  ...event,
  context: {
    marketConditions: await getMarketConditions(),
    networkCongestion: await getNetworkCongestion(),
    historicalData: await getHistoricalData(event.data.address)
  }
};
```

### Cross-Reference with Memory

```typescript
// Check agent memory for related events
const relatedEvents = agent.getMemory()
  .filter(memory => memory.includes(event.data.address));

if (relatedEvents.length > 0) {
  event.context.relatedActivity = relatedEvents;
}
```

## Event Batching and Aggregation

### Batch Similar Events

```typescript
// Group events by type and time window
const eventBatches = new Map();

function addToBatch(event) {
  const key = `${event.type}_${Math.floor(event.timestamp / 60000)}`;
  if (!eventBatches.has(key)) {
    eventBatches.set(key, []);
  }
  eventBatches.get(key).push(event);
}
```

### Aggregate Event Data

```typescript
// Aggregate multiple events into summary
function aggregateEvents(events) {
  return {
    type: events[0].type,
    count: events.length,
    timeRange: {
      start: Math.min(...events.map(e => e.timestamp)),
      end: Math.max(...events.map(e => e.timestamp))
    },
    summary: generateSummary(events)
  };
}
```

## Event Persistence and Retrieval

### Store Events

```typescript
// Store event for later analysis
async function storeEvent(event) {
  await eventDatabase.insert({
    ...event,
    storedAt: Date.now(),
    processed: false
  });
}
```

### Retrieve Historical Events

```typescript
// Get events from specific time range
async function getEventsInRange(startTime, endTime, type) {
  return await eventDatabase.find({
    timestamp: { $gte: startTime, $lte: endTime },
    type: type
  });
}
```

## Performance Considerations

### Event Rate Limiting

```typescript
// Limit event processing rate
const eventRateLimiter = createRateLimiter({
  maxEvents: 1000,
  windowMs: 60000
});

if (eventRateLimiter.shouldThrottle()) {
  // Skip processing or queue for later
  return;
}
```

### Event Prioritization

```typescript
// Prioritize critical events
function getEventPriority(event) {
  if (event.type === 'anomaly') return 'high';
  if (event.type === 'contract_deploy') return 'medium';
  return 'low';
}

// Process high-priority events first
const highPriorityEvents = events.filter(e => getEventPriority(e) === 'high');
```

### Memory Management

```typescript
// Clean up old events from memory
function cleanupOldEvents() {
  const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
  events = events.filter(e => e.timestamp > cutoffTime);
}
```

## Testing Events

### Mock Event Generation

```typescript
// Create test events for development
function createMockEvent(type, data = {}) {
  return {
    type,
    timestamp: Date.now(),
    source: 'mock_source',
    data: {
      ...data,
      mock: true
    }
  };
}

// Test with mock events
const mockEvent = createMockEvent('wallet_activity', {
  address: 'TestWallet123',
  cluster: 'test_cluster'
});
```

### Event Validation Testing

```typescript
// Test event validation
describe('Event Validation', () => {
  it('should validate valid events', () => {
    const validEvent = createMockEvent('wallet_activity');
    expect(isValidEvent(validEvent)).toBe(true);
  });

  it('should reject invalid events', () => {
    const invalidEvent = { type: 'invalid' };
    expect(isValidEvent(invalidEvent)).toBe(false);
  });
});
```

## Troubleshooting

### Common Issues

1. **Events not being processed**
   - Check event validation logic
   - Verify event routing configuration
   - Monitor agent health status

2. **High event latency**
   - Check network connectivity
   - Monitor RPC endpoint performance
   - Review event processing pipeline

3. **Memory issues**
   - Implement event cleanup routines
   - Monitor event storage size
   - Use event batching for high-volume scenarios

### Debug Commands

```typescript
// Enable event logging
const DEBUG_EVENTS = true;

if (DEBUG_EVENTS) {
  console.log('Processing event:', {
    type: event.type,
    source: event.source,
    timestamp: event.timestamp,
    dataKeys: Object.keys(event.data)
  });
}

// Monitor event processing performance
const startTime = Date.now();
processEvent(event);
const processingTime = Date.now() - startTime;
console.log(`Event processed in ${processingTime}ms`);
```

## Related Documentation

- [Agent Development Guide](agents.md)
- [Signal System](signals.md)
- [Memory Management](memory.md)
- [Performance Optimization](runtime.md)
- [Throttling System](throttle.md)
