import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { startPerformanceTracking, endPerformanceTracking } from "../utils/metrics";

export const ExampleAgent: Agent = {
  id: "agent-xxx",
  name: "Example",
  role: "template",
  watchType: "wallet_activity", // - example
  glyph: "x",
  triggerThreshold: 3,
  lastSignal: null,
  originTimestamp: "2025-01-01T00:00:00.000Z",

  description:
    "Template agent used as a reference for custom swarm agent creation. Replace fields and logic to define your own behavior.",

  observe: (event) => {
    const startTime = startPerformanceTracking("agent-xxx");
    let signalEmitted = false;
    
    if (event?.type === "wallet_activity") {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "Example",
        type: "template_log",
        glyph: "x",
        hash,
        timestamp: new Date().toISOString(),
      });
      signalEmitted = true;
    }
    
    endPerformanceTracking("agent-xxx", startTime, signalEmitted);
  },

  getMemory: () => {
    return ["template_signal_001", "wallet_event_placeholder"];
  },
};
