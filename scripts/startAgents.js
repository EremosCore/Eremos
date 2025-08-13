// scripts/startAgents.js
console.log('⚙️ Initializing agents...');

// Example: Load agent modules dynamically
const fs = require('fs');
const path = require('path');

const agentsDir = path.join(__dirname, '../agents');

// If agents folder exists, load them
if (fs.existsSync(agentsDir)) {
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.js'));

  if (agentFiles.length === 0) {
    console.warn('⚠️ No agent files found in /agents. Add some to get started.');
  } else {
    agentFiles.forEach(file => {
      console.log(`📡 Loading agent: ${file}`);
      require(path.join(agentsDir, file));
    });
  }
} else {
  console.warn('⚠️ No /agents folder found. Skipping agent initialization.');
}

console.log('✅ Agent framework started successfully.');
