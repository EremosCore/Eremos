export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  details?: Record<string, any>;
}) {
  const confidenceStr = signal.confidence
    ? ` (confidence: ${signal.confidence})`
    : "";
  console.log(
    `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}${confidenceStr}`
  );
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
