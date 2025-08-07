// Eremos Core Framework
// Main entry point for the agent swarm framework

// Import types
import type { Agent } from './types/agent';

// Export core types
export type { Agent } from './types/agent';
export type { Signal } from './types/signal';
export type { AgentConfig } from './types/config';

// Export utility functions
export { generateSignalHash } from './utils/signal';
export { logSignal } from './utils/logger';
export { parseWalletEvent } from './utils/eventParser';
export { recordCall, getCallCount } from './utils/metrics';
export { shouldEmit } from './utils/throttle';

// Export agents
export { Theron } from './agents/theron';
export { Observer } from './agents/observer';
export { Harvester } from './agents/harvester';
export { LaunchTracker } from './agents/launchtracker';
export { GhostWatcher } from './agents/skieró';
export { ExampleAgent } from './agents/example';

// Framework version
export const VERSION = '0.1.0';
export const FRAMEWORK_NAME = 'Eremos';

// Main framework class
export class EremosFramework {
  private agents: Map<string, Agent> = new Map();
  private isRunning = false;

  constructor() {
    this.registerDefaultAgents();
  }

  private registerDefaultAgents(): void {
    // Register built-in agents
    const defaultAgents = [
      { id: 'theron', agent: require('./agents/theron').Theron },
      { id: 'observer', agent: require('./agents/observer').Observer },
      { id: 'harvester', agent: require('./agents/harvester').Harvester },
      {
        id: 'launchtracker',
        agent: require('./agents/launchtracker').LaunchTracker,
      },
      { id: 'skieró', agent: require('./agents/skieró').GhostWatcher },
    ];

    defaultAgents.forEach(({ id, agent }) => {
      this.registerAgent(id, agent);
    });
  }

  registerAgent(id: string, agent: Agent): void {
    this.agents.set(id, agent);
    console.log(`[Eremos] Registered agent: ${agent.name} (${id})`);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  start(): void {
    if (this.isRunning) {
      console.warn('[Eremos] Framework is already running');
      return;
    }

    this.isRunning = true;
    console.log(
      `[Eremos] Starting framework v${VERSION} with ${this.agents.size} agents`
    );

    this.agents.forEach((agent, id) => {
      console.log(`[Eremos] Agent ${agent.name} (${id}) is active`);
    });
  }

  stop(): void {
    this.isRunning = false;
    console.log('[Eremos] Framework stopped');
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

// Default export
export default EremosFramework;
