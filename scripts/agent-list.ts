import * as fs from 'fs'
import * as path from 'path'

const agentsPath = path.join(__dirname, '../agents')
const agentFiles = fs.readdirSync(agentsPath)

agentFiles.forEach((file) => {
  const agent = require(path.join(agentsPath, file))
  console.log(
    `🧠 ${agent.name || file.replace('.ts', '')} (${agent.id}) - ${agent.description}`
  )
})
