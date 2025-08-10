import { ExampleAgent } from '../agents/example'

ExampleAgent.observe({
  type: 'wallet_activity',
  wallet: '7Yk...',
  txCount: 4,
  timestamp: new Date().toISOString(),
})
