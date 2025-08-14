# Runtime Layer

The Eremos runtime coordinates agents, feeds events into active watchers, and logs outputs and state.

## Responsibilities

- Agent registry and lifecycle management
- Event ingestion and routing to `observe()`
- Signal logging and optional forwarding (e.g., webhooks, Discord)
- Backpressure handling and basic throttling

## Registry

Agents register with unique `id` and declare `watchType`, `role`, and capabilities. The registry can:
- Filter by `watchType` for efficient routing
- Track `lastSignal` to avoid duplicates
- Enforce `triggerThreshold`/cooldowns

## Scheduling & concurrency

- Event processing is cooperative and can be run in parallel across agents observing the same `watchType`.
- For high volume windows, apply batching and queueing to avoid unbounded memory.

## Backpressure

- Use bounded queues and time‑sliced processing loops to prevent starvation.
- Drop or degrade non‑critical events first during overload conditions.

## Future

- Priority queues per agent class (e.g., launch monitors over indexers)
- More granular throttling strategies (per event key, per wallet, per source)
- Persistent state snapshots for recovering after restarts
