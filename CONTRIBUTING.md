# Contributing to Eremos

We welcome contributions to the Eremos framework! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- TypeScript knowledge
- Basic understanding of blockchain concepts

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Eremos.git
   cd Eremos
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment:
   ```bash
   cp .env.example .env.local
   ```

## Development Workflow

### Scripts

- `npm run dev` - Start development mode
- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run lint` - Check code style
- `npm run format` - Format code

### Code Standards

- Write TypeScript with strict typing
- Follow existing code patterns and conventions
- Include JSDoc comments for public APIs
- Write tests for new functionality
- Ensure all linting passes

## Types of Contributions

### Agent Development
- Create new agent types in `/agents`
- Follow the existing agent structure
- Include proper signal emission
- Add documentation

### Documentation
- Improve existing docs in `/docs`
- Add examples and use cases
- Fix typos or unclear sections

### Bug Fixes
- Include reproduction steps
- Add tests to prevent regression
- Update documentation if needed

### Feature Requests
- Open an issue first to discuss
- Provide detailed use cases
- Consider backward compatibility

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Add/update tests
4. Update documentation
5. Run `npm run lint` and `npm run test`
6. Commit with clear messages
7. Open a pull request

### PR Guidelines

- Keep changes focused and atomic
- Write clear commit messages
- Include tests for new features
- Update relevant documentation
- Reference related issues

## Agent Development Guide

When creating new agents:

1. **Structure**: Follow the pattern in existing agents
2. **Signals**: Emit structured signals using the framework
3. **Types**: Use TypeScript interfaces from `/types`
4. **Testing**: Include unit tests for agent logic
5. **Documentation**: Add agent description to docs

## Community

- **Issues**: Report bugs or request features
- **Discussions**: Ask questions or share ideas
- **Twitter**: Follow [@EremosCore](https://x.com/EremosCore)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers get started
- Maintain professional communication

## Questions?

- Check existing [documentation](docs/index.md)
- Search existing issues
- Join our community discussions
- Contact us on Twitter [@EremosCore](https://x.com/EremosCore)

---

Thank you for contributing to Eremos! 🗿💛
