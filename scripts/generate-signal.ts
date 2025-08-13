import { logSignal } from '../utils/logger'
import { generateSignalHash } from '../utils/signal'

const hash = generateSignalHash({ type: 'manual', payload: 'test' })

logSignal({
  agent: 'ManualSim',
  type: 'test_signal',
  glyph: '*',
  hash,
  timestamp: new Date().toISOString(),
})
