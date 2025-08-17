const http = require('http');
const fs = require('fs');
const path = require('path');

function loadDashboardData() {
  try {
    // Use ts-node to require TypeScript files
    require('ts-node/register');
    const { generateDashboardData } = require('../utils/dashboard.ts');
    return generateDashboardData();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return {
      overview: { totalSignals: 0, activeAgents: 0, avgConfidence: 0, signalsToday: 0 },
      agents: [],
      recentActivity: [],
      signalDistribution: {}
    };
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/dashboard') {
    const htmlPath = path.join(__dirname, 'index.html');
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } 
  else if (req.url === '/api/dashboard') {
    // Ensure we're in the right working directory
    const originalCwd = process.cwd();
    process.chdir(path.join(__dirname, '..'));
    
    const data = loadDashboardData();
    
    // Restore original working directory
    process.chdir(originalCwd);
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`\n🚀 Eremos Analytics Dashboard`);
  console.log(`📊 Running at: http://localhost:${PORT}`);
  console.log(`🔄 Auto-refresh: 30s\n`);
});

module.exports = server;
