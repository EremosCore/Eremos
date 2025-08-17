#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { mockDataGenerator } from '../utils/mockDataGenerator';
import { Agent } from '../types/agent';

interface StressTestConfig {
  agentPath?: string;
  eventCount: number;
  concurrency: number;
  duration: number; // in seconds
  scenario?: 'launch_detection' | 'mint_surge' | 'liquidity_drain' | 'governance_attack';
}

interface StressTestResults {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  averageProcessingTime: number;
  maxProcessingTime: number;
  minProcessingTime: number;
  eventsPerSecond: number;
  errors: string[];
}

class AgentStressTester {
  private config: StressTestConfig;
  private agent: Agent | null = null;
  private results: StressTestResults = {
    totalEvents: 0,
    successfulEvents: 0,
    failedEvents: 0,
    averageProcessingTime: 0,
    maxProcessingTime: 0,
    minProcessingTime: Infinity,
    eventsPerSecond: 0,
    errors: [],
  };

  constructor(config: StressTestConfig) {
    this.config = config;
  }

  async loadAgent(agentPath: string): Promise<void> {
    try {
      const absolutePath = path.resolve(agentPath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Agent file not found: ${agentPath}`);
      }

      delete require.cache[absolutePath];
      const module = require(absolutePath);

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

  async runStressTest(): Promise<StressTestResults> {
    if (!this.agent) {
      throw new Error('No agent loaded');
    }

    console.log('🚀 Starting stress test...');
    console.log(`🤖 Agent: ${this.agent.name}`);
    console.log(`📊 Events: ${this.config.eventCount}`);
    console.log(`⚡ Concurrency: ${this.config.concurrency}`);
    console.log(`⏱️  Duration: ${this.config.duration}s\n`);

    const startTime = Date.now();
    const processingTimes: number[] = [];

    // Generate events
    let events;
    if (this.config.scenario) {
      events = mockDataGenerator.generateScenario(this.config.scenario);
      // Repeat events to reach desired count
      while (events.length < this.config.eventCount) {
        events.push(...mockDataGenerator.generateScenario(this.config.scenario));
      }
      events = events.slice(0, this.config.eventCount);
    } else {
      events = mockDataGenerator.generateMixedEvents(this.config.eventCount);
    }

    // Process events with concurrency control
    const batches = this.createBatches(events, this.config.concurrency);

    for (const batch of batches) {
      const batchPromises = batch.map(event => this.processEvent(event, processingTimes));
      await Promise.all(batchPromises);

      // Check if duration exceeded
      if ((Date.now() - startTime) / 1000 > this.config.duration) {
        console.log('⏰ Duration limit reached, stopping test...');
        break;
      }
    }

    const totalTime = Date.now() - startTime;

    // Calculate results
    this.results.totalEvents = this.results.successfulEvents + this.results.failedEvents;
    this.results.averageProcessingTime =
      processingTimes.length > 0
        ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
        : 0;
    this.results.maxProcessingTime = processingTimes.length > 0 ? Math.max(...processingTimes) : 0;
    this.results.minProcessingTime = processingTimes.length > 0 ? Math.min(...processingTimes) : 0;
    this.results.eventsPerSecond = this.results.totalEvents / (totalTime / 1000);

    return this.results;
  }

  private createBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  private async processEvent(event: any, processingTimes: number[]): Promise<void> {
    const startTime = Date.now();

    try {
      this.agent!.observe(event);
      this.results.successfulEvents++;
    } catch (error) {
      this.results.failedEvents++;
      this.results.errors.push(
        `Event processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    const processingTime = Date.now() - startTime;
    processingTimes.push(processingTime);
  }

  printResults(): void {
    console.log('\n📊 Stress Test Results:');
    console.log('='.repeat(50));
    console.log(`Total Events: ${this.results.totalEvents}`);
    console.log(
      `Successful: ${this.results.successfulEvents} (${((this.results.successfulEvents / this.results.totalEvents) * 100).toFixed(2)}%)`
    );
    console.log(
      `Failed: ${this.results.failedEvents} (${((this.results.failedEvents / this.results.totalEvents) * 100).toFixed(2)}%)`
    );
    console.log(`Events/Second: ${this.results.eventsPerSecond.toFixed(2)}`);
    console.log(`Avg Processing Time: ${this.results.averageProcessingTime.toFixed(2)}ms`);
    console.log(`Max Processing Time: ${this.results.maxProcessingTime.toFixed(2)}ms`);
    console.log(`Min Processing Time: ${this.results.minProcessingTime.toFixed(2)}ms`);

    if (this.results.errors.length > 0) {
      console.log(`\n❌ Errors (${this.results.errors.length}):`);
      this.results.errors.slice(0, 10).forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
      if (this.results.errors.length > 10) {
        console.log(`  ... and ${this.results.errors.length - 10} more errors`);
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  const config: StressTestConfig = {
    eventCount: 1000,
    concurrency: 10,
    duration: 60,
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 Agent Stress Tester

Usage: npm run stress-test [options]

Options:
  --agent <path>       Path to agent file
  --events <number>    Number of events to generate (default: 1000)
  --concurrency <num>  Concurrent event processing (default: 10)
  --duration <seconds> Maximum test duration (default: 60)
  --scenario <type>    Scenario type: launch_detection, mint_surge, liquidity_drain, governance_attack
  --help, -h           Show this help message

Examples:
  npm run stress-test
  npm run stress-test -- --agent agents/myagent.ts --events 5000
  npm run stress-test -- --scenario launch_detection --concurrency 20
    `);
    return;
  }

  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--agent':
        const agentArg = args[++i];
        if (agentArg) config.agentPath = agentArg;
        break;
      case '--events':
        const eventsArg = args[++i];
        config.eventCount = eventsArg ? parseInt(eventsArg) || 1000 : 1000;
        break;
      case '--concurrency':
        const concurrencyArg = args[++i];
        config.concurrency = concurrencyArg ? parseInt(concurrencyArg) || 10 : 10;
        break;
      case '--duration':
        const durationArg = args[++i];
        config.duration = durationArg ? parseInt(durationArg) || 60 : 60;
        break;
      case '--scenario':
        config.scenario = args[++i] as any;
        break;
    }
  }

  const tester = new AgentStressTester(config);

  try {
    // Load agent
    if (config.agentPath) {
      await tester.loadAgent(config.agentPath);
    } else {
      // Load first available agent
      const agentsDir = path.join(process.cwd(), 'agents');
      const agentFiles = fs
        .readdirSync(agentsDir)
        .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'));

      if (agentFiles.length === 0) {
        throw new Error('No agent files found');
      }

      const firstAgent = agentFiles[0];
      if (firstAgent) {
        await tester.loadAgent(path.join(agentsDir, firstAgent));
      }
    }

    // Run stress test
    await tester.runStressTest();
    tester.printResults();
  } catch (error) {
    console.error('❌ Stress test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentStressTester };
