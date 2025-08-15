export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  details?: Record<string, any>;
}) {
  const confidenceStr = signal.confidence !== undefined
    ? ` confidence: ${signal.confidence.toFixed(2)}`
    : '';

  console.log(`[${signal.agent}] stored signal ${signal.hash} (${signal.type})${confidenceStr} at ${signal.timestamp}`);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
