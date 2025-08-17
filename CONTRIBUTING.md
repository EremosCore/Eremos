# Contributing to Eremos

Welcome to the Eremos community! We're excited that you're interested in contributing to our autonomous agent framework for Solana blockchain monitoring. This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Types of Contributions](#types-of-contributions)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Submitting Changes](#submitting-changes)
- [Review Process](#review-process)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

**In short: Be respectful, be inclusive, be collaborative.**

## Getting Started

### Prerequisites

Before you begin contributing, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Git** (latest version)
- **TypeScript** knowledge (intermediate level recommended)
- **Solana** basic understanding (helpful but not required)

### First Steps

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Eremos.git
   cd Eremos
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/EremosCore/Eremos.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Verify setup**:
   ```bash
   npm run validate
   ```

## Development Setup

### Environment Configuration

1. **Copy environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Configure for development**:
   ```bash
   # .env.local
   SOLANA_RPC_URL=https://api.devnet.solana.com
   AGENT_LOG_LEVEL=debug
   TEST_MODE=true
   DEBUG=eremos:*
   ```

### Development Tools

We use several tools to maintain code quality:

- **TypeScript** - Type safety and modern JavaScript features
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Husky** - Git hooks for quality gates

### IDE Setup

We recommend **Visual Studio Code** with these extensions:

- TypeScript and JavaScript Language Features (built-in)
- ESLint
- Prettier - Code formatter
- GitLens
- Solana

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Types of Contributions

We welcome various types of contributions:

### 🔧 Code Contributions

#### Agent Development
- **New Agents**: Create agents for specific monitoring patterns
- **Agent Improvements**: Enhance existing agent capabilities
- **Performance Optimizations**: Improve agent efficiency

#### Framework Features
- **Core Features**: Enhance the framework's core functionality
- **Utilities**: Add helpful utility functions
- **Signal Processing**: Improve signal handling and processing

#### Bug Fixes
- **Critical Bugs**: Security or data integrity issues
- **Functional Bugs**: Features not working as expected
- **Performance Issues**: Optimization opportunities

### 📚 Documentation

- **API Documentation**: TypeScript interfaces and method documentation
- **Tutorials**: Step-by-step guides for specific use cases
- **Examples**: Real-world usage examples
- **Architecture Docs**: System design and technical documentation

### 🎨 Design & UX

- **Visual Assets**: Logos, diagrams, illustrations
- **User Experience**: Interface design for tooling
- **Brand Guidelines**: Consistent visual identity

### 🧪 Testing

- **Unit Tests**: Test individual components
- **Integration Tests**: Test component interactions
- **Performance Tests**: Benchmark and optimization tests
- **End-to-End Tests**: Complete workflow testing

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Testing improvements
- `refactor/` - Code refactoring
- `perf/` - Performance improvements

**Examples:**
```bash
feature/ghost-wallet-agent
fix/rpc-connection-timeout
docs/api-reference-update
test/agent-lifecycle-tests
```

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Testing
- `chore` - Maintenance

**Examples:**
```bash
feat(agents): add ghost wallet detection agent

Add new agent that monitors long-dormant wallets for sudden activity.
Includes confidence scoring based on dormancy period and activity volume.

Closes #123

fix(rpc): handle connection timeout gracefully

Improve error handling for RPC connection timeouts and implement
automatic retry with exponential backoff.

docs: update API reference for Signal interface

Add detailed documentation for the new metadata field and provide
usage examples for custom signal processors.
```

### Development Process

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes** following our [coding standards](#coding-standards)

4. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request** on GitHub

## Coding Standards

### TypeScript Guidelines

#### 1. Type Safety
```typescript
// ✅ Good - Explicit types
interface AgentConfig {
  enabled: boolean;
  interval: number;
  confidenceThreshold: number;
}

// ❌ Bad - Implicit any
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good - Generic constraints
function processData<T extends { id: string }>(data: T): T {
  return { ...data, processed: true };
}
```

#### 2. Naming Conventions
```typescript
// ✅ Good - Descriptive names
class LaunchDetectionAgent implements Agent {
  private confidenceThreshold: number;
  
  async detectTokenLaunch(): Promise<Signal[]> {
    // Implementation
  }
}

// ❌ Bad - Unclear names
class LDA {
  private ct: number;
  
  async detect(): Promise<any[]> {
    // Implementation
  }
}
```

#### 3. Error Handling
```typescript
// ✅ Good - Specific error types
class AgentError extends Error {
  constructor(
    message: string,
    public agentName: string,
    public context?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}

// ✅ Good - Proper error handling
async function monitorBlockchain(): Promise<void> {
  try {
    const data = await fetchBlockchainData();
    await processData(data);
  } catch (error) {
    if (error instanceof RPCError) {
      logger.warn('RPC error, retrying...', { error: error.message });
      await retryWithBackoff();
    } else {
      logger.error('Unexpected error', { error });
      throw error;
    }
  }
}
```

### Code Organization

#### 1. File Structure
```
src/
├── agents/          # Agent implementations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── signals/         # Signal processing
├── config/          # Configuration management
├── errors/          # Error classes
└── index.ts         # Main export
```

#### 2. Import Organization
```typescript
// 1. Node.js modules
import fs from 'fs';
import path from 'path';

// 2. Third-party libraries
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

// 3. Internal modules (absolute imports)
import { Agent, Signal } from '@/types';
import { logger, emitSignal } from '@/utils';

// 4. Relative imports
import { BaseAgent } from './base-agent';
```

#### 3. Class Structure
```typescript
export class ExampleAgent extends BaseAgent {
  // 1. Public properties
  public readonly name = 'ExampleAgent';
  
  // 2. Private properties
  private readonly config: AgentConfig;
  private isRunning = false;
  
  // 3. Constructor
  constructor(config: AgentConfig) {
    super();
    this.config = config;
  }
  
  // 4. Public methods
  async initialize(): Promise<void> {
    // Implementation
  }
  
  async monitor(): Promise<void> {
    // Implementation
  }
  
  // 5. Private methods
  private async processData(data: any): Promise<void> {
    // Implementation
  }
}
```

### Performance Guidelines

1. **Async/Await**: Use for all async operations
2. **Connection Pooling**: Reuse connections when possible
3. **Caching**: Cache frequently accessed data
4. **Batch Operations**: Group multiple operations when possible
5. **Memory Management**: Clean up resources properly

```typescript
// ✅ Good - Resource cleanup
class ResourceManager {
  private connections: Connection[] = [];
  
  async cleanup(): Promise<void> {
    await Promise.all(
      this.connections.map(conn => conn.close())
    );
    this.connections = [];
  }
}
```

## Testing Guidelines

### Test Structure

We use **Jest** for testing. Organize tests to mirror the source structure:

```
tests/
├── agents/          # Agent tests
├── utils/           # Utility tests
├── signals/         # Signal processing tests
├── integration/     # Integration tests
└── fixtures/        # Test data
```

### Test Patterns

#### 1. Unit Tests
```typescript
// tests/agents/example-agent.test.ts
import { ExampleAgent } from '@/agents/example-agent';
import { AgentConfig } from '@/types';

describe('ExampleAgent', () => {
  let agent: ExampleAgent;
  let config: AgentConfig;
  
  beforeEach(() => {
    config = {
      enabled: true,
      interval: 5000,
      confidenceThreshold: 0.7
    };
    agent = new ExampleAgent(config);
  });
  
  afterEach(async () => {
    await agent.cleanup();
  });
  
  describe('initialization', () => {
    test('should initialize with valid config', async () => {
      await expect(agent.initialize()).resolves.not.toThrow();
      expect(agent.name).toBe('ExampleAgent');
    });
    
    test('should throw error with invalid config', async () => {
      const invalidConfig = { ...config, confidenceThreshold: -1 };
      const invalidAgent = new ExampleAgent(invalidConfig);
      
      await expect(invalidAgent.initialize()).rejects.toThrow();
    });
  });
  
  describe('monitoring', () => {
    test('should emit signal when conditions are met', async () => {
      const emitSpy = jest.spyOn(agent, 'emitSignal');
      
      // Mock data that should trigger a signal
      jest.spyOn(agent as any, 'fetchData').mockResolvedValue({
        confidence: 0.8,
        data: { tokenAddress: 'test123' }
      });
      
      await agent.monitor();
      
      expect(emitSpy).toHaveBeenCalledWith({
        agent: 'ExampleAgent',
        type: 'test_signal',
        confidence: 0.8,
        // ... other signal properties
      });
    });
  });
});
```

#### 2. Integration Tests
```typescript
// tests/integration/agent-framework.test.ts
import { EremosFramework } from '@/framework';
import { ExampleAgent } from '@/agents/example-agent';

describe('Agent Framework Integration', () => {
  let framework: EremosFramework;
  
  beforeEach(async () => {
    framework = new EremosFramework();
    await framework.initialize();
  });
  
  afterEach(async () => {
    await framework.shutdown();
  });
  
  test('should register and start agents', async () => {
    const agent = new ExampleAgent({ enabled: true, interval: 1000, confidenceThreshold: 0.7 });
    
    framework.registerAgent(agent);
    await framework.start();
    
    const status = framework.getAgentStatus('ExampleAgent');
    expect(status.status).toBe('running');
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- agents/example-agent.test.ts

# Run tests matching pattern
npm run test -- --testNamePattern="initialization"
```

## Documentation Guidelines

### Documentation Types

1. **Code Documentation** - JSDoc comments in code
2. **API Documentation** - Formal API reference
3. **User Guides** - How-to guides and tutorials
4. **Architecture Documentation** - System design docs

### JSDoc Standards

```typescript
/**
 * Represents an autonomous monitoring agent for blockchain events.
 * 
 * @example
 * ```typescript
 * const agent = new LaunchDetectionAgent({
 *   enabled: true,
 *   interval: 5000,
 *   confidenceThreshold: 0.8
 * });
 * 
 * await agent.initialize();
 * await agent.monitor();
 * ```
 */
export class LaunchDetectionAgent implements Agent {
  /**
   * Creates a new launch detection agent.
   * 
   * @param config - Agent configuration options
   * @throws {AgentError} When configuration is invalid
   */
  constructor(config: AgentConfig) {
    // Implementation
  }
  
  /**
   * Detects token launch events on the blockchain.
   * 
   * @returns Promise that resolves to array of detected signals
   * @throws {RPCError} When RPC call fails
   * @throws {AgentError} When agent is not initialized
   * 
   * @example
   * ```typescript
   * const signals = await agent.detectTokenLaunch();
   * console.log(`Found ${signals.length} potential launches`);
   * ```
   */
  async detectTokenLaunch(): Promise<Signal[]> {
    // Implementation
  }
}
```

### Markdown Guidelines

1. **Use clear headings** with proper hierarchy
2. **Include code examples** for all features
3. **Add table of contents** for long documents
4. **Use consistent formatting** throughout
5. **Include links** to related documentation

## Submitting Changes

### Pull Request Guidelines

#### 1. Before Submitting
- [ ] Code follows our style guidelines
- [ ] Tests pass locally (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Documentation is updated
- [ ] Commit messages follow our format

#### 2. Pull Request Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Documentation
- [ ] Code documentation updated
- [ ] API documentation updated
- [ ] User guides updated
- [ ] README updated (if needed)

## Screenshots/Examples
(If applicable, add screenshots or code examples)

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

#### 3. PR Best Practices

- **Keep PRs focused** - One feature or fix per PR
- **Write clear descriptions** - Explain what and why
- **Include tests** - All new code should have tests
- **Update documentation** - Keep docs in sync with code
- **Respond to feedback** - Address review comments promptly

## Review Process

### What We Look For

1. **Code Quality**
   - Follows TypeScript best practices
   - Proper error handling
   - Clear naming and structure
   - Performance considerations

2. **Testing**
   - Adequate test coverage
   - Tests cover edge cases
   - Integration tests for new features

3. **Documentation**
   - Code is well-documented
   - API changes are documented
   - User-facing changes have guides

4. **Compatibility**
   - No breaking changes (unless intentional)
   - Backward compatibility maintained
   - Performance impact considered

### Review Timeline

- **Initial Review**: Within 2-3 business days
- **Follow-up Reviews**: Within 1-2 business days
- **Merge**: After approval and all checks pass

### Review Feedback

We may ask for changes in these areas:
- Code structure and organization
- Test coverage and quality
- Documentation completeness
- Performance optimization
- Security considerations

## Community

### Getting Help

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bug reports and feature requests
- **Twitter** - [@EremosCore](https://twitter.com/EremosCore) for updates
- **Website** - [eremos.io](https://eremos.io) for latest information

### Recognition

Contributors are recognized in:
- **README.md** - Contributors section
- **Release Notes** - Feature acknowledgments
- **Twitter** - Public thanks for significant contributions

### Maintainer Guidelines

If you're interested in becoming a maintainer:
1. Consistently contribute high-quality code
2. Help review other contributors' PRs
3. Participate in project discussions
4. Demonstrate understanding of project goals

## Thank You

Your contributions make Eremos better for everyone in the Solana ecosystem. Whether you're fixing a bug, adding a feature, improving documentation, or helping other contributors, your work is valued and appreciated.

**Happy contributing! 🎯**

---

*For questions about contributing, please open a GitHub Discussion or reach out to the maintainers.*
