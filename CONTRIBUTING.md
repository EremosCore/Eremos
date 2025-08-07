# Contributing to Eremos

Thank you for your interest in contributing to Eremos! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Creating Agents](#creating-agents)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see below)
4. **Create a feature branch** for your changes
5. **Make your changes** following our coding standards
6. **Test your changes** thoroughly
7. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment
cp env.example .env.local

# Verify setup
npm run lint
npm test
```

### Available Scripts

```bash
# Development
npm run dev              # Run development agent
npm run build            # Build the project
npm start                # Run built project

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Check code with ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier

# Agent Management
npm run validate         # Validate all agents
npm run generate:agent   # Generate new agent template
npm run export:memory    # Export agent memory
npm run simulate         # Run cluster simulation
npm run stress           # Run stress tests
```

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Follow strict typing practices
- Use interfaces for object shapes
- Prefer `const` over `let` when possible
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons at the end of statements
- Use trailing commas in objects and arrays
- Maximum line length: 80 characters

### Agent Development

- Follow the existing agent patterns in `/agents`
- Use the `Agent` interface from `/types/agent`
- Implement required methods: `observe()`, `getMemory()`
- Use utility functions from `/utils`
- Add proper JSDoc comments

### Example Agent Structure

```typescript
import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const MyAgent: Agent = {
  id: "agent-xxx",
  name: "MyAgent",
  role: "surveillance",
  watchType: "wallet_activity",
  glyph: "⚡",
  triggerThreshold: 0.8,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  
  description: "My custom agent for detecting specific patterns",
  
  observe: (event) => {
    // Your detection logic here
    if (event?.type === "wallet_activity") {
      const hashed = generateSignalHash(event);
      logSignal({
        agent: "MyAgent",
        type: "activity_detected",
        glyph: "⚡",
        hash: hashed,
        timestamp: new Date().toISOString(),
        details: event
      });
    }
  },
  
  getMemory: () => {
    return ["memory_fragment_1", "memory_fragment_2"];
  }
};
```

## Creating Agents

### Using the Generator

```bash
npm run generate:agent
```

This will create a new agent template in the `/agents` directory.

### Manual Creation

1. Create a new file in `/agents/` with your agent name
2. Follow the `Agent` interface structure
3. Implement the required methods
4. Add tests in `/tests/`
5. Update documentation if needed

### Agent Guidelines

- **Naming**: Use descriptive names (e.g., `WalletTracker`, `ContractMonitor`)
- **Roles**: Choose appropriate roles (`surveillance`, `memory_vault`, `trigger`, etc.)
- **Glyphs**: Use unique Unicode symbols for visual identification
- **Thresholds**: Set appropriate confidence thresholds (0.0 - 1.0)
- **Memory**: Implement meaningful memory storage

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- theron.behavior.test.ts
```

### Writing Tests

- Create test files in `/tests/` directory
- Use descriptive test names
- Test both success and failure cases
- Mock external dependencies
- Use Jest's built-in assertions

### Example Test

```typescript
import { MyAgent } from '../agents/myagent';

describe('MyAgent', () => {
  test('should detect wallet activity', () => {
    const event = {
      type: 'wallet_activity',
      wallet: '7Yk...',
      txCount: 4,
      timestamp: new Date().toISOString()
    };
    
    expect(() => {
      MyAgent.observe(event);
    }).not.toThrow();
  });
  
  test('should return memory fragments', () => {
    const memory = MyAgent.getMemory();
    expect(Array.isArray(memory)).toBe(true);
  });
});
```

## Pull Request Process

### Before Submitting

1. **Ensure code quality:**
   ```bash
   npm run lint
   npm run format
   npm test
   ```

2. **Update documentation** if your changes affect:
   - API interfaces
   - Configuration options
   - Installation process

3. **Add tests** for new functionality

4. **Update CHANGELOG.md** if applicable

### Pull Request Guidelines

- **Title**: Use clear, descriptive titles
- **Description**: Explain what and why, not how
- **Related Issues**: Link to any related issues
- **Screenshots**: Include screenshots for UI changes
- **Testing**: Describe how you tested your changes

### Review Process

1. Automated checks must pass (linting, tests)
2. Code review by maintainers
3. Address any feedback
4. Maintainers will merge when ready

## Code of Conduct

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement

- Instances of abusive behavior may be reported
- Project maintainers are responsible for enforcement
- Unacceptable behavior will not be tolerated

## Questions?

If you have questions about contributing:

- Check the [documentation](docs/)
- Open an issue for questions
- Join our community discussions
- Contact the maintainers directly

Thank you for contributing to Eremos!
