#!/usr/bin/env node

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

interface AgentTemplate {
  id: string;
  name: string;
  category: 'defi' | 'nft' | 'governance' | 'security' | 'custom';
  description: string;
  watchType: string;
  defaultThreshold: number;
  observeLogic: string;
  memoryPattern?: string;
}

const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'defi-liquidity-monitor',
    name: 'DeFi Liquidity Monitor',
    category: 'defi',
    description: 'Monitors liquidity pool changes and large swaps',
    watchType: 'liquidity_activity',
    defaultThreshold: 5,
    observeLogic: `if (event?.type === "liquidity_activity" && event.amount > 100000) {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "{{agentName}}",
        type: "large_liquidity_change",
        glyph: "{{glyph}}",
        hash,
        timestamp: new Date().toISOString(),
        poolAddress: event.poolAddress,
        amount: event.amount
      });
    }`,
    memoryPattern: `return [
      "pool_change_{{timestamp}}",
      "liquidity_event_{{hash}}",
      "swap_volume_{{amount}}"
    ];`,
  },
  {
    id: 'nft-mint-tracker',
    name: 'NFT Mint Tracker',
    category: 'nft',
    description: 'Tracks NFT minting activity and collection launches',
    watchType: 'mint_activity',
    defaultThreshold: 3,
    observeLogic: `if (event?.type === "mint_activity" && event.mintCount > 10) {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "{{agentName}}",
        type: "mint_surge",
        glyph: "{{glyph}}",
        hash,
        timestamp: new Date().toISOString(),
        collection: event.collection,
        mintCount: event.mintCount
      });
    }`,
    memoryPattern: `return [
      "mint_event_{{collection}}",
      "surge_detected_{{timestamp}}",
      "collection_{{hash}}"
    ];`,
  },
  {
    id: 'governance-proposal-monitor',
    name: 'Governance Proposal Monitor',
    category: 'governance',
    description: 'Monitors DAO proposals and voting activity',
    watchType: 'governance_activity',
    defaultThreshold: 2,
    observeLogic: `if (event?.type === "governance_activity" && event.proposalType === "critical") {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "{{agentName}}",
        type: "critical_proposal",
        glyph: "{{glyph}}",
        hash,
        timestamp: new Date().toISOString(),
        proposalId: event.proposalId,
        dao: event.dao
      });
    }`,
    memoryPattern: `return [
      "proposal_{{proposalId}}",
      "dao_activity_{{dao}}",
      "vote_pattern_{{hash}}"
    ];`,
  },
  {
    id: 'security-anomaly-detector',
    name: 'Security Anomaly Detector',
    category: 'security',
    description: 'Detects suspicious wallet patterns and potential exploits',
    watchType: 'security_event',
    defaultThreshold: 1,
    observeLogic: `if (event?.type === "security_event" && event.riskLevel === "high") {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "{{agentName}}",
        type: "security_alert",
        glyph: "{{glyph}}",
        hash,
        timestamp: new Date().toISOString(),
        riskLevel: event.riskLevel,
        walletAddress: event.walletAddress
      });
    }`,
    memoryPattern: `return [
      "security_event_{{timestamp}}",
      "risk_pattern_{{hash}}",
      "wallet_flag_{{walletAddress}}"
    ];`,
  },
];

const GLYPHS = ['Ω', 'Ψ', 'Δ', 'Γ', 'Λ', 'Π', 'Σ', 'Φ', 'Χ', 'Ξ', '∆', '∇', '∞', '∑', '∏', '∫'];

