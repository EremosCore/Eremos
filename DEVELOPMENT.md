# Development Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/EremosCore/Eremos.git
   cd Eremos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

## Development Workflow

### Code Quality

We use several tools to maintain code quality:

- **TypeScript** for type safety
- **ESLint** for linting
- **Prettier** for code formatting
- **Jest** for testing

### Before Committing

Always run these commands before committing:

```bash
# Check types
npm run type-check

# Format code
npm run format

# Lint and fix issues
npm run lint:fix

# Run tests
npm test

# Build to ensure no build errors
npm run build
```

### Git Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

3. Push and create a PR:
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` code style changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## Project Structure

```
├── agents/           # Agent implementations
├── docs/            # Documentation and assets
├── scripts/         # Development and utility scripts
├── tests/           # Test files
├── types/           # TypeScript type definitions
├── utils/           # Shared utilities
├── .github/         # GitHub workflows and templates
├── dist/            # Compiled output (gitignored)
└── coverage/        # Test coverage reports (gitignored)
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place test files in the `tests/` directory
- Use the `.test.ts` extension
- Follow the existing test patterns
- Aim for good test coverage

## Agent Development

### Creating a New Agent

1. Use the generator script:
   ```bash
   npm run agent:generate
   ```

2. Follow the prompts to configure your agent

3. Implement the agent logic in the generated file

4. Add tests for your agent

5. Validate your agent:
   ```bash
   npm run agent:validate
   ```

### Agent Best Practices

- Keep agents focused on a single responsibility
- Use proper TypeScript types
- Include comprehensive error handling
- Add thorough tests
- Document your agent's purpose and configuration

## Debugging

### Development Mode

```bash
npm run dev
```

### Simulation and Testing

```bash
# Run cluster simulation
npm run simulate

# Performance testing
npm run stress-test
```

## CI/CD

The project uses GitHub Actions for continuous integration:

- **On Push/PR**: Runs tests, linting, type checking, and builds
- **Security**: Runs npm audit for security vulnerabilities
- **Multiple Node Versions**: Tests on Node.js 18.x and 20.x

## Performance Considerations

- Keep signal emission lightweight
- Use efficient data structures for memory storage
- Consider rate limiting for external API calls
- Profile agent performance under load

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `npm run type-check` to see detailed errors
2. **Linting errors**: Run `npm run lint:fix` to auto-fix issues
3. **Test failures**: Check test output and fix failing assertions
4. **Build errors**: Ensure all dependencies are installed and TypeScript config is correct

### Getting Help

- Check existing issues on GitHub
- Read the documentation in `/docs`
- Join our community discussions
- Contact the maintainers on Twitter [@EremosCore](https://x.com/EremosCore)
