import { agents } from '../agents'

const exportMemory = (id: string) => {
  const agent = agents.find((a) => a.id === id)

  if (agent && typeof agent.getMemory === 'function') {
    const memory = agent.getMemory()
    console.log(`Memory for ${agent.name}:\n`)
    console.log(JSON.stringify(memory, null, 2))
  } else {
    console.error('Agent not found or getMemory not available.')
  }
}

// Replace with a valid agent ID
exportMemory('agent-000')
