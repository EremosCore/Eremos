# Contributing to Eremos

We're open to signal logic, new agents, and utility extensions. This guide will help you get started.

---

## 🚀 Quick Start

1. **Fork the repo**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Eremos.git
   cd Eremos
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Set up development environment**
   ```bash
   cp .env.example .env.local  # if .env.example exists
   npm run dev
   ```

---

## 🧪 Development Workflow

### Creating a New Agent

1. **Use the template**: Copy `/agents/example.ts` as a starting point
2. **Implement required methods**:
   - `observe(event)` — detection logic
   - `getMemory()` — memory snapshot
   - Required properties: `description`, `watchType`, `glyph`, `triggerThreshold`
3. **Test your agent**: Use `/scripts/dev-agent.ts` to simulate
4. **Add tests**: Create tests in `/tests/` directory

### Code Standards

- **TypeScript**: All new code should be in TypeScript
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Use `npm run format` for consistent code style
- **Testing**: Add tests for new functionality

### Available Commands

```bash
npm run dev          # Start development mode
npm run build        # Build TypeScript
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint code
npm run lint:fix     # Fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Type check without building
npm run setup        # Setup development environment
```

---

## 📝 Pull Request Guidelines

### Before Submitting

1. **Test your changes**: `npm run test`
2. **Lint your code**: `npm run lint`
3. **Format your code**: `npm run format`
4. **Type check**: `npm run type-check`

### PR Requirements

- **Clean commits**: Write clear, descriptive commit messages
- **Avoid bloat**: Keep changes focused and minimal
- **Add tests**: Include tests for new functionality
- **Update docs**: Update relevant documentation
- **Follow patterns**: Use existing code patterns and conventions

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Examples:**
- `feat(agent): add new wallet monitoring agent`
- `fix(utils): resolve signal hash generation issue`
- `docs(readme): update installation instructions`

---

## 🎯 Contribution Areas

### High Priority
- **New Agents**: Specialized monitoring agents
- **Signal Logic**: Improved detection algorithms
- **Performance**: Optimizations for large-scale monitoring

### Medium Priority
- **Documentation**: Better guides and examples
- **Testing**: More comprehensive test coverage
- **Tooling**: Development and debugging tools

### Low Priority
- **UI/UX**: Frontend improvements
- **Infrastructure**: Deployment and scaling tools

---

## 🤝 Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Twitter**: DM us at [@EremosCore](https://x.com/EremosCore)

---

## 📋 Checklist

Before submitting your PR, ensure:

- [ ] Code follows TypeScript standards
- [ ] All tests pass (`npm run test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive

---

*Thank you for contributing to Eremos! 💛*
