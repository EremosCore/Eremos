import { generateSignalHash } from '../utils/signal'

const sampleEvent = {
  type: 'wallet_activity',
  source_wallet: '9xS6...r4nD',
  timestamp: new Date().toISOString(),
  notes: 'debug preview',
}

const hash = generateSignalHash(sampleEvent)
console.log('Generated Signal Hash:', hash)
