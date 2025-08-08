#!/usr/bin/env ts-node

/**
 * Agent Generation Script
 *
 * This script generates new agents with proper structure and templates.
 * It creates all necessary files including tests and documentation.
 */

import * as fs from 'fs';
import * as path from 'path';

interface GenerateOptions {
  name: string;
  role: string;
  glyph: string;
  watchType: string;
  description: string;
  triggerThreshold: number;
  generateTests: boolean;
  generateDocs: boolean;
}

const WATCH_TYPES = [
  'wallet_activity',
  'contract_deployments',
  'mint_activity',
  'anomaly_detection',
  'token_transfers',
  'liquidity_events',
  'governance_events',
  'staking_events',
];

const ROLES = [
  'surveillance',
  'memory_vault',
  'indexing',
  'launch_tracker',
  'anomaly_detector',
  'pattern_analyzer',
  'trend_detector',
  'alert_manager',
];

const GLYPHS = [
  '🔍',
  '📡',
  '🧠',
  '⚡',
  '🔮',
  '📊',
  '🎯',
  '🚨',
  'Δ',
  'Ϸ',
  'λ',
  'ψ',
  'Ω',
  'Φ',
  'Θ',
  'Ξ',
];

function parseArguments(): GenerateOptions {
  const args = process.argv.slice(2);
  const options: GenerateOptions = {
    name: '',
    role: 'surveillance',
    glyph: '🔍',
    watchType: 'wallet_activity',
    description: '',
    triggerThreshold: 0.8,
    generateTests: true,
    generateDocs: true,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    switch (arg) {
      case '--name':
      case '-n':
        if (nextArg && !nextArg.startsWith('-')) {
          options.name = nextArg;
          i++;
        }
        break;
      case '--role':
      case '-r':
        if (nextArg && !nextArg.startsWith('-')) {
          options.role = nextArg;
          i++;
        }
        break;
      case '--glyph':
      case '-g':
        if (nextArg && !nextArg.startsWith('-')) {
          options.glyph = nextArg;
          i++;
        }
        break;
      case '--watch-type':
      case '-w':
        if (nextArg && !nextArg.startsWith('-')) {
          options.watchType = nextArg;
          i++;
        }
        break;
      case '--description':
      case '-d':
        if (nextArg && !nextArg.startsWith('-')) {
          options.description = nextArg;
          i++;
        }
        break;
      case '--threshold':
      case '-t':
        if (nextArg && !nextArg.startsWith('-')) {
          options.triggerThreshold = parseFloat(nextArg);
          i++;
        }
        break;
      case '--no-tests':
        options.generateTests = false;
        break;
      case '--no-docs':
        options.generateDocs = false;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function printHelp(): void {
  console.log(`
🔧 Eremos Agent Generator

Usage: npm run generate:agent [options]

Options:
  -n, --name <name>           Agent name (required)
  -r, --role <role>           Agent role (default: surveillance)
  -g, --glyph <glyph>         Agent glyph (default: 🔍)
  -w, --watch-type <type>     Watch type (default: wallet_activity)
  -d, --description <desc>    Agent description
  -t, --threshold <number>    Trigger threshold 0-1 (default: 0.8)
  --no-tests                  Skip test file generation
  --no-docs                   Skip documentation generation
  -h, --help                  Show this help message

Available Roles:
  ${ROLES.join(', ')}

Available Watch Types:
  ${WATCH_TYPES.join(', ')}

Available Glyphs:
  ${GLYPHS.join(', ')}

Examples:
  npm run generate:agent -- --name=my-agent --role=surveillance
  npm run generate:agent -- --name=analyzer --role=pattern_analyzer --glyph=📊
  npm run generate:agent -- --name=alert --role=alert_manager --glyph=🚨 --no-tests
`);
}

function validateOptions(options: GenerateOptions): void {
  if (!options.name) {
    console.error('❌ Error: Agent name is required');
    console.log('Use --name or -n to specify the agent name');
    process.exit(1);
  }

  if (!ROLES.includes(options.role)) {
    console.error(`❌ Error: Invalid role '${options.role}'`);
    console.log(`Available roles: ${ROLES.join(', ')}`);
    process.exit(1);
  }

  if (!WATCH_TYPES.includes(options.watchType)) {
    console.error(`❌ Error: Invalid watch type '${options.watchType}'`);
    console.log(`Available watch types: ${WATCH_TYPES.join(', ')}`);
    process.exit(1);
  }

  if (options.triggerThreshold < 0 || options.triggerThreshold > 1) {
    console.error('❌ Error: Trigger threshold must be between 0 and 1');
    process.exit(1);
  }
}

function generateAgentId(name: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 4);
  return `agent-${timestamp}-${random}`;
}

function generateAgentFile(options: GenerateOptions): string {
  const agentId = generateAgentId(options.name);
  const className =
    options.name.charAt(0).toUpperCase() + options.name.slice(1);

  return `import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const ${className}: Agent = {
  id: "${agentId}",
  name: "${options.name}",
  role: "${options.role}",
  watchType: "${options.watchType}",
  glyph: "${options.glyph}",
  triggerThreshold: ${options.triggerThreshold},
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "${options.description || `Agent for ${options.watchType} monitoring`}",

  observe: (event: any) => {
    // TODO: Implement your detection logic here
    // Example implementation:
    
    // Check if event matches your watch type
    if (event?.type === "${options.watchType}") {
      // Calculate confidence based on your logic
      const confidence = calculateConfidence(event);
      
      // Emit signal if confidence meets threshold
      if (confidence >= ${className}.triggerThreshold) {
        const signal = {
          agent: ${className}.name,
          type: "${options.watchType}_detected",
          glyph: ${className}.glyph,
          hash: generateSignalHash(event),
          timestamp: new Date().toISOString(),
          source: \`agent-\${${className}.id}\`,
          confidence: confidence,
          data: {
            event: event,
            // Add additional context as needed
          }
        };
        
        logSignal(signal);
        ${className}.lastSignal = signal.timestamp;
      }
    }
  },

  getMemory: () => {
    // TODO: Implement memory snapshot
    return [
      \`Last signal: \${${className}.lastSignal || 'None'}\`,
      \`Total observations: \${observationCount || 0}\`,
      \`Average confidence: \${averageConfidence || 0}\`
    ];
  }
};

// Helper function to calculate confidence
function calculateConfidence(event: any): number {
  // TODO: Implement your confidence calculation logic
  // This is a placeholder implementation
  
  let confidence = 0;
  
  // Example confidence factors:
  // - Event strength (0-1)
  // - Pattern match quality (0-1)
  // - Historical context (0-1)
  // - External factors (0-1)
  
  // For now, return a random confidence for testing
  confidence = Math.random();
  
  return Math.min(confidence, 1.0);
}

// Internal state tracking (optional)
let observationCount = 0;
let averageConfidence = 0;
`;
}

function generateTestFile(options: GenerateOptions): string {
  const className =
    options.name.charAt(0).toUpperCase() + options.name.slice(1);

  return `import { ${className} } from '../agents/${options.name}';

describe('${className} Agent', () => {
  beforeEach(() => {
    // Reset agent state before each test
    ${className}.lastSignal = null;
  });

  test('should have correct configuration', () => {
    expect(${className}.name).toBe('${options.name}');
    expect(${className}.role).toBe('${options.role}');
    expect(${className}.watchType).toBe('${options.watchType}');
    expect(${className}.glyph).toBe('${options.glyph}');
    expect(${className}.triggerThreshold).toBe(${options.triggerThreshold});
  });

  test('should process events of correct type', () => {
    const mockEvent = {
      type: '${options.watchType}',
      data: 'test data',
      timestamp: new Date().toISOString()
    };

    const originalLastSignal = ${className}.lastSignal;
    ${className}.observe(mockEvent);

    // Verify agent processed the event
    // Note: Signal emission depends on confidence calculation
  });

  test('should not process events of wrong type', () => {
    const mockEvent = {
      type: 'wrong_type',
      data: 'test data',
      timestamp: new Date().toISOString()
    };

    const originalLastSignal = ${className}.lastSignal;
    ${className}.observe(mockEvent);

    // Verify agent did not emit signal
    expect(${className}.lastSignal).toBe(originalLastSignal);
  });

  test('should emit signal when confidence threshold is met', () => {
    // Mock the confidence calculation to return high confidence
    const mockEvent = {
      type: '${options.watchType}',
      data: 'high_confidence_event',
      timestamp: new Date().toISOString()
    };

    ${className}.observe(mockEvent);

    // Verify signal was emitted (if confidence was high enough)
    // This test may need adjustment based on your confidence logic
  });

  test('should provide memory snapshot', () => {
    const memory = ${className}.getMemory();
    
    expect(Array.isArray(memory)).toBe(true);
    expect(memory.length).toBeGreaterThan(0);
    
    // Verify memory contains expected information
    expect(memory.some(entry => entry.includes('Last signal'))).toBe(true);
  });

  test('should handle null/undefined events gracefully', () => {
    expect(() => {
      ${className}.observe(null);
    }).not.toThrow();

    expect(() => {
      ${className}.observe(undefined);
    }).not.toThrow();
  });

  test('should handle malformed events gracefully', () => {
    const malformedEvent = {
      // Missing required fields
    };

    expect(() => {
      ${className}.observe(malformedEvent);
    }).not.toThrow();
  });
});
`;
}

function generateDocumentation(options: GenerateOptions): string {
  const className =
    options.name.charAt(0).toUpperCase() + options.name.slice(1);

  return `# ${className} Agent

## Overview

${options.description || `The ${options.name} agent monitors ${options.watchType} events and emits signals when specific conditions are met.`}

## Configuration

- **Name**: ${options.name}
- **Role**: ${options.role}
- **Glyph**: ${options.glyph}
- **Watch Type**: ${options.watchType}
- **Trigger Threshold**: ${options.triggerThreshold}

## Purpose

This agent is designed to:

- Monitor ${options.watchType} events across the Solana network
- Analyze patterns and calculate confidence scores
- Emit signals when confidence exceeds the threshold
- Maintain internal state and memory

## Signal Types

The agent emits the following signal types:

- **${options.watchType}_detected**: Emitted when a ${options.watchType} event is detected with sufficient confidence

## Confidence Calculation

The agent calculates confidence based on:

- Event strength and quality
- Pattern matching against known signatures
- Historical context and trends
- External market factors

## Memory Management

The agent maintains memory of:

- Last signal timestamp
- Total observations processed
- Average confidence scores
- Pattern recognition data

## Usage

\`\`\`typescript
import { ${className} } from '../agents/${options.name}';

// Process an event
${className}.observe({
  type: '${options.watchType}',
  data: eventData,
  timestamp: new Date().toISOString()
});

// Get memory snapshot
const memory = ${className}.getMemory();
\`\`\`

## Testing

Run the agent tests:

\`\`\`bash
npm test -- --testNamePattern="${className}"
\`\`\`

## Development

To modify this agent:

1. Update the \`observe\` method with your detection logic
2. Implement the \`calculateConfidence\` function
3. Add any additional state tracking as needed
4. Update tests to cover new functionality
5. Update this documentation

## Dependencies

- \`../types/agent\` - Agent interface
- \`../utils/signal\` - Signal generation utilities
- \`../utils/logger\` - Logging utilities
`;
}

function createDirectoryIfNotExists(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  createDirectoryIfNotExists(dir);
  fs.writeFileSync(filePath, content);
}

async function generateAgent(): Promise<void> {
  try {
    const options = parseArguments();

    if (!options.name) {
      printHelp();
      process.exit(1);
    }

    validateOptions(options);

    console.log(`
🚀 Generating Agent: ${options.name}
═══════════════════════════════════════
`);

    // Generate agent file
    const agentContent = generateAgentFile(options);
    const agentPath = path.join('agents', `${options.name}.ts`);
    writeFile(agentPath, agentContent);
    console.log(`✅ Created agent: ${agentPath}`);

    // Generate test file
    if (options.generateTests) {
      const testContent = generateTestFile(options);
      const testPath = path.join('tests', `${options.name}.test.ts`);
      writeFile(testPath, testContent);
      console.log(`✅ Created tests: ${testPath}`);
    }

    // Generate documentation
    if (options.generateDocs) {
      const docContent = generateDocumentation(options);
      const docPath = path.join('docs', 'agents', `${options.name}.md`);
      writeFile(docPath, docContent);
      console.log(`✅ Created documentation: ${docPath}`);
    }

    console.log(`
🎉 Agent generation completed!

Next steps:
1. Review and customize the generated agent code
2. Implement your detection logic in the observe() method
3. Update the calculateConfidence() function
4. Run tests: npm test -- --testNamePattern="${options.name}"
5. Test the agent: npm run dev:agent -- --agent=${options.name}

Happy coding! 🚀
`);
  } catch (error) {
    console.error('❌ Error generating agent:', error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateAgent();
}
