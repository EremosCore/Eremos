// Central export file for all agents
export { ExampleAgent } from "./example";
export { Harvester } from "./harvester";
export { LaunchTracker } from "./launchtracker";
export { Observer } from "./observer";
export { GhostWatcher } from "./skieró";
export { Theron } from "./theron";

// Agent registry for runtime coordination
import { Agent } from "../types/agent";
import { ExampleAgent } from "./example";
import { Harvester } from "./harvester";
import { LaunchTracker } from "./launchtracker";
import { Observer } from "./observer";
import { GhostWatcher } from "./skieró";
import { Theron } from "./theron";

export const agents: Agent[] = [
  Theron, // Agent-000 - The memory vault
  Observer, // Surveillance agent
  Harvester, // Indexing agent
  LaunchTracker, // Launch monitoring
  GhostWatcher, // Agent-022 - Dormant wallet monitor
  ExampleAgent, // Template agent
];

// Helper function to get agent by ID
export const getAgentById = (id: string): Agent | undefined => {
  return agents.find((agent) => agent.id === id);
};

// Helper function to get agents by role
export const getAgentsByRole = (role: string): Agent[] => {
  return agents.filter((agent) => agent.role === role);
};

// Helper function to get agents by watch type
export const getAgentsByWatchType = (watchType: string): Agent[] => {
  return agents.filter((agent) => agent.watchType === watchType);
};
