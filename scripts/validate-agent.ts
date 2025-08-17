#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { Agent } from '../types/agent';

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number;
}

interface ValidationError {
  code: string;
  message: string;
  severity: 'error' | 'warning';
  line?: number;
  suggestion?: string;
}

interface ValidationWarning {
  code: string;
  message: string;
  suggestion: string;
}

interface MockEvent {
  type: string;
  timestamp: string;
  data: any;
}

class AgentValidator {
  private readonly REQUIRED_FIELDS = [
    'id',
    'name',
    'role',
    'glyph',
    'watchType',
    'triggerThreshold',
    'lastSignal',
    'originTimestamp',
    'description',
    'observe',
  ];

  private readonly VALID_ROLES = [
    'memory_vault',
    'surveillance',
    'indexing',
    'launch_monitor',
    'defi_monitor',
    'nft_monitor',
    'governance_monitor',
    'security_monitor',
    'custom_monitor',
    'template',
  ];

  private readonly VALID_WATCH_TYPES = [
    'wallet_activity',
    'anomaly_detection',
    'mint_activity',
    'liquidity_activity',
    'governance_activity',
    'security_event',
    'contract_deployment',
    'token_transfer',
  ];

  async validateAgent(agentPath: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 100,
    };

    try {
      // Check if file exists
      if (!fs.existsSync(agentPath)) {
        result.errors.push({
          code: 'FILE_NOT_FOUND',
          message: `Agent file not found: ${agentPath}`,
          severity: 'error',
          suggestion: 'Ensure the file path is correct and the file exists',
        });
        result.isValid = false;
        result.score = 0;
        return result;
      }

      // Read and parse the agent file
      const fileContent = fs.readFileSync(agentPath, 'utf-8');
      const agent = await this.loadAgent(agentPath);

      // Validate file structure
      this.validateFileStructure(fileContent, result);

      // Validate agent object
      if (agent) {
        this.validateAgentObject(agent, result);
        this.validateAgentBehavior(agent, result);
        await this.testAgentFunctionality(agent, result);
      } else {
        result.errors.push({
          code: 'AGENT_LOAD_FAILED',
          message: 'Failed to load agent from file',
          severity: 'error',
          suggestion: 'Check for syntax errors and ensure the agent is properly exported',
        });
        result.isValid = false;
      }

      // Calculate final score
      result.score = this.calculateScore(result);
      result.isValid = result.errors.filter(e => e.severity === 'error').length === 0;
    } catch (error) {
      result.errors.push({
        code: 'VALIDATION_ERROR',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
      result.isValid = false;
      result.score = 0;
    }

    return result;
  }

  private async loadAgent(agentPath: string): Promise<Agent | null> {
    try {
      // Dynamic import for TypeScript files
      const absolutePath = path.resolve(agentPath);
      delete require.cache[absolutePath];
      const module = require(absolutePath);

      // Find the agent export
      const agentExport = Object.values(module).find(
        (exp: any) => exp && typeof exp === 'object' && exp.id && exp.name && exp.observe
      ) as Agent;

      return agentExport || null;
    } catch (error) {
      console.error('Failed to load agent:', error);
      return null;
    }
  }

  private validateFileStructure(content: string, result: ValidationResult): void {
    // Check for required imports
    const requiredImports = [
      'import.*Agent.*from.*types/agent',
      'import.*generateSignalHash.*from.*utils/signal',
      'import.*logSignal.*from.*utils/logger',
    ];

    requiredImports.forEach((importPattern, index) => {
      if (!new RegExp(importPattern).test(content)) {
        const importNames = ['Agent type', 'generateSignalHash', 'logSignal'];
        result.warnings.push({
          code: 'MISSING_IMPORT',
          message: `Missing recommended import: ${importNames[index]}`,
          suggestion: 'Add the missing import for better functionality',
        });
      }
    });

    // Check for export
    if (!content.includes('export')) {
      result.errors.push({
        code: 'NO_EXPORT',
        message: 'Agent must be exported',
        severity: 'error',
        suggestion: 'Add "export const YourAgent: Agent = { ... }"',
      });
    }

    // Check for TypeScript syntax
    if (!content.includes(': Agent')) {
      result.warnings.push({
        code: 'MISSING_TYPE_ANNOTATION',
        message: 'Agent should have explicit type annotation',
        suggestion: 'Add ": Agent" type annotation to your agent constant',
      });
    }
  }

  private validateAgentObject(agent: Agent, result: ValidationResult): void {
    // Check required fields
    this.REQUIRED_FIELDS.forEach(field => {
      if (!(field in agent) || agent[field as keyof Agent] === undefined) {
        result.errors.push({
          code: 'MISSING_FIELD',
          message: `Required field missing: ${field}`,
          severity: 'error',
          suggestion: `Add the ${field} field to your agent object`,
        });
      }
    });

    // Validate field types and values
    this.validateAgentFields(agent, result);
  }

  private validateAgentFields(agent: Agent, result: ValidationResult): void {
    // Validate ID format
    if (agent.id && !agent.id.startsWith('agent-')) {
      result.warnings.push({
        code: 'ID_FORMAT',
        message: 'Agent ID should start with "agent-"',
        suggestion: 'Use format: "agent-yourname"',
      });
    }

    // Validate name
    if (agent.name && !/^[A-Z][A-Za-z0-9]*$/.test(agent.name)) {
      result.warnings.push({
        code: 'NAME_FORMAT',
        message: 'Agent name should be PascalCase',
        suggestion: 'Use PascalCase format like "MyAgent"',
      });
    }

    // Validate role
    if (agent.role && !this.VALID_ROLES.includes(agent.role)) {
      result.warnings.push({
        code: 'INVALID_ROLE',
        message: `Unknown role: ${agent.role}`,
        suggestion: `Use one of: ${this.VALID_ROLES.join(', ')}`,
      });
    }

    // Validate watch type
    if (agent.watchType && !this.VALID_WATCH_TYPES.includes(agent.watchType)) {
      result.warnings.push({
        code: 'INVALID_WATCH_TYPE',
        message: `Unknown watch type: ${agent.watchType}`,
        suggestion: `Use one of: ${this.VALID_WATCH_TYPES.join(', ')}`,
      });
    }

    // Validate trigger threshold
    if (agent.triggerThreshold !== undefined) {
      if (typeof agent.triggerThreshold !== 'number') {
        result.errors.push({
          code: 'INVALID_THRESHOLD_TYPE',
          message: 'triggerThreshold must be a number',
          severity: 'error',
          suggestion: 'Set triggerThreshold to a numeric value',
        });
      } else if (agent.triggerThreshold < 0) {
        result.errors.push({
          code: 'NEGATIVE_THRESHOLD',
          message: 'triggerThreshold cannot be negative',
          severity: 'error',
          suggestion: 'Set triggerThreshold to a positive number or Infinity',
        });
      }
    }

    // Validate glyph
    if (agent.glyph && agent.glyph.length !== 1) {
      result.warnings.push({
        code: 'INVALID_GLYPH',
        message: 'Glyph should be a single character',
        suggestion: 'Use a single Unicode character as the glyph',
      });
    }

    // Validate timestamp format
    if (agent.originTimestamp && !this.isValidISODate(agent.originTimestamp)) {
      result.errors.push({
        code: 'INVALID_TIMESTAMP',
        message: 'originTimestamp must be a valid ISO date string',
        severity: 'error',
        suggestion: 'Use new Date().toISOString() format',
      });
    }

    // Validate description
    if (agent.description && agent.description.length < 10) {
      result.warnings.push({
        code: 'SHORT_DESCRIPTION',
        message: 'Description should be more descriptive',
        suggestion: 'Provide a detailed description of what the agent does',
      });
    }
  }

  private validateAgentBehavior(agent: Agent, result: ValidationResult): void {
    // Check if observe function exists and is callable
    if (typeof agent.observe !== 'function') {
      result.errors.push({
        code: 'INVALID_OBSERVE',
        message: 'observe must be a function',
        severity: 'error',
        suggestion: 'Implement observe as a function that takes an event parameter',
      });
    }

    // Check if getMemory exists and is callable (optional)
    if (agent.getMemory && typeof agent.getMemory !== 'function') {
      result.errors.push({
        code: 'INVALID_GET_MEMORY',
        message: 'getMemory must be a function if provided',
        severity: 'error',
        suggestion: 'Implement getMemory as a function that returns an array of strings',
      });
    }
  }

  private async testAgentFunctionality(agent: Agent, result: ValidationResult): Promise<void> {
    try {
      // Test observe function with mock events
      const mockEvents = this.generateMockEvents(agent.watchType);

      for (const event of mockEvents) {
        try {
          agent.observe(event);
        } catch (error) {
          result.errors.push({
            code: 'OBSERVE_RUNTIME_ERROR',
            message: `observe() threw an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            severity: 'error',
            suggestion: 'Add error handling to your observe function',
          });
        }
      }

      // Test getMemory function
      if (agent.getMemory) {
        try {
          const memory = agent.getMemory();
          if (!Array.isArray(memory)) {
            result.errors.push({
              code: 'INVALID_MEMORY_RETURN',
              message: 'getMemory() must return an array',
              severity: 'error',
              suggestion: 'Return an array of strings from getMemory()',
            });
          } else if (memory.length === 0) {
            result.warnings.push({
              code: 'EMPTY_MEMORY',
              message: 'getMemory() returns empty array',
              suggestion: 'Consider returning some default memory entries',
            });
          }
        } catch (error) {
          result.errors.push({
            code: 'MEMORY_RUNTIME_ERROR',
            message: `getMemory() threw an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            severity: 'error',
            suggestion: 'Add error handling to your getMemory function',
          });
        }
      }
    } catch (error) {
      result.errors.push({
        code: 'FUNCTIONALITY_TEST_FAILED',
        message: `Failed to test agent functionality: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    }
  }

  private generateMockEvents(watchType: string): MockEvent[] {
    const baseEvent = {
      timestamp: new Date().toISOString(),
      data: { test: true },
    };

    const eventTypes: Record<string, MockEvent[]> = {
      wallet_activity: [
        { ...baseEvent, type: 'wallet_activity', data: { address: '0x123', amount: 1000 } },
        { ...baseEvent, type: 'wallet_activity', data: { address: '0x456', amount: 500 } },
      ],
      mint_activity: [
        { ...baseEvent, type: 'mint_activity', data: { collection: '0xabc', mintCount: 10 } },
        { ...baseEvent, type: 'mint_activity', data: { collection: '0xdef', mintCount: 5 } },
      ],
      liquidity_activity: [
        { ...baseEvent, type: 'liquidity_activity', data: { poolAddress: '0x789', amount: 50000 } },
      ],
      governance_activity: [
        {
          ...baseEvent,
          type: 'governance_activity',
          data: { proposalId: 'prop-1', dao: 'TestDAO' },
        },
      ],
      security_event: [
        {
          ...baseEvent,
          type: 'security_event',
          data: { riskLevel: 'high', walletAddress: '0x999' },
        },
      ],
    };

    return eventTypes[watchType] || [{ ...baseEvent, type: watchType }];
  }

  private isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString.includes('T');
  }

  private calculateScore(result: ValidationResult): number {
    let score = 100;

    // Deduct points for errors
    result.errors.forEach(error => {
      if (error.severity === 'error') {
        score -= 20;
      }
    });

    // Deduct points for warnings
    result.warnings.forEach(() => {
      score -= 5;
    });

    return Math.max(0, score);
  }

  async validateAllAgents(agentsDir: string = 'agents'): Promise<Record<string, ValidationResult>> {
    const results: Record<string, ValidationResult> = {};

    if (!fs.existsSync(agentsDir)) {
      console.error(`Agents directory not found: ${agentsDir}`);
      return results;
    }

    const files = fs
      .readdirSync(agentsDir)
      .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'))
      .map(file => path.join(agentsDir, file));

    for (const file of files) {
      const agentName = path.basename(file, '.ts');
      results[agentName] = await this.validateAgent(file);
    }

    return results;
  }

  printValidationReport(result: ValidationResult, agentName: string): void {
    console.log(`\n🤖 Validation Report for ${agentName}`);
    console.log('='.repeat(50));

    if (result.isValid) {
      console.log(`✅ Status: VALID (Score: ${result.score}/100)`);
    } else {
      console.log(`❌ Status: INVALID (Score: ${result.score}/100)`);
    }

    if (result.errors.length > 0) {
      console.log('\n🚨 Errors:');
      result.errors.forEach(error => {
        console.log(`  • ${error.code}: ${error.message}`);
        if (error.suggestion) {
          console.log(`    💡 ${error.suggestion}`);
        }
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      result.warnings.forEach(warning => {
        console.log(`  • ${warning.code}: ${warning.message}`);
        console.log(`    💡 ${warning.suggestion}`);
      });
    }

    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log('\n🎉 Perfect! No issues found.');
    }
  }
}

// CLI interface
async function main() {
  const validator = new AgentValidator();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🔍 Validating all agents...\n');
    const results = await validator.validateAllAgents();

    Object.entries(results).forEach(([name, result]) => {
      validator.printValidationReport(result, name);
    });

    // Summary
    const totalAgents = Object.keys(results).length;
    const validAgents = Object.values(results).filter(r => r.isValid).length;
    const avgScore = Object.values(results).reduce((sum, r) => sum + r.score, 0) / totalAgents;

    console.log('\n📊 Summary:');
    console.log(`Total agents: ${totalAgents}`);
    console.log(`Valid agents: ${validAgents}`);
    console.log(`Average score: ${avgScore.toFixed(1)}/100`);
  } else {
    // Validate specific agent
    const agentPath = args[0];
    if (!agentPath) {
      console.error('❌ Please provide an agent path');
      return;
    }
    const result = await validator.validateAgent(agentPath);
    const agentName = path.basename(agentPath, '.ts');
    validator.printValidationReport(result, agentName);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentValidator, ValidationResult, ValidationError, ValidationWarning };
