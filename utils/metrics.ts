const metrics: Record<string, number> = {}

export function recordCall(agentId: string) {
  metrics[agentId] = (metrics[agentId] || 0) + 1
}

export function getCallCount(agentId: string): number {
  return metrics[agentId] || 0
}
