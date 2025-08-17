# Examples

This document provides practical examples and real-world usage patterns for the Eremos framework. These examples demonstrate how to build, configure, and deploy autonomous monitoring agents for various blockchain scenarios.

## Table of Contents

- [Basic Examples](#basic-examples)
- [Agent Development](#agent-development)
- [Signal Processing](#signal-processing)
- [Configuration Examples](#configuration-examples)
- [Integration Examples](#integration-examples)
- [Real-World Scenarios](#real-world-scenarios)
- [Best Practices](#best-practices)

## Basic Examples

### Hello World Agent

The simplest possible agent that demonstrates the basic structure:

```typescript
// examples/hello-world-agent.ts
import { Agent, Signal } from '../types';
import { emitSignal, logger } from '../utils';

export class HelloWorldAgent implements Agent {
  name = 'HelloWorldAgent';
  
  async initialize(): Promise<void> {
    logger.info(`[${this.name}] Hello, Eremos! 👋`);
  }
  
  async monitor(): Promise<void> {
    // Simple signal emission every time monitor is called
    const signal: Signal = {
      agent: this.name,
      type: 'hello_world',
      glyph: '👋',
      hash: `hello_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'hello-world-agent',
      confidence: 1.0,
      data: {
        message: 'Hello from Eremos!',
        timestamp: Date.now()
      }
    };
    
    await emitSignal(signal);
    logger.info(`[${this.name}] Signal emitted: ${signal.glyph} ${signal.type}`);
  }
}

// Usage
async function runHelloWorld() {
  const agent = new HelloWorldAgent();
  await agent.initialize();
  await agent.monitor();
}
```

### Simple Configuration

Basic configuration setup for development:

```typescript
// examples/basic-config.ts
import { EremosConfig } from '../types';

const config: EremosConfig = {
  solana: {
    rpcUrl: 'https://api.devnet.solana.com',
    timeout: 30000,
    maxRetries: 3
  },
  agents: {
    HelloWorldAgent: {
      enabled: true,
      interval: 10000, // 10 seconds
      confidenceThreshold: 0.5
    }
  },
  signals: {
    outputPath: './example-signals',
    outputFormat: 'json',
    minConfidence: 0.5
  },
  logging: {
    level: 'info'
  },
  performance: {
    maxMemoryUsage: 512,
    cacheEnabled: true
  }
};

export default config;
```

## Agent Development

### Token Launch Detection Agent

A complete example of a token launch detection agent:

```typescript
// examples/token-launch-agent.ts
import { BaseAgent, Signal, AgentConfig } from '../types';
import { getSignaturesForAddress, getTransaction } from '../utils/rpc';
import { isValidSolanaAddress, calculateConfidence } from '../utils';

interface LaunchData {
  tokenAddress: string;
  creator: string;
  timestamp: number;
  fundingSource?: string;
  marketCap?: number;
}

export class TokenLaunchAgent extends BaseAgent {
  name = 'TokenLaunchAgent';
  private knownPrograms = new Set([
    '11111111111111111111111111111112', // System Program
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // Token Program
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Token Metadata
  ]);
  
  protected async setup(): Promise<void> {
    this.logger.info('Setting up token launch detection');
    // Initialize any required connections or state
  }
  
  protected async performMonitoring(): Promise<void> {
    try {
      // Monitor recent transactions for token creation patterns
      const recentSignatures = await this.getRecentSignatures();
      
      for (const sig of recentSignatures) {
        const launchData = await this.analyzeTransaction(sig);
        
        if (launchData && this.isHighConfidenceLaunch(launchData)) {
          await this.emitLaunchSignal(launchData);
        }
      }
    } catch (error) {
      this.logger.error(`Monitoring error: ${error.message}`);
    }
  }
  
  private async getRecentSignatures(): Promise<string[]> {
    // This is a simplified example - in reality, you'd monitor specific programs
    // or use websocket subscriptions for real-time data
    return [];
  }
  
  private async analyzeTransaction(signature: string): Promise<LaunchData | null> {
    try {
      const tx = await getTransaction(signature);
      
      if (!tx?.meta?.postTokenBalances) return null;
      
      // Look for token creation patterns
      const tokenCreation = this.detectTokenCreation(tx);
      
      if (tokenCreation) {
        return {
          tokenAddress: tokenCreation.mint,
          creator: tokenCreation.owner,
          timestamp: tx.blockTime! * 1000,
          fundingSource: await this.detectFundingSource(tokenCreation.owner)
        };
      }
      
      return null;
    } catch (error) {
      this.logger.warn(`Failed to analyze transaction ${signature}: ${error.message}`);
      return null;
    }
  }
  
  private detectTokenCreation(tx: any): { mint: string; owner: string } | null {
    // Simplified token creation detection
    // In reality, you'd parse instruction data to detect mint instructions
    const newTokens = tx.meta?.postTokenBalances?.filter((balance: any) => 
      balance.uiTokenAmount.uiAmount > 0
    );
    
    if (newTokens?.length > 0) {
      return {
        mint: newTokens[0].mint,
        owner: newTokens[0].owner
      };
    }
    
    return null;
  }
  
  private async detectFundingSource(address: string): Promise<string | undefined> {
    try {
      const signatures = await getSignaturesForAddress(address, { limit: 10 });
      
      // Look for CEX funding patterns
      for (const sig of signatures) {
        const tx = await getTransaction(sig.signature);
        
        if (this.isCEXFunding(tx)) {
          return this.identifyCEX(tx);
        }
      }
      
      return undefined;
    } catch (error) {
      return undefined;
    }
  }
  
  private isCEXFunding(tx: any): boolean {
    // Simplified CEX detection logic
    // Look for large round-number transfers from known CEX addresses
    return false;
  }
  
  private identifyCEX(tx: any): string {
    // Identify which CEX based on transaction patterns
    return 'unknown';
  }
  
  private isHighConfidenceLaunch(data: LaunchData): boolean {
    const confidence = calculateConfidence({
      fundingSource: data.fundingSource === 'coinbase' ? 0.3 : 0.1,
      timingPattern: 0.2, // Fast deployment after funding
      walletLinkage: 0.2, // Multiple related wallets
      metadataQuality: 0.2 // Complete token metadata
    });
    
    return confidence >= this.config.confidenceThreshold;
  }
  
  private async emitLaunchSignal(data: LaunchData): Promise<void> {
    const signal: Signal = {
      agent: this.name,
      type: 'launch_detected',
      glyph: 'Δ',
      hash: this.createHash(data.tokenAddress),
      timestamp: new Date().toISOString(),
      source: 'token-launch-agent',
      confidence: this.calculateLaunchConfidence(data),
      data: {
        tokenAddress: data.tokenAddress,
        creator: data.creator,
        fundingSource: data.fundingSource,
        marketCap: data.marketCap,
        launchTime: data.timestamp
      }
    };
    
    await this.emitSignal(signal);
    this.logger.info(`🚀 Token launch detected: ${data.tokenAddress}`);
  }
  
  private calculateLaunchConfidence(data: LaunchData): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on funding source
    if (data.fundingSource === 'coinbase') confidence += 0.2;
    if (data.fundingSource === 'binance') confidence += 0.15;
    
    // Boost confidence based on timing
    const timeSinceCreation = Date.now() - data.timestamp;
    if (timeSinceCreation < 60000) confidence += 0.1; // Very recent
    
    return Math.min(1.0, confidence);
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`Token launch agent error: ${error.message}`);
    
    // Emit error signal
    await this.emitSignal({
      agent: this.name,
      type: 'agent_error',
      glyph: '❌',
      hash: this.createHash(error.message),
      timestamp: new Date().toISOString(),
      source: 'token-launch-agent',
      confidence: 1.0,
      data: {
        error: error.message,
        stack: error.stack
      }
    });
  }
}
```

### Whale Watching Agent

Monitor large wallet movements:

```typescript
// examples/whale-watcher-agent.ts
import { BaseAgent, Signal } from '../types';
import { getAccountInfo, getSignaturesForAddress } from '../utils/rpc';

interface WhaleActivity {
  wallet: string;
  amount: number;
  token: string;
  type: 'transfer' | 'swap' | 'stake';
  destination?: string;
}

export class WhaleWatcherAgent extends BaseAgent {
  name = 'WhaleWatcherAgent';
  
  private whaleWallets = [
    'A1B2C3...', // Known whale addresses
    'D4E5F6...',
    'G7H8I9...'
  ];
  
  private thresholds = {
    sol: 10000,      // 10k SOL
    usdc: 1000000,   // 1M USDC
    other: 100000    // 100k USD equivalent
  };
  
  protected async setup(): Promise<void> {
    this.logger.info(`Monitoring ${this.whaleWallets.length} whale wallets`);
  }
  
  protected async performMonitoring(): Promise<void> {
    for (const wallet of this.whaleWallets) {
      await this.monitorWhaleWallet(wallet);
    }
  }
  
  private async monitorWhaleWallet(wallet: string): Promise<void> {
    try {
      const signatures = await getSignaturesForAddress(wallet, { 
        limit: 5,
        until: this.getLastCheckedSignature(wallet)
      });
      
      for (const sig of signatures) {
        const activity = await this.analyzeWhaleTransaction(sig.signature, wallet);
        
        if (activity && this.isSignificantActivity(activity)) {
          await this.emitWhaleSignal(activity);
        }
      }
      
      this.updateLastChecked(wallet, signatures[0]?.signature);
    } catch (error) {
      this.logger.warn(`Failed to monitor whale wallet ${wallet}: ${error.message}`);
    }
  }
  
  private async analyzeWhaleTransaction(signature: string, wallet: string): Promise<WhaleActivity | null> {
    // Implementation would analyze transaction details
    // This is a simplified version
    return null;
  }
  
  private isSignificantActivity(activity: WhaleActivity): boolean {
    const threshold = this.thresholds[activity.token] || this.thresholds.other;
    return activity.amount >= threshold;
  }
  
  private async emitWhaleSignal(activity: WhaleActivity): Promise<void> {
    const signal: Signal = {
      agent: this.name,
      type: 'whale_activity',
      glyph: '🐋',
      hash: this.createHash(`${activity.wallet}-${activity.amount}-${Date.now()}`),
      timestamp: new Date().toISOString(),
      source: 'whale-watcher',
      confidence: 0.95,
      data: activity
    };
    
    await this.emitSignal(signal);
  }
  
  // Helper methods for tracking state
  private getLastCheckedSignature(wallet: string): string | undefined {
    // Implementation would retrieve from persistent storage
    return undefined;
  }
  
  private updateLastChecked(wallet: string, signature: string | undefined): void {
    // Implementation would save to persistent storage
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`Whale watcher error: ${error.message}`);
  }
}
```

## Signal Processing

### Custom Signal Processor

Example of a signal processor that enriches signals with additional data:

```typescript
// examples/signal-enrichment-processor.ts
import { SignalProcessor, Signal } from '../types';
import { getTokenMetadata, getCoinGeckoPrice } from '../utils/external';

export class SignalEnrichmentProcessor implements SignalProcessor {
  priority = 100; // High priority to run early
  
  canProcess(signal: Signal): boolean {
    return signal.type === 'launch_detected' && signal.data?.tokenAddress;
  }
  
  async process(signal: Signal): Promise<Signal> {
    const enrichedSignal = { ...signal };
    
    try {
      // Add token metadata
      if (signal.data?.tokenAddress) {
        const metadata = await getTokenMetadata(signal.data.tokenAddress);
        enrichedSignal.data = {
          ...signal.data,
          metadata: {
            name: metadata?.name,
            symbol: metadata?.symbol,
            description: metadata?.description,
            image: metadata?.image
          }
        };
      }
      
      // Add market data if available
      if (enrichedSignal.data?.metadata?.symbol) {
        const price = await getCoinGeckoPrice(enrichedSignal.data.metadata.symbol);
        if (price) {
          enrichedSignal.data.market = {
            price: price.usd,
            priceChange24h: price.usd_24h_change,
            marketCap: price.market_cap,
            volume24h: price.total_volume
          };
        }
      }
      
      // Add risk assessment
      enrichedSignal.data.riskAssessment = this.assessRisk(enrichedSignal);
      
      // Update confidence based on enriched data
      enrichedSignal.confidence = this.recalculateConfidence(enrichedSignal);
      
    } catch (error) {
      // Don't fail the signal if enrichment fails
      console.warn(`Signal enrichment failed: ${error.message}`);
    }
    
    return enrichedSignal;
  }
  
  private assessRisk(signal: Signal): any {
    const risks = [];
    
    // Check for red flags
    if (!signal.data?.metadata?.name) {
      risks.push('missing_name');
    }
    
    if (!signal.data?.metadata?.description) {
      risks.push('missing_description');
    }
    
    if (signal.data?.fundingSource === 'unknown') {
      risks.push('unknown_funding');
    }
    
    return {
      level: risks.length > 2 ? 'high' : risks.length > 0 ? 'medium' : 'low',
      flags: risks,
      score: Math.max(0, 1 - (risks.length * 0.2))
    };
  }
  
  private recalculateConfidence(signal: Signal): number {
    let confidence = signal.confidence;
    
    // Boost confidence for complete metadata
    if (signal.data?.metadata?.name && signal.data?.metadata?.description) {
      confidence += 0.1;
    }
    
    // Reduce confidence for high-risk signals
    if (signal.data?.riskAssessment?.level === 'high') {
      confidence -= 0.2;
    }
    
    return Math.min(1.0, Math.max(0.0, confidence));
  }
}
```

### Multi-Output Signal Handler

Example of routing signals to different outputs based on criteria:

```typescript
// examples/multi-output-handler.ts
import { OutputHandler, Signal } from '../types';
import { FileOutputHandler, WebhookOutputHandler, DatabaseOutputHandler } from '../utils/outputs';

export class MultiOutputHandler implements OutputHandler {
  private fileHandler = new FileOutputHandler();
  private webhookHandler = new WebhookOutputHandler();
  private dbHandler = new DatabaseOutputHandler();
  
  configure(config: any): void {
    // Configure each handler
    this.fileHandler.configure({
      path: config.filePath || './signals.json',
      format: 'json'
    });
    
    this.webhookHandler.configure({
      url: config.webhookUrl,
      secret: config.webhookSecret
    });
    
    this.dbHandler.configure({
      connectionString: config.databaseUrl
    });
  }
  
  async handle(signal: Signal): Promise<void> {
    // Always save to file for backup
    await this.fileHandler.handle(signal);
    
    // High-confidence signals go to webhook
    if (signal.confidence >= 0.8) {
      try {
        await this.webhookHandler.handle(signal);
      } catch (error) {
        console.warn(`Webhook delivery failed: ${error.message}`);
      }
    }
    
    // Critical signals go to database
    if (signal.type === 'launch_detected' || signal.confidence >= 0.9) {
      try {
        await this.dbHandler.handle(signal);
      } catch (error) {
        console.warn(`Database storage failed: ${error.message}`);
      }
    }
    
    // Error signals get special handling
    if (signal.type === 'agent_error' || signal.type === 'system_error') {
      await this.handleErrorSignal(signal);
    }
  }
  
  private async handleErrorSignal(signal: Signal): Promise<void> {
    // Send to monitoring/alerting system
    console.error('Error signal received:', signal);
    
    // Could integrate with services like PagerDuty, Slack, etc.
  }
  
  isReady(): boolean {
    return this.fileHandler.isReady() && 
           this.webhookHandler.isReady() && 
           this.dbHandler.isReady();
  }
}
```

## Configuration Examples

### Production Configuration

Example production configuration with performance optimizations:

```typescript
// examples/production-config.ts
export const productionConfig = {
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    timeout: 30000,
    maxRetries: 5,
    retryDelay: 1000
  },
  
  agents: {
    TokenLaunchAgent: {
      enabled: true,
      interval: 2000, // 2 seconds for fast detection
      confidenceThreshold: 0.8,
      maxConcurrent: 3
    },
    
    WhaleWatcherAgent: {
      enabled: true,
      interval: 10000, // 10 seconds
      confidenceThreshold: 0.7,
      custom: {
        whaleThresholds: {
          sol: 50000,
          usdc: 5000000
        }
      }
    },
    
    GhostWatcherAgent: {
      enabled: false, // Disabled in production for now
      interval: 60000,
      confidenceThreshold: 0.6
    }
  },
  
  signals: {
    outputPath: '/var/log/eremos/signals',
    outputFormat: 'json',
    minConfidence: 0.5,
    rateLimit: 1000, // Max signals per minute
    compression: true
  },
  
  logging: {
    level: 'info',
    outputPath: '/var/log/eremos/app.log',
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 10
  },
  
  performance: {
    maxMemoryUsage: 2048, // 2GB
    cacheEnabled: true,
    cacheTTL: 300000, // 5 minutes
    memoryCheckInterval: 60000
  },
  
  security: {
    enableCORS: false,
    rateLimitRequests: 10000,
    encryptSensitiveData: true
  },
  
  monitoring: {
    healthCheckPort: 3001,
    metricsPort: 3002,
    enableProfiling: false
  }
};
```

### Development Configuration

Configuration optimized for development and debugging:

```typescript
// examples/development-config.ts
export const developmentConfig = {
  solana: {
    rpcUrl: 'https://api.devnet.solana.com',
    timeout: 60000, // Longer timeout for debugging
    maxRetries: 1 // Fail fast in development
  },
  
  agents: {
    TokenLaunchAgent: {
      enabled: true,
      interval: 10000, // Slower for debugging
      confidenceThreshold: 0.5, // Lower threshold to see more signals
      custom: {
        debugMode: true,
        verboseLogging: true
      }
    }
  },
  
  signals: {
    outputPath: './dev-signals',
    outputFormat: 'json',
    minConfidence: 0.1, // Very low for testing
    includeDebugInfo: true
  },
  
  logging: {
    level: 'debug',
    outputPath: './logs/dev.log',
    colorized: true,
    prettyPrint: true
  },
  
  performance: {
    maxMemoryUsage: 512, // Lower memory limit
    cacheEnabled: false, // Disable cache for testing
    enableProfiling: true
  },
  
  development: {
    mockRPCResponses: false,
    simulationMode: false,
    enableHotReload: true,
    debugWebUI: true
  }
};
```

## Integration Examples

### Discord Notification Integration

```typescript
// examples/discord-integration.ts
import { OutputHandler, Signal } from '../types';
import axios from 'axios';

