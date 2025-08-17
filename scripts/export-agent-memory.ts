#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Agent } from '../types/agent';

interface MemoryExport {
  agentId: string;
  agentName: string;
  timestamp: string;
  memory: string[];
}

class AgentMemoryExporter {
  private agents: Agent[] = [];

  async loadAllAgents(): Promise<void> {
    const agentsDir = path.join(process.cwd(), 'agents');

    if (!fs.existsSync(agentsDir)) {
      throw new Error('Agents directory not found');
    }

    const agentFiles = fs
      .readdirSync(agentsDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'));

    for (const file of agentFiles) {
      try {
        const agentPath = path.join(agentsDir, file);
        const module = require(path.resolve(agentPath));

        // Find the agent export
        const agent = Object.values(module).find(
          (exp: any) => exp && typeof exp === 'object' && exp.id && exp.name && exp.observe
        ) as Agent;

        if (agent) {
          this.agents.push(agent);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load agent from ${file}:`, error);
      }
    }
  }

  exportMemory(agentId?: string): MemoryExport[] {
    const exports: MemoryExport[] = [];
    const timestamp = new Date().toISOString();

    const agentsToExport = agentId
      ? this.agents.filter(agent => agent.id === agentId)
      : this.agents;

    for (const agent of agentsToExport) {
      try {
        const memory = agent.getMemory ? agent.getMemory() : [];
        exports.push({
          agentId: agent.id,
          agentName: agent.name,
          timestamp,
          memory,
        });
      } catch (error) {
        console.warn(`⚠️  Failed to export memory for ${agent.name}:`, error);
      }
    }

    return exports;
  }

  async exportToFile(filename: string, agentId?: string): Promise<void> {
    await this.loadAllAgents();
    const exports = this.exportMemory(agentId);

    const outputPath = path.join(process.cwd(), filename);
    fs.writeFileSync(outputPath, JSON.stringify(exports, null, 2));

    console.log(`✅ Memory exported to ${filename}`);
    console.log(`📊 Exported ${exports.length} agent(s)`);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const exporter = new AgentMemoryExporter();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🧠 Agent Memory Exporter

Usage: npm run export:memory [options]

Options:
  --agent <id>     Export memory for specific agent ID
  --output <file>  Output filename (default: agent-memory.json)
  --help, -h       Show this help message

Examples:
  npm run export:memory
  npm run export:memory -- --agent agent-launch --output launch-memory.json
    `);
    return;
  }

  let agentId: string | undefined;
  let outputFile = 'agent-memory.json';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--agent':
        agentId = args[++i];
        break;
      case '--output':
        outputFile = args[++i] || 'agent-memory.json';
        break;
    }
  }

  try {
    await exporter.exportToFile(outputFile, agentId);
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentMemoryExporter };
