# Architecture

---

## Overview

Eremos is built around a modular agent system where each agent operates independently but shares common utilities and patterns.

---

## Core Components

### Agents
- **Independent modules** that observe specific blockchain events
- **Scoped logic** for detecting patterns and anomalies
- **Signal emission** when thresholds are met
- **Memory persistence** for state management

### Utilities
- **Shared logging** and signal generation
- **Common patterns** for agent development
- **Type definitions** for consistency
- **Testing frameworks** for validation

### Scripts
- **Development tools** for agent testing
- **Bootstrap scripts** for setup
- **Analysis tools** for signal processing

---

## Design Principles

- **Modularity**: Each agent is self-contained
- **Extensibility**: Easy to add new agents
- **Consistency**: Shared patterns and utilities
- **Transparency**: Clear signal generation and logging

---

*For detailed implementation guides, see the [Agent Guide](agents.md) and [Contributing Guide](contributing.md).*
