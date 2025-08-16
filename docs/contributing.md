# 🤝 Contributing to Eremos

<div align="center">

**Join the swarm intelligence community**

[![Contributors](https://img.shields.io/badge/Contributors-Welcome-green?style=flat)](https://github.com/EremosCore/Eremos)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)

</div>

We welcome contributions from the community! Whether you're a developer, analyst, designer, or just passionate about blockchain intelligence, there's a place for you in the Eremos ecosystem.

## ∴ Table of Contents

- [∆ Ways to Contribute](#-ways-to-contribute)
- [Σ Agent Development](#-agent-development)
- [◊ Design & Creative](#-design--creative)
- [∇ Analytics & Research](#-analytics--research)
- [※ Documentation](#-documentation)
- [⟩ Development Workflow](#-development-workflow)
- [∴ Contribution Guidelines](#-contribution-guidelines)
- [∘ Testing Requirements](#-testing-requirements)
- [∞ Community & Support](#-community--support)

## ∆ Ways to Contribute

### Σ Agent Development

**Perfect for**: TypeScript developers, blockchain engineers, data scientists

- **Create New Agents**: Build detection algorithms for specific patterns
- **Enhance Existing Agents**: Improve confidence scoring and detection logic
- **Optimize Performance**: Help agents process more events efficiently
- **Add Integrations**: Connect agents to new data sources or chains

**Getting Started**:
1. Read the [Agent Development Guide](agents.md)
2. Study existing agents in `/agents/`
3. Start with `agents/example.ts` as a template
4. Check out the [Architecture Guide](architecture.md)

### ◊ Design & Creative

**Perfect for**: UI/UX designers, visual artists, content creators

- **Agent Artwork**: Create visual representations of agents
- **Documentation Design**: Improve visual clarity of guides
- **Logo & Branding**: Design variations and themed assets  
- **Mythbuilding**: Expand the Eremos narrative and lore

**Getting Started**:
1. Check existing assets in `/docs/`
2. Review the [Glyph System](glyphs.md) for visual identity
3. Submit designs via pull request or share on Twitter

### ∇ Analytics & Research

**Perfect for**: Blockchain analysts, researchers, data scientists

- **Detection Algorithms**: Improve pattern recognition accuracy
- **Confidence Scoring**: Refine signal confidence calculations
- **Performance Analysis**: Benchmark agent effectiveness
- **Market Research**: Identify new patterns worth detecting

**Getting Started**:
1. Review the [Signal Taxonomy](signals.md)
2. Analyze existing detection patterns
3. Propose improvements with data backing

### ※ Documentation

**Perfect for**: Technical writers, educators, community builders

- **Guide Improvements**: Enhance existing documentation
- **Tutorial Creation**: Write step-by-step tutorials
- **API Documentation**: Document interfaces and utilities
- **Translation**: Help make Eremos accessible globally

## ⟩ Development Workflow

### 1. **Fork & Clone**
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR_USERNAME/Eremos.git
cd Eremos
npm install
```

### 2. **Create Feature Branch**
```bash
# Use descriptive branch names
git checkout -b feature/amazing-agent
git checkout -b fix/confidence-scoring
git checkout -b docs/agent-tutorial
```

### 3. **Development Environment**
```bash
# Install dependencies
npm install

# Test existing functionality
npm run agent:dev
npm run agent:list

# Run tests
npm test
```

### 4. **Make Changes**
- **Agents**: Work in `/agents/` directory
- **Utilities**: Enhance `/utils/` functions
- **Documentation**: Update `/docs/` files
- **Types**: Modify `/types/` interfaces

### 5. **Test Your Changes**
```bash
# Test specific agent
npm run agent:validate agents/my-agent.ts

# Run full test suite
npm test

# Test signal generation
npm run signal:preview

# Stress test (if applicable)
npm run stress:test
```

### 6. **Submit Pull Request**
- **Clear Title**: Describe what the PR accomplishes
- **Detailed Description**: Explain the changes and reasoning
- **Test Results**: Include test outputs if relevant
- **Screenshots**: For visual changes, include before/after images

## ∴ Contribution Guidelines

### ✅ **Best Practices**

#### **Code Quality**
- **TypeScript First**: All code should be properly typed
- **Clean Commits**: Atomic commits with clear messages
- **No Bloat**: Avoid unnecessary dependencies or complexity
- **Documentation**: Comment complex logic and update docs

#### **Agent Development**
- **Single Responsibility**: Each agent should have one clear purpose
- **Confidence Scoring**: Include meaningful confidence calculations
- **Error Handling**: Gracefully handle malformed events
- **Performance**: Process events in under 100ms

#### **Documentation**
- **Clear Examples**: Include practical code examples
- **Consistent Style**: Follow existing documentation patterns
- **Cross-References**: Link to related concepts
- **Update Related Files**: Keep all docs synchronized

### ⚠️ **Things to Avoid**

- **Breaking Changes**: Don't modify existing agent interfaces without discussion
- **Performance Regressions**: Test that changes don't slow down processing
- **Unclear Purpose**: Explain why changes are needed
- **Missing Tests**: Include tests for new functionality
- **Hardcoded Values**: Use configuration where appropriate

## ∘ Testing Requirements

### **For New Agents**
```typescript
// Example test structure
describe("MyAgent", () => {
  it("should detect target patterns", () => {
    const event = { type: "wallet_activity", /* test data */ };
    const result = MyAgent.observe(event);
    expect(result).toBeDefined();
  });
  
  it("should return valid memory", () => {
    const memory = MyAgent.getMemory();
    expect(Array.isArray(memory)).toBe(true);
    expect(memory.length).toBeGreaterThan(0);
  });
  
  it("should calculate confidence correctly", () => {
    // Test confidence scoring logic
  });
});
```

### **For Utility Functions**
- Unit tests for all public functions
- Edge case handling
- Performance benchmarks for critical paths

### **For Documentation**
- All links should work
- Code examples should be runnable
- No spelling or grammar errors

## ∞ Community & Support

### **Communication Channels**
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Twitter**: [@EremosCore](https://x.com/EremosCore) - Community updates and support

### **Getting Help**
- **Technical Questions**: Open a GitHub issue with the `question` label
- **Agent Development**: Reference the [Agent Guide](agents.md) first
- **Architecture Questions**: Check the [Architecture Guide](architecture.md)
- **Quick Questions**: Reach out on Twitter

### **Community Guidelines**
- **Be Respectful**: Treat all community members with respect
- **Stay On Topic**: Keep discussions relevant to Eremos
- **Share Knowledge**: Help others learn and contribute
- **Credit Others**: Acknowledge contributions and inspirations

## 🏆 **Recognition**

Contributors will be:
- **Listed in Contributors**: GitHub contributors page
- **Credited in Releases**: Significant contributions mentioned in release notes
- **Featured on Social**: Outstanding contributions highlighted on Twitter
- **Agent Attribution**: New agents can include creator attribution

## 🚀 **Special Contribution Opportunities**

### **Agent-001 Development**
We're working on the next major agent. Interested contributors can:
- Propose detection patterns
- Contribute to confidence algorithms
- Help with testing and validation

### **Visual Interface**
Planning a web interface for agent monitoring:
- React/Next.js developers
- UI/UX designers
- Data visualization experts

### **Performance Optimization**
Always looking for performance improvements:
- Event processing optimization
- Memory usage reduction
- Signal emission efficiency

---

<div align="center">

**Ready to contribute?** Fork the repo and start building the future of on-chain intelligence!

[![Fork Eremos](https://img.shields.io/badge/Fork-Eremos-blue?style=flat&logo=github)](https://github.com/EremosCore/Eremos/fork)
[![Join Community](https://img.shields.io/badge/Join-Community-green?style=flat)](https://x.com/EremosCore)

_Every contribution matters in building the swarm_ 🐝

</div>
