// types/config.ts
export interface AgentConfig {
  id: string
  triggerThreshold: number
  passive?: boolean
  logLevel?: 'info' | 'warn' | 'debug'
}
