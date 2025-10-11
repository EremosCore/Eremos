# Agent Guide

## Base Requirements
Each agent must include:
- `observe(event)` — detection logic
- `getMemory()` — memory snapshot
- `description`, `watchType`, `glyph`, and `triggerThreshold`

Use `/agents/example.ts` as a scaffold.

## Development Tips
- Keep logic scoped and clean
- Use `generateSignalHash()` for all outputs
- Log using the shared `logSignal()` util

You can test agents using `/scripts/dev-agent.ts` or create your own mock.

## Agents

### Theron (Agent-000)
- Role: memory_vault  
- Glyph: Ϸ  
- Watches: anomaly_detection  

### Observer
- Role: surveillance  
- Glyph: Δ  
- Watches: wallet_activity  

### Harvester (new)
- Role: indexing  
- Glyph: λ  
- Watches: mint_activity  
