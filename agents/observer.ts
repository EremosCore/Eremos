import { Agent } from "../types/agent"

export const Observer: Agent = {
  id: "agent-observer",
  name: "Observer",
  role: "surveillance",
  glyph: "Δ",
  watchType: "wallet_activity",
  triggerThreshold: 3,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "A passive agent that logs unusual wallet clustering.",

  observe: (event) => {
    if (event?.type === "wallet_activity" && event.cluster?.length > 3) {
      console.log("Observed cluster:", event.cluster)
    }
  }
}
