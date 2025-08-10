export function logSignal(signal: {
  agent: string
  type: string
  glyph: string
  hash: string
  timestamp: string
  details?: Record<string, any>
}) {
  console.log(
    `[${signal.agent}] stored signal ${signal.hash} (${signal.type}) at ${signal.timestamp}`
  )
  if (signal.details) {
    console.log(`├─ context:`, JSON.stringify(signal.details, null, 2))
  }
}
