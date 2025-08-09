# Contributing to Eremos

Thank you for your interest in contributing to Eremos! We welcome contributions from developers, researchers, and anyone passionate about on-chain intelligence.

## 🚀 Quick Start for Contributors

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/Eremos.git
   cd Eremos
   npm install
   ```

2. **Set up Development Environment**
   ```bash
   cp .env.example .env.local
   npm run dev
   ```

3. **Validate Your Setup**
   ```bash
   npm run validate
   npm test
   ```

## 🔧 Development Workflow

### Creating a New Agent

1. Use the agent generator:
   ```bash
   npm run generate:agent
   ```

2. Work on your agent in `/agents`
3. Test with the development script:
   ```bash
   npm run dev
   ```

4. Validate your agent:
   ```bash
   npm run validate
   ```

### Code Quality

- Run linting: `npm run lint`
- Fix auto-fixable issues: `npm run lint:fix`
- Ensure tests pass: `npm test`
- Follow TypeScript best practices

### Commit Guidelines

- Use clear, descriptive commit messages
- Keep commits focused and atomic
- Reference issues when applicable

## 🎯 Contribution Areas

### Agents & Logic
- New detection algorithms
- Signal refinement
- Performance optimizations
- Pattern recognition improvements

### Documentation
- API documentation
- Agent development guides
- Architecture explanations
- Tutorial content

### Tooling & Infrastructure
- Development scripts
- Testing frameworks
- CI/CD improvements
- Monitoring tools

### Design & UX
- Visual improvements
- Documentation design
- Asset creation
- Brand consistency

## 📋 Submission Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Thoroughly**
   ```bash
   npm run lint
   npm test
   npm run validate
   ```

4. **Submit Pull Request**
   - Provide clear description of changes
   - Link to related issues
   - Include testing steps

## 🐛 Bug Reports

When reporting bugs, please include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Relevant logs or error messages

## 💡 Feature Requests

For new features:
- Describe the use case
- Explain how it fits the Eremos vision
- Consider implementation complexity
- Discuss potential alternatives

## 📝 Code Style

- Use TypeScript strictly
- Follow existing naming conventions
- Document complex logic
- Keep functions focused and pure when possible
- Avoid bloat - maintain the minimalist philosophy

## 🤝 Community

- **Twitter/X:** [@EremosCore](https://x.com/EremosCore)
- **Issues:** Use GitHub Issues for bugs and feature requests
- **Discussions:** For general questions and ideas

---

*We appreciate all contributions, no matter how small. Every improvement helps make Eremos better for the entire community!*
