# Eremos Development Makefile
# Provides convenient commands for common development tasks

.PHONY: help install dev test lint format clean deploy validate-agents

# Default target
help: ## Show this help message
	@echo "🤖 Eremos Development Commands"
	@echo "═══════════════════════════════"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install project dependencies
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed successfully"

setup: install ## Complete project setup for new developers
	@echo "🔧 Setting up development environment..."
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "📝 Created .env.local from template"; \
	fi
	@echo "✅ Setup complete! Run 'make dev' to start development"

dev: ## Start development mode
	@echo "🚀 Starting development mode..."
	npm run dev

test: ## Run all tests
	@echo "🧪 Running tests..."
	npm run test

lint: ## Check code style and quality
	@echo "🔍 Checking code quality..."
	npm run lint

format: ## Format code automatically
	@echo "💅 Formatting code..."
	npm run format

validate-agents: ## Validate all agent configurations
	@echo "🤖 Validating agent configurations..."
	npm run validate-agent

simulate: ## Simulate agent cluster behavior
	@echo "🌊 Simulating agent cluster..."
	npm run simulate-cluster

clean: ## Clean build artifacts and node_modules
	@echo "🧹 Cleaning project..."
	rm -rf node_modules
	rm -rf dist
	rm -rf .next
	@echo "✅ Project cleaned"

deploy-agent: ## Deploy a new agent (usage: make deploy-agent AGENT=agent-name)
	@if [ -z "$(AGENT)" ]; then \
		echo "❌ Please specify an agent name: make deploy-agent AGENT=agent-name"; \
		exit 1; \
	fi
	@echo "🚀 Deploying agent: $(AGENT)"
	npm run dev-agent -- --agent=$(AGENT)

status: ## Show swarm status and agent information
	@echo "📊 Eremos Swarm Status"
	@echo "════════════════════════"
	@echo "🤖 Checking agent registry..."
	# This would call a status script when implemented

bootstrap: ## Bootstrap a new agent from template
	@if [ -z "$(NAME)" ]; then \
		echo "❌ Please specify an agent name: make bootstrap NAME=MyAgent"; \
		exit 1; \
	fi
	@echo "🤖 Creating new agent: $(NAME)"
	@cp agents/example.ts agents/$(shell echo $(NAME) | tr '[:upper:]' '[:lower:]').ts
	@echo "✅ Agent template created at agents/$(shell echo $(NAME) | tr '[:upper:]' '[:lower:]').ts"
	@echo "📝 Don't forget to update the agent configuration!"

docs: ## Generate or serve documentation
	@echo "📚 Documentation commands:"
	@echo "  - README.md: Main project documentation"
	@echo "  - docs/: Detailed technical documentation"
	@echo "  - DEVELOPMENT.md: Developer setup guide"

quick-start: setup ## Complete quick-start for new contributors
	@echo ""
	@echo "🎉 Quick Start Complete!"
	@echo "═══════════════════════"
	@echo "Next steps:"
	@echo "  1. Review the README.md for project overview"
	@echo "  2. Check DEVELOPMENT.md for detailed setup"
	@echo "  3. Run 'make dev' to start development"
	@echo "  4. Run 'make bootstrap NAME=MyAgent' to create your first agent"
	@echo ""

# Development workflow shortcuts
.PHONY: check fix build
check: lint test validate-agents ## Run all quality checks
fix: format lint ## Fix common code issues
build: clean install test ## Full build process
