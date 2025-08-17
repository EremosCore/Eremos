import "dotenv/config";
import { Agent } from "../types/agent";
import { ExampleAgent } from "../agents/example";
import { Harvester } from "../agents/harvester";
import { Observer } from "../agents/observer";
import { SolanaWatcher } from "../agents/solana-watcher";
import { EthereumWatcher } from "../agents/ethereum-watcher"; 

// CLI arg, example: npm run dev sol OR npm run dev eth
const arg = process.argv[2]?.toLowerCase();

let agents: Agent[];

if (!arg) {
  console.log("No agent selected → running all agents.\n");
  agents = [ExampleAgent, Harvester, Observer, SolanaWatcher, EthereumWatcher];
} else if (arg === "sol") {
  agents = [SolanaWatcher];
} else if (arg === "eth") {
  agents = [EthereumWatcher];
} else {
  console.error(`Unknown agent option: ${arg}`);
  console.log("   Usage: npm run dev [sol|eth]");
  process.exit(1);
}

async function startAgents() {
  console.log("Starting Eremos agent swarm...\n");

  for (const agent of agents) {
    try {
      console.log(`⚡ Initializing ${agent.name} (${agent.id})`);
      console.log(`   Role: ${agent.role} | Glyph: ${agent.glyph}`);
      console.log(`   Watching: ${agent.watchType}\n`);
      
      if (agent.init) {
        await agent.init();
      }
    } catch (error) {
      console.error(`Failed to initialize ${agent.name}:`, error);
    }
  }

  console.log("\n All agents initialized. Listening for events...\n");

  process.on("SIGINT", async () => {
    console.log("\n\n Shutting down agents...");
    
    for (const agent of agents) {
      if (agent.cleanup) {
        await agent.cleanup();
      }
    }
    
    console.log("Agents terminated. Goodbye!");
    process.exit(0);
  });

  process.stdin.resume();
}

startAgents().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});