export class DiscordNotificationHandler implements OutputHandler {
  private webhookUrl: string = '';
  private username: string = 'Eremos';
  
  configure(config: { webhookUrl: string; username?: string }): void {
    this.webhookUrl = config.webhookUrl;
    this.username = config.username || 'Eremos';
  }
  
  async handle(signal: Signal): Promise<void> {
    if (signal.confidence < 0.8) return; // Only high-confidence signals
    
    const embed = this.createEmbed(signal);
    
    await axios.post(this.webhookUrl, {
      username: this.username,
      embeds: [embed]
    });
  }
  
  private createEmbed(signal: Signal): any {
    const color = this.getColorForSignal(signal);
    
    const embed = {
      title: `${signal.glyph} ${signal.type.replace('_', ' ').toUpperCase()}`,
      color: color,
      timestamp: signal.timestamp,
      fields: [
        {
          name: 'Agent',
          value: signal.agent,
          inline: true
        },
        {
          name: 'Confidence',
          value: `${(signal.confidence * 100).toFixed(1)}%`,
          inline: true
        }
      ]
    };
    
    // Add specific fields based on signal type
    if (signal.type === 'launch_detected' && signal.data) {
      embed.fields.push(
        {
          name: 'Token Address',
          value: `\`${signal.data.tokenAddress}\``,
          inline: false
        },
        {
          name: 'Creator',
          value: `\`${signal.data.creator}\``,
          inline: false
        }
      );
      
      if (signal.data.fundingSource) {
        embed.fields.push({
          name: 'Funding Source',
          value: signal.data.fundingSource,
          inline: true
        });
      }
    }
    
    return embed;
  }
  