class AgentGenerator {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  private question(prompt: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(prompt, resolve);
    });
  }

  private displayTemplates(): void {
    console.log('\n🤖 Available Agent Templates:\n');
    AGENT_TEMPLATES.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.category})`);
      console.log(`   ${template.description}\n`);
    });
  }

  private generateAgentId(name: string): string {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `agent-${cleanName}`;
  }

  private selectRandomGlyph(): string {
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
  }

  private generateAgentCode(
    template: AgentTemplate,
    agentName: string,
    agentId: string,
    glyph: string,
    threshold: number,
    customDescription?: string
  ): string {
    const description = customDescription || template.description;
    const observeLogic = template.observeLogic
      .replace(/{{agentName}}/g, agentName)
      .replace(/{{glyph}}/g, glyph);

    const memoryLogic = template.memoryPattern
      ? template.memoryPattern
          .replace(/{{timestamp}}/g, 'timestamp')
          .replace(/{{hash}}/g, 'hash')
          .replace(/{{amount}}/g, 'amount')
      : `return ["${template.category}_event_001", "${agentName.toLowerCase()}_signal"];`;

    return `import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const ${agentName}: Agent = {
  id: "${agentId}",
  name: "${agentName}",
  role: "${template.category}_monitor",
  watchType: "${template.watchType}",
  glyph: "${glyph}",
  triggerThreshold: ${threshold},
  lastSignal: null,
  originTimestamp: "${new Date().toISOString()}",

  description: "${description}",

  observe: (event) => {
    ${observeLogic}
  },

  getMemory: () => {
    ${memoryLogic}
  },
};
`;
  }

  private validateAgentName(name: string): boolean {
    return /^[A-Za-z][A-Za-z0-9]*$/.test(name) && name.length >= 3 && name.length <= 50;
  }

  private validateThreshold(threshold: string): boolean {
    const num = parseInt(threshold);
    return !isNaN(num) && num > 0 && num <= 1000;
  }

  async generate(): Promise<void> {
    console.log('🚀 Welcome to the Eremos Agent Generator!\n');

    try {
      // Display available templates
      this.displayTemplates();

      // Template selection
      const templateChoice = await this.question(
        'Select a template (1-4) or press Enter for custom: '
      );
      let selectedTemplate: AgentTemplate | null = null;

      if (templateChoice && parseInt(templateChoice) >= 1 && parseInt(templateChoice) <= 4) {
        selectedTemplate = AGENT_TEMPLATES[parseInt(templateChoice) - 1] || null;
        if (selectedTemplate) {
          console.log(`\n✅ Selected: ${selectedTemplate.name}\n`);
        }
      } else {
        console.log('\n🛠️  Creating custom agent...\n');
      }

      // Agent name
      let agentName = '';
      while (!agentName) {
        const name = await this.question('Enter agent name (PascalCase, e.g., MyAgent): ');
        if (this.validateAgentName(name)) {
          agentName = name;
        } else {
          console.log(
            '❌ Invalid name. Use PascalCase, 3-50 characters, letters and numbers only.'
          );
        }
      }

      // Agent description
      const defaultDesc =
        selectedTemplate?.description || 'Custom agent for monitoring blockchain activity';
      const description =
        (await this.question('Enter description (or press Enter for default): ')) || defaultDesc;

      // Watch type
      const defaultWatchType = selectedTemplate?.watchType || 'wallet_activity';
      const watchType =
        (await this.question(`Enter watch type (default: ${defaultWatchType}): `)) ||
        defaultWatchType;

      // Trigger threshold
      let threshold = selectedTemplate?.defaultThreshold || 3;
      const thresholdInput = await this.question(
        `Enter trigger threshold (default: ${threshold}): `
      );
      if (thresholdInput && this.validateThreshold(thresholdInput)) {
        threshold = parseInt(thresholdInput);
      }

      // Glyph selection
      const randomGlyph = this.selectRandomGlyph();
      const glyph = (await this.question(`Enter glyph (default: ${randomGlyph}): `)) || randomGlyph;

      // Generate agent
      const agentId = this.generateAgentId(agentName);

      let agentCode: string;
      if (selectedTemplate) {
        agentCode = this.generateAgentCode(
          selectedTemplate,
          agentName,
          agentId,
          glyph,
          threshold,
          description
        );
      } else {
        // Custom agent template
        agentCode = `import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const ${agentName}: Agent = {
  id: "${agentId}",
  name: "${agentName}",
  role: "custom_monitor",
  watchType: "${watchType}",
  glyph: "${glyph}",
  triggerThreshold: ${threshold},
  lastSignal: null,
  originTimestamp: "${new Date().toISOString()}",

  description: "${description}",

  observe: (event) => {
    // TODO: Implement your custom observation logic here
    if (event?.type === "${watchType}") {
      const hash = generateSignalHash(event);
      logSignal({
        agent: "${agentName}",
        type: "custom_signal",
        glyph: "${glyph}",
        hash,
        timestamp: new Date().toISOString(),
      });
    }
  },

  getMemory: () => {
    return ["custom_signal_001", "${agentName.toLowerCase()}_event"];
  },
};
`;
      }

      // Save agent file
      const filename = `${agentName.toLowerCase()}.ts`;
      const filepath = path.join('agents', filename);

      fs.writeFileSync(filepath, agentCode);

      console.log('\n✅ Agent generated successfully!');
      console.log(`📁 File: ${filepath}`);
      console.log(`🤖 Agent ID: ${agentId}`);
      console.log(`🔮 Glyph: ${glyph}`);
      console.log(`⚡ Threshold: ${threshold}`);

      // Generate test file
      const testCode = this.generateTestCode(agentName, agentId, watchType);
      const testFilepath = path.join('tests', `${agentName.toLowerCase()}.test.ts`);
      fs.writeFileSync(testFilepath, testCode);
      console.log(`🧪 Test file: ${testFilepath}`);

      console.log('\n🎉 Your agent is ready! Remember to:');
      console.log('1. Review and customize the observe() logic');
      console.log('2. Update the getMemory() method if needed');
      console.log('3. Run the tests to validate your agent');
      console.log('4. Add your agent to the main export if needed');
    } catch (error) {
      console.error('❌ Error generating agent:', error);
    } finally {
      this.rl.close();
    }
  }

  private generateTestCode(agentName: string, agentId: string, watchType: string): string {
    return `import { ${agentName} } from "../agents/${agentName.toLowerCase()}";

describe("${agentName} Agent", () => {
  test("should have correct configuration", () => {
    expect(${agentName}.id).toBe("${agentId}");
    expect(${agentName}.name).toBe("${agentName}");
    expect(${agentName}.watchType).toBe("${watchType}");
    expect(${agentName}.observe).toBeDefined();
    expect(${agentName}.getMemory).toBeDefined();
  });

  test("should handle events correctly", () => {
    const mockEvent = {
      type: "${watchType}",
      timestamp: new Date().toISOString(),
      data: { test: true }
    };

    // Test that observe doesn't throw
    expect(() => {
      ${agentName}.observe(mockEvent);
    }).not.toThrow();
  });

  test("should return memory array", () => {
    const memory = ${agentName}.getMemory?.();
    expect(Array.isArray(memory)).toBe(true);
    expect(memory?.length).toBeGreaterThan(0);
  });
});
`;
  }
}

// Run the generator if this file is executed directly
if (require.main === module) {
  const generator = new AgentGenerator();
  generator.generate().catch(console.error);
}

export { AgentGenerator, AGENT_TEMPLATES };
