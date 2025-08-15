# Eremos Architecture

Eremos is a swarm-style agent framework for passive blockchain observation.

## Agent Structure

Each agent:
- Has a role (`observer`, `memory`, `trigger`, `+ more to come`)
- Watches a specific event type
- Emits structured signals
- Optionally stores memory

## Framework Design

- **Shared utilities** and types define common structure across agents
- **Signals** are deterministic and lightweight — not reactive
- **Modular design** allows for easy extension and customization

## Future Roadmap

> Agent communication and orchestration are coming soon.

---

*For more details, see the [main documentation](index.md)*
