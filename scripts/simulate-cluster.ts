import { Theron } from "../agents/theron";

console.log("\n🔮 Eremos Agent Simulation Starting...\n");
console.log("╭─────────────────────────────────────────────╮");
console.log("│           Agent Theron (000) - Active      │");
console.log("│               Memory Vault Mode             │");
console.log("╰─────────────────────────────────────────────╯\n");

const mockEvent = {
  type: "anomaly",
  wallet: "Bc4f2...o18",
  txCount: 6,
  confidence: 0.91,
  timestamp: new Date().toISOString(),
};

console.log("📡 Feeding anomaly event to Theron...");
console.log(`   Event: ${JSON.stringify(mockEvent, null, 2)}\n`);

Theron.observe(mockEvent);

console.log("\n✨ Agent simulation complete!");
console.log("📊 Memory fragments stored:", Theron.getMemory?.()?.length || 0);
console.log("🔍 Run 'npm run agent:health' to validate all agents\n");
