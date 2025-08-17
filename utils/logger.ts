export function logSignal(signal: {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  confidence?: number;
  poolAddress?: string;
  amount?: number;
  collection?: string;
  mintCount?: number;
  proposalId?: string;
  dao?: string;
  riskLevel?: string;
  walletAddress?: string;
  details?: Record<string, any>;
}) {
  console.log(
    `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`
  );
  if (signal.confidence) {
    console.log(`├─ confidence: ${signal.confidence}`);
  }
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
