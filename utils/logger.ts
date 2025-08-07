export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  details?: Record<string, any>;
  confidence?: number;
}) {
  console.log(
    `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`
  );
  if (signal.confidence !== undefined) {
    console.log(`├─ confidence: ${signal.confidence}`);
  }
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
