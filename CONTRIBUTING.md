# Contributing to Eremos

Thank you for your interest in contributing to Eremos! This guide will help you get started with making meaningful contributions to our autonomous agent framework.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- TypeScript knowledge (recommended)
- Basic understanding of blockchain/Solana (helpful but not required)

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then:
   git clone https://github.com/YOUR_USERNAME/Eremos.git
   cd Eremos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

4. **Set up your environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## Making Changes

### Code Style Guidelines

- **TypeScript First**: Use TypeScript with strict type checking
- **Formatting**: Code is automatically formatted with Prettier
- **Naming**: Use descriptive names for variables, functions, and files
- **Comments**: Add comments for complex logic, especially in agent detection algorithms

### Testing

Before submitting changes:

```bash
# Run the full test suite
npm test

# Run tests for specific component
npm test -- --testNamePattern="YourComponent"

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type check
npm run type-check
```

### Commit Messages

Use clear, descriptive commit messages:

```bash
# Good examples:
git commit -m "feat: add launch detection to observer agent"
git commit -m "fix: resolve signal confidence calculation bug"
git commit -m "docs: update agent architecture documentation"
git commit -m "test: add unit tests for signal processor"

# Use conventional commit prefixes:
# feat: new features
# fix: bug fixes
# docs: documentation changes
# test: adding or updating tests
# refactor: code refactoring
# style: formatting changes
# chore: maintenance tasks
```

## Types of Contributions

### 🐛 Bug Fixes

- Check [existing issues](https://github.com/AJibolaOnaneye/Eremos/issues) first
- Include reproduction steps in your PR description
- Add tests that verify the fix

### ✨ New Features

- Discuss major features in an issue first
- Follow existing patterns in the codebase
- Include comprehensive tests
- Update documentation as needed

### 📚 Documentation

- Fix typos, improve clarity, add examples
- Update README for structural changes
- Add inline code comments for complex logic
- Create or update docs in `/docs` folder

### 🧪 Testing

- Add tests for uncovered code paths
- Improve existing test reliability
- Add integration tests for agent workflows

### 🎨 Visual/Structural Improvements

Perfect for bounty submissions:
- Better README layout and organization
- Add useful badges and shields
- Improve code formatting consistency
- Better file/folder organization
- Add helpful developer tooling

## Bounty-Specific Guidelines

For the current bounty challenge, focus on:

### README Improvements
- Better structure and navigation
- More comprehensive quick start guide
- Clear usage examples with code snippets
- Professional badges and project identity

### Documentation Enhancements
- Fix formatting inconsistencies
- Add missing sections (API docs, troubleshooting)
- Improve onboarding clarity for new developers

### Developer Experience
- Add missing config files (`.prettierrc`, `.eslintrc`)
- Create GitHub Actions for CI/CD
- Add helpful npm scripts
- Improve TypeScript configurations

### Repository Organization
- Better folder structure
- Consistent file naming
- Clear separation of concerns
- Remove unused files

## Pull Request Process

### Before Submitting

1. **Ensure your changes work**
   ```bash
   npm run dev  # Test locally
   npm test     # All tests pass
   npm run lint # No linting errors
   ```

2. **Update documentation** if needed

3. **Rebase on latest main**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### PR Template

Use this template for your pull request:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Visual/structural improvement

## Testing
- [ ] Tests pass locally
- [ ] Added new tests (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)
Before/after screenshots for visual changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

### Review Process

1. **Automated checks** run on every PR
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Merge** after approval

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Celebrate contributions of all sizes

### Communication

- **Issues**: For bug reports and feature requests
- **Discussions**: For questions and brainstorming
- **Twitter**: [@EremosCore](https://x.com/EremosCore) for announcements
- **Pull Requests**: For code contributions

### Getting Help

- Check existing issues and documentation first
- Ask questions in GitHub Discussions
- Join our community on X/Twitter
- Reach out to maintainers for complex problems

## Recognition

Contributors will be:
- Listed in our contributors section
- Mentioned in release notes for significant contributions
- Eligible for bounties and rewards
- Invited to community events and discussions

---

**Ready to contribute?** 

1. Pick an issue or improvement area
2. Follow the setup steps above
3. Make your changes
4. Submit a clean pull request
5. Celebrate your contribution to the Solana ecosystem! 🎉

Thank you for helping make Eremos better for everyone! 💛
