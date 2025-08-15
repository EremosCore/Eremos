# Eremos Development Guide

Welcome to Eremos development! This guide will help you get started quickly.

## Quick Development Commands

```bash
# Development workflow
npm run dev              # Start development mode
npm run dev-agent        # Run agent in development mode
npm run test             # Run all tests
npm run validate-agent   # Validate agent configurations

# Code quality
npm run lint             # Check code style
npm run format           # Format code
```

## Creating Your First Agent

1. **Copy the example template:**
   ```bash
   cp agents/example.ts agents/my-new-agent.ts
   ```

2. **Modify the agent configuration:**
   - Change the `id` to be unique
   - Update the `name` and `description`
   - Choose appropriate `watchType` and `glyph`
   - Implement your custom `observe` logic

3. **Test your agent:**
   ```bash
   npm run dev-agent -- --agent=my-new-agent
   ```

## Agent Types and Examples

| Watch Type | Purpose | Example Use Case |
|------------|---------|------------------|
| `wallet_activity` | Monitor wallet transactions | Track large transfers |
| `contract_deploy` | Watch new contract deployments | Detect new tokens |
| `bundle_activity` | Monitor MEV bundles | Find coordinated trading |
| `dormant_revival` | Track dormant wallet activations | Ghost wallet detection |

## Signal Structure

Every signal should include:
- `agent`: Agent name
- `type`: Signal type
- `glyph`: Visual identifier
- `hash`: Unique signal hash
- `timestamp`: ISO timestamp
- `confidence`: Score 0.0-1.0

## Debugging Tips

- Use `utils/debug.ts` for structured logging
- Set `DEBUG_MODE=true` in `.env.local` for verbose output
- Check `docs/architecture.md` for system design
- Review existing agents in `/agents` for patterns

## Testing

- Unit tests go in `/tests`
- Test signal generation with mock data
- Validate confidence scoring logic
- Test error handling and edge cases

## Need Help?

- 📖 Check `/docs` for detailed documentation
- 🐛 Report issues on GitHub
- 💬 Join discussions on Twitter [@EremosCore](https://x.com/EremosCore)
- 📧 Contact the core team

Happy building! 🛠️
