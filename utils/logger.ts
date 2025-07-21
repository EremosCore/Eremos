import { SignalLog } from "../types/signal";

export function logSignal(signal: SignalLog) {
  console.log(`[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
