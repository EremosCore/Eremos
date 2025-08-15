import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import fs from "fs";
import path from "path";

async function validateAgent(agentName?: string): Promise<void> {
  console.log("\n🔍 Eremos Agent Validator\n");
  
  if (!agentName) {
    console.log("Usage: npm run agent:validate <agent-name>");
    console.log("Example: npm run agent:validate theron\n");
    process.exit(1);
  }

  const agentPath = path.join(__dirname, "../agents", `${agentName}.ts`);
  
  if (!fs.existsSync(agentPath)) {
    console.log(`❌ Agent file not found: ${agentPath}`);
    console.log(`Available agents: ${fs.readdirSync(path.join(__dirname, "../agents")).filter(f => f.endsWith('.ts')).map(f => f.replace('.ts', '')).join(', ')}\n`);
    process.exit(1);
  }

  console.log(`📋 Validating agent: ${agentName}`);
  console.log(`📁 Path: ${agentPath}\n`);

  try {
    // Import the agent module
    const agentModule = await import(agentPath);
    const agentExports = Object.keys(agentModule);
    
    if (agentExports.length === 0) {
      console.log("❌ No exports found in agent file");
      process.exit(1);
    }

    console.log(`✅ Agent file imports successfully`);
    console.log(`📦 Exports found: ${agentExports.join(', ')}\n`);

    // Find the agent object (usually the main export or matches the filename)
    const possibleAgentKeys = [
      agentName.charAt(0).toUpperCase() + agentName.slice(1), // Capitalize first letter
      agentName,
      'default',
      agentExports[0] // Fallback to first export
    ];

    let agent: Agent | null = null;
    let agentKey = '';

    for (const key of possibleAgentKeys) {
      if (agentModule[key] && typeof agentModule[key] === 'object') {
        agent = agentModule[key];
        agentKey = key;
        break;
      }
    }

    if (!agent) {
      console.log("❌ Could not find agent object in exports");
      console.log(`   Expected one of: ${possibleAgentKeys.join(', ')}`);
      process.exit(1);
    }

    console.log(`✅ Found agent object: ${agentKey}`);

    // Validate required fields
    const requiredFields = ['id', 'name', 'role', 'glyph', 'watchType', 'triggerThreshold', 'lastSignal', 'originTimestamp', 'description', 'observe'];
    const validationResults: string[] = [];

    for (const field of requiredFields) {
      if (agent[field as keyof Agent] === undefined || agent[field as keyof Agent] === null) {
        validationResults.push(`❌ Missing required field: ${field}`);
      } else if (field === 'observe' && typeof agent.observe !== 'function') {
        validationResults.push(`❌ Field 'observe' must be a function`);
      } else if (field === 'triggerThreshold' && typeof agent.triggerThreshold !== 'number') {
        validationResults.push(`❌ Field 'triggerThreshold' must be a number`);
      } else {
        validationResults.push(`✅ ${field}: ${field === 'observe' ? 'function' : agent[field as keyof Agent]}`);
      }
    }

    console.log("\n📊 Field Validation:");
    validationResults.forEach(result => console.log(`   ${result}`));

    // Test agent behavior
    console.log("\n🧪 Behavior Testing:");
    
    const testEvent = {
      type: agent.watchType,
      timestamp: new Date().toISOString(),
      testData: true
    };

    console.log(`   Testing observe() with ${agent.watchType} event...`);
    
    try {
      agent.observe(testEvent);
      console.log("   ✅ observe() executed without errors");
    } catch (error) {
      console.log(`   ❌ observe() threw error: ${error}`);
    }

    // Test memory function if present
    if (agent.getMemory) {
      console.log("   Testing getMemory() function...");
      try {
        const memory = agent.getMemory();
        if (Array.isArray(memory)) {
          console.log(`   ✅ getMemory() returned array with ${memory.length} items`);
        } else {
          console.log("   ⚠️  getMemory() didn't return an array");
        }
      } catch (error) {
        console.log(`   ❌ getMemory() threw error: ${error}`);
      }
    } else {
      console.log("   ℹ️  getMemory() function not implemented (optional)");
    }

    // Validate glyph
    if (agent.glyph && agent.glyph.length > 0) {
      console.log(`   ✅ Glyph: ${agent.glyph} (${agent.glyph.length} character${agent.glyph.length > 1 ? 's' : ''})`);
    } else {
      console.log("   ⚠️  Glyph is empty or missing");
    }

    console.log("\n🎉 Agent validation complete!");
    console.log(`Agent '${agent.name}' appears to be properly structured.\n`);

  } catch (error) {
    console.log(`❌ Error during validation: ${error}`);
    process.exit(1);
  }
}

// Get agent name from command line arguments
const agentName = process.argv[2];
validateAgent(agentName);
