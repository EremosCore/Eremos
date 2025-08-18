# Memory System

## Overview

The memory system in Eremos allows agents to maintain lightweight state and context across time. Memory helps agents track previously seen patterns, share known identifiers, and enable external tools to interpret their current state. Unlike traditional databases, agent memory is designed to be lightweight, fast, and interpretable.

## Purpose and Benefits

### Why Use Memory?

Memory helps agents:

- **Track previously seen patterns** across multiple events
- **Share known tags or identifiers** with other agents
- **Enable external tools** to interpret their current state
- **Maintain context** between different observation cycles
- **Avoid redundant processing** of previously analyzed data
- **Build behavioral profiles** of wallets and contracts

### Memory vs. Traditional Storage

| Aspect | Agent Memory | Traditional Database |
|--------|--------------|---------------------|
| **Speed** | In-memory, instant access | Disk I/O, slower access |
| **Size** | Lightweight, limited entries | Large, unlimited storage |
| **Persistence** | Ephemeral, resets on restart | Persistent, survives restarts |
| **Complexity** | Simple string tokens | Complex structured data |
| **Use Case** | Runtime context and state | Historical data and analytics |

## Memory Format and Structure

### Basic Memory Format

Memory is returned as an array of string tokens:

```typescript
getMemory: () => ["cluster:001", "mint:phantom_batch", "flag:volatile"]
```

### Memory Token Patterns

#### 1. **Category:Identifier Pattern**
```
category:identifier
```
Examples:
- `wallet:6Yxk...P2M8` - Specific wallet address
- `cluster:cluster_04` - Wallet cluster identifier
- `contract:ContractABC123` - Contract address
- `token:TokenXYZ789` - Token identifier

#### 2. **Action:Target Pattern**
```
action:target
```
Examples:
- `mint:phantom_batch` - Minting activity on Phantom
- `deploy:stealth_contract` - Stealth contract deployment
- `fund:kraken_flow` - Funding from Kraken
- `interact:raydium` - Interaction with Raydium

#### 3. **Flag:Reason Pattern**
```
flag:reason
```
Examples:
- `flag:volatile` - Volatility warning
- `flag:suspicious` - Suspicious activity detected
- `flag:high_risk` - High-risk behavior
- `flag:anomaly` - Anomaly detected

#### 4. **Timestamp:Event Pattern**
```
timestamp:event
```
Examples:
- `20241201:launch_spike` - Launch spike on December 1st
- `morning:funding_wave` - Morning funding wave
- `hourly:volume_check` - Hourly volume check

## Memory Implementation

### Basic Memory Implementation

```typescript
export const BasicAgent: Agent = {
  // ... other properties
  
  memory: new Set<string>(),
  
  getMemory: function() {
    return Array.from(this.memory);
  },
  
  addToMemory: function(token: string) {
    this.memory.add(token);
  },
  
  removeFromMemory: function(token: string) {
    this.memory.delete(token);
  }
};
```

### Advanced Memory with Categories

```typescript
export const AdvancedAgent: Agent = {
  // ... other properties
  
  memory: {
    wallets: new Set<string>(),
    contracts: new Set<string>(),
    patterns: new Set<string>(),
    flags: new Set<string>()
  },
  
  getMemory: function() {
    return [
      ...Array.from(this.memory.wallets).map(w => `wallet:${w}`),
      ...Array.from(this.memory.contracts).map(c => `contract:${c}`),
      ...Array.from(this.memory.patterns).map(p => `pattern:${p}`),
      ...Array.from(this.memory.flags).map(f => `flag:${f}`)
    ];
  },
  
  addWallet: function(address: string) {
    this.memory.wallets.add(address);
  },
  
  addContract: function(address: string) {
    this.memory.contracts.add(address);
  },
  
  addPattern: function(pattern: string) {
    this.memory.patterns.add(pattern);
  },
  
  addFlag: function(flag: string) {
    this.memory.flags.add(flag);
  }
};
```

### Memory with TTL (Time To Live)

