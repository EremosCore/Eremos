import { Signal } from "../types/signal";

export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  details?: Record<string, any>;
}) {
  console.log(
    `[${signal.agent}] → emitting signal (${signal.type}) at ${signal.timestamp}`
  );

  if (signal.details) {
    Object.entries(signal.details).forEach(([key, val]) => {
      const pretty =
        typeof val === "object" ? JSON.stringify(val).slice(0, 120) : val;
      console.log(`[${signal.agent}] → ${key}: ${pretty}`);
    });
  }

  const structured: Signal & { agent: string; glyph: string } = {
    type: signal.type,
    hash: signal.hash,
    timestamp: signal.timestamp,
    source: signal.agent,
    details: signal.details,
    agent: signal.agent,
    glyph: signal.glyph,
  };

  console.log("");
  console.log(JSON.stringify(structured, null, 2));
  console.log("");
}