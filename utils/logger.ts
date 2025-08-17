import { analytics } from './analytics';

export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  details?: Record<string, any>;
}) {
  console.log(`[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }

  analytics.recordSignal({
    id: signal.hash,
    agent: signal.agent,
    type: signal.type,
    confidence: signal.confidence,
    timestamp: signal.timestamp,
    hash: signal.hash
  });
}
