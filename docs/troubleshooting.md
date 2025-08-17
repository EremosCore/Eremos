# Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with the Eremos framework. Issues are organized by category with step-by-step solutions.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Configuration Problems](#configuration-problems)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)
- [Network and RPC Issues](#network-and-rpc-issues)
- [Agent-Specific Issues](#agent-specific-issues)
- [Development Issues](#development-issues)
- [Debugging Tools](#debugging-tools)
- [Getting Help](#getting-help)

## Installation Issues

### Node.js Version Compatibility

**Problem**: "Error: Node.js version not supported"

**Solution**:
```bash
# Check your Node.js version
node --version

# If version is below 18.0.0, update Node.js
# Option 1: Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Option 2: Download from nodejs.org
# Visit https://nodejs.org/ and download the latest LTS version

# Verify installation
node --version
npm --version
```

### npm Installation Failures

**Problem**: "EACCES: permission denied" or "npm ERR! code EACCES"

**Solution**:
```bash
# Option 1: Fix npm permissions (recommended)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use sudo (not recommended for security)
sudo npm install -g npm@latest

# Option 3: Change npm's default directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

**Problem**: "gyp ERR! stack Error: EACCES: permission denied"

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If on Linux/macOS, you might need build tools
# Ubuntu/Debian:
sudo apt-get update
sudo apt-get install build-essential

# macOS:
xcode-select --install
```

### TypeScript Compilation Errors

**Problem**: "tsc: command not found" or TypeScript compilation fails

**Solution**:
```bash
# Install TypeScript globally
npm install -g typescript

# Or use local installation
npx tsc --version

# If compilation fails, check tsconfig.json
npm run type-check

# For specific TypeScript errors, see the output and fix:
# - Missing type declarations
# - Incorrect import paths
# - Type mismatches
```

## Configuration Problems

### Environment Variables Not Loading

**Problem**: "SOLANA_RPC_URL is not defined" or environment variables not working

**Solution**:
```bash
# 1. Check if .env.local exists
ls -la | grep .env

# 2. If not, copy from example
cp .env.example .env.local

# 3. Verify file contents
cat .env.local

# 4. Ensure no spaces around = in environment variables
# Good: SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Bad:  SOLANA_RPC_URL = https://api.mainnet-beta.solana.com

# 5. Check if variables are loaded in your application
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.SOLANA_RPC_URL);"
```

### Invalid Configuration Values

**Problem**: Configuration validation errors

**Solution**:
```typescript
// Check common configuration issues:

// 1. Invalid confidence thresholds (must be 0-1)
CONFIDENCE_THRESHOLD_DEFAULT=0.8  // ✅ Good
CONFIDENCE_THRESHOLD_DEFAULT=80   // ❌ Bad

// 2. Invalid intervals (must be positive numbers)
AGENT_POLLING_INTERVAL=5000       // ✅ Good  
AGENT_POLLING_INTERVAL=-1000      // ❌ Bad

// 3. Invalid RPC URLs
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  // ✅ Good
SOLANA_RPC_URL=invalid-url                          // ❌ Bad

// 4. Missing required variables
SOLANA_RPC_URL=  // ❌ Bad - RPC URL is required
```

**Validation script**:
```bash
# Create a validation script
node -e "
const config = require('./dist/config').loadConfig();
console.log('Configuration is valid:', config);
"
```

### Agent Configuration Issues

**Problem**: Agents not starting or behaving unexpectedly

**Solution**:
```bash
# 1. Check agent-specific configuration
DEBUG=eremos:agents npm run dev

# 2. Verify agent enable flags
AGENT_THERON_ENABLED=true
AGENT_OBSERVER_ENABLED=true

# 3. Check interval values (minimum 1000ms recommended)
AGENT_THERON_INTERVAL=5000

# 4. Verify confidence thresholds
CONFIDENCE_THRESHOLD_THERON=0.7

# 5. Test individual agents
npm run agent:theron
```

## Runtime Errors

### Memory Issues

**Problem**: "JavaScript heap out of memory" or high memory usage

**Solution**:
```bash
# 1. Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev

# 2. Check memory usage
# Add to your monitoring:
process.memoryUsage()

# 3. Implement memory cleanup in agents
class MemoryEfficientAgent extends BaseAgent {
  private memoryCheckInterval = setInterval(() => {
    const usage = process.memoryUsage();
    if (usage.heapUsed > 500 * 1024 * 1024) { // 500MB
      this.logger.warn('High memory usage detected', usage);
      // Implement cleanup logic
    }
  }, 30000);
  
  async cleanup() {
    clearInterval(this.memoryCheckInterval);
    // Clean up other resources
  }
}

# 4. Configure memory limits in environment
MAX_MEMORY_USAGE=1024
MEMORY_CHECK_INTERVAL=60000
```

### Unhandled Promise Rejections

**Problem**: "UnhandledPromiseRejectionWarning" or crashes due to async errors

**Solution**:
```typescript
// 1. Always handle async operations properly
async function safeAsyncOperation() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    logger.error('Operation failed:', error);
    // Handle error appropriately
    throw error; // or return default value
  }
}

// 2. Add global error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Graceful shutdown or error recovery
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Graceful shutdown
  process.exit(1);
});

// 3. Use proper error handling in agents
class RobustAgent extends BaseAgent {
  protected async performMonitoring(): Promise<void> {
    try {
      await this.doMonitoring();
    } catch (error) {
      await this.handleError(error);
      // Don't rethrow unless necessary
    }
  }
  
  protected async handleError(error: Error): Promise<void> {
    this.logger.error(`Agent error: ${error.message}`);
    
    // Implement retry logic
    if (this.shouldRetry(error)) {
      setTimeout(() => this.performMonitoring(), 5000);
    }
  }
}
```

### Signal Processing Errors

**Problem**: Signals not being emitted or processed correctly

**Solution**:
```typescript
// 1. Validate signal structure
function validateSignal(signal: Signal): boolean {
  const required = ['agent', 'type', 'hash', 'timestamp', 'source', 'confidence'];
  
  for (const field of required) {
    if (!signal[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  if (signal.confidence < 0 || signal.confidence > 1) {
    console.error('Confidence must be between 0 and 1');
    return false;
  }
  
  return true;
}

// 2. Debug signal emission
class DebuggingAgent extends BaseAgent {
  protected async emitSignal(signal: Signal): Promise<void> {
    console.log('Emitting signal:', JSON.stringify(signal, null, 2));
    
    if (!validateSignal(signal)) {
      throw new Error('Invalid signal structure');
    }
    
    await super.emitSignal(signal);
    console.log('Signal emitted successfully');
  }
}

// 3. Check signal processors
// Enable debugging for signal processing
DEBUG=eremos:signals npm run dev
```

## Performance Issues

### Slow Agent Performance

**Problem**: Agents running slowly or missing events

**Solution**:
```bash
# 1. Profile your application
npm run dev --inspect
# Open Chrome DevTools and go to chrome://inspect

# 2. Check RPC call performance
DEBUG=eremos:rpc npm run dev

# 3. Optimize polling intervals
# Balance between responsiveness and resource usage
AGENT_POLLING_INTERVAL=5000  # Start with 5 seconds
AGENT_POLLING_INTERVAL=2000  # Increase frequency if needed

# 4. Implement caching
CACHE_ENABLED=true
CACHE_TTL=300000  # 5 minutes

# 5. Use batch operations when possible
```

**Performance optimization techniques**:
```typescript
class OptimizedAgent extends BaseAgent {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private batchQueue: string[] = [];
  
  // Cache frequently accessed data
  private async getCachedData(key: string): Promise<any> {
    const cached = this.cache.get(key);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < 300000) { // 5 min cache
      return cached.data;
    }
    
    const data = await this.fetchData(key);
    this.cache.set(key, { data, timestamp: now });
    return data;
  }
  
  // Batch RPC calls
  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;
    
    const batch = this.batchQueue.splice(0, 10); // Process 10 at a time
    const results = await Promise.all(
      batch.map(item => this.processItem(item))
    );
    
    // Process results...
  }
}
```

### High CPU Usage

**Problem**: Node.js process consuming too much CPU

**Solution**:
```bash
# 1. Identify CPU-intensive operations
npm install clinic
npx clinic doctor -- node dist/index.js

# 2. Check for infinite loops or blocking operations
# Use CPU profiler in Chrome DevTools

# 3. Optimize algorithms
# - Use efficient data structures
# - Avoid nested loops when possible
# - Implement proper pagination

# 4. Add rate limiting
RATE_LIMIT_RPC_CALLS=100
RATE_LIMIT_WINDOW=60000
```

## Network and RPC Issues

### RPC Connection Timeouts

**Problem**: "Connection timeout" or "ECONNRESET" errors

**Solution**:
```bash
# 1. Check RPC endpoint status
curl -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' \
  $SOLANA_RPC_URL

# 2. Increase timeout values
RPC_TIMEOUT=60000
RPC_MAX_RETRIES=5
RPC_RETRY_DELAY=2000

# 3. Use backup RPC endpoints
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_RPC_BACKUP_URL=https://rpc.ankr.com/solana

# 4. Implement connection pooling
```

**Robust RPC configuration**:
```typescript
class RobustRPCManager {
  private endpoints = [
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
    'https://solana-api.projectserum.com'
  ];
  
  private currentEndpointIndex = 0;
  
  async call(method: string, params: any[]): Promise<any> {
    const maxAttempts = this.endpoints.length;
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const endpoint = this.endpoints[this.currentEndpointIndex];
        const result = await this.makeRequest(endpoint, method, params);
        return result;
      } catch (error) {
        lastError = error;
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % this.endpoints.length;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    throw lastError;
  }
}
```

### Rate Limiting Issues

**Problem**: "Too Many Requests" or rate limit errors

**Solution**:
```bash
# 1. Implement exponential backoff
RATE_LIMIT_BACKOFF=exponential
RATE_LIMIT_BASE_DELAY=1000
RATE_LIMIT_MAX_DELAY=30000

# 2. Use premium RPC endpoints
# QuickNode, Helius, Alchemy provide higher rate limits

# 3. Optimize request patterns
# - Batch requests when possible
# - Cache results to reduce calls
# - Use websockets for real-time data

# 4. Monitor rate limit usage
```

**Rate limiting implementation**:
```typescript
class RateLimitedRPC {
  private requests: number[] = [];
  private maxRequestsPerMinute = 100;
  
  async call(method: string, params: any[]): Promise<any> {
    await this.checkRateLimit();
    
    try {
      const result = await this.makeRequest(method, params);
      this.recordRequest();
      return result;
    } catch (error) {
      if (this.isRateLimitError(error)) {
        await this.handleRateLimit();
        return this.call(method, params); // Retry
      }
      throw error;
    }
  }
  
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    this.requests = this.requests.filter(time => time > oneMinuteAgo);
    
    if (this.requests.length >= this.maxRequestsPerMinute) {
      const waitTime = this.requests[0] + 60000 - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}
```

## Agent-Specific Issues

### Agent Not Starting

**Problem**: Agent doesn't initialize or start monitoring

**Diagnostic steps**:
```bash
# 1. Check agent configuration
DEBUG=eremos:agents npm run agent:theron

# 2. Verify agent is enabled
AGENT_THERON_ENABLED=true

# 3. Check for initialization errors
npm run agent:theron 2>&1 | grep -i error

# 4. Test agent in isolation
```

**Debug agent initialization**:
```typescript
class DebuggableAgent extends BaseAgent {
  async initialize(): Promise<void> {
    console.log(`[${this.name}] Starting initialization...`);
    
    try {
      console.log(`[${this.name}] Setting up connections...`);
      await this.setup();
      
      console.log(`[${this.name}] Validating configuration...`);
      this.validateConfig();
      
      console.log(`[${this.name}] Initialization complete!`);
    } catch (error) {
      console.error(`[${this.name}] Initialization failed:`, error);
      throw error;
    }
  }
  
  private validateConfig(): void {
    if (this.config.confidenceThreshold < 0 || this.config.confidenceThreshold > 1) {
      throw new Error('Invalid confidence threshold');
    }
    
    if (this.config.interval < 1000) {
      console.warn('Very short interval may cause issues');
    }
  }
}
```

### Signals Not Being Emitted

**Problem**: Agent runs but doesn't emit signals

**Solution**:
```typescript
class DiagnosticAgent extends BaseAgent {
  protected async performMonitoring(): Promise<void> {
    console.log(`[${this.name}] Starting monitoring cycle...`);
    
    try {
      const data = await this.fetchData();
      console.log(`[${this.name}] Fetched data:`, data);
      
      const analysis = await this.analyzeData(data);
      console.log(`[${this.name}] Analysis result:`, analysis);
      
      if (analysis.confidence > this.config.confidenceThreshold) {
        console.log(`[${this.name}] Confidence threshold met, emitting signal...`);
        await this.emitSignal(analysis.signal);
        console.log(`[${this.name}] Signal emitted successfully!`);
      } else {
        console.log(`[${this.name}] Confidence too low: ${analysis.confidence} < ${this.config.confidenceThreshold}`);
      }
    } catch (error) {
      console.error(`[${this.name}] Monitoring error:`, error);
    }
  }
}
```

### False Positives/Negatives

**Problem**: Agent detecting incorrect patterns or missing valid ones

**Solution**:
```typescript
// 1. Adjust confidence thresholds
CONFIDENCE_THRESHOLD_DEFAULT=0.7  // Start conservative
CONFIDENCE_THRESHOLD_DEFAULT=0.5  // Lower for more signals
CONFIDENCE_THRESHOLD_DEFAULT=0.9  // Higher for fewer, higher-quality signals

// 2. Implement validation logic
class ValidatingAgent extends BaseAgent {
  private async validateDetection(data: any): Promise<boolean> {
    // Multiple validation checks
    const checks = [
      this.checkDataIntegrity(data),
      this.checkPatternConsistency(data),
      this.checkHistoricalContext(data)
    ];
    
    const validChecks = checks.filter(Boolean).length;
    return validChecks >= 2; // Require at least 2 validations
  }
  
  private checkDataIntegrity(data: any): boolean {
    // Validate data structure and values
    return data && typeof data === 'object' && data.signature;
  }
  
  private checkPatternConsistency(data: any): boolean {
    // Check if pattern matches expected format
    return true; // Implement specific logic
  }
  
  private checkHistoricalContext(data: any): boolean {
    // Compare with historical patterns
    return true; // Implement specific logic
  }
}

// 3. Implement feedback mechanism
class LearningAgent extends BaseAgent {
  private falsePositiveThreshold = 0.1;
  private recentDetections: Array<{ signal: Signal; confirmed: boolean }> = [];
  
  private adjustConfidenceThreshold(): void {
    const recentFalsePositives = this.recentDetections
      .filter(d => !d.confirmed).length / this.recentDetections.length;
    
    if (recentFalsePositives > this.falsePositiveThreshold) {
      this.config.confidenceThreshold += 0.05;
      console.log(`Increased confidence threshold to ${this.config.confidenceThreshold}`);
    }
  }
}
```

## Development Issues

### Hot Reload Not Working

**Problem**: Changes not reflected during development

**Solution**:
```bash
# 1. Use ts-node-dev for hot reload
npm install --save-dev ts-node-dev

# 2. Update package.json script
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
}

# 3. Check file watching
# Ensure your editor doesn't use atomic writes
# VS Code: "files.watcherExclude" configuration

# 4. Clear cache if needed
rm -rf dist/
npm run clean
npm run build
```

### TypeScript Import Issues

**Problem**: "Cannot find module" or import path errors

**Solution**:
```bash
# 1. Check tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@agents/*": ["agents/*"],
      "@utils/*": ["utils/*"]
    }
  }
}

# 2. Verify file extensions
// Use .ts for TypeScript files
import { Agent } from './agent.ts';  // ❌ Bad
import { Agent } from './agent';     // ✅ Good

# 3. Check relative vs absolute imports
// Relative imports
import { BaseAgent } from '../base/agent';
// Absolute imports (if configured)
import { BaseAgent } from '@/base/agent';

# 4. Clear TypeScript cache
rm -rf dist/
npx tsc --build --clean
npm run build
```

### Testing Issues

**Problem**: Tests failing or not running

**Solution**:
```bash
# 1. Check Jest configuration
npx jest --showConfig

# 2. Verify test file patterns
# Jest looks for:
# - files in __tests__ folders
# - files with .test.ts or .spec.ts suffix

# 3. Fix common test issues
# Mock external dependencies
jest.mock('@solana/web3.js');

# 4. Debug test failures
npm run test -- --verbose
npm run test -- --no-cache
```

## Debugging Tools

### Enable Debug Logging

```bash
# General debugging
DEBUG=eremos:* npm run dev

# Component-specific debugging
DEBUG=eremos:agents npm run dev
DEBUG=eremos:rpc npm run dev
DEBUG=eremos:signals npm run dev

# Multiple components
DEBUG=eremos:agents,eremos:rpc npm run dev
```

### Memory Profiling

```bash
# Basic memory monitoring
node --trace-warnings dist/index.js

# Heap snapshots
node --inspect dist/index.js
# Open chrome://inspect in Chrome

# Memory usage tracking
```

### Performance Profiling

```bash
# CPU profiling
node --prof dist/index.js
# Generate report: node --prof-process isolate-*.log

# Flame graphs
npm install -g 0x
0x dist/index.js
```

### Custom Debugging Utilities

```typescript
// Debugging utility class
class DebugUtils {
  static logWithTimestamp(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
  
  static measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const start = Date.now();
      try {
        const result = await fn();
        const end = Date.now();
        console.log(`${name} took ${end - start}ms`);
        resolve(result);
      } catch (error) {
        const end = Date.now();
        console.log(`${name} failed after ${end - start}ms`);
        reject(error);
      }
    });
  }
  
  static deepLog(obj: any, maxDepth = 3): void {
    console.log(JSON.stringify(obj, null, 2));
  }
}

// Usage in agents
class DebuggableAgent extends BaseAgent {
  protected async performMonitoring(): Promise<void> {
    DebugUtils.logWithTimestamp(`[${this.name}] Starting monitoring`);
    
    const result = await DebugUtils.measureTime(
      `${this.name} monitoring cycle`,
      () => this.doMonitoring()
    );
    
    DebugUtils.logWithTimestamp(`[${this.name}] Monitoring complete`, result);
  }
}
```

## Getting Help

### Information to Collect

When seeking help, please include:

1. **Environment Information**:
   ```bash
   node --version
   npm --version
   cat package.json | grep version
   ```

2. **Error Messages**:
   ```bash
   # Full error output with stack trace
   npm run dev 2>&1 | tee error.log
   ```

3. **Configuration**:
   ```bash
   # Sanitized configuration (remove sensitive data)
   cat .env.local | sed 's/=.*/=***HIDDEN***/'
   ```

4. **System Information**:
   ```bash
   uname -a
   free -h  # Linux
   top -l 1 | head -20  # macOS
   ```

### Log Collection

```bash
# Enable comprehensive logging
DEBUG=eremos:* VERBOSE_LOGGING=true npm run dev > full.log 2>&1

# Collect system metrics
# Create a monitoring script
#!/bin/bash
while true; do
  echo "$(date): $(ps aux | grep node | grep -v grep)"
  echo "$(date): $(free -h)"
  sleep 60
done > monitoring.log &
```

### Community Resources

- **GitHub Issues**: [Report bugs and request features](https://github.com/EremosCore/Eremos/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/EremosCore/Eremos/discussions)
- **Discord**: [Join our community server](https://discord.gg/eremos) (if available)
- **Twitter**: [@EremosCore](https://twitter.com/EremosCore) for updates

### Creating Effective Issue Reports

When creating an issue:

1. **Use descriptive titles**: "RPC timeout errors on mainnet" vs "It doesn't work"
2. **Provide context**: What were you trying to do?
3. **Include reproduction steps**: Minimal steps to reproduce the issue
4. **Share error messages**: Complete error output, not just the last line
5. **Specify environment**: OS, Node.js version, Eremos version
6. **Include configuration**: Sanitized configuration (remove secrets)

### Template for Bug Reports

```markdown
## Bug Description
Brief description of the issue.

## Steps to Reproduce
1. Start with configuration X
2. Run command Y
3. See error Z

## Expected Behavior
What should have happened.

## Actual Behavior
What actually happened.

## Environment
- OS: 
- Node.js version: 
- npm version: 
- Eremos version: 

## Configuration
```bash
# Paste sanitized configuration here
```

## Error Messages
```
Paste full error output here
```

## Additional Context
Any other relevant information.
```

Remember: The more information you provide, the faster we can help you resolve the issue!
