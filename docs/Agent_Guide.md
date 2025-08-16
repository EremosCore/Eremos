# Agent Guide (Simple Version)

**What is an agent?**  
A tiny program that *watches something* and prints a signal when it sees something interesting. One agent = one job.

---

## What every agent must have

These fields exist in each agent (plain English):

- **id**: machine-readable id, like `agent-000-theron` (lowercase/kebab).
- **name**: human name, like `Theron`.
- **role**: short category for what it does (e.g. `surveillance`, `indexing`, `memory_vault`).
- **glyph**: a small symbol that represents the agent (e.g. `Δ`, `λ`, `Ϸ`). Keep it unique.
- **watchType**: what the agent watches (e.g. `wallet_activity`, `mint_activity`, `anomaly_detection`).
- **triggerThreshold**: number ≥ 1 that decides when a signal is “important”.
- **lastSignal**: the last signal id/hash it produced (or `null` if none yet).
- **originTimestamp**: ISO date string (e.g. `2025-08-15T00:00:00.000Z`).
- **description**: one short sentence: *what does this agent watch and why?*
- **observe(event)**: the function that gets events and decides if they are interesting.
- **getMemory()** *(optional)*: returns a short list of strings describing current state.

> You don’t need to build agents to contribute. This page just explains the shape for newcomers.

---

## Minimal sketch (just to see the shape)

```ts
export const id = "agent-example-001";
export const name = "ExampleAgent";
export const role = "surveillance";
export const glyph = "☆";
export const watchType = "example_activity";
export const triggerThreshold = 3;
export const lastSignal = null;
export const originTimestamp = new Date().toISOString();
export const description = "Demo agent that watches example events.";

export function observe(event:any) {
  // tiny checks here
}

export function getMemory() {
  return ["seen:0"];
}

Common words you’ll see

signal: the standardized “I saw something” message an agent prints.

hash / generateSignalHash: a unique id for a signal (helps dedupe & track).

logSignal: shared logger so all agents print signals the same way.


| Name      | Role          | Glyph | Watches            |
| --------- | ------------- | ----- | ------------------ |
| Theron    | memory\_vault | Ϸ     | anomaly\_detection |
| Observer  | surveillance  | Δ     | wallet\_activity   |
| Harvester | indexing      | λ     | mint\_activity     |