  private getColorForSignal(signal: Signal): number {
    if (signal.confidence >= 0.9) return 0x00ff00; // Green
    if (signal.confidence >= 0.7) return 0xffff00; // Yellow
    return 0xff0000; // Red
  }
  
  isReady(): boolean {
    return !!this.webhookUrl;
  }
}

// Usage example
const discordHandler = new DiscordNotificationHandler();
discordHandler.configure({
  webhookUrl: 'https://discord.com/api/webhooks/...',
  username: 'Eremos Bot'
});
```

### Telegram Bot Integration

```typescript
// examples/telegram-integration.ts
import { OutputHandler, Signal } from '../types';
import axios from 'axios';

export class TelegramNotificationHandler implements OutputHandler {
  private botToken: string = '';
  private chatId: string = '';
  
  configure(config: { botToken: string; chatId: string }): void {
    this.botToken = config.botToken;
    this.chatId = config.chatId;
  }
  
  async handle(signal: Signal): Promise<void> {
    if (signal.confidence < 0.8) return;
    
    const message = this.formatMessage(signal);
    
    await axios.post(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });
  }
  
  private formatMessage(signal: Signal): string {
    let message = `${signal.glyph} *${signal.type.replace('_', ' ').toUpperCase()}*\n\n`;
    message += `*Agent:* ${signal.agent}\n`;
    message += `*Confidence:* ${(signal.confidence * 100).toFixed(1)}%\n`;
    message += `*Time:* ${new Date(signal.timestamp).toLocaleString()}\n\n`;
    
    if (signal.type === 'launch_detected' && signal.data) {
      message += `*Token:* \`${signal.data.tokenAddress}\`\n`;
      message += `*Creator:* \`${signal.data.creator}\`\n`;
      
      if (signal.data.fundingSource) {
        message += `*Funding:* ${signal.data.fundingSource}\n`;
      }
      
      if (signal.data.metadata?.name) {
        message += `*Name:* ${signal.data.metadata.name}\n`;
      }
    }
    
    return message;
  }
  
  isReady(): boolean {
    return !!this.botToken && !!this.chatId;
  }
}
```

## Real-World Scenarios

### Scenario 1: MEV Detection System

```typescript
// examples/mev-detection-scenario.ts
import { BaseAgent, Signal } from '../types';

