# Contributing to Eremos

Thank you for your interest in contributing to Eremos! We welcome contributions from developers, designers, researchers, and blockchain enthusiasts.

## 🤝 Ways to Contribute

### For Developers
- **New Agents:** Create specialized monitoring agents for specific use cases
- **Utility Functions:** Enhance shared utilities in `/utils`
- **Performance:** Optimize signal processing and memory usage
- **Testing:** Add comprehensive test coverage
- **Documentation:** Improve code documentation and examples

### For Designers & Artists
- **Visual Assets:** Create banners, logos, or agent glyphs
- **UI/UX:** Design interfaces for signal visualization
- **Documentation Design:** Improve visual presentation of docs

### For Researchers
- **Signal Analysis:** Improve confidence scoring algorithms
- **Pattern Detection:** Develop new behavioral heuristics
- **Whitepapers:** Contribute to research documentation

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Eremos.git
   cd Eremos
   ```

2. **Set up development environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 📋 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow existing naming conventions
- Write clear, self-documenting code
- Add JSDoc comments for public APIs

### Agent Development
- Use `/agents/example.ts` as your starting template
- Test agents with `/scripts/dev-agent.ts`
- Ensure signals follow the standard structure
- Include confidence scoring logic

### Testing
- Write unit tests for new functionality
- Test error handling and edge cases
- Validate signal generation with mock data
- Ensure backward compatibility

### Commit Guidelines
- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Use conventional commit format when possible:
  ```
  feat: add new wallet cluster detection agent
  fix: resolve memory leak in signal processing
  docs: update agent development guide
  ```

## 🔍 Code Review Process

1. **Submit a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

2. **Review Criteria**
   - Code quality and style
   - Test coverage
   - Documentation updates
   - Performance impact
   - Security considerations

3. **Merge Requirements**
   - All tests must pass
   - At least one core team review
   - No merge conflicts
   - Updated documentation if needed

## 🛠️ Development Scripts

Use these scripts during development:

```bash
npm run dev              # Start development mode
npm run dev-agent        # Test agent development
npm run validate-agent   # Validate agent configs
npm run test             # Run test suite
npm run lint             # Check code style
npm run format           # Format code
```

## 📝 Documentation

When contributing, please:
- Update relevant documentation
- Add examples for new features
- Include inline code comments
- Update the README if needed

## 🐛 Reporting Issues

When reporting bugs:
- Use the GitHub issue template
- Provide minimal reproduction steps
- Include environment details
- Add relevant logs or screenshots

## 💡 Feature Requests

For new features:
- Check existing issues first
- Provide clear use case description
- Consider implementation complexity
- Discuss with community first for major changes

## 🔒 Security

For security-related issues:
- Do NOT open public issues
- Email the core team directly
- Provide detailed vulnerability description
- Allow time for responsible disclosure

## 📞 Getting Help

- 💬 **Discussions:** GitHub Discussions for questions
- 🐦 **Twitter:** [@EremosCore](https://x.com/EremosCore) for announcements
- 📖 **Documentation:** Check `/docs` for detailed guides
- 🔧 **Development:** See `DEVELOPMENT.md` for dev setup

## 🙏 Recognition

Contributors will be:
- Listed in the README contributors section
- Credited in release notes
- Invited to contributor-only channels
- Eligible for bounties and grants

---

**Note:** By contributing, you agree that your contributions will be licensed under the MIT License.

Push clean commits. Avoid bloat. Build something useful! 🚀
