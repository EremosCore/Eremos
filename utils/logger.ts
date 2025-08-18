import { saveSignal } from './storage';

export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  details?: Record<string, any>;
}) {
  // Console output (existing functionality)
  console.log(`[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
  
  // Save to file (new functionality)
  saveSignal(signal);
}