```typescript
export const TTLAgent: Agent = {
  // ... other properties
  
  memory: new Map<string, { data: string, expiresAt: number }>(),
  
  getMemory: function() {
    const now = Date.now();
    const validEntries = [];
    
    for (const [key, entry] of this.memory.entries()) {
      if (entry.expiresAt > now) {
        validEntries.push(entry.data);
      } else {
        this.memory.delete(key); // Clean up expired entries
      }
    }
    
    return validEntries;
  },
  
  addToMemory: function(token: string, ttlMs: number = 3600000) { // 1 hour default
    const expiresAt = Date.now() + ttlMs;
    this.memory.set(token, { data: token, expiresAt });
  }
};
```

## Memory Best Practices

### 1. **Keep Memory Declarative and Interpretable**

✅ **Good Examples:**
```typescript
// Clear, descriptive tokens
"wallet:6Yxk...P2M8"
"cluster:funding_anomaly_001"
"pattern:morning_launch_spike"
"flag:high_risk_volatile"
```

❌ **Avoid:**
```typescript
// Unclear or cryptic tokens
"w:6Yxk..."
"c:001"
"p:spike"
"f:hrv"
```

### 2. **Avoid Storing Raw Data or Full Event Payloads**

✅ **Good Examples:**
```typescript
// Store identifiers and patterns
"wallet:6Yxk...P2M8"
"pattern:cex_funding"
"cluster:morning_launch"
```

❌ **Avoid:**
```typescript
// Don't store raw data
"raw_data:{\"address\":\"6Yxk...\",\"amount\":\"1000\",\"timestamp\":\"...\"}"
"full_event:{\"type\":\"wallet_activity\",\"data\":{...}}"
```

### 3. **Use Consistent Naming Conventions**

```typescript
// Consistent format across all agents
const memoryTokens = [
  `wallet:${walletAddress}`,
  `pattern:${patternType}`,
  `cluster:${clusterId}`,
  `flag:${flagType}`,
  `timestamp:${eventDate}`
];
```

### 4. **Limit Memory Size**

```typescript
// Implement memory size limits
const MAX_MEMORY_SIZE = 100;

function addToMemory(token: string) {
  if (this.memory.size >= MAX_MEMORY_SIZE) {
    // Remove oldest entry (FIFO)
    const firstKey = this.memory.keys().next().value;
    this.memory.delete(firstKey);
  }
  this.memory.add(token);
}
```

## Memory Use Cases

### 1. **Pattern Recognition**

```typescript
export const PatternAgent: Agent = {
  // ... other properties
  
  observe: function(event) {
    if (event.type === 'wallet_activity') {
      const wallet = event.data.address;
      
      // Check if we've seen this wallet before
      const walletMemory = this.getMemory()
        .filter(token => token.startsWith(`wallet:${wallet}`));
      
      if (walletMemory.length === 0) {
        // First time seeing this wallet
        this.addToMemory(`wallet:${wallet}:first_seen`);
      } else {
        // We've seen this wallet before
        this.addToMemory(`wallet:${wallet}:repeat_visitor`);
        
        // Check for suspicious patterns
        if (this.detectSuspiciousPattern(wallet, event)) {
          this.addToMemory(`flag:suspicious:${wallet}`);
        }
      }
    }
  }
};
```

### 2. **Cross-Agent Communication**

```typescript
export const ObserverAgent: Agent = {
  // ... other properties
  
  observe: function(event) {
    if (event.type === 'contract_deploy') {
      const contract = event.data.contractAddress;
      
      // Mark this contract as observed
      this.addToMemory(`contract:${contract}:observed`);
      
      // Check if other agents have seen this contract
      const otherAgentMemories = this.getOtherAgentMemories();
      const contractSeenByOthers = otherAgentMemories.some(memory => 
        memory.includes(`contract:${contract}`)
      );
      
      if (contractSeenByOthers) {
        this.addToMemory(`contract:${contract}:multi_agent_detection`);
      }
    }
  }
};
```

