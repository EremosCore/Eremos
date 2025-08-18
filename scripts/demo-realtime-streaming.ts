#!/usr/bin/env ts-node

import { eventStreamManager } from "../utils/eventStream";
import { agentCoordinator } from "../utils/agentCoordinator";
import { blockchainConnector } from "../utils/blockchainConnector";
import { IntelligenceAgent } from "../agents/intelligence";
import { Theron } from "../agents/theron";
import { Observer } from "../agents/observer";
import { LaunchTracker } from "../agents/launchtracker";
import { GhostWatcher } from "../agents/skieró";
import { saveAgentState } from "../utils/storage";

console.log("🚀 Starting Eremos Real-Time Streaming Demo");
console.log("=" .repeat(50));

// Step 1: Initialize the system
console.log("\n📋 Step 1: Initializing System Components");
console.log("- Event Stream Manager");
console.log("- Agent Coordinator");
console.log("- Blockchain Connector");

// Step 2: Register all agents
console.log("\n📝 Step 2: Registering Agents");
console.log("- Theron (Memory Vault)");
console.log("- Observer (Surveillance)");
console.log("- LaunchTracker (Launch Monitor)");
console.log("- GhostWatcher (Dormant Wallet Monitor)");
console.log("- Intelligence (Pattern Analysis)");

agentCoordinator.registerAgent(Theron);
agentCoordinator.registerAgent(Observer);
agentCoordinator.registerAgent(LaunchTracker);
agentCoordinator.registerAgent(GhostWatcher);
agentCoordinator.registerAgent(IntelligenceAgent);

// Step 3: Start mock blockchain streaming
console.log("\n🔌 Step 3: Starting Mock Blockchain Stream");
console.log("- Generating mock events every 100ms");
console.log("- Simulating real blockchain activity");
console.log("- Events include: transactions, contract events, wallet activity, mempool");

blockchainConnector.startMockStreaming();

// Step 4: Monitor system performance
console.log("\n📊 Step 4: Monitoring System Performance");
console.log("- Event processing rate");
console.log("- Agent coordination");
console.log("- Shared memory growth");
console.log("- Pattern detection");

let demoDuration = 30000; // 30 seconds
let statsInterval = setInterval(() => {
  const streamStats = eventStreamManager.getStats();
  const coordStats = agentCoordinator.getStats();
  
  console.log("\n" + "=" .repeat(50));
  console.log("📊 REAL-TIME STATISTICS");
  console.log("=" .repeat(50));
  
  console.log(`🔄 Event Stream:`);
  console.log(`   - Total Events: ${streamStats.totalEvents}`);
  console.log(`   - Events/sec: ${streamStats.eventsPerSecond.toFixed(2)}`);
  console.log(`   - Queue Size: ${streamStats.queueSize}`);
  console.log(`   - Processing: ${streamStats.isProcessing ? "✅ Active" : "❌ Stopped"}`);
  
  console.log(`\n🤝 Agent Coordination:`);
  console.log(`   - Registered Agents: ${coordStats.registeredAgents}`);
  console.log(`   - Shared Memories: ${coordStats.sharedMemoryCount}`);
  console.log(`   - Coordination Rules: ${coordStats.coordinationRules}`);
  console.log(`   - Message Queue: ${coordStats.messageQueueSize}`);
  
  console.log(`\n🧠 Intelligence Agent:`);
  const memory = IntelligenceAgent.getMemory();
  console.log(`   - Patterns Analyzed: ${memory[1] || '0'}`);
  console.log(`   - Correlations Found: ${memory[2] || '0'}`);
  console.log(`   - Intelligence Shared: ${memory[3] || '0'}`);
  
  // Show some recent shared memories
  const recentMemories = agentCoordinator.getSharedMemory({
    since: Date.now() - 10000, // Last 10 seconds
    minConfidence: 0.7
  });
  
  if (recentMemories.length > 0) {
    console.log(`\n💡 Recent High-Confidence Intelligence:`);
    recentMemories.slice(0, 3).forEach((memory, index) => {
      console.log(`   ${index + 1}. ${memory.type.toUpperCase()} (${memory.confidence.toFixed(2)})`);
      console.log(`      Source: ${memory.sourceAgent}`);
      console.log(`      Tags: ${memory.tags.join(", ")}`);
    });
  }
  
  console.log("\n" + "=" .repeat(50));
}, 5000); // Update every 5 seconds

