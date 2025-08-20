# Basic Eremos development commands

.PHONY: help setup dev clean
.PHONY: agent-list generate-agent test-agent validate-agent deploy-agent
.PHONY: stress-test simulate-cluster health-check logs profile

help:
	@echo "Eremos Development Commands:"
	@echo "  setup    - Install deps and configure environment"  
	@echo "  dev      - Start development mode"
	@echo "  clean    - Remove build artifacts"
	@echo "  test     - Run agent tests"

setup:
	npm install
	npm install -D typescript ts-node @types/node
	

dev:
	npx ts-node scripts/dev-agent.ts

format:
	@echo "✨ Formatting code..."
	@npx prettier --write "**/*.{ts,js,json,md}" 
	

clean:
	rm -rf node_modules dist *.log

test:
	npx ts-node scripts/validate-agent.ts