export class MEVDetectionAgent extends BaseAgent {
  name = 'MEVDetectionAgent';
  
  private mevPatterns = {
    arbitrage: /arbitrage|arb/i,
    sandwich: /sandwich/i,
    frontrun: /frontrun|front.run/i,
    backrun: /backrun|back.run/i
  };
  
  protected async setup(): Promise<void> {
    this.logger.info('Setting up MEV detection patterns');
  }
  
  protected async performMonitoring(): Promise<void> {
    // Monitor DEX transactions for MEV patterns
    const recentTxs = await this.getRecentDEXTransactions();
    
    for (const tx of recentTxs) {
      const mevAnalysis = await this.analyzeMEVTransaction(tx);
      
      if (mevAnalysis.isMEV && mevAnalysis.confidence > 0.7) {
        await this.emitMEVSignal(mevAnalysis);
      }
    }
  }
  
  private async getRecentDEXTransactions(): Promise<any[]> {
    // Implementation would monitor DEX program calls
    return [];
  }
  
  private async analyzeMEVTransaction(tx: any): Promise<any> {
    // Analyze transaction for MEV patterns
    const analysis = {
      isMEV: false,
      confidence: 0,
      type: 'unknown',
      profitEstimate: 0,
      txSignature: tx.signature
    };
    
    // Check for arbitrage patterns
    if (this.detectArbitrage(tx)) {
      analysis.isMEV = true;
      analysis.type = 'arbitrage';
      analysis.confidence = 0.8;
    }
    
    // Check for sandwich attacks
    if (this.detectSandwich(tx)) {
      analysis.isMEV = true;
      analysis.type = 'sandwich';
      analysis.confidence = 0.9;
    }
    
    return analysis;
  }
  
