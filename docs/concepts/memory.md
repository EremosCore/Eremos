# Memory System

Eremos agents can expose internal memory using the `getMemory()` method.  
This allows agents to retain lightweight state or emit recognizable signals across time.

## Purpose

Memory helps agents:
- Track previously seen patterns
- Share known tags or identifiers
- Enable external tools to interpret their state

## Format

Memory is returned as an array of string tokens:

```ts
getMemory: () => ["cluster:001", "mint:phantom_batch", "flag:volatile"]
```

These tokens can represent tags, signal IDs, or abstract state cues.

## Notes

- Keep memory declarative and interpretable.

- Avoid storing raw data or full event payloads.

- Memory is optional - use it when the agent benefits from context or history.
