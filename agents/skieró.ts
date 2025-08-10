import { Agent } from '../types/agent'
import { logSignal } from '../utils/logger'
import { generateSignalHash } from '../utils/signal'

export const GhostWatcher: Agent = {
  id: 'agent-022',
  name: 'Skieró', //pending name change, might let the community decide via a poll?
  role: 'dormant_wallet_monitor',
  watchType: 'wallet_activity',
  glyph: 'ψ',
  triggerThreshold: 0.7,
  lastSignal: 'inactive',
  originTimestamp: '2024-07-03T00:00:00.000Z',

  description:
    'Tracks long-dormant wallets that suddenly reactivate. Useful for catching old dev or team wallets coming back online.',

  observe: (event) => {
    if (event.type === 'reactivation' && event.walletAgeDays > 180) {
      logSignal({
        agent: 'Skieró',
        type: 'wallet_reactivated',
        glyph: 'ψ',
        hash: generateSignalHash(event),
        timestamp: new Date().toISOString(),
        confidence: 0.78,
      })
    }
  },

  getMemory: () => ['ghost.wallet.3x89', 'anomaly.102b'],
}
