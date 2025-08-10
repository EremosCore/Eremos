# Contributing to Eremos 🤝

Thank you for your interest in contributing to Eremos! This document provides guidelines and information for contributors.

## 🚀 Quick Start

1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Create** a new branch: `git checkout -b feature/your-feature-name`
5. **Make** your changes
6. **Test** your changes: `npm test`
7. **Commit** and **push** your changes
8. **Create** a pull request

## 🎯 What We're Looking For

### Priority Areas
- **New Agents**: Specialized monitoring agents for different DeFi protocols
- **Signal Processing**: Enhanced signal validation and processing logic  
- **Performance**: Optimization of agent processing and signal emission
- **Documentation**: Improved guides, examples, and API documentation
- **Testing**: Unit tests, integration tests, and agent behavior tests
- **Developer Experience**: Tools that make agent development easier

### Agent Ideas
- **DEX Monitors**: Track activity on Jupiter, Orca, Raydium
- **NFT Watchers**: Monitor NFT launches and trading activity
- **Governance Agents**: Track DAO proposals and voting patterns
- **Liquidity Scouts**: Detect new liquidity pool formations
- **Bridge Monitors**: Watch cross-chain bridge activity
- **Yield Farmers**: Track yield farming opportunities

## 🏗️ Development Setup

### Prerequisites
- Node.js 16+ 
- npm 8+
- Git

### Installation
```bash
git clone https://github.com/YOUR_USERNAME/Eremos.git
cd Eremos
npm install
```

### Development Scripts
```bash
npm run dev          # Watch mode for TypeScript
npm run build        # Build the project
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
```

## 🤖 Creating New Agents

### Agent Structure
```typescript
import { Agent } from "../types/agent";

export const YourAgent: Agent = {
  id: "agent-xxx",
  name: "YourAgentName", 
  role: "observer", // or "memory_vault", "trigger", etc.
  watchType: "your_watch_type",
  glyph: "Ψ", // Choose a unique symbol
  triggerThreshold: 0.8,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "Clear description of what this agent does",
  
  observe: (event) => {
    // Your observation logic here
  },
  
  getMemory: () => {
    // Optional memory functionality
    return [];
  }
};
```

### Agent Guidelines
1. **Single Responsibility**: Each agent should have one clear purpose
2. **Minimal Resource Usage**: Optimize for low CPU and memory usage
3. **Clear Signals**: Emit meaningful, structured signals
4. **Error Handling**: Handle edge cases gracefully
5. **Documentation**: Include clear descriptions and examples

### Testing Agents
```bash
# Validate agent structure
npm run validate-agents

# Simulate agent behavior
npm run simulate-cluster

# Run agent-specific tests
npm test -- --testNamePattern="YourAgent"
```

## 📡 Signal Standards

### Signal Format
```typescript
{
  agent: "AgentName",
  type: "signal_type", 
  glyph: "Ψ",
  hash: "generated_hash",
  timestamp: "ISO_timestamp",
  confidence?: number, // 0-1 scale
  metadata?: object    // Additional context
}
```

### Signal Types
- `launch_detected` - New token/contract launches
- `anomaly_detected` - Unusual patterns or behaviors
- `threshold_breach` - Metric thresholds exceeded
- `pattern_match` - Specific patterns identified
- `archival` - Data storage events

## 🧪 Testing Guidelines

### Test Structure
- **Unit Tests**: Test individual functions and components
- **Agent Tests**: Test agent behavior and signal emission
- **Integration Tests**: Test agent interactions and workflows

### Writing Tests
```typescript
import { YourAgent } from "../agents/your-agent";

describe("YourAgent", () => {
  it("should emit signal on specific event", () => {
    const event = { type: "test_event" };
    // Test agent behavior
  });
});
```

## 📋 Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper types for all data structures
- Avoid `any` types when possible
- Document complex type definitions

### Style Guide
- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic

### Commit Messages
Use conventional commit format:
```
feat: add new DEX monitoring agent
fix: resolve signal hash collision issue  
docs: update agent development guide
test: add coverage for signal validation
```

## 🔍 Code Review Process

### Before Submitting
- [ ] All tests pass
- [ ] Code is properly formatted
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Agent validates successfully

### Review Criteria
- **Functionality**: Does the code work as intended?
- **Performance**: Is the code efficient?
- **Security**: Are there any security concerns?
- **Maintainability**: Is the code readable and maintainable?
- **Testing**: Is there adequate test coverage?

## 📚 Documentation

### What to Document
- New agent capabilities and usage
- Signal types and formats
- Configuration options
- Example implementations
- Architecture decisions

### Documentation Format
- Use clear, concise language
- Include code examples
- Add visual diagrams when helpful
- Keep examples up to date

## 🐛 Bug Reports

Use the bug report template when reporting issues:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment information
- Relevant logs or errors

## ✨ Feature Requests

Use the feature request template for new ideas:
- Clear description of the feature
- Use cases and benefits
- Implementation considerations
- Alternative approaches

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Be constructive in feedback
- Help others learn and grow
- Respect different perspectives

### Be Collaborative
- Share knowledge and insights
- Review others' contributions
- Provide helpful feedback
- Work together on solutions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Twitter**: [@EremosCore](https://x.com/EremosCore) for announcements
- **Email**: hello@eremos.io for direct contact

## 🏆 Recognition

Contributors are recognized through:
- Contributor documentation
- Release notes attribution  
- Social media highlights
- Community showcases

Thank you for contributing to Eremos! 🙏