### 3. **State Tracking**

```typescript
export const StateAgent: Agent = {
  // ... other properties
  
  observe: function(event) {
    // Track current state
    const currentState = this.determineCurrentState(event);
    
    // Update memory with current state
    this.clearStateMemory();
    this.addToMemory(`state:${currentState}`);
    
    // Track state transitions
    const previousState = this.getPreviousState();
    if (previousState && previousState !== currentState) {
      this.addToMemory(`transition:${previousState}:${currentState}`);
    }
  },
  
  clearStateMemory: function() {
    const nonStateTokens = this.getMemory()
      .filter(token => !token.startsWith('state:'));
    this.memory = new Set(nonStateTokens);
  },
  
  getPreviousState: function() {
    const stateTokens = this.getMemory()
      .filter(token => token.startsWith('state:'))
      .map(token => token.split(':')[1]);
    return stateTokens[stateTokens.length - 1];
  }
};
```

## Memory Persistence and Recovery

### Basic Persistence

```typescript
export const PersistentAgent: Agent = {
  // ... other properties
  
  saveMemory: function() {
    const memoryData = {
      tokens: this.getMemory(),
      timestamp: Date.now(),
      agentId: this.id
    };
    
    // Save to local storage or file
    localStorage.setItem(`agent_memory_${this.id}`, JSON.stringify(memoryData));
  },
  
  loadMemory: function() {
    const savedMemory = localStorage.getItem(`agent_memory_${this.id}`);
    if (savedMemory) {
      const memoryData = JSON.parse(savedMemory);
      
      // Check if memory is still fresh (e.g., less than 24 hours old)
      const memoryAge = Date.now() - memoryData.timestamp;
      if (memoryAge < 24 * 60 * 60 * 1000) { // 24 hours
        this.memory = new Set(memoryData.tokens);
      }
    }
  }
};
```

### Advanced Persistence with Database

```typescript
export const DatabaseAgent: Agent = {
  // ... other properties
  
  async saveMemory() {
    const memoryData = {
      agentId: this.id,
      tokens: this.getMemory(),
      timestamp: new Date(),
      version: '1.0'
    };
    
    try {
      await this.database.collection('agent_memory').updateOne(
        { agentId: this.id },
        { $set: memoryData },
        { upsert: true }
      );
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  },
  
  async loadMemory() {
    try {
      const memoryDoc = await this.database.collection('agent_memory')
        .findOne({ agentId: this.id });
      
      if (memoryDoc) {
        this.memory = new Set(memoryDoc.tokens);
      }
    } catch (error) {
      console.error('Failed to load memory:', error);
    }
  }
};
```

## Memory Analysis and Debugging

### Memory Inspection Tools

```typescript
// Analyze memory contents
function analyzeMemory(agent: Agent) {
  const memory = agent.getMemory();
  
  const analysis = {
    totalTokens: memory.length,
    categories: {},
    patterns: {},
    recommendations: []
  };
  
  // Categorize tokens
  for (const token of memory) {
    const [category] = token.split(':');
    analysis.categories[category] = (analysis.categories[category] || 0) + 1;
  }
  
  // Detect patterns
  const walletTokens = memory.filter(token => token.startsWith('wallet:'));
  if (walletTokens.length > 50) {
    analysis.recommendations.push('Consider clearing old wallet entries');
  }
  
  // Check for memory leaks
  const flagTokens = memory.filter(token => token.startsWith('flag:'));
  if (flagTokens.length > 100) {
    analysis.recommendations.push('High number of flags - review flag generation logic');
  }
  
  return analysis;
}
```

### Memory Debugging

```typescript
// Enable memory debugging
const DEBUG_MEMORY = true;

if (DEBUG_MEMORY) {
  console.log('Memory state:', {
    totalEntries: this.memory.size,
    entries: this.getMemory(),
    timestamp: new Date().toISOString()
  });
}

// Memory change tracking
function trackMemoryChange(operation: string, token: string) {
  if (DEBUG_MEMORY) {
    console.log(`Memory ${operation}:`, {
      token,
      timestamp: new Date().toISOString(),
      totalEntries: this.memory.size
    });
  }
}
```

