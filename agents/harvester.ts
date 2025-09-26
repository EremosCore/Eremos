import { Agent } from "../types/agent"
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { parseMintActivityEvent } from "../utils/eventParser";

export const Harvester: Agent = {
  id: "agent-harvester",
  name: "Harvester",
  role: "indexing",
  glyph: "λ",
  watchType: "mint_activity",
  triggerThreshold: 2,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "Indexes mint data for high-volume collections.",

  observe: (rawEvent) => {
    const event = parseMintActivityEvent(rawEvent);
    if (event && event.amount > 10) {
      logSignal({
        agent: "Harvester",
        type: "mint_activity",
        glyph: "λ",
        hash: generateSignalHash(event),
        timestamp: new Date().toISOString(),
        details: {
          amount: event.amount
        }
      });
    }
  }
}
