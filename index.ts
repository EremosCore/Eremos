// Main entry point for Eremos swarm framework
import { agents } from "./agents";
import { logSignal } from "./utils/logger";
import { debug } from "./utils/debug";

export * from "./agents";

// Initialize the swarm
export const initializeSwarm = () => {
  debug("system", `Initializing Eremos swarm with ${agents.length} agents`);
  
  agents.forEach((agent) => {
    debug("agent", `Agent ${agent.name} (${agent.id}) loaded - ${agent.role}`);
  });

  logSignal({
    agent: "System",
    type: "swarm_initialized", 
    glyph: "⚡",
    hash: "sys_init_" + Date.now().toString(36),
    timestamp: new Date().toISOString(),
    details: {
      agentCount: agents.length,
      version: "1.0.0"
    }
  });
};

// Default initialization if run directly
if (require.main === module) {
  initializeSwarm();
}