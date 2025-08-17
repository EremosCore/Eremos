# Contributing to Eremos

Thank you for your interest in contributing to Eremos! We welcome contributions from developers, researchers, and anyone passionate about on-chain signal detection.

## 🎯 Ways to Contribute

- **🐛 Bug fixes** - Fix issues with existing agents or utilities
- **🤖 New agents** - Create agents that detect new patterns or behaviors
- **🔧 Utilities** - Improve shared utilities and helper functions
- **📚 Documentation** - Improve docs, add examples, or fix typos
- **🧪 Testing** - Add tests for existing functionality
- **🎨 Visual improvements** - Enhance README, add badges, improve formatting

## 🚀 Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/Eremos.git
   cd Eremos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Test your changes**
   ```bash
   npm run test:agent example
   npm run validate agents/your-agent.ts
   ```

## 🤖 Creating New Agents

1. **Use the example template**
   ```bash
   cp agents/example.ts agents/your-agent.ts
   ```

2. **Update agent properties**
   - Choose a unique `id` and descriptive `name`
   - Define the `role` and `watchType` 
   - Select an appropriate `glyph` (check `docs/glyphs.md`)
   - Set a reasonable `triggerThreshold`

3. **Implement detection logic**
   - Write your `observe()` function to detect patterns
   - Use `generateSignalHash()` for signal IDs
   - Log signals with `logSignal()`
   - Add confidence scoring when applicable

4. **Test your agent**
   ```bash
   node -r ts-node/register scripts/dev-agent.ts
   ```

## 📝 Code Style

- **TypeScript** - Use proper typing throughout
- **Naming** - Use descriptive variable and function names
- **Comments** - Comment complex logic and agent behavior
- **Imports** - Use relative imports for local files
- **Format** - Keep code clean and readable

## 🧪 Testing

- Test your changes locally before submitting
- Run existing tests: `npm test`
- Validate agent configs: `npm run validate agents/your-agent.ts`
- Use simulation scripts: `npm run simulate`

## 📋 Pull Request Process

1. **Create a descriptive PR title**
   - `[AGENT] Add wallet cluster detection agent`
   - `[BUG] Fix signal hash generation`
   - `[DOCS] Improve agent creation guide`

2. **Fill out the PR template** with:
   - Clear description of changes
   - Type of change (bug fix, feature, etc.)
   - Testing performed
   - Screenshots if visual changes

3. **Link related issues** using `Closes #123`

4. **Wait for review** and address feedback

## 🎨 Visual/Structural Improvements

We especially welcome:
- **README improvements** - Better formatting, badges, structure
- **Documentation clarity** - Fix typos, improve examples
- **Repo organization** - Better folder structure, file naming
- **Developer tooling** - Scripts, configs, automation

## 🔍 Finding Issues to Work On

- Check the [Issues](https://github.com/EremosCore/Eremos/issues) page
- Look for `good first issue` labels
- Ask in issues if you need clarification
- Propose new ideas via feature requests

## 💬 Getting Help

- **Discord**: Join our community (link coming soon)
- **Twitter**: [@EremosCore](https://x.com/EremosCore)  
- **Issues**: Use GitHub issues for questions
- **Email**: Contact the core team

## 📜 Code of Conduct

- Be respectful and constructive
- Focus on the technology and use cases
- Help others learn and contribute
- Keep discussions on-topic

## 🏆 Recognition

Contributors are recognized in:
- README contributor section (coming soon)
- Release notes for significant contributions
- Agent attribution for new agents
- Community shoutouts on Twitter

---

**Ready to contribute?** Fork the repo and start building! 🛠️
