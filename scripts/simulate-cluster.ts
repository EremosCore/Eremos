#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { mockDataGenerator } from '../utils/mockDataGenerator';
import { Agent } from '../types/agent';

interface ClusterSimulationConfig {
  agentCount: number;
  eventCount: number;
  duration: number; // in seconds
  scenario?: 'launch_detection' | 'mint_surge' | 'liquidity_drain' | 'governance_attack';
  verbose: boolean;
}

interface AgentInstance {
  agent: Agent;
  filePath: string;
  eventCount: number;
  errorCount: number;
  lastActivity: string;
}

class AgentClusterSimulator {
  private config: ClusterSimulationConfig;
  private agentInstances: AgentInstance[] = [];
  private isRunning = false;

  constructor(config: ClusterSimulationConfig) {
    this.config = config;
  }

  async loadAgents(): Promise<void> {
    const agentsDir = path.join(process.cwd(), 'agents');

    if (!fs.existsSync(agentsDir)) {
      throw new Error('Agents directory not found');
    }

    const agentFiles = fs
      .readdirSync(agentsDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'));

    if (agentFiles.length === 0) {
      throw new Error('No agent files found');
    }

    // Load agents up to the configured count
    const filesToLoad = agentFiles.slice(0, this.config.agentCount);

    for (const file of filesToLoad) {
      try {
        const agentPath = path.join(agentsDir, file);
        const module = require(path.resolve(agentPath));

        const agent = Object.values(module).find(
          (exp: any) => exp && typeof exp === 'object' && exp.id && exp.name && exp.observe
        ) as Agent;

        if (agent) {
          this.agentInstances.push({
            agent,
            filePath: file,
            eventCount: 0,
            errorCount: 0,
            lastActivity: 'Never',
          });
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load agent from ${file}:`, error);
      }
    }

    if (this.agentInstances.length === 0) {
      throw new Error('No valid agents could be loaded');
    }

    console.log(`✅ Loaded ${this.agentInstances.length} agent(s) for cluster simulation`);
  }

  async startSimulation(): Promise<void> {
    console.log('🚀 Starting agent cluster simulation...\n');
    console.log(`🤖 Agents: ${this.agentInstances.length}`);
    console.log(`📊 Events per cycle: ${this.config.eventCount}`);
    console.log(`⏱️  Duration: ${this.config.duration}s`);
    console.log(`🎯 Scenario: ${this.config.scenario || 'mixed'}\n`);

    this.printAgentStatus();

    this.isRunning = true;
    const startTime = Date.now();
    let cycleCount = 0;

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down cluster simulation...');
      this.isRunning = false;
    });

    while (this.isRunning && (Date.now() - startTime) / 1000 < this.config.duration) {
      cycleCount++;
      console.log(`\n🔄 Cycle ${cycleCount} - ${new Date().toLocaleTimeString()}`);

      await this.runSimulationCycle();

      if (this.config.verbose) {
        this.printAgentStatus();
      }

      // Wait between cycles
      await this.sleep(2000);
    }

    console.log('\n✅ Simulation completed');
    this.printFinalReport();
  }

  private async runSimulationCycle(): Promise<void> {
    // Generate events for this cycle
    let events;
    if (this.config.scenario) {
      events = mockDataGenerator.generateScenario(this.config.scenario);
      // Repeat to reach desired count
      while (events.length < this.config.eventCount) {
        events.push(...mockDataGenerator.generateScenario(this.config.scenario));
      }
      events = events.slice(0, this.config.eventCount);
    } else {
      events = mockDataGenerator.generateMixedEvents(this.config.eventCount);
    }

    // Distribute events to agents
    const promises = this.agentInstances.map(async instance => {
      for (const event of events) {
        try {
          instance.agent.observe(event);
          instance.eventCount++;
          instance.lastActivity = new Date().toLocaleTimeString();
        } catch (error) {
          instance.errorCount++;
          if (this.config.verbose) {
            console.error(`❌ ${instance.agent.name} error:`, error);
          }
        }
      }
    });

    await Promise.all(promises);
  }

  private printAgentStatus(): void {
    console.log('\n📊 Agent Status:');
    console.log('┌─────────────────────┬──────┬────────┬────────┬─────────────────┐');
    console.log('│ Agent               │ Glyph│ Events │ Errors │ Last Activity   │');
    console.log('├─────────────────────┼──────┼────────┼────────┼─────────────────┤');

    this.agentInstances.forEach(instance => {
      const name = instance.agent.name.padEnd(19);
      const glyph = instance.agent.glyph.padEnd(5);
      const events = instance.eventCount.toString().padEnd(6);
      const errors = instance.errorCount.toString().padEnd(6);
      const lastActivity = instance.lastActivity.padEnd(15);

      console.log(`│ ${name} │ ${glyph}│ ${events} │ ${errors} │ ${lastActivity} │`);
    });

    console.log('└─────────────────────┴──────┴────────┴────────┴─────────────────┘');
  }

  private printFinalReport(): void {
    const totalEvents = this.agentInstances.reduce((sum, instance) => sum + instance.eventCount, 0);
    const totalErrors = this.agentInstances.reduce((sum, instance) => sum + instance.errorCount, 0);
    const successRate =
      totalEvents > 0 ? (((totalEvents - totalErrors) / totalEvents) * 100).toFixed(2) : '0';

    console.log('\n📈 Final Report:');
    console.log('='.repeat(50));
    console.log(`Total Events Processed: ${totalEvents}`);
    console.log(`Total Errors: ${totalErrors}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Active Agents: ${this.agentInstances.length}`);

    console.log('\n🏆 Top Performers:');
    const sortedByEvents = [...this.agentInstances].sort((a, b) => b.eventCount - a.eventCount);
    sortedByEvents.slice(0, 3).forEach((instance, index) => {
      const medal = ['🥇', '🥈', '🥉'][index] || '🏅';
      console.log(
        `${medal} ${instance.agent.name}: ${instance.eventCount} events, ${instance.errorCount} errors`
      );
    });

    if (totalErrors > 0) {
      console.log('\n⚠️  Agents with Errors:');
      this.agentInstances
        .filter(instance => instance.errorCount > 0)
        .forEach(instance => {
          console.log(`  • ${instance.agent.name}: ${instance.errorCount} errors`);
        });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  const config: ClusterSimulationConfig = {
    agentCount: 5,
    eventCount: 10,
    duration: 30,
    verbose: false,
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Agent Cluster Simulator

Usage: npm run simulate [options]

Options:
  --agents <number>    Number of agents to run (default: 5)
  --events <number>    Events per simulation cycle (default: 10)
  --duration <seconds> Simulation duration (default: 30)
  --scenario <type>    Scenario type: launch_detection, mint_surge, liquidity_drain, governance_attack
  --verbose            Verbose logging
  --help, -h           Show this help message

Examples:
  npm run simulate
  npm run simulate -- --agents 10 --events 50 --duration 60
  npm run simulate -- --scenario launch_detection --verbose
    `);
    return;
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--agents':
        const agentsArg = args[++i];
        config.agentCount = agentsArg ? parseInt(agentsArg) || 5 : 5;
        break;
      case '--events':
        const eventsArg = args[++i];
        config.eventCount = eventsArg ? parseInt(eventsArg) || 10 : 10;
        break;
      case '--duration':
        const durationArg = args[++i];
        config.duration = durationArg ? parseInt(durationArg) || 30 : 30;
        break;
      case '--scenario':
        config.scenario = args[++i] as any;
        break;
      case '--verbose':
        config.verbose = true;
        break;
    }
  }

  const simulator = new AgentClusterSimulator(config);

  try {
    await simulator.loadAgents();
    await simulator.startSimulation();
  } catch (error) {
    console.error('❌ Cluster simulation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentClusterSimulator };
