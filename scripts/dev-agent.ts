import { ExampleAgent } from "../agents/example";

console.log("\n⚡ Eremos Example Agent Demo\n");
console.log("╭─────────────────────────────────────────────╮");
console.log("│         Example Agent - Template Mode      │");
console.log("│              Wallet Activity Monitor        │");
console.log("╰─────────────────────────────────────────────╯\n");

const mockWalletEvent = {
  type: "wallet_activity",
  wallet: "7Yk...H3pQ",
  txCount: 4,
  source: "kraken",
  timestamp: new Date().toISOString()
};

console.log("🎯 Testing wallet activity detection...");
console.log(`   Event: ${JSON.stringify(mockWalletEvent, null, 2)}\n`);

ExampleAgent.observe(mockWalletEvent);

console.log("\n🚀 Example agent demo complete!");
console.log("💡 Use this agent as a template for creating your own");
console.log("🔧 Run 'npm run agent:validate example' to check agent health\n");
