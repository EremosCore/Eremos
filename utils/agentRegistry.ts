import { Agent } from '../types/agent';
import { logInfo, logError, logWarning } from './logger';

/**
 * Agent Registry for managing active agents in the swarm
 */
class AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private activeAgents: Set<string> = new Set();

  /**
   * Register a new agent in the swarm
   * @param agent - Agent to register
   */
  register(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      logWarning(`Agent ${agent.id} is already registered. Updating existing agent.`);
    }

    this.agents.set(agent.id, agent);
    logInfo(`Agent registered: ${agent.name} (${agent.id}) - ${agent.role}`);
  }

  /**
   * Activate an agent for monitoring
   * @param agentId - ID of the agent to activate
   */
  activate(agentId: string): void {
    if (!this.agents.has(agentId)) {
      logError(`Cannot activate unknown agent: ${agentId}`);
      return;
    }

    this.activeAgents.add(agentId);
    const agent = this.agents.get(agentId)!;
    logInfo(`Agent activated: ${agent.name} (${agent.glyph})`);
  }

  /**
   * Deactivate an agent
   * @param agentId - ID of the agent to deactivate
   */
  deactivate(agentId: string): void {
    this.activeAgents.delete(agentId);
    const agent = this.agents.get(agentId);
    if (agent) {
      logInfo(`Agent deactivated: ${agent.name} (${agent.glyph})`);
    }
  }

  /**
   * Get an agent by ID
   * @param agentId - ID of the agent to retrieve
   * @returns Agent instance or undefined if not found
   */
  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all active agents
   * @returns Array of active agent instances
   */
  getActiveAgents(): Agent[] {
    return Array.from(this.activeAgents)
      .map(id => this.agents.get(id))
      .filter((agent): agent is Agent => agent !== undefined);
  }

  /**
   * Get all registered agents
   * @returns Array of all agent instances
   */
  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get swarm statistics
   * @returns Object containing swarm metrics
   */
  getStats(): SwarmStats {
    const allAgents = this.getAllAgents();
    const activeAgents = this.getActiveAgents();

    return {
      totalAgents: allAgents.length,
      activeAgents: activeAgents.length,
      inactiveAgents: allAgents.length - activeAgents.length,
      agentRoles: this.getAgentRoleDistribution(),
      watchTypes: this.getWatchTypeDistribution()
    };
  }

  /**
   * Get distribution of agent roles
   * @returns Record of role names to counts
   */
  private getAgentRoleDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    this.getAllAgents().forEach(agent => {
      distribution[agent.role] = (distribution[agent.role] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Get distribution of watch types
   * @returns Record of watch types to counts
   */
  private getWatchTypeDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    this.getAllAgents().forEach(agent => {
      distribution[agent.watchType] = (distribution[agent.watchType] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Validate agent configuration
   * @param agent - Agent to validate
   * @returns True if valid, false otherwise
   */
  validateAgent(agent: Agent): boolean {
    const errors: string[] = [];

    if (!agent.id || agent.id.trim() === '') {
      errors.push('Agent ID is required');
    }

    if (!agent.name || agent.name.trim() === '') {
      errors.push('Agent name is required');
    }

    if (typeof agent.triggerThreshold !== 'number' || agent.triggerThreshold < 0) {
      errors.push('Trigger threshold must be a non-negative number');
    }

    if (!agent.observe || typeof agent.observe !== 'function') {
      errors.push('Agent must have an observe function');
    }

    if (errors.length > 0) {
      logError(`Agent validation failed for ${agent.id}:`, new Error(errors.join(', ')));
      return false;
    }

    return true;
  }
}

/**
 * Swarm statistics interface
 */
export interface SwarmStats {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  agentRoles: Record<string, number>;
  watchTypes: Record<string, number>;
}

/**
 * Global agent registry instance
 */
export const agentRegistry = new AgentRegistry();

/**
 * Convenience function to register and activate an agent
 * @param agent - Agent to register and activate
 */
export function deployAgent(agent: Agent): void {
  if (!agentRegistry.validateAgent(agent)) {
    return;
  }

  agentRegistry.register(agent);
  agentRegistry.activate(agent.id);
}

/**
 * Get formatted swarm status report
 * @returns Formatted string with swarm information
 */
export function getSwarmStatusReport(): string {
  const stats = agentRegistry.getStats();
  const activeAgents = agentRegistry.getActiveAgents();

  let report = `\n🤖 Eremos Swarm Status Report\n`;
  report += `═══════════════════════════════\n`;
  report += `Total Agents: ${stats.totalAgents}\n`;
  report += `Active Agents: ${stats.activeAgents}\n`;
  report += `Inactive Agents: ${stats.inactiveAgents}\n\n`;

  if (activeAgents.length > 0) {
    report += `Active Agents:\n`;
    activeAgents.forEach(agent => {
      report += `  ${agent.glyph} ${agent.name} (${agent.id}) - ${agent.role}\n`;
    });
    report += `\n`;
  }

  report += `Roles Distribution:\n`;
  Object.keys(stats.agentRoles).forEach((role: string) => {
    const count = stats.agentRoles[role];
    report += `  ${role}: ${count}\n`;
  });

  report += `\nWatch Types:\n`;
  Object.keys(stats.watchTypes).forEach((type: string) => {
    const count = stats.watchTypes[type];
    report += `  ${type}: ${count}\n`;
  });

  return report;
}