  private detectArbitrage(tx: any): boolean {
    // Implementation would check for multi-DEX trades
    return false;
  }
  
  private detectSandwich(tx: any): boolean {
    // Implementation would check for sandwich patterns
    return false;
  }
  
  private async emitMEVSignal(analysis: any): Promise<void> {
    const signal: Signal = {
      agent: this.name,
      type: 'mev_detected',
      glyph: '🤖',
      hash: this.createHash(analysis.txSignature),
      timestamp: new Date().toISOString(),
      source: 'mev-detection',
      confidence: analysis.confidence,
      data: {
        mevType: analysis.type,
        txSignature: analysis.txSignature,
        profitEstimate: analysis.profitEstimate,
        timestamp: Date.now()
      }
    };
    
    await this.emitSignal(signal);
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`MEV detection error: ${error.message}`);
  }
}
```

### Scenario 2: Multi-Chain Monitoring

```typescript
// examples/multi-chain-scenario.ts
import { BaseAgent, Signal } from '../types';

export class MultiChainBridgeAgent extends BaseAgent {
  name = 'MultiChainBridgeAgent';
  
  private bridgeContracts = {
    wormhole: '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5',
    allbridge: 'A11br1dgeFr2fHJ9dQdqGSwxd1DKkPx1k8Z7LGvZmJGk',
    sollet: 'SLt1dgeFr2fHJ9dQdqGSwxd1DKkPx1k8Z7LGvZmJGk'
  };
  
