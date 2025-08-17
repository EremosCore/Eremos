# Signal Throttling

## Overview

Signal throttling is a critical mechanism in Eremos that prevents agents from overwhelming the system with excessive signal emissions during high-volume event windows.

## Problem

Some agents may attempt to emit signals too frequently, which can lead to:
- **Signal spam** during blockchain congestion
- **Resource exhaustion** from processing too many signals
- **Reduced signal quality** due to noise
- **Performance degradation** in downstream systems

## Solution

The `utils/throttle.ts` helper implements intelligent cooldown logic that applies per agent, ensuring controlled and meaningful signal emission.

## How It Works

### Throttle Configuration

```typescript
import { createThrottle } from '../utils/throttle';

const throttle = createThrottle({
  windowMs: 60000,        // 1 minute window
  maxSignals: 10,         // Max 10 signals per window
  cooldownMs: 5000        // 5 second cooldown between signals
});
```

### Usage in Agents

```typescript
export const MyAgent: Agent = {
  // ... other properties
  
  observe: (event) => {
    // Check if we should throttle this signal
    if (throttle.shouldThrottle('anomaly_detected')) {
      return; // Skip this signal
    }
    
    // Emit signal if not throttled
    const signal = generateSignal(event);
    logSignal(signal);
    
    // Mark this signal type as used
    throttle.markUsed('anomaly_detected');
  }
};
```

## Throttle Types

### 1. **Rate Limiting**
- Limits signals per time window
- Configurable window size and maximum count
- Automatic reset after window expires

### 2. **Cooldown Protection**
- Enforces minimum time between similar signals
- Prevents rapid-fire emission of the same event type
- Configurable cooldown duration

### 3. **Per-Agent Isolation**
- Each agent maintains independent throttle state
- No cross-contamination between different agent types
- Allows for agent-specific throttling rules

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `windowMs` | number | 60000 | Time window in milliseconds |
| `maxSignals` | number | 10 | Maximum signals per window |
| `cooldownMs` | number | 5000 | Minimum time between signals |
| `resetOnWindowEnd` | boolean | true | Reset counter when window expires |

## Best Practices

### 1. **Choose Appropriate Windows**
- **Short windows** (1-5 minutes) for high-frequency events
- **Long windows** (15-60 minutes) for anomaly detection
- **Dynamic windows** based on blockchain congestion

### 2. **Set Reasonable Limits**
- **Conservative limits** for critical signals
- **Higher limits** for informational signals
- **Monitor and adjust** based on system performance

### 3. **Use Descriptive Keys**
```typescript
// Good - descriptive and specific
throttle.shouldThrottle('wallet_funding_anomaly');
throttle.shouldThrottle('contract_deploy_spike');

// Avoid - too generic
throttle.shouldThrottle('event');
throttle.shouldThrottle('signal');
```

## Advanced Features

### Custom Throttle Logic

```typescript
const customThrottle = createThrottle({
  windowMs: 300000, // 5 minutes
  maxSignals: 5,
  cooldownMs: 10000,
  customLogic: (key, count, lastUsed) => {
    // Custom throttling logic
    if (key.includes('critical')) {
      return count < 20; // Allow more critical signals
    }
    return count < 5; // Standard limit for others
  }
});
```

### Throttle State Inspection

```typescript
// Check current throttle state
const state = throttle.getState('anomaly_detected');
console.log(`Signals in window: ${state.count}`);
console.log(`Time until reset: ${state.timeUntilReset}ms`);
console.log(`Cooldown remaining: ${state.cooldownRemaining}ms`);
```

## Monitoring and Debugging

### Enable Throttle Logging

```typescript
const throttle = createThrottle({
  // ... other options
  enableLogging: true,
  logLevel: 'info' // 'debug', 'info', 'warn'
});
```

### Throttle Metrics

```typescript
// Get throttle statistics
const stats = throttle.getStats();
console.log('Throttle Statistics:', {
  totalThrottled: stats.totalThrottled,
  activeKeys: stats.activeKeys,
  windowResets: stats.windowResets
});
```

## Examples

### Basic Anomaly Detection Agent

```typescript
import { createThrottle } from '../utils/throttle';

const anomalyThrottle = createThrottle({
  windowMs: 300000,  // 5 minutes
  maxSignals: 3,     // Max 3 anomalies per 5 minutes
  cooldownMs: 30000  // 30 second cooldown
});

export const AnomalyAgent: Agent = {
  // ... agent properties
  
  observe: (event) => {
    if (event.type === 'suspicious_activity') {
      // Check throttle before emitting
      if (anomalyThrottle.shouldThrottle('suspicious_activity')) {
        console.log('Throttling suspicious activity signal');
        return;
      }
      
      // Emit signal
      const signal = {
        type: 'anomaly_detected',
        confidence: 0.85,
        timestamp: new Date().toISOString()
      };
      
      logSignal(signal);
      anomalyThrottle.markUsed('suspicious_activity');
    }
  }
};
```

### High-Frequency Monitoring Agent

```typescript
const monitoringThrottle = createThrottle({
  windowMs: 60000,   // 1 minute
  maxSignals: 50,    // Allow more frequent signals
  cooldownMs: 1000   // 1 second cooldown
});

export const MonitoringAgent: Agent = {
  // ... agent properties
  
  observe: (event) => {
    const throttleKey = `monitoring_${event.category}`;
    
    if (monitoringThrottle.shouldThrottle(throttleKey)) {
      return;
    }
    
    // Process and emit signal
    const signal = processEvent(event);
    logSignal(signal);
    monitoringThrottle.markUsed(throttleKey);
  }
};
```

## Troubleshooting

### Common Issues

1. **Signals being throttled too aggressively**
   - Increase `maxSignals` or `windowMs`
   - Check if cooldown is too long

2. **Throttle not working as expected**
   - Verify throttle keys are unique
   - Check throttle configuration
   - Enable logging for debugging

3. **Memory leaks from throttle state**
   - Ensure proper cleanup of old throttle entries
   - Monitor throttle state size

### Debug Commands

```typescript
// Enable verbose logging
const throttle = createThrottle({
  enableLogging: true,
  logLevel: 'debug'
});

// Inspect specific throttle state
console.log(throttle.getState('my_signal_type'));

// Get all active throttle keys
console.log(throttle.getActiveKeys());
```

## Related Documentation

- [Agent Development Guide](agents.md)
- [Signal System](signals.md)
- [Memory Management](memory.md)
- [Performance Optimization](runtime.md)
