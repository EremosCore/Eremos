import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { parseWalletActivityEvent } from "../utils/eventParser";

export const Observer: Agent = {
  id: "agent-observer",
  name: "Observer",
  role: "surveillance",
  glyph: "φ",
  watchType: "wallet_activity",
  triggerThreshold: 3,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "A passive agent that logs unusual wallet clustering.",

  observe: (rawEvent) => {
    const event = parseWalletActivityEvent(rawEvent);
    if (!event) return;
    
    if (event.cluster && event.cluster.length > 3) {
      const hash = generateSignalHash(event);

      logSignal({
          agent: "Observer",
          type: "cluster_detected",
          glyph: "φ",
          hash,
          timestamp: new Date().toISOString(),
          details: {
            clusterSize: event.cluster.length,
            address: event.address,
            volume: event.volume
          }
      });
    }
  }
};
