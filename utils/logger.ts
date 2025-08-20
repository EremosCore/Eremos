// utils/logger.ts

// Helper: current timestamp in ISO format
function getTimestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (msg: string) => {
    console.log(`[${getTimestamp()}] INFO: ${msg}`);
  },
  warn: (msg: string) => {
    console.warn(`[${getTimestamp()}] WARN: ${msg}`);
  },
  error: (msg: string) => {
    console.error(`[${getTimestamp()}] ERROR: ${msg}`);
  },
  debug: (msg: string) => {
    console.debug(`[${getTimestamp()}] DEBUG: ${msg}`);
  }
};

export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  details?: Record<string, any>;
}) {

  logger.info(
    `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`
  );
=======
  const confidenceStr = signal.confidence !== undefined
    ? ` confidence: ${signal.confidence.toFixed(2)}`
    : '';

  console.log(`[${signal.agent}] stored signal ${signal.hash} (${signal.type})${confidenceStr} at ${signal.timestamp}`);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
