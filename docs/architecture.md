# Eremos Architecture

Eremos is a swarm-style agent framework for passive blockchain observation.

Each agent:
- Has a role (`observer`, `memory`, `trigger`, `+ more soon`)
- Watches a specific event type
- Emits structured signals
- Optionally stores memory

Shared utilities and types define common structure across agents.  
Signals are deterministic and lightweight — not reactive.

> Agent communication and orchestration are coming soon.
