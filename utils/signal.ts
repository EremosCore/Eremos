export function generateSignalHash(signalType: string, agentId?: string): string {
  const base = JSON.stringify({ type: signalType, agent: agentId }) + Date.now();
  const hash = Buffer.from(base).toString("base64").slice(0, 10);
  return "sig_" + hash;
}

export function logSignal(signal: any): void {
  console.log(`[SIGNAL] ${signal.type} from ${signal.agent || signal.source} at ${signal.timestamp}`);
}
