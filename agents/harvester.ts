import { Agent } from '../types/agent'

export const Harvester: Agent = {
  id: 'agent-harvester',
  name: 'Harvester',
  role: 'indexing',
  glyph: 'λ',
  watchType: 'mint_activity',
  triggerThreshold: 2,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: 'Indexes mint data for high-volume collections.',

  observe: (event) => {
    if (event?.type === 'mint_activity' && event.amount > 10) {
      console.log('Mint spike detected:', event.amount)
    }
  },
}
