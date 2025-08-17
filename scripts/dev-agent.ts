#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { mockDataGenerator } from '../utils/mockDataGenerator';
import { Agent } from '../types/agent';

interface DevServerConfig {
  agentPath?: string;
  eventInterval: number;
  eventCount: number;
  scenario?: 'launch_detection' | 'mint_surge' | 'liquidity_drain' | 'governance_attack';
  verbose: boolean;
}

class AgentDevServer {
  private config: DevServerConfig;
  private agent: Agent | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private eventCounter = 0;

  constructor(config: DevServerConfig) {
    this.config = config;
  }

  async start(): Promise<void> {
    console.log('🚀 Starting Eremos Agent Development Server...\n');

    try {
      // Load agent if specified
      if (this.config.agentPath) {
        await this.loadAgent(this.config.agentPath);
      } else {
        await this.selectAgent();
      }

      if (!this.agent) {
        console.error('❌ No agent loaded. Exiting...');
        return;
      }

      console.log(`🤖 Loaded agent: ${this.agent.name} (${this.agent.id})`);
      console.log(`📊 Watch Type: ${this.agent.watchType}`);
      console.log(`⚡ Trigger Threshold: ${this.agent.triggerThreshold}`);
      console.log(`🔮 Glyph: ${this.agent.glyph}\n`);

      // Start event simulation
      this.startEventSimulation();

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down development server...');
        this.stop();
        process.exit(0);
      });

      console.log('🎯 Development server running. Press Ctrl+C to stop.\n');
      console.log('📈 Event simulation started...\n');
    } catch (error) {
      console.error('❌ Failed to start development server:', error);
    }
  }

  private async loadAgent(agentPath: string): Promise<void> {
    try {
      const absolutePath = path.resolve(agentPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Agent file not found: ${agentPath}`);
      }

      // Clear require cache for hot reloading
      delete require.cache[absolutePath];
      const module = require(absolutePath);

      // Find the agent export
      this.agent = Object.values(module).find(
        (exp: any) => exp && typeof exp === 'object' && exp.id && exp.name && exp.observe
      ) as Agent;

      if (!this.agent) {
        throw new Error('No valid agent found in the specified file');
      }
    } catch (error) {
      console.error(`❌ Failed to load agent from ${agentPath}:`, error);
      throw error;
    }
  }

  private async selectAgent(): Promise<void> {
    const agentsDir = path.join(process.cwd(), 'agents');

    if (!fs.existsSync(agentsDir)) {
      throw new Error('Agents directory not found');
    }

    const agentFiles = fs
      .readdirSync(agentsDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'));

    if (agentFiles.length === 0) {
      throw new Error('No agent files found in agents directory');
    }

    console.log('📁 Available agents:');
    agentFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });

    // For development, just load the first agent
    const selectedFile = agentFiles[0];
    if (!selectedFile) {
      throw new Error('No agent files found');
    }
    const agentPath = path.join(agentsDir, selectedFile);
    await this.loadAgent(agentPath);
  }

  private startEventSimulation(): void {
    this.intervalId = setInterval(() => {
      this.simulateEvent();
    }, this.config.eventInterval);
  }

  private simulateEvent(): void {
    if (!this.agent) return;

    try {
      let events;

      if (this.config.scenario) {
        events = mockDataGenerator.generateScenario(this.config.scenario);
      } else {
        // Generate events based on agent's watch type
        switch (this.agent.watchType) {
          case 'wallet_activity':
            events = mockDataGenerator.generateWalletActivity(1);
            break;
          case 'mint_activity':
            events = mockDataGenerator.generateMintActivity(1);
            break;
          case 'liquidity_activity':
            events = mockDataGenerator.generateLiquidityActivity(1);
            break;
          case 'governance_activity':
            events = mockDataGenerator.generateGovernanceActivity(1);
            break;
          case 'security_event':
            events = mockDataGenerator.generateSecurityEvents(1);
            break;
          case 'anomaly_detection':
            events = mockDataGenerator.generateAnomalyEvents(1);
            break;
          default:
            events = mockDataGenerator.generateMixedEvents(1);
        }
      }

      // Process each event
      events.forEach(event => {
        this.eventCounter++;

        if (this.config.verbose) {
          console.log(`📨 Event ${this.eventCounter}:`, JSON.stringify(event, null, 2));
        } else {
          console.log(`📨 Event ${this.eventCounter}: ${event.type} at ${event.timestamp}`);
        }

        // Call agent's observe method
        try {
          this.agent!.observe(event);
        } catch (error) {
          console.error(`❌ Agent observe error:`, error);
        }
      });

      // Stop after configured event count
      if (this.eventCounter >= this.config.eventCount) {
        console.log(`\n✅ Completed ${this.config.eventCount} events. Stopping simulation.`);
        this.stop();
      }
    } catch (error) {
      console.error('❌ Error simulating event:', error);
    }
  }

  private stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  const config: DevServerConfig = {
    eventInterval: 2000, // 2 seconds
    eventCount: 50,
    verbose: false,
  };

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--agent':
      case '-a':
        const agentArg = args[++i];
        if (agentArg) config.agentPath = agentArg;
        break;
      case '--interval':
      case '-i':
        const intervalArg = args[++i];
        config.eventInterval = intervalArg ? parseInt(intervalArg) || 2000 : 2000;
        break;
      case '--count':
      case '-c':
        const countArg = args[++i];
        config.eventCount = countArg ? parseInt(countArg) || 50 : 50;
        break;
      case '--scenario':
      case '-s':
        config.scenario = args[++i] as any;
        break;
      case '--verbose':
      case '-v':
        config.verbose = true;
        break;
      case '--help':
      case '-h':
        console.log(`
🚀 Eremos Agent Development Server

Usage: npm run dev [options]

Options:
  -a, --agent <path>     Path to agent file
  -i, --interval <ms>    Event interval in milliseconds (default: 2000)
  -c, --count <number>   Number of events to generate (default: 50)
  -s, --scenario <type>  Scenario type: launch_detection, mint_surge, liquidity_drain, governance_attack
  -v, --verbose          Verbose event logging
  -h, --help             Show this help message

Examples:
  npm run dev
  npm run dev -- --agent agents/myagent.ts --verbose
  npm run dev -- --scenario launch_detection --count 20
        `);
        return;
    }
  }

  const server = new AgentDevServer(config);
  await server.start();
}

if (require.main === module) {
  main().catch(console.error);
}
