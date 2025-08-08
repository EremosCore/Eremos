import { Theron } from "../agents/theron";
import { Observer } from "../agents/observer";
import { Harvester } from "../agents/harvester";
import { LaunchTracker } from "../agents/launchtracker";
import { Agent } from "../types/agent";

const agents: Agent[] = [Theron, Observer, Harvester, LaunchTracker];

const exportMemory = (id: string) => {
  const agent = agents.find((a: Agent) => a.id === id);

  if (agent && typeof agent.getMemory === "function") {
    const memory = agent.getMemory();
    console.log(`Memory for ${agent.name}:\n`);
    console.log(JSON.stringify(memory, null, 2));
  } else {
    console.error("Agent not found or getMemory not available.");
  }
};

// Replace with a valid agent ID
exportMemory('agent-000');