  protected async setup(): Promise<void> {
    this.logger.info('Setting up multi-chain bridge monitoring');
  }
  
  protected async performMonitoring(): Promise<void> {
    for (const [bridgeName, contractAddress] of Object.entries(this.bridgeContracts)) {
      await this.monitorBridge(bridgeName, contractAddress);
    }
  }
  
  private async monitorBridge(bridgeName: string, contractAddress: string): Promise<void> {
    try {
      const bridgeActivity = await this.getBridgeActivity(contractAddress);
      
      for (const activity of bridgeActivity) {
        if (this.isSignificantBridgeActivity(activity)) {
          await this.emitBridgeSignal(bridgeName, activity);
        }
      }
    } catch (error) {
      this.logger.warn(`Failed to monitor ${bridgeName}: ${error.message}`);
    }
  }
  
  private async getBridgeActivity(contractAddress: string): Promise<any[]> {
    // Implementation would fetch bridge transactions
    return [];
  }
  
  private isSignificantBridgeActivity(activity: any): boolean {
    // Check for large transfers or unusual patterns
    return activity.amount > 100000; // $100k threshold
  }
  
  private async emitBridgeSignal(bridgeName: string, activity: any): Promise<void> {
    const signal: Signal = {
      agent: this.name,
      type: 'bridge_activity',
      glyph: '🌉',
      hash: this.createHash(`${bridgeName}-${activity.txHash}`),
      timestamp: new Date().toISOString(),
      source: 'bridge-monitor',
      confidence: 0.85,
      data: {
        bridge: bridgeName,
        amount: activity.amount,
        token: activity.token,
        sourceChain: activity.sourceChain,
        destinationChain: activity.destinationChain,
        txHash: activity.txHash
      }
    };
    
    await this.emitSignal(signal);
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`Bridge monitoring error: ${error.message}`);
  }
}
```

## Best Practices

### 1. Agent Design Patterns

```typescript
// Follow the Single Responsibility Principle
class GoodAgent extends BaseAgent {
  name = 'TokenLaunchAgent';
  
