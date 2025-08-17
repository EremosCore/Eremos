# Getting Started with Eremos

Welcome to Eremos! This guide will help you set up the framework and create your first autonomous agents for Solana blockchain monitoring.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Initial Setup](#initial-setup)
- [Understanding Agents](#understanding-agents)
- [Running Your First Agent](#running-your-first-agent)
- [Creating Custom Agents](#creating-custom-agents)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Prerequisites

### System Requirements

Before you begin, ensure your system meets these requirements:

- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free space for installation and data
- **Network**: Stable internet connection for RPC calls

### Software Dependencies

Install these tools before proceeding:

1. **Node.js** (v18.0.0 or higher)
   ```bash
   # Check your version
   node --version
   
   # If you need to install/update Node.js:
   # Visit https://nodejs.org/ or use a version manager
   # For macOS/Linux with nvm:
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **npm** (v8.0.0 or higher)
   ```bash
   # Check your version
   npm --version
   
   # Update npm if needed
   npm install -g npm@latest
   ```

3. **Git**
   ```bash
   # Check if Git is installed
   git --version
   
   # Install Git if needed:
   # Windows: Download from https://git-scm.com/
   # macOS: Install Xcode Command Line Tools
   # Ubuntu: sudo apt-get install git
   ```

### Solana Knowledge (Recommended)

While not required, basic familiarity with these concepts will help:
- Solana blockchain fundamentals
- Wallet addresses and transactions
- RPC endpoints and API calls
- TypeScript/JavaScript programming

## Installation

### 1. Clone the Repository

```bash
# Clone Eremos
git clone https://github.com/EremosCore/Eremos.git

# Navigate to the project directory
cd Eremos
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# Verify installation
npm run validate
```

### 3. Verify Installation

Check that everything is working correctly:

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test
```

If all commands complete successfully, your installation is ready!

## Initial Setup

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
# Copy the example file
cp .env.example .env.local

# Edit the configuration
# Use your preferred editor (nano, vim, VS Code, etc.)
nano .env.local
```

### 2. Basic Configuration

For a quick start, configure these essential settings in `.env.local`:

```bash
# Required: Solana RPC endpoint
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Recommended: Set log level for debugging
AGENT_LOG_LEVEL=info

# Optional: Enable specific agents
AGENT_THERON_ENABLED=true
AGENT_OBSERVER_ENABLED=true
```

### 3. RPC Endpoint Selection

Choose an appropriate RPC endpoint for your needs:

**Free Options (Good for Testing):**
```bash
# Solana Foundation (free, rate-limited)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# For development/testing
SOLANA_RPC_URL=https://api.devnet.solana.com
```

**Premium Options (Better Performance):**
```bash
# QuickNode (requires API key)
SOLANA_RPC_URL=https://your-endpoint.solana-mainnet.quiknode.pro/your-api-key/

# Helius (requires API key)
SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=your-api-key

# Alchemy (requires API key)
SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/your-api-key
```

### 4. Test Your Configuration

Verify your setup works:

```bash
# Test basic functionality
npm run dev

# Should output something like:
# [Eremos] Starting agent framework...
# [Eremos] RPC connection established
# [Theron] Agent initialized
```

## Understanding Agents

### What are Agents?

Agents are autonomous programs that monitor the Solana blockchain for specific patterns or events. Each agent:

- **Monitors** specific blockchain activities
- **Analyzes** transaction patterns
- **Emits** structured signals when interesting events are detected
- **Operates** independently with minimal resource usage

### Built-in Agents

Eremos comes with several pre-built agents:

1. **Theron (Agent-000)**: General-purpose monitoring agent
2. **Observer**: Tracks wallet activities and interactions
3. **Launch Tracker**: Detects new token launches
4. **Harvester**: Collects and analyzes transaction data
5. **Ghost Watcher**: Monitors dormant wallets that become active

### Agent Lifecycle

Each agent follows this lifecycle:

```
Initialize → Monitor → Analyze → Signal → Repeat
```

1. **Initialize**: Set up monitoring parameters
2. **Monitor**: Watch blockchain for relevant events
3. **Analyze**: Process events and calculate confidence scores
4. **Signal**: Emit structured alerts when thresholds are met
5. **Repeat**: Continue monitoring cycle

## Running Your First Agent

### 1. Start the Framework

```bash
# Start all enabled agents
npm run dev

# Or start individual agents
npm run agent:theron
```

### 2. Understanding Output

Agent output includes:

```bash
[2025-08-17T15:30:42Z] [Theron] Agent initialized
[2025-08-17T15:30:43Z] [Theron] Monitoring blockchain...
[2025-08-17T15:30:45Z] [Theron] → Fresh funding detected (wallet: 6Yxk...P2M8)
[2025-08-17T15:30:48Z] [Theron] → Token creation detected (confidence: 0.91)
[2025-08-17T15:30:48Z] [Theron] 🎯 SIGNAL EMITTED:
{
  "agent": "Theron",
  "type": "launch_detected",
  "glyph": "Δ",
  "confidence": 0.91,
  "timestamp": "2025-08-17T15:30:48Z"
}
```

### 3. Signal Interpretation

- **Confidence Score**: 0.0-1.0 (higher = more reliable)
- **Glyph**: Visual identifier for signal type
- **Timestamp**: When the event was detected
- **Type**: Category of detected activity

### 4. Monitoring Multiple Agents

```bash
# Run multiple agents simultaneously
npm run agents:all

# Monitor logs in real-time
tail -f logs/eremos.log
```

## Creating Custom Agents

### 1. Agent Template

Create a new agent by copying the example:

```bash
# Copy the example agent
cp agents/example.ts agents/my-custom-agent.ts
```

### 2. Basic Agent Structure

```typescript
import { Agent, Signal } from '../types';
import { emitSignal, logger } from '../utils';

export class MyCustomAgent implements Agent {
  name = 'MyCustomAgent';
  
  async initialize(): Promise<void> {
    logger.info(`[${this.name}] Initializing...`);
    // Setup code here
  }
  
  async monitor(): Promise<void> {
    // Main monitoring logic
    const event = await this.checkForCustomEvent();
    
    if (event && this.meetsThreshold(event)) {
      const signal: Signal = {
        agent: this.name,
        type: 'custom_detection',
        glyph: '⚡',
        hash: this.generateHash(event),
        timestamp: new Date().toISOString(),
        source: 'custom-agent',
        confidence: this.calculateConfidence(event)
      };
      
      emitSignal(signal);
    }
  }
  
  private async checkForCustomEvent(): Promise<any> {
    // Your custom detection logic
    return null;
  }
  
  private meetsThreshold(event: any): boolean {
    // Define your confidence threshold
    return true;
  }
  
  private calculateConfidence(event: any): number {
    // Calculate confidence score (0-1)
    return 0.8;
  }
  
  private generateHash(event: any): string {
    // Generate unique hash for the event
    return `custom_${Date.now()}`;
  }
}
```

### 3. Register Your Agent

Add your agent to the framework:

```typescript
// In your main file or agent registry
import { MyCustomAgent } from './agents/my-custom-agent';

const customAgent = new MyCustomAgent();
customAgent.initialize();
```

### 4. Test Your Agent

```bash
# Add a script to package.json
"agent:my-custom": "ts-node agents/my-custom-agent.ts"

# Run your agent
npm run agent:my-custom
```

## Configuration

### Environment Variables

Key configuration options:

```bash
# Agent behavior
AGENT_POLLING_INTERVAL=5000    # How often to check (ms)
CONFIDENCE_THRESHOLD_DEFAULT=0.7  # Minimum confidence to emit signals
AGENT_MAX_CONCURRENT=5         # Max agents running simultaneously

# Performance
RPC_TIMEOUT=30000             # RPC call timeout
CACHE_ENABLED=true            # Enable result caching
MAX_MEMORY_USAGE=1024         # Memory limit (MB)

# Output
SIGNAL_OUTPUT_PATH=./signals  # Where to save signals
SIGNAL_OUTPUT_FORMAT=json     # Output format
AGENT_LOG_LEVEL=info         # Logging level
```

### Agent-Specific Configuration

Configure individual agents:

```bash
# Enable/disable agents
AGENT_THERON_ENABLED=true
AGENT_OBSERVER_ENABLED=false

# Agent intervals
AGENT_THERON_INTERVAL=5000
AGENT_OBSERVER_INTERVAL=3000

# Agent thresholds
CONFIDENCE_THRESHOLD_LAUNCH=0.8
CONFIDENCE_THRESHOLD_GHOST=0.6
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Your Agents

```bash
# Test in simulation mode
TEST_MODE=true npm run agent:theron

# Mock RPC responses for testing
MOCK_RPC_RESPONSES=true npm run dev
```

### Writing Tests

Create tests for your custom agents:

```typescript
// tests/agents/my-custom-agent.test.ts
import { MyCustomAgent } from '../../agents/my-custom-agent';

describe('MyCustomAgent', () => {
  let agent: MyCustomAgent;
  
  beforeEach(() => {
    agent = new MyCustomAgent();
  });
  
  test('should initialize correctly', async () => {
    await expect(agent.initialize()).resolves.not.toThrow();
  });
  
  test('should detect custom events', async () => {
    // Test your agent logic
  });
});
```

## Troubleshooting

### Common Issues

#### RPC Connection Errors
```bash
# Error: Connection timeout
# Solution: Check your RPC endpoint and network
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
  $SOLANA_RPC_URL
```

#### Permission Errors
```bash
# Error: EACCES permission denied
# Solution: Fix npm permissions or use a different directory
sudo chown -R $(whoami) ~/.npm
```

#### Memory Issues
```bash
# Error: JavaScript heap out of memory
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

#### TypeScript Compilation Errors
```bash
# Error: Type checking failed
# Solution: Run type checking to see specific errors
npm run type-check
```

### Getting Help

If you encounter issues:

1. **Check the logs**: Look in `logs/eremos.log` for detailed error messages
2. **Verify configuration**: Ensure `.env.local` is properly configured
3. **Test RPC connection**: Use `curl` to verify your RPC endpoint works
4. **Check system resources**: Ensure sufficient memory and disk space
5. **Search issues**: Look for similar problems in [GitHub Issues](https://github.com/EremosCore/Eremos/issues)
6. **Ask for help**: Create a new issue with detailed information

### Debug Mode

Enable detailed debugging:

```bash
# Enable debug logging
DEBUG=eremos:* npm run dev

# Enable verbose output
VERBOSE_LOGGING=true npm run dev

# Enable component-specific debugging
DEBUG_AGENTS=true DEBUG_RPC=true npm run dev
```

## Next Steps

Now that you have Eremos running, explore these advanced topics:

1. **[Architecture Guide](architecture.md)**: Understand the framework's design
2. **[API Reference](api-reference.md)**: Detailed documentation of types and interfaces
3. **[Examples](examples.md)**: Real-world usage patterns and scenarios
4. **[Contributing](contributing.md)**: How to contribute to the project
5. **[Advanced Configuration](configuration.md)**: Performance tuning and optimization

### Community Resources

- **Website**: [eremos.io](https://eremos.io)
- **Twitter**: [@EremosCore](https://twitter.com/EremosCore)
- **GitHub**: [EremosCore/Eremos](https://github.com/EremosCore/Eremos)
- **Discussions**: Join our [GitHub Discussions](https://github.com/EremosCore/Eremos/discussions)

Welcome to the Eremos community! 🎯
