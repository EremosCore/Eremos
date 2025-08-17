import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const Maelstrom: Agent = {
  id: "agent-maelstrom",
  name: "Maelstrom",
  role: "liquidity_guardian",
  glyph: "⟲",
  watchType: "liquidity_event",
  triggerThreshold: 1,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),

  description:
    "Watches liquidity pools for sudden drains or whale exits. Fires signals when more than 30% of a pool's liquidity disappears in a short window.",

  observe: (event) => {
    if (event?.type === "liquidity_event" && event.percentOutflow >= 30) {
      const hash = generateSignalHash(event);

      logSignal({
        agent: "Maelstrom",
        type: "liquidity_drain",
        glyph: "∇",
        hash,
        timestamp: new Date().toISOString(),
        confidence: 0.92,
      });
    }
  },

  getMemory: () => {
    return ["lp.rug.23x", "drain.2025-06", "whale.exit.γ"];
  },
};
