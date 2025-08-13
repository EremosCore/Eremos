import { Theron } from '../agents/theron'

const mockEvent = {
  type: 'wallet_activity',
  wallet: 'Bc4f2...o18',
  txCount: 6,
  timestamp: new Date().toISOString(),
}

Theron.observe(mockEvent)
