# API Reference

This document provides detailed documentation for all TypeScript interfaces, classes, and methods available in the Eremos framework.

## Table of Contents

- [Core Interfaces](#core-interfaces)
- [Agent System](#agent-system)
- [Signal System](#signal-system)
- [Utility Functions](#utility-functions)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Events](#events)
- [Types](#types)
- [Examples](#examples)

## Core Interfaces

### Agent

The base interface that all agents must implement.

```typescript
interface Agent {
  /** Unique identifier for the agent */
  name: string;
  
  /** Agent initialization */
  initialize(): Promise<void>;
  
  /** Main monitoring loop */
  monitor(): Promise<void>;
  
  /** Cleanup resources */
  cleanup?(): Promise<void>;
  
  /** Get current agent status */
  getStatus?(): AgentStatus;
  
  /** Handle configuration updates */
  updateConfig?(config: AgentConfig): Promise<void>;
}
```

**Usage Example:**
```typescript
class MyAgent implements Agent {
  name = 'MyAgent';
  
  async initialize(): Promise<void> {
    console.log(`[${this.name}] Initializing...`);
  }
  
  async monitor(): Promise<void> {
    // Monitoring logic here
  }
}
```

### Signal

Represents a detected event or pattern on the blockchain.

```typescript
interface Signal {
  /** Source agent identifier */
  agent: string;
  
  /** Signal type/category */
  type: SignalType;
  
  /** Visual identifier (emoji or symbol) */
  glyph: string;
  
  /** Unique signal hash */
  hash: string;
  
  /** ISO 8601 timestamp */
  timestamp: string;
  
  /** Source system identifier */
  source: string;
  
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  
  /** Optional payload data */
  data?: any;
  
  /** Additional metadata */
  metadata?: SignalMetadata;
}
```

**Signal Types:**
```typescript
type SignalType = 
  | 'launch_detected'
  | 'wallet_activity'
  | 'ghost_wallet'
  | 'suspicious_activity'
  | 'large_transfer'
  | 'new_program'
  | 'mint_pattern'
  | 'custom';
```

**Usage Example:**
```typescript
const signal: Signal = {
  agent: 'LaunchTracker',
  type: 'launch_detected',
  glyph: 'Δ',
  hash: 'sig_abc123',
  timestamp: new Date().toISOString(),
  source: 'launch-tracker',
  confidence: 0.91,
  data: {
    tokenAddress: '5gW...pump',
    walletAddress: '6Yxk...P2M8'
  }
};
```

### AgentConfig

Configuration interface for individual agents.

```typescript
interface AgentConfig {
  /** Whether the agent is enabled */
  enabled: boolean;
  
  /** Monitoring interval in milliseconds */
  interval: number;
  
  /** Minimum confidence threshold for signals */
  confidenceThreshold: number;
  
  /** Maximum concurrent operations */
  maxConcurrent?: number;
  
  /** Custom configuration parameters */
  custom?: Record<string, any>;
}
```

## Agent System

### BaseAgent

Abstract base class providing common agent functionality.

```typescript
abstract class BaseAgent implements Agent {
  abstract name: string;
  
  protected config: AgentConfig;
  protected logger: Logger;
  protected rpcManager: RPCManager;
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.logger = createLogger(this.name);
    this.rpcManager = new RPCManager();
  }
  
  /** Initialize the agent */
  async initialize(): Promise<void> {
    this.logger.info(`Initializing agent: ${this.name}`);
    await this.setup();
  }
  
  /** Main monitoring loop */
  async monitor(): Promise<void> {
    if (!this.config.enabled) return;
    
    try {
      await this.performMonitoring();
    } catch (error) {
      this.logger.error(`Monitoring error: ${error.message}`);
      await this.handleError(error);
    }
  }
  
  /** Abstract methods to implement */
  protected abstract setup(): Promise<void>;
  protected abstract performMonitoring(): Promise<void>;
  protected abstract handleError(error: Error): Promise<void>;
  
  /** Get agent status */
  getStatus(): AgentStatus {
    return {
      name: this.name,
      enabled: this.config.enabled,
      lastRun: this.lastRun,
      status: this.currentStatus,
      errorCount: this.errorCount
    };
  }
}
```

### AgentStatus

Status information for an agent.

```typescript
interface AgentStatus {
  /** Agent name */
  name: string;
  
  /** Whether agent is enabled */
  enabled: boolean;
  
  /** Last execution timestamp */
  lastRun?: Date;
  
  /** Current status */
  status: 'idle' | 'running' | 'error' | 'stopped';
  
  /** Error count since last reset */
  errorCount: number;
  
  /** Performance metrics */
  metrics?: AgentMetrics;
}
```

### AgentManager

Manages multiple agents and their lifecycle.

```typescript
class AgentManager {
  private agents: Map<string, Agent>;
  private scheduler: Scheduler;
  
  /** Register a new agent */
  register(agent: Agent): void {
    this.agents.set(agent.name, agent);
  }
  
  /** Start all registered agents */
  async startAll(): Promise<void> {
    for (const agent of this.agents.values()) {
      await this.start(agent.name);
    }
  }
  
  /** Start a specific agent */
  async start(agentName: string): Promise<void> {
    const agent = this.agents.get(agentName);
    if (!agent) throw new Error(`Agent not found: ${agentName}`);
    
    await agent.initialize();
    this.scheduler.schedule(agent);
  }
  
  /** Stop all agents */
  async stopAll(): Promise<void> {
    for (const agent of this.agents.values()) {
      await this.stop(agent.name);
    }
  }
  
  /** Get status of all agents */
  getStatus(): AgentStatus[] {
    return Array.from(this.agents.values())
      .map(agent => agent.getStatus?.() || {
        name: agent.name,
        enabled: true,
        status: 'unknown',
        errorCount: 0
      });
  }
}
```

## Signal System

### SignalEmitter

Handles signal creation and emission.

```typescript
class SignalEmitter {
  private processors: SignalProcessor[];
  private outputs: OutputHandler[];
  
  /** Emit a signal */
  async emit(signal: Signal): Promise<void> {
    // Validate signal
    this.validateSignal(signal);
    
    // Process through pipeline
    let processedSignal = signal;
    for (const processor of this.processors) {
      if (processor.canProcess(processedSignal)) {
        processedSignal = await processor.process(processedSignal);
      }
    }
    
    // Send to outputs
    for (const output of this.outputs) {
      await output.handle(processedSignal);
    }
  }
  
  /** Add signal processor */
  addProcessor(processor: SignalProcessor): void {
    this.processors.push(processor);
  }
  
  /** Add output handler */
  addOutput(output: OutputHandler): void {
    this.outputs.push(output);
  }
  
  private validateSignal(signal: Signal): void {
    if (!signal.agent) throw new Error('Signal must have agent');
    if (!signal.type) throw new Error('Signal must have type');
    if (signal.confidence < 0 || signal.confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }
  }
}
```

### SignalProcessor

Interface for processing signals in the pipeline.

```typescript
interface SignalProcessor {
  /** Process a signal */
  process(signal: Signal): Promise<Signal>;
  
  /** Check if processor can handle this signal */
  canProcess(signal: Signal): boolean;
  
  /** Processor priority (higher = earlier in pipeline) */
  priority: number;
}
```

### OutputHandler

Interface for signal output destinations.

```typescript
interface OutputHandler {
  /** Handle a signal */
  handle(signal: Signal): Promise<void>;
  
  /** Configure the output handler */
  configure(config: OutputConfig): void;
  
  /** Check if handler is ready */
  isReady(): boolean;
}
```

### Built-in Output Handlers

#### FileOutputHandler

```typescript
class FileOutputHandler implements OutputHandler {
  private outputPath: string;
  private format: 'json' | 'text';
  
  configure(config: { path: string; format: 'json' | 'text' }): void {
    this.outputPath = config.path;
    this.format = config.format;
  }
  
  async handle(signal: Signal): Promise<void> {
    const content = this.format === 'json' 
      ? JSON.stringify(signal, null, 2)
      : this.formatAsText(signal);
    
    await fs.appendFile(this.outputPath, content + '\n');
  }
  
  isReady(): boolean {
    return !!this.outputPath;
  }
}
```

#### WebhookOutputHandler

```typescript
class WebhookOutputHandler implements OutputHandler {
  private url: string;
  private secret?: string;
  
  configure(config: { url: string; secret?: string }): void {
    this.url = config.url;
    this.secret = config.secret;
  }
  
  async handle(signal: Signal): Promise<void> {
    const payload = {
      signal,
      timestamp: Date.now()
    };
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.secret) {
      headers['X-Eremos-Signature'] = this.generateSignature(payload);
    }
    
    await fetch(this.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  }
  
  private generateSignature(payload: any): string {
    return crypto
      .createHmac('sha256', this.secret!)
      .update(JSON.stringify(payload))
      .digest('hex');
  }
}
```

## Utility Functions

### RPC Functions

```typescript
/** Get account information */
async function getAccountInfo(
  address: string,
  options?: GetAccountInfoOptions
): Promise<AccountInfo | null> {
  return rpcManager.call('getAccountInfo', [address, options]);
}

/** Get transaction information */
async function getTransaction(
  signature: string,
  options?: GetTransactionOptions
): Promise<TransactionResponse | null> {
  return rpcManager.call('getTransaction', [signature, options]);
}

/** Get signatures for address */
async function getSignaturesForAddress(
  address: string,
  options?: GetSignaturesOptions
): Promise<SignatureInfo[]> {
  return rpcManager.call('getSignaturesForAddress', [address, options]);
}

/** Get token accounts by owner */
async function getTokenAccountsByOwner(
  owner: string,
  filter: TokenAccountFilter,
  options?: GetTokenAccountsOptions
): Promise<TokenAccount[]> {
  return rpcManager.call('getTokenAccountsByOwner', [owner, filter, options]);
}
```

### Signal Utilities

```typescript
/** Create a signal hash */
function createSignalHash(data: any): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex')
    .substring(0, 12);
}

/** Calculate confidence score */
function calculateConfidence(factors: ConfidenceFactors): number {
  const {
    fundingSource = 0,
    timingPattern = 0,
    walletLinkage = 0,
    metadataQuality = 0
  } = factors;
  
  return Math.min(1.0, fundingSource + timingPattern + walletLinkage + metadataQuality);
}

/** Format signal for display */
function formatSignal(signal: Signal): string {
  return `[${signal.timestamp}] [${signal.agent}] ${signal.glyph} ${signal.type} (confidence: ${signal.confidence})`;
}
```

### Memory Utilities

```typescript
/** Store data in ephemeral memory */
function setEphemeralMemory(key: string, value: any, ttl?: number): void {
  ephemeralMemory.set(key, value, ttl);
}

/** Get data from ephemeral memory */
function getEphemeralMemory<T>(key: string): T | undefined {
  return ephemeralMemory.get(key);
}

/** Store data in persistent memory */
async function setPersistentMemory(key: string, value: any): Promise<void> {
  await persistentMemory.set(key, value);
}

/** Get data from persistent memory */
async function getPersistentMemory<T>(key: string): Promise<T | undefined> {
  return persistentMemory.get(key);
}
```

### Validation Utilities

```typescript
/** Validate Solana address */
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/** Validate signal structure */
function validateSignal(signal: any): signal is Signal {
  return (
    typeof signal.agent === 'string' &&
    typeof signal.type === 'string' &&
    typeof signal.confidence === 'number' &&
    signal.confidence >= 0 &&
    signal.confidence <= 1 &&
    typeof signal.timestamp === 'string'
  );
}

/** Validate configuration */
function validateConfig(config: any): config is EremosConfig {
  return (
    typeof config === 'object' &&
    typeof config.solana?.rpcUrl === 'string' &&
    typeof config.agents === 'object'
  );
}
```

## Configuration

### EremosConfig

Main configuration interface for the framework.

```typescript
interface EremosConfig {
  /** Solana configuration */
  solana: {
    rpcUrl: string;
    timeout?: number;
    maxRetries?: number;
  };
  
  /** Agent configurations */
  agents: Record<string, AgentConfig>;
  
  /** Signal configuration */
  signals: {
    outputPath?: string;
    outputFormat?: 'json' | 'text';
    minConfidence?: number;
    rateLimit?: number;
  };
  
  /** Logging configuration */
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    outputPath?: string;
    maxFileSize?: number;
  };
  
  /** Performance configuration */
  performance: {
    maxMemoryUsage?: number;
    cacheEnabled?: boolean;
    cacheTTL?: number;
  };
}
```

### Configuration Loading

```typescript
/** Load configuration from environment */
function loadConfigFromEnv(): EremosConfig {
  return {
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      timeout: parseInt(process.env.RPC_TIMEOUT || '30000'),
      maxRetries: parseInt(process.env.RPC_MAX_RETRIES || '3')
    },
    agents: loadAgentConfigs(),
    signals: {
      outputPath: process.env.SIGNAL_OUTPUT_PATH || './signals',
      outputFormat: (process.env.SIGNAL_OUTPUT_FORMAT as any) || 'json',
      minConfidence: parseFloat(process.env.SIGNAL_MIN_CONFIDENCE || '0.5')
    },
    logging: {
      level: (process.env.AGENT_LOG_LEVEL as any) || 'info',
      outputPath: process.env.LOGS_DIRECTORY || './logs'
    },
    performance: {
      maxMemoryUsage: parseInt(process.env.MAX_MEMORY_USAGE || '1024'),
      cacheEnabled: process.env.CACHE_ENABLED === 'true',
      cacheTTL: parseInt(process.env.CACHE_TTL || '300000')
    }
  };
}
```

## Error Handling

### EremosError

Base error class for framework errors.

```typescript
class EremosError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = 'EremosError';
  }
}
```

### Error Types

```typescript
class AgentError extends EremosError {
  constructor(message: string, agentName: string, context?: any) {
    super(message, 'AGENT_ERROR', { agentName, ...context });
    this.name = 'AgentError';
  }
}

class RPCError extends EremosError {
  constructor(message: string, endpoint: string, context?: any) {
    super(message, 'RPC_ERROR', { endpoint, ...context });
    this.name = 'RPCError';
  }
}

class SignalError extends EremosError {
  constructor(message: string, signal?: Partial<Signal>, context?: any) {
    super(message, 'SIGNAL_ERROR', { signal, ...context });
    this.name = 'SignalError';
  }
}

class ConfigError extends EremosError {
  constructor(message: string, configKey?: string, context?: any) {
    super(message, 'CONFIG_ERROR', { configKey, ...context });
    this.name = 'ConfigError';
  }
}
```

### Error Handler

```typescript
interface ErrorHandler {
  handle(error: Error, context?: any): Promise<void>;
}

class DefaultErrorHandler implements ErrorHandler {
  async handle(error: Error, context?: any): Promise<void> {
    logger.error('Error occurred:', {
      error: error.message,
      stack: error.stack,
      context
    });
    
    // Emit error signal
    if (error instanceof EremosError) {
      await signalEmitter.emit({
        agent: 'system',
        type: 'error',
        glyph: '❌',
        hash: createSignalHash({ error: error.message, context }),
        timestamp: new Date().toISOString(),
        source: 'error-handler',
        confidence: 1.0,
        data: {
          error: error.message,
          code: error.code,
          context: error.context
        }
      });
    }
  }
}
```

## Events

### Event System

```typescript
interface EventEmitter {
  on(event: string, listener: (...args: any[]) => void): void;
  off(event: string, listener: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
}

class EremosEventEmitter implements EventEmitter {
  private listeners: Map<string, Function[]> = new Map();
  
  on(event: string, listener: (...args: any[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }
  
  off(event: string, listener: (...args: any[]) => void): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  emit(event: string, ...args: any[]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(...args));
    }
  }
}
```

### Framework Events

```typescript
// Framework lifecycle events
framework.on('initialized', () => {
  console.log('Framework initialized');
});

framework.on('agent:started', (agentName: string) => {
  console.log(`Agent started: ${agentName}`);
});

framework.on('agent:stopped', (agentName: string) => {
  console.log(`Agent stopped: ${agentName}`);
});

framework.on('signal:emitted', (signal: Signal) => {
  console.log(`Signal emitted: ${signal.type}`);
});

framework.on('error', (error: Error) => {
  console.error('Framework error:', error);
});
```

## Types

### Common Types

```typescript
/** Blockchain transaction signature */
type TransactionSignature = string;

/** Solana public key address */
type SolanaAddress = string;

/** Unix timestamp in milliseconds */
type Timestamp = number;

/** Confidence score between 0 and 1 */
type ConfidenceScore = number;

/** Agent execution priority */
type Priority = 'low' | 'normal' | 'high' | 'critical';

/** Log levels */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';
```

### Utility Types

```typescript
/** Make all properties optional */
type Partial<T> = {
  [P in keyof T]?: T[P];
};

/** Pick specific properties */
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/** Omit specific properties */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Make specific properties required */
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

## Examples

### Basic Agent Example

```typescript
import { BaseAgent, Signal } from 'eremos';

class TokenLaunchAgent extends BaseAgent {
  name = 'TokenLaunchAgent';
  
  protected async setup(): Promise<void> {
    this.logger.info('Setting up token launch monitoring');
  }
  
  protected async performMonitoring(): Promise<void> {
    const recentTransactions = await this.getRecentTransactions();
    
    for (const tx of recentTransactions) {
      const analysis = await this.analyzeTransaction(tx);
      
      if (analysis.isTokenLaunch && analysis.confidence > this.config.confidenceThreshold) {
        await this.emitSignal({
          agent: this.name,
          type: 'launch_detected',
          glyph: 'Δ',
          hash: this.createHash(tx.signature),
          timestamp: new Date().toISOString(),
          source: 'token-launch-agent',
          confidence: analysis.confidence,
          data: {
            signature: tx.signature,
            tokenAddress: analysis.tokenAddress,
            creator: analysis.creator
          }
        });
      }
    }
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`Token launch agent error: ${error.message}`);
    // Implement error recovery logic
  }
  
  private async getRecentTransactions(): Promise<Transaction[]> {
    // Implementation here
    return [];
  }
  
  private async analyzeTransaction(tx: Transaction): Promise<Analysis> {
    // Implementation here
    return { isTokenLaunch: false, confidence: 0 };
  }
}
```

### Custom Signal Processor Example

```typescript
import { SignalProcessor, Signal } from 'eremos';

class ConfidenceBoostProcessor implements SignalProcessor {
  priority = 100;
  
  canProcess(signal: Signal): boolean {
    return signal.type === 'launch_detected' && signal.confidence > 0.8;
  }
  
  async process(signal: Signal): Promise<Signal> {
    // Boost confidence for high-quality signals
    const boostedSignal = { ...signal };
    
    if (signal.data?.fundingSource === 'coinbase') {
      boostedSignal.confidence = Math.min(1.0, signal.confidence + 0.05);
    }
    
    // Add metadata
    boostedSignal.metadata = {
      ...signal.metadata,
      processed: true,
      processor: 'ConfidenceBoostProcessor',
      originalConfidence: signal.confidence
    };
    
    return boostedSignal;
  }
}
```

### Framework Usage Example

```typescript
import { EremosFramework, TokenLaunchAgent, FileOutputHandler } from 'eremos';

async function main() {
  // Initialize framework
  const framework = new EremosFramework();
  
  // Configure agents
  const tokenAgent = new TokenLaunchAgent({
    enabled: true,
    interval: 5000,
    confidenceThreshold: 0.7
  });
  
  // Configure outputs
  const fileOutput = new FileOutputHandler();
  fileOutput.configure({
    path: './signals.json',
    format: 'json'
  });
  
  // Register components
  framework.registerAgent(tokenAgent);
  framework.addOutput(fileOutput);
  
  // Start monitoring
  await framework.start();
  
  // Handle shutdown
  process.on('SIGINT', async () => {
    await framework.stop();
    process.exit(0);
  });
}

main().catch(console.error);
```

This API reference provides comprehensive documentation for building and extending the Eremos framework. For more examples and tutorials, see the [examples documentation](examples.md).
