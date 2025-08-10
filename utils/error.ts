export function formatError(err: unknown): string {
  if (err instanceof Error) return `[Error] ${err.message}`
  return '[Error] Unknown failure'
}

export function logAgentError(agentName: string, error: unknown) {
  console.error(`[${agentName}] ${formatError(error)}`)
}