  // Focused on one specific task
  protected async performMonitoring(): Promise<void> {
    await this.detectTokenLaunches();
  }
}

// Avoid doing too many things in one agent
class BadAgent extends BaseAgent {
  name = 'EverythingAgent';
  
  protected async performMonitoring(): Promise<void> {
    await this.detectTokenLaunches();
    await this.monitorWhales();
    await this.checkBridges();
    await this.analyzeMEV();
    // Too many responsibilities!
  }
}
```

### 2. Error Handling

```typescript
// Good error handling with specific recovery strategies
protected async performMonitoring(): Promise<void> {
  try {
    await this.fetchData();
  } catch (error) {
    if (error instanceof RPCTimeoutError) {
      // Specific handling for timeout
      await this.switchToBackupRPC();
      return;
    }
    
    if (error instanceof RateLimitError) {
      // Specific handling for rate limits
      await this.delayAndRetry();
      return;
    }
    
    // Generic error handling
    this.logger.error(`Unexpected error: ${error.message}`);
    throw error;
  }
}
```

### 3. Resource Management

```typescript
// Good resource management
class ResourceAwareAgent extends BaseAgent {
  private connections: Connection[] = [];
  
  protected async setup(): Promise<void> {
    // Initialize resources
    this.connections = await this.createConnections();
  }
  
  async cleanup(): Promise<void> {
    // Always clean up resources
    await Promise.all(
      this.connections.map(conn => conn.close())
    );
    this.connections = [];
  }
}
```

### 4. Configuration Management

```typescript
// Good configuration handling
class ConfigurableAgent extends BaseAgent {
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    super();
    this.config = this.validateConfig(config);
  }
  
  private validateConfig(config: AgentConfig): AgentConfig {
    if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) {
      throw new Error('Confidence threshold must be between 0 and 1');
    }
    
    if (config.interval < 1000) {
      this.logger.warn('Very short interval may cause rate limiting');
    }
    
    return config;
  }
}
```

### 5. Testing Your Agents

```typescript
// Example test structure
describe('TokenLaunchAgent', () => {
  let agent: TokenLaunchAgent;
  
  beforeEach(() => {
    agent = new TokenLaunchAgent({
      enabled: true,
      interval: 5000,
      confidenceThreshold: 0.7
    });
  });
  
  test('should detect valid token launch', async () => {
    // Mock the RPC response
    jest.spyOn(rpcUtils, 'getTransaction').mockResolvedValue({
      /* mock transaction data */
    });
    
    const emitSpy = jest.spyOn(agent, 'emitSignal');
    
    await agent.monitor();
    
    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'launch_detected',
        confidence: expect.any(Number)
      })
    );
  });
});
```

These examples provide a comprehensive foundation for building sophisticated blockchain monitoring systems with Eremos. Start with the basic examples and gradually incorporate more advanced patterns as your needs grow.
