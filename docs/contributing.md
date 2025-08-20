# Contributing to Eremos

We welcome contributions from the community! This guide will help you get started with contributing to the Eremos project.

## 🚀 Quick Start

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Eremos.git
   cd Eremos
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🤝 Ways to Contribute

### 🔍 Agent Development
- Create new monitoring agents for specific use cases
- Improve existing agent logic and performance
- Add new signal types and detection patterns
- Use `/scripts/dev-agent.ts` to simulate and test your agents

### 🛠️ Core Development
- Enhance utility functions and signal processing
- Improve performance and memory usage
- Add new configuration options
- Extend the plugin system

### 🧪 Testing
- Write unit tests for new features
- Add integration tests for agent interactions
- Improve test coverage
- Create stress tests for performance validation

### 📚 Documentation
- Improve existing documentation
- Add code examples and tutorials
- Create architecture diagrams
- Write agent development guides

### 🎨 Design & UX
- Create agent artwork and visualizations
- Design better signal visualization
- Improve dashboard UI/UX
- Create brand assets and marketing materials

## 📋 Development Guidelines

### Code Standards
- Use **TypeScript** for all new code
- Follow the existing code style and patterns
- Add comprehensive JSDoc comments
- Keep functions small and focused

### Testing Requirements
- Write tests for all new functionality
- Ensure tests pass before submitting PR
- Include both unit and integration tests
- Test error scenarios and edge cases

### Agent Development Best Practices
- Follow the agent interface defined in `types/agent.ts`
- Use shared utilities from `/utils` folder
- Implement proper error handling
- Add appropriate logging and metrics

## 🔧 Development Commands

```bash
npm run dev              # Start development mode
npm run test             # Run test suite
npm run test:coverage    # Run tests with coverage
npm run lint             # Check code style
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run validate-agent   # Validate agent configuration
npm run generate-agent   # Generate new agent template
npm run simulate-cluster # Simulate agent cluster behavior
```

## 📝 Pull Request Process

1. **Ensure your code follows our standards**:
   ```bash
   npm run lint
   npm run test
   npm run typecheck
   ```

2. **Update documentation** if needed
3. **Write clear commit messages**:
   ```
   feat: add new wallet cluster detection agent
   fix: resolve memory leak in signal processing
   docs: update agent development guide
   ```

4. **Open a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots/demos if applicable
   - Test results and performance impact

5. **Respond to feedback** and make requested changes

## 🐛 Reporting Issues

When reporting bugs, please include:
- **Environment details** (Node.js version, OS, etc.)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Error messages** and stack traces
- **Configuration** used (sanitized .env values)

## 💡 Feature Requests

For feature requests, please provide:
- **Clear description** of the proposed feature
- **Use case** and problem it solves
- **Possible implementation** approach
- **Backwards compatibility** considerations

## 🏗️ Project Structure

Understanding the codebase:

```
📁 Eremos/
├── 🤖 agents/           # Agent implementations
│   ├── example.ts       # Template agent
│   ├── theron.ts        # Main detection agent
│   └── observer.ts      # Observation agent
├── 🔧 utils/            # Shared utilities
│   ├── signal.ts        # Signal processing
│   ├── metrics.ts       # Performance metrics
│   └── logger.ts        # Logging utilities
├── 📝 types/            # TypeScript definitions
├── ⚡ scripts/          # Development scripts
├── 🧪 tests/            # Test suites
└── 📚 docs/             # Documentation
```

## 🎯 Agent Development Guide

### Creating a New Agent

1. **Use the agent generator**:
   ```bash
   npm run generate-agent
   ```

2. **Follow the agent interface**:
   ```typescript
   import { Agent } from "../types/agent";

   export const MyAgent: Agent = {
     id: "agent-my-agent",
     name: "MyAgent",
     role: "detector",
     watchType: "custom_activity",
     glyph: "🔍",
     triggerThreshold: 5,
     
     observe: (event) => {
       // Your detection logic here
     }
   };
   ```

3. **Test your agent**:
   ```bash
   npm run validate-agent agents/my-agent.ts
   npm run dev-agent agents/my-agent.ts
   ```

### Signal Processing

Agents emit signals when they detect patterns:

```typescript
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

// In your agent's observe method
const hash = generateSignalHash(event);
logSignal({
  agent: "MyAgent",
  type: "detection_type",
  glyph: "🔍",
  hash,
  timestamp: new Date().toISOString(),
  confidence: 0.85
});
```

## 🌟 Recognition

Contributors will be recognized:
- In project documentation
- GitHub contributor graphs
- Social media mentions
- Future bounty opportunities

## 📞 Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Twitter**: [@EremosCore](https://x.com/EremosCore) for quick questions
- **Discord**: Join our community (link in README)

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please:
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Keep discussions on-topic

---

Thank you for contributing to Eremos! Your efforts help make on-chain monitoring more accessible and transparent for everyone. 💛🗿
