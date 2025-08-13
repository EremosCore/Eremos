import { Theron } from '../agents/theron'

for (let i = 0; i < 100; i++) {
  Theron.observe({
    type: 'wallet_activity',
    wallet: `0x${i.toString(16).padStart(4, '0')}`,
    txCount: Math.floor(Math.random() * 10),
    timestamp: new Date().toISOString(),
  })
}