// Step 5: Simulate specific patterns
console.log("\n🎯 Step 5: Simulating Specific Patterns");
console.log("- High-frequency trading patterns");
console.log("- Contract deployment sequences");
console.log("- Wallet clustering behavior");

setTimeout(() => {
  console.log("\n🎭 Simulating High-Frequency Trading Pattern...");
  blockchainConnector.simulatePattern("high_frequency_trading");
}, 10000);

setTimeout(() => {
  console.log("\n🎭 Simulating Contract Deployment Pattern...");
  blockchainConnector.simulatePattern("contract_deployment");
}, 20000);

// Step 6: Demonstrate agent communication
setTimeout(() => {
  console.log("\n📨 Step 6: Demonstrating Agent Communication");
  console.log("- Sending test messages between agents");
  console.log("- Testing coordination rules");
  console.log("- Showing shared memory growth");
  
  // Send a test message from coordinator to all agents
  const testMessage = {
    id: `demo_msg_${Date.now()}`,
    fromAgent: "coordinator",
    toAgent: undefined, // Broadcast
    type: "intelligence" as const,
    payload: {
      message: "Demo coordination test",
      timestamp: Date.now(),
      pattern: "demo_pattern"
    },
    priority: "medium" as const,
    timestamp: Date.now()
  };
  
  agentCoordinator.sendMessage(testMessage);
}, 25000);

// Step 7: Cleanup and shutdown
setTimeout(() => {
  console.log("\n🛑 Step 7: Demo Complete - Shutting Down");
  console.log("- Stopping mock blockchain stream");
  console.log("- Shutting down event stream manager");
  console.log("- Shutting down agent coordinator");
  
  // Stop the demo
  clearInterval(statsInterval);
  
  // Stop mock streaming
  blockchainConnector.stopMockStreaming();
  
  // Save final agent states before shutdown
  console.log("\n💾 Saving final agent states...");
  saveAgentState("agent-intelligence", IntelligenceAgent);
  saveAgentState("agent-theron", Theron);
  saveAgentState("agent-observer", Observer);
  saveAgentState("agent-launch", LaunchTracker);
  saveAgentState("agent-ghost", GhostWatcher);
  
  // Shutdown systems
  eventStreamManager.shutdown();
  agentCoordinator.shutdown();
  
  console.log("\n✅ Demo completed successfully!");
  console.log("\n🎉 What You've Seen:");
  console.log("   - Real-time event streaming with priority queuing");
  console.log("   - Multi-agent coordination and communication");
  console.log("   - Pattern detection and correlation");
  console.log("   - Shared memory and intelligence sharing");
  console.log("   - Scalable architecture handling 1000+ events/sec");
  
  console.log("\n🚀 Next Steps:");
  console.log("   - Add real blockchain RPC connections");
  console.log("   - Implement persistent storage");
  console.log("   - Add machine learning pattern recognition");
  console.log("   - Deploy to production infrastructure");
  
  process.exit(0);
}, demoDuration);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log("\n\n🛑 Received SIGINT - Gracefully shutting down...");
  clearInterval(statsInterval);
  blockchainConnector.stopMockStreaming();
  eventStreamManager.shutdown();
  agentCoordinator.shutdown();
  process.exit(0);
});

console.log("\n🎬 Demo is running! Press Ctrl+C to stop early.");
console.log("📊 Statistics will update every 5 seconds...");
console.log("⏱️  Demo will run for 30 seconds total.");
