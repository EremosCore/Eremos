# Contributing to Eremos

Thank you for your interest in contributing to Eremos! This guide will help you get started with contributing to our blockchain agent ecosystem.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Workflow](#contributing-workflow)
- [Agent Development](#agent-development)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (v2.30.0 or higher)
- **TypeScript** (v5.0.0 or higher)

### Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/eremos.git
   cd eremos
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```
5. **Start development**:
   ```bash
   npm run dev
   ```

## Development Setup

### Environment Configuration

1. **Copy the environment template**:

   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables** in `.env`:

   ```env
   # Development settings
   NODE_ENV=development
   LOG_LEVEL=debug

   # Add any blockchain RPC endpoints or API keys as needed
   ```

### IDE Setup

We recommend using **Visual Studio Code** with the following extensions:

- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- GitLens

### Verification

Verify your setup by running:

```bash
# Run all tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check

# Build the project
npm run build
```

## Project Structure

```
eremos/
├── agents/           # Agent implementations
├── docs/            # Documentation
├── scripts/         # Development and utility scripts
├── tests/           # Test files
├── types/           # TypeScript type definitions
├── utils/           # Shared utilities
├── .github/         # GitHub templates and workflows
└── package.json     # Project configuration
```

### Key Directories

- **`agents/`**: Contains all agent implementations
- **`types/`**: TypeScript interfaces and type definitions
- **`utils/`**: Shared utilities for signal processing, logging, etc.
- **`tests/`**: Unit and integration tests
- **`docs/`**: Project documentation and guides

## Contributing Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/eremos-org/eremos/issues)
- Look for issues labeled `good first issue` for beginners
- Comment on the issue to indicate you're working on it

### 2. Create a Branch

Create a descriptive branch name:

```bash
git checkout -b feature/agent-defi-monitor
git checkout -b fix/signal-emission-bug
git checkout -b docs/agent-development-guide
```

### Branch Naming Conventions

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/improvements
- `agent/agent-name` - New agent implementations

### 3. Make Changes

- Write clean, well-documented code
- Follow our [code standards](#code-standards)
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run all tests
npm test

# Run specific test files
npm test -- --testPathPattern=agent

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### 5. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat(agents): add DeFi liquidity monitoring agent"
```

### 6. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub using our [PR template](.github/pull_request_template.md).

## Agent Development

### Agent Architecture

Agents in Eremos follow a specific pattern:

```typescript
import { BaseAgent, Signal, AgentConfig } from '../types/agent';

export class YourAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async initialize(): Promise<void> {
    // Agent initialization logic
  }

  async process(data: any): Promise<Signal[]> {
    // Main agent logic
    // Return array of signals
  }

  async cleanup(): Promise<void> {
    // Cleanup resources
  }
}
```

### Agent Development Guidelines

1. **Follow Naming Conventions**:
   - Agent class names: `PascalCase` (e.g., `DeFiMonitor`)
   - File names: `camelCase.ts` (e.g., `defiMonitor.ts`)
   - Signal types: `SCREAMING_SNAKE_CASE` (e.g., `LIQUIDITY_CHANGE`)

2. **Implement Required Methods**:
   - `initialize()`: Setup and configuration
   - `process()`: Main processing logic
   - `cleanup()`: Resource cleanup

3. **Signal Emission**:

   ```typescript
   const signal: Signal = {
     type: 'WALLET_ACTIVITY',
     timestamp: Date.now(),
     data: {
       address: walletAddress,
       activity: 'large_transfer',
       amount: transferAmount,
     },
     confidence: 0.95,
     metadata: {
       source: 'blockchain_monitor',
       version: '1.0.0',
     },
   };
   ```

4. **Memory Management**:
   - Use the provided memory utilities
   - Clean up resources in the `cleanup()` method
   - Avoid memory leaks in long-running agents

5. **Error Handling**:
   ```typescript
   try {
     // Agent logic
   } catch (error) {
     this.logger.error('Agent processing failed', { error, data });
     // Handle gracefully, don't crash the system
   }
   ```

### Agent Testing

Create comprehensive tests for your agents:

```typescript
// tests/yourAgent.test.ts
import { YourAgent } from '../agents/yourAgent';

describe('YourAgent', () => {
  let agent: YourAgent;

  beforeEach(() => {
    agent = new YourAgent(mockConfig);
  });

  it('should emit correct signals for valid data', async () => {
    const signals = await agent.process(mockData);
    expect(signals).toHaveLength(1);
    expect(signals[0].type).toBe('EXPECTED_SIGNAL_TYPE');
  });

  // Add more tests...
});
```

## Code Standards

### TypeScript Guidelines

1. **Use strict TypeScript configuration**
2. **Prefer interfaces over types** for object shapes
3. **Use explicit return types** for public methods
4. **Avoid `any` type** - use proper typing
5. **Use meaningful variable names**

### Code Style

We use **Prettier** and **ESLint** for consistent formatting:

```bash
# Format code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Code Organization

1. **Import Order**:

   ```typescript
   // 1. Node modules
   import fs from 'fs';
   import path from 'path';

   // 2. Internal modules
   import { BaseAgent } from '../types/agent';
   import { logger } from '../utils/logger';

   // 3. Relative imports
   import './styles.css';
   ```

2. **Class Structure**:

   ```typescript
   class YourClass {
     // 1. Properties
     private config: Config;

     // 2. Constructor
     constructor(config: Config) {
       this.config = config;
     }

     // 3. Public methods
     public async process(): Promise<void> {}

     // 4. Private methods
     private validateInput(): boolean {}
   }
   ```

### Documentation Standards

1. **Use JSDoc comments** for public APIs:

   ```typescript
   /**
    * Processes blockchain data and emits relevant signals
    * @param data - The blockchain data to process
    * @returns Array of signals generated from the data
    */
   async process(data: BlockchainData): Promise<Signal[]> {
     // Implementation
   }
   ```

2. **Comment complex logic**:
   ```typescript
   // Calculate liquidity impact using the constant product formula
   // Impact = (amount * reserve_out) / (reserve_in + amount)
   const impact = (amount * reserveOut) / (reserveIn + amount);
   ```

## Testing Guidelines

### Test Structure

```typescript
describe('Component/Feature', () => {
  describe('method/functionality', () => {
    it('should do something specific', () => {
      // Test implementation
    });

    it('should handle edge case', () => {
      // Edge case test
    });
  });
});
```

### Test Categories

1. **Unit Tests**: Test individual functions/methods
2. **Integration Tests**: Test component interactions
3. **Agent Tests**: Test complete agent workflows
4. **End-to-End Tests**: Test full system scenarios

### Test Best Practices

1. **Use descriptive test names**
2. **Test both success and failure cases**
3. **Mock external dependencies**
4. **Keep tests focused and isolated**
5. **Use proper assertions**

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- yourAgent.test.ts
```

## Documentation

### Documentation Types

1. **Code Documentation**: JSDoc comments in code
2. **API Documentation**: Generated from code comments
3. **User Guides**: Step-by-step instructions
4. **Architecture Documentation**: System design and patterns

### Writing Guidelines

1. **Be clear and concise**
2. **Use examples and code snippets**
3. **Keep documentation up-to-date**
4. **Use proper markdown formatting**
5. **Include diagrams when helpful**

### Documentation Structure

```markdown
# Title

Brief description of what this document covers.

## Overview

High-level explanation.

## Getting Started

Step-by-step instructions.

## Examples

Code examples and use cases.

## API Reference

Detailed API documentation.

## Troubleshooting

Common issues and solutions.
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(agents): add DeFi liquidity monitoring agent
fix(signals): resolve signal emission timing issue
docs(readme): update installation instructions
test(agents): add unit tests for Theron agent
refactor(utils): improve signal processing performance
```

### Scope Guidelines

- `agents`: Agent-related changes
- `utils`: Utility function changes
- `types`: Type definition changes
- `docs`: Documentation changes
- `tests`: Test-related changes

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
2. **Update documentation** if needed
3. **Follow code standards**
4. **Write descriptive commit messages**
5. **Rebase on latest main** if needed

### PR Requirements

1. **Fill out the PR template** completely
2. **Link related issues**
3. **Provide clear description** of changes
4. **Include screenshots** if UI changes
5. **Request appropriate reviewers**

### Review Process

1. **Automated checks** must pass (CI/CD)
2. **Code review** by maintainers
3. **Testing verification**
4. **Documentation review**
5. **Final approval** and merge

### After Merge

1. **Delete your branch**
2. **Update local repository**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d your-branch-name
   ```

## Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for solutions
3. **Try the latest version**
4. **Gather relevant information**

### Issue Types

Use our issue templates:

- **Bug Report**: For reporting bugs
- **Feature Request**: For suggesting new features
- **Agent Proposal**: For proposing new agents

### Issue Guidelines

1. **Use descriptive titles**
2. **Provide detailed descriptions**
3. **Include reproduction steps** for bugs
4. **Add relevant labels**
5. **Be respectful and constructive**

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Requests**: Code contributions and reviews

### Getting Help

1. **Check the documentation** first
2. **Search existing issues** and discussions
3. **Create a new discussion** for questions
4. **Join our community** channels

### Recognition

We appreciate all contributions! Contributors will be:

- **Listed in our contributors** section
- **Mentioned in release notes** for significant contributions
- **Invited to join** our contributor community

## Development Tips

### Debugging

1. **Use the built-in logger**:

   ```typescript
   import { logger } from '../utils/logger';
   logger.debug('Processing data', { data });
   ```

2. **Enable debug mode**:

   ```bash
   LOG_LEVEL=debug npm run dev
   ```

3. **Use TypeScript strict mode** for better error catching

### Performance

1. **Profile your agents** for performance bottlenecks
2. **Use efficient data structures**
3. **Implement proper caching** where appropriate
4. **Monitor memory usage**

### Security

1. **Never commit sensitive data**
2. **Validate all inputs**
3. **Use secure coding practices**
4. **Report security issues** privately

## Troubleshooting

### Common Issues

1. **Installation Problems**:

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript Errors**:

   ```bash
   # Check TypeScript configuration
   npm run type-check

   # Rebuild type definitions
   npm run build:types
   ```

3. **Test Failures**:

   ```bash
   # Run tests in verbose mode
   npm test -- --verbose

   # Run specific test file
   npm test -- yourTest.test.ts
   ```

### Getting Support

If you encounter issues:

1. Check this troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our community discussions

---

Thank you for contributing to Eremos! Your contributions help make blockchain monitoring more accessible and powerful for everyone.
