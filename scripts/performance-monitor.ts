import { logPerformanceReport, getAllPerformanceMetrics } from "../utils/metrics";
import { Kythara } from "../agents/pumpfun-scanner";
import { Nephesh } from "../agents/cex-tracker";
import { ExampleAgent } from "../agents/example";
import { 
  generateScamSequence, 
  generateCexFunding, 
  generatePumpFunInteraction,
  generateBundleActivity,
  getRandomEventGenerator 
} from "../utils/mockData";

// Simulate realistic Solana pump.fun scam activity
function simulateRealisticSolanaActivity() {
  console.log("⦿ Awakening the Eremos swarm...");
  console.log("◉ Kythara and Nephesh scanning the digital winds...\n");
  
  const agents = [Kythara, Nephesh, ExampleAgent];
  
  // Generate a complete scam sequence
  const scamSequence = generateScamSequence();
  console.log(`🚨 Generated scam sequence with ${scamSequence.length} events:\n`);
  
  // Process the scam sequence
  scamSequence.forEach((event, index) => {
    setTimeout(() => {
      console.log(`⚡ Processing event ${index + 1}: ${event.type} (confidence: ${event.confidence?.toFixed(2)})`);
      
      // Send event to all relevant agents
      agents.forEach(agent => {
        if (agent.watchType === event.type || 
            agent.watchType === "wallet_activity" || 
            event.type.includes(agent.watchType.split('_')[0])) {
          agent.observe(event);
        }
      });
      
      // After processing scam sequence, generate random activity
      if (index === scamSequence.length - 1) {
        console.log("\n🔄 Generating additional random activity...\n");
        generateRandomActivity(agents);
      }
    }, index * 200); // 200ms between events for realistic timing
  });
}

// Generate ongoing random activity for performance testing
function generateRandomActivity(agents: any[]) {
  let eventCount = 0;
  const maxEvents = 20;
  
  const interval = setInterval(() => {
    const eventGenerator = getRandomEventGenerator();
    const event = eventGenerator();
    
    console.log(`🎲 Random event ${eventCount + 1}: ${event.type} (confidence: ${event.confidence?.toFixed(2)})`);
    
    // Process through relevant agents
    agents.forEach(agent => {
      if (agent.watchType === event.type || 
          agent.watchType === "wallet_activity" ||
          event.type.includes(agent.watchType.split('_')[0])) {
        agent.observe(event);
      }
    });
    
    eventCount++;
    
    // Stop after processing enough events and show results
    if (eventCount >= maxEvents) {
      clearInterval(interval);
      setTimeout(() => {
        console.log("\n" + "=".repeat(60));
        console.log("🏁 Simulation Complete - Performance Results:");
        console.log("=".repeat(60));
        
        logPerformanceReport();
        
        // Show detailed breakdown
        const allMetrics = getAllPerformanceMetrics();
        console.log("\n📊 Detailed Agent Performance Data:");
        console.log("=".repeat(40));
        Object.entries(allMetrics).forEach(([agentId, metrics]: [string, any]) => {
          console.log(`\n🤖 ${agentId}:`);
          console.log(`   Total Processing Time: ${metrics.totalExecutionTime.toFixed(2)}ms`);
          console.log(`   Signals Per Call: ${(metrics.signalsEmitted / metrics.calls * 100).toFixed(1)}%`);
          console.log(`   Efficiency Score: ${(1000 / metrics.averageExecutionTime).toFixed(0)} calls/sec`);
        });
        
        console.log("\n💾 Raw metrics JSON:");
        console.log(JSON.stringify(allMetrics, null, 2));
      }, 500);
    }
  }, 150); // Generate event every 150ms
}

// Run the simulation
simulateRealisticSolanaActivity();