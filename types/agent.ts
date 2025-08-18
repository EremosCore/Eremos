export type Agent = {
  id: string
  name: string
  role: string
  glyph: string
  watchType: string
  triggerThreshold: number
  lastSignal: string | null
  originTimestamp: string
  description: string
  observe: (event: any) => void
  getMemory: () => string[]
}

// Extended agent type for agents with additional capabilities
export type ExtendedAgent = Agent & {
  // Pattern analysis capabilities
  analyzePatterns?: (event: any) => Array<{ type: string; confidence: number; data: any }>
  shareIntelligence?: (pattern: any) => void
  calculateSignalConfidence?: (event: any, patterns: any[]) => number
  
  // Memory and tracking
  recentTransactions?: any[]
  contractInteractions?: Map<string, any[]>
  walletBehaviors?: Map<string, any>
  
  // Counters
  correlationCount?: number
  sharedIntelligenceCount?: number
  
  // Methods
  getCorrelationCount?: () => number
  getSharedIntelligenceCount?: () => number
  triggerEnhancedAnalysis?: (payload: any) => void
  correlateIntelligence?: (payload: any) => void
  handleMessage?: (message: any) => void
}
