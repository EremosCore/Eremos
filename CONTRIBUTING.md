# Contributing to Eremos

Thank you for your interest in contributing to Eremos! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Questions and Discussion](#questions-and-discussion)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Eremos.git
   cd Eremos
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/EremosCore/Eremos.git
   ```
4. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Verify setup**:
   ```bash
   npm run validate
   npm test
   ```

## Contributing Guidelines

### What We're Looking For

- **New Agents**: Create new monitoring agents with specific roles
- **Signal Logic**: Improve detection algorithms and confidence scoring
- **Utility Extensions**: Add helpful utilities for agent development
- **Documentation**: Improve guides, examples, and API documentation
- **Testing**: Add tests for existing functionality
- **Bug Fixes**: Fix issues and improve stability
- **Performance**: Optimize agent performance and resource usage

### Agent Development

When creating a new agent:

1. **Use the template**: Start with `/agents/example.ts` as a scaffold
2. **Follow the interface**: Implement all required `Agent` type properties
3. **Add tests**: Create comprehensive tests in `/tests/`
4. **Document**: Add clear descriptions and usage examples
5. **Validate**: Use `/scripts/validate-agent.ts` to check your agent

### Code Style

- **TypeScript**: Use strict typing and avoid `any` where possible
- **Naming**: Use descriptive names for variables, functions, and files
- **Comments**: Add JSDoc comments for public functions and complex logic
- **Formatting**: Run `npm run format` before committing
- **Linting**: Ensure `npm run lint` passes without warnings

### File Organization

- **Agents**: Place new agents in `/agents/` with descriptive names
- **Utilities**: Add shared utilities in `/utils/`
- **Types**: Extend types in `/types/` as needed
- **Tests**: Mirror the source structure in `/tests/`
- **Scripts**: Add development scripts in `/scripts/`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test files
npm test -- --testPathPattern=agent-name
```

### Writing Tests

- **Coverage**: Aim for at least 80% test coverage
- **Structure**: Use descriptive test names and organize with `describe` blocks
- **Mocking**: Mock external dependencies and network calls
- **Edge Cases**: Test error conditions and boundary cases

## Pull Request Process

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure quality**:
   ```bash
   npm run validate
   npm test
   npm run test:coverage
   ```

3. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: add new anomaly detection agent"
   git commit -m "fix: resolve memory leak in observer agent"
   git commit -m "docs: improve agent development guide"
   ```

4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what was changed and why
   - Link to any related issues
   - Screenshots for UI changes (if applicable)

6. **Wait for review** and address any feedback

### Commit Message Format

Use conventional commit format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Reporting Issues

### Before Reporting

1. **Check existing issues** to avoid duplicates
2. **Search documentation** for solutions
3. **Try the latest version** from the main branch

### Issue Template

When creating an issue, include:

- **Clear title** describing the problem
- **Detailed description** of what happened
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Relevant logs** or error messages
- **Screenshots** if applicable

## Questions and Discussion

- **GitHub Issues**: Use issues for questions and discussions
- **Twitter**: Follow [@EremosCore](https://x.com/EremosCore) for updates
- **Website**: Visit [Eremos.io](https://www.eremos.io/) for more information

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame (coming soon)

Thank you for contributing to Eremos! 🚀
