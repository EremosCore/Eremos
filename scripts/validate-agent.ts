import { Agent } from '../types/agent'
import fs from 'fs'

const raw = fs.readFileSync(process.argv[2], 'utf-8')
const agent: Agent = JSON.parse(raw)

if (!agent.id || !agent.observe || !agent.triggerThreshold) {
  console.error('❌ Invalid agent config.')
  process.exit(1)
} else {
  console.log('✅ Agent config looks valid.')
}
