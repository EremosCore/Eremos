import { Signal } from '../types/signal';

export function logSignal(signal: Signal) {
  const header = `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`;
  const confidence =
    typeof signal.confidence === 'number'
      ? ` | confidence=${signal.confidence.toFixed(2)}`
      : '';
  console.log(header + confidence);
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2));
  }
}
