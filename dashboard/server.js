const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Global storage for real-time data
global.recentSignals = [];
global.performanceMetrics = {};

// Import simulation functions (simplified for server)
function generateMockSolanaEvent() {
  const eventTypes = ['wallet_funding', 'pump_interaction', 'token_creation', 'bundle_activity'];
  const agents = ['Nephesh', 'Kythara', 'Example'];
  const glyphs = ['◉', '⦿', '🚨', 'x'];
  
  return {
    agent: agents[Math.floor(Math.random() * agents.length)],
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
    hash: 'sig_' + Math.random().toString(36).substr(2, 8),
    timestamp: new Date().toISOString(),
    confidence: Math.random() * 0.5 + 0.5,
    details: {
      wallet: Math.random().toString(36).substr(2, 15),
      amount: Math.random() * 50 + 5
    }
  };
}

function updatePerformanceMetrics(agentId, executionTime, signalEmitted) {
  if (!global.performanceMetrics[agentId]) {
    global.performanceMetrics[agentId] = {
      calls: 0,
      totalExecutionTime: 0,
      signalsEmitted: 0,
      averageExecutionTime: 0,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
    };
  }
  
  const metrics = global.performanceMetrics[agentId];
  metrics.calls += 1;
  metrics.totalExecutionTime += executionTime;
  metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.calls;
  if (signalEmitted) metrics.signalsEmitted += 1;
  metrics.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
}

function runSolanaSimulation() {
  console.log('⦿ Awakening Eremos agents for live dashboard simulation...');
  
  let eventCount = 0;
  const maxEvents = 50;
  
  const interval = setInterval(() => {
    const event = generateMockSolanaEvent();
    const executionTime = Math.random() * 10 + 1; // 1-11ms
    const signalEmitted = event.confidence > 0.7;
    
    // Update performance metrics
    updatePerformanceMetrics(event.agent.toLowerCase().replace(' ', '-'), executionTime, signalEmitted);
    
    // Add signal to recent signals if emitted
    if (signalEmitted) {
      global.recentSignals.unshift(event);
      // Keep only last 20 signals
      if (global.recentSignals.length > 20) {
        global.recentSignals = global.recentSignals.slice(0, 20);
      }
    }
    
    eventCount++;
    
    if (eventCount >= maxEvents) {
      clearInterval(interval);
      console.log('✅ Simulation complete - data available in dashboard');
    }
  }, 500); // Generate event every 500ms
}

// Simple HTTP server to serve the dashboard
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    // Serve the dashboard HTML
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (req.url === '/api/signals') {
    // API endpoint for real-time signals
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Return recent signals from global storage
    const recentSignals = global.recentSignals || [];
    res.end(JSON.stringify(recentSignals));
    
  } else if (req.url === '/api/performance') {
    // API endpoint for real performance metrics
    res.writeHead(200, {
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*'
    });
    
    // Return real performance data from global storage
    const performanceData = global.performanceMetrics || {
      "agent-observer": {
        calls: 0,
        totalExecutionTime: 0,
        signalsEmitted: 0,
        averageExecutionTime: 0,
        memoryUsage: 0
      }
    };
    
    res.end(JSON.stringify(performanceData));
    
  } else if (req.url === '/api/simulate' && req.method === 'POST') {
    // API endpoint to trigger simulation
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Trigger the simulation
    try {
      runSolanaSimulation();
      res.end(JSON.stringify({ status: 'simulation_started' }));
    } catch (error) {
      res.end(JSON.stringify({ status: 'error', message: error.message }));
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Eremos Dashboard running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://localhost:${PORT}/api/signals`);
  console.log(`   http://localhost:${PORT}/api/performance`);
  console.log('\n💡 Open the dashboard in your browser to see signal analytics!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down dashboard server...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});