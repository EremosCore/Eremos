#!/usr/bin/env ts-node

/**
 * Enhanced Development Agent Script
 *
 * This script provides a comprehensive development environment for testing
 * and debugging agents in the Eremos framework.
 */

import { Agent } from '../types/agent';
import { generateSignalHash } from '../utils/signal';
import { logSignal } from '../utils/logger';

// Import all available agents
import { Theron } from '../agents/theron';
import { Observer } from '../agents/observer';
import { Harvester } from '../agents/harvester';
import { LaunchTracker } from '../agents/launchtracker';

interface DevConfig {
  agent: string;
  duration: number;
  eventInterval: number;
  verbose: boolean;
  memorySnapshot: boolean;
}

const AVAILABLE_AGENTS: Record<string, Agent> = {
  theron: Theron,
  observer: Observer,
  harvester: Harvester,
  launchtracker: LaunchTracker,
};

function parseArguments(): DevConfig {
  const args = process.argv.slice(2);
  const config: DevConfig = {
    agent: 'observer',
    duration: 30000, // 30 seconds
    eventInterval: 1000, // 1 second
    verbose: false,
    memorySnapshot: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--agent':
      case '-a':
        if (nextArg && !nextArg.startsWith('-')) {
          config.agent = nextArg;
          i++;
        }
        break;
      case '--duration':
      case '-d':
        if (nextArg && !nextArg.startsWith('-')) {
          config.duration = parseInt(nextArg) * 1000;
          i++;
        }
        break;
      case '--interval':
      case '-i':
        if (nextArg && !nextArg.startsWith('-')) {
          config.eventInterval = parseInt(nextArg);
          i++;
        }
        break;
      case '--verbose':
      case '-v':
        config.verbose = true;
        break;
      case '--memory':
      case '-m':
        config.memorySnapshot = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

function printHelp(): void {
  console.log(`
🔧 Eremos Agent Development Tool

Usage: npm run dev:agent [options]

Options:
  -a, --agent <name>     Agent to test (default: observer)
  -d, --duration <sec>   Test duration in seconds (default: 30)
  -i, --interval <ms>    Event interval in milliseconds (default: 1000)
  -v, --verbose          Enable verbose logging
  -m, --memory          Show memory snapshots
  -h, --help            Show this help message

Available Agents:
  ${Object.keys(AVAILABLE_AGENTS).join(', ')}

Examples:
  npm run dev:agent -- --agent=theron --duration=60
  npm run dev:agent -- --agent=observer --verbose --memory
  npm run dev:agent -- --agent=harvester --interval=500
`);
}

function generateMockEvent(agent: Agent): any {
  const eventTypes = {
    wallet_activity: {
      type: 'wallet_activity',
      wallet: `wallet_${Math.random().toString(36).substr(2, 8)}`,
      amount: Math.random() * 1000,
      timestamp: new Date().toISOString(),
      source: 'mock',
    },
    anomaly_detection: {
      type: 'anomaly_detection',
      pattern: ['suspicious', 'normal', 'unusual'][
        Math.floor(Math.random() * 3)
      ],
      confidence: Math.random(),
      timestamp: new Date().toISOString(),
      source: 'mock',
    },
    mint_activity: {
      type: 'mint_activity',
      token: `token_${Math.random().toString(36).substr(2, 8)}`,
      supply: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      source: 'mock',
    },
    contract_deployments: {
      type: 'contract_deployments',
      contract: `contract_${Math.random().toString(36).substr(2, 8)}`,
      deployer: `deployer_${Math.random().toString(36).substr(2, 8)}`,
      timestamp: new Date().toISOString(),
      source: 'mock',
    },
  };

  return (
    eventTypes[agent.watchType as keyof typeof eventTypes] ||
    eventTypes.wallet_activity
  );
}

function displayAgentInfo(agent: Agent): void {
  console.log(`
🤖 Agent Information
───────────────────
Name: ${agent.name}
ID: ${agent.id}
Role: ${agent.role}
Glyph: ${agent.glyph}
Watch Type: ${agent.watchType}
Trigger Threshold: ${agent.triggerThreshold}
Description: ${agent.description}
Origin: ${agent.originTimestamp}
Last Signal: ${agent.lastSignal || 'None'}
`);
}

function displayMemorySnapshot(agent: Agent): void {
  if (agent.getMemory) {
    const memory = agent.getMemory();
    console.log(`
🧠 Memory Snapshot
─────────────────
${memory.map((entry, index) => `${index + 1}. ${entry}`).join('\n')}
`);
  }
}

function displayStats(stats: {
  eventsProcessed: number;
  signalsEmitted: number;
  startTime: number;
  errors: number;
}): void {
  const duration = Date.now() - stats.startTime;
  const eventsPerSecond = (stats.eventsProcessed / (duration / 1000)).toFixed(
    2
  );
  const signalsPerSecond = (stats.signalsEmitted / (duration / 1000)).toFixed(
    2
  );

  console.log(`
📊 Performance Statistics
────────────────────────
Duration: ${(duration / 1000).toFixed(1)}s
Events Processed: ${stats.eventsProcessed}
Signals Emitted: ${stats.signalsEmitted}
Events/Second: ${eventsPerSecond}
Signals/Second: ${signalsPerSecond}
Errors: ${stats.errors}
`);
}

async function runDevAgent(): Promise<void> {
  try {
    const config = parseArguments();

    // Validate agent exists
    if (!AVAILABLE_AGENTS[config.agent]) {
      console.error(`❌ Error: Agent '${config.agent}' not found.`);
      console.log(
        `Available agents: ${Object.keys(AVAILABLE_AGENTS).join(', ')}`
      );
      process.exit(1);
    }

    const agent = AVAILABLE_AGENTS[config.agent];

    console.log(`
🚀 Starting Eremos Agent Development Environment
═══════════════════════════════════════════════════
`);

    displayAgentInfo(agent);

    // Statistics tracking
    const stats = {
      eventsProcessed: 0,
      signalsEmitted: 0,
      startTime: Date.now(),
      errors: 0,
    };

    // Event generation loop
    const eventInterval = setInterval(() => {
      try {
        const mockEvent = generateMockEvent(agent);

        if (config.verbose) {
          console.log(
            `📡 Processing event: ${JSON.stringify(mockEvent, null, 2)}`
          );
        }

        // Store original lastSignal for comparison
        const originalLastSignal = agent.lastSignal;

        // Process event
        agent.observe(mockEvent);
        stats.eventsProcessed++;

        // Check if signal was emitted
        if (agent.lastSignal !== originalLastSignal) {
          stats.signalsEmitted++;
          console.log(`✅ Signal emitted at ${agent.lastSignal}`);
        }

        // Display memory snapshot if requested
        if (config.memorySnapshot && agent.getMemory) {
          displayMemorySnapshot(agent);
        }
      } catch (error) {
        stats.errors++;
        console.error(`❌ Error processing event:`, error);
      }
    }, config.eventInterval);

    // Stop after duration
    setTimeout(() => {
      clearInterval(eventInterval);

      console.log(`
🛑 Development session completed
═══════════════════════════════════
`);

      displayStats(stats);

      if (config.memorySnapshot && agent.getMemory) {
        displayMemorySnapshot(agent);
      }

      process.exit(0);
    }, config.duration);

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      clearInterval(eventInterval);
      displayStats(stats);
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the development environment
if (require.main === module) {
  runDevAgent();
}
