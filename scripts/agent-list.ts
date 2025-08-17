#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Agent } from '../types/agent';

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  watchType: string;
  glyph: string;
  triggerThreshold: number;
  description: string;
  filePath: string;
}

class AgentLister {
  async listAgents(): Promise<AgentInfo[]> {
    const agentsDir = path.join(process.cwd(), 'agents');
    const agentInfos: AgentInfo[] = [];

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
          agentInfos.push({
            id: agent.id,
            name: agent.name,
            role: agent.role,
            watchType: agent.watchType,
            glyph: agent.glyph,
            triggerThreshold: agent.triggerThreshold,
            description: agent.description,
            filePath: file,
          });
        }
      } catch (error) {
        console.warn(`⚠️  Failed to load agent from ${file}:`, error);
      }
    }

    return agentInfos.sort((a, b) => a.name.localeCompare(b.name));
  }

  printAgentList(agents: AgentInfo[], format: 'table' | 'json' | 'detailed' = 'table'): void {
    if (agents.length === 0) {
      console.log('No agents found.');
      return;
    }

    switch (format) {
      case 'json':
        console.log(JSON.stringify(agents, null, 2));
        break;

      case 'detailed':
        agents.forEach((agent, index) => {
          console.log(`\n${index + 1}. ${agent.name} (${agent.glyph})`);
          console.log(`   ID: ${agent.id}`);
          console.log(`   Role: ${agent.role}`);
          console.log(`   Watch Type: ${agent.watchType}`);
          console.log(`   Trigger Threshold: ${agent.triggerThreshold}`);
          console.log(`   File: ${agent.filePath}`);
          console.log(`   Description: ${agent.description}`);
        });
        break;

      case 'table':
      default:
        console.log('\n🤖 Available Agents:\n');
        console.log(
          '┌─────────────────────┬──────┬─────────────────────┬─────────────────────┬───────────┐'
        );
        console.log(
          '│ Name                │ Glyph│ Role                │ Watch Type          │ Threshold │'
        );
        console.log(
          '├─────────────────────┼──────┼─────────────────────┼─────────────────────┼───────────┤'
        );

        agents.forEach(agent => {
          const name = agent.name.padEnd(19);
          const glyph = agent.glyph.padEnd(5);
          const role = agent.role.padEnd(19);
          const watchType = agent.watchType.padEnd(19);
          const threshold = agent.triggerThreshold.toString().padEnd(9);

          console.log(`│ ${name} │ ${glyph}│ ${role} │ ${watchType} │ ${threshold} │`);
        });

        console.log(
          '└─────────────────────┴──────┴─────────────────────┴─────────────────────┴───────────┘'
        );
        console.log(`\nTotal: ${agents.length} agent(s)`);
        break;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const lister = new AgentLister();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Agent Lister

Usage: npm run agent:list [options]

Options:
  --format <type>  Output format: table, json, detailed (default: table)
  --help, -h       Show this help message

Examples:
  npm run agent:list
  npm run agent:list -- --format json
  npm run agent:list -- --format detailed
    `);
    return;
  }

  let format: 'table' | 'json' | 'detailed' = 'table';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--format':
        const formatArg = args[++i];
        if (formatArg && ['table', 'json', 'detailed'].includes(formatArg)) {
          format = formatArg as 'table' | 'json' | 'detailed';
        }
        break;
    }
  }

  try {
    const agents = await lister.listAgents();
    lister.printAgentList(agents, format);
  } catch (error) {
    console.error('❌ Failed to list agents:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentLister };
