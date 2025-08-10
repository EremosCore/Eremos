let lastEmitted: Record<string, number> = {}

export function shouldEmit(agentId: string, cooldown: number): boolean {
  const now = Date.now()
  if (!lastEmitted[agentId] || now - lastEmitted[agentId] > cooldown) {
    lastEmitted[agentId] = now
    return true
  }
  return false
}
