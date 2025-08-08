# Contributing to Eremos 🤝

Thank you for your interest in contributing to Eremos! This document provides guidelines and information for contributors.

## 🎯 How to Contribute

We welcome contributions from the community! Here are the main areas where you can help:

### 🚀 New Features

- **Agent Development** - Create new agents for specific detection patterns
- **Signal Logic** - Improve detection algorithms and confidence scoring
- **Performance Optimizations** - Enhance agent performance and memory usage
- **Tooling** - Add development utilities and testing frameworks

### 📚 Documentation

- **Code Comments** - Add inline documentation for complex logic
- **API Documentation** - Improve type definitions and interfaces
- **Tutorials** - Create guides for common use cases
- **Architecture Docs** - Enhance system design documentation

### 🐛 Bug Fixes

- **Bug Reports** - Report issues with detailed reproduction steps
- **Bug Fixes** - Submit fixes for confirmed issues
- **Test Coverage** - Add tests for edge cases and error conditions

### 🧪 Testing

- **Unit Tests** - Add comprehensive test coverage
- **Integration Tests** - Test agent interactions and workflows
- **Performance Tests** - Benchmark agent performance
- **Stress Tests** - Test system under load

## 📋 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/EremosCore/Eremos.git
cd Eremos

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run tests to verify setup
npm test
```

### Development Workflow

```bash
# Start development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Validate changes
npm run validate
```

## 🏗️ Agent Development

### Creating a New Agent

1. **Use the template** - Start with `/agents/example.ts`
2. **Follow the interface** - Implement the `Agent` type from `/types/agent.ts`
3. **Add tests** - Create tests in `/tests/`
4. **Update docs** - Add agent documentation to `/docs/agents.md`

### Agent Structure

```typescript
import { Agent } from '../types/agent';

export const myAgent: Agent = {
  id: 'my-agent',
  name: 'My Agent',
  role: 'surveillance',
  glyph: '🔍',
  watchType: 'wallet_activity',
  triggerThreshold: 0.8,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: 'Monitors specific wallet patterns',

  observe: (event: any) => {
    // Your detection logic here
  },

  getMemory: () => {
    // Return memory snapshot
    return [];
  },
};
```

### Testing Your Agent

```bash
# Test a specific agent
npm run dev:agent -- --agent=my-agent

# Validate agent configuration
npm run validate:agent -- --agent=my-agent

# Run full test suite
npm test
```

## 📝 Code Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide explicit types for function parameters and return values
- Use interfaces for object shapes
- Avoid `any` type - use proper typing

### Code Style

- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and single-purpose

### Testing Requirements

- Write tests for all new functionality
- Maintain >80% test coverage
- Include edge case testing
- Test error conditions

### Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new agent for wallet monitoring
fix: resolve memory leak in signal processing
docs: update agent development guide
test: add comprehensive test suite for observer agent
refactor: improve signal confidence calculation
```

## 🔄 Pull Request Process

### Before Submitting

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Run validation** (`npm run validate`)
7. **Commit your changes** with conventional commit format

### Pull Request Checklist

- [ ] Code follows TypeScript standards
- [ ] Tests pass and coverage is adequate
- [ ] Documentation is updated
- [ ] Commit messages follow conventional format
- [ ] No linting errors
- [ ] Changes are focused and atomic

### Review Process

1. **Automated checks** - CI/CD pipeline runs tests and linting
2. **Code review** - Maintainers review the changes
3. **Feedback** - Address any review comments
4. **Merge** - Once approved, changes are merged

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Reproduction steps** - step-by-step instructions
- **Expected behavior** vs actual behavior
- **Environment details** - OS, Node version, etc.
- **Screenshots/logs** if applicable

### Feature Requests

For feature requests:

- **Clear description** of the feature
- **Use case** - why this feature is needed
- **Proposed implementation** if you have ideas
- **Priority** - how important is this feature

## 📞 Getting Help

### Community Resources

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and ideas
- **Twitter** - [@EremosCore](https://x.com/EremosCore)
- **Website** - [Eremos.io](https://eremos.io)

### Development Questions

- Check existing documentation in `/docs/`
- Look at existing agent implementations
- Review test files for usage examples
- Ask in GitHub Discussions

## 🏆 Recognition

Contributors will be recognized in:

- **GitHub Contributors** list
- **Release notes** for significant contributions
- **Documentation** for major features
- **Community shoutouts** on social media

## 📄 License

By contributing to Eremos, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Eremos!** 🚀

_Together we're building the future of on-chain monitoring._