## Memory Performance Optimization

### Memory Cleanup Strategies

```typescript
// Periodic memory cleanup
class MemoryManager {
  constructor(agent: Agent, cleanupIntervalMs: number = 300000) { // 5 minutes
    this.agent = agent;
    this.cleanupInterval = cleanupIntervalMs;
    this.startCleanupTimer();
  }
  
  startCleanupTimer() {
    setInterval(() => {
      this.cleanupMemory();
    }, this.cleanupInterval);
  }
  
  cleanupMemory() {
    const memory = this.agent.getMemory();
    const now = Date.now();
    
    // Remove old timestamp-based entries
    const cleanedMemory = memory.filter(token => {
      if (token.startsWith('timestamp:')) {
        const timestamp = this.extractTimestamp(token);
        return (now - timestamp) < 24 * 60 * 60 * 1000; // Keep last 24 hours
      }
      return true; // Keep non-timestamp entries
    });
    
    // Update agent memory
    this.agent.memory = new Set(cleanedMemory);
  }
  
  extractTimestamp(token: string): number {
    // Extract timestamp from token like "timestamp:20241201:event"
    const parts = token.split(':');
    if (parts.length >= 2) {
      return parseInt(parts[1]) || 0;
    }
    return 0;
  }
}
```

### Memory Compression

```typescript
// Compress memory tokens for storage
function compressMemory(memory: string[]): string {
  // Simple compression: remove common prefixes
  const compressed = memory.map(token => {
    if (token.startsWith('wallet:')) return `w:${token.substring(7)}`;
    if (token.startsWith('contract:')) return `c:${token.substring(9)}`;
    if (token.startsWith('pattern:')) return `p:${token.substring(8)}`;
    if (token.startsWith('flag:')) return `f:${token.substring(5)}`;
    return token;
  });
  
  return JSON.stringify(compressed);
}

// Decompress memory tokens
function decompressMemory(compressed: string): string[] {
  const compressedArray = JSON.parse(compressed);
  
  return compressedArray.map(token => {
    if (token.startsWith('w:')) return `wallet:${token.substring(2)}`;
    if (token.startsWith('c:')) return `contract:${token.substring(2)}`;
    if (token.startsWith('p:')) return `pattern:${token.substring(2)}`;
    if (token.startsWith('f:')) return `flag:${token.substring(2)}`;
    return token;
  });
}
```

## Troubleshooting

### Common Memory Issues

1. **Memory growing too large**
   - Implement size limits
   - Add TTL for entries
   - Regular cleanup routines

2. **Memory not persisting**
   - Check persistence implementation
   - Verify storage permissions
   - Monitor error logs

3. **Memory corruption**
   - Validate token format
   - Implement memory validation
   - Add error recovery

### Debug Commands

```typescript
// Check memory health
function checkMemoryHealth(agent: Agent) {
  const memory = agent.getMemory();
  
  console.log('Memory Health Check:', {
    totalEntries: memory.length,
    uniqueCategories: new Set(memory.map(t => t.split(':')[0])).size,
    averageTokenLength: memory.reduce((sum, t) => sum + t.length, 0) / memory.length,
    hasDuplicates: memory.length !== new Set(memory).size
  });
}

// Validate memory tokens
function validateMemoryTokens(agent: Agent) {
  const memory = agent.getMemory();
  const invalidTokens = [];
  
  for (const token of memory) {
    if (!token.includes(':') || token.length < 3) {
      invalidTokens.push(token);
    }
  }
  
  if (invalidTokens.length > 0) {
    console.warn('Invalid memory tokens found:', invalidTokens);
  }
  
  return invalidTokens.length === 0;
}
```

## Related Documentation

- [Agent Development Guide](agents.md)
- [Event System](events.md)
- [Signal System](signals.md)
- [Performance Optimization](runtime.md)
- [Throttling System](throttle.md)
