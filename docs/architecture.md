# Eremos Architecture

Eremos is a swarm-style agent framework for passive blockchain observation.

Each agent:

- Has a role (`observer`, `memory`, `trigger`, `+ more to come`)
- Watches a specific event type
- Emits structured signals
- Optionally stores memory

Shared utilities and types define common structure across agents.  
Signals are deterministic and lightweight — not reactive.

> Agent communication and orchestration are coming soon.

# Architecture

![Architecture Diagram](architecture-diagram.png)

This diagram illustrates the modular agent framework of Eremos, showing how agents interact with blockchain data, utilities, and the signal emission system.

- **Agents**: Monitor blockchain events and emit signals
- **Utils**: Provide shared logic for parsing, logging, metrics, and more
- **Types**: Define interfaces and data structures
- **Scripts**: Bootstrap and manage agent execution

For more details, see the main README and docs.
