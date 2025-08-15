import { Agent } from "../types/agent";
const fs = require("fs");
const path = require("path");

interface AgentHealthResult {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  issues: string[];
  details: {
    id?: string;
    role?: string;
    glyph?: string;
    watchType?: string;
    hasMemory: boolean;
  };
}

async function checkAgentHealth(agentFile: string): Promise<AgentHealthResult> {
  const agentName = path.basename(agentFile, '.ts');
  const result: AgentHealthResult = {
    name: agentName,
    status: 'healthy',
    issues: [],
    details: {
      hasMemory: false
    }
  };

  try {
    const agentPath = path.join(process.cwd(), "agents", agentFile);
    const agentModule = await import(agentPath);
    
    // Find the agent object
    const possibleKeys = [
      agentName.charAt(0).toUpperCase() + agentName.slice(1),
      agentName,
      'default',
      Object.keys(agentModule)[0]
    ];

    let agent: Agent | null = null;
    for (const key of possibleKeys) {
      if (agentModule[key] && typeof agentModule[key] === 'object') {
        agent = agentModule[key];
        break;
      }
    }

    if (!agent) {
      result.status = 'error';
      result.issues.push('Agent object not found in exports');
      return result;
    }

    // Check required fields
    const requiredFields = ['id', 'name', 'role', 'glyph', 'watchType', 'triggerThreshold', 'observe'];
    
    for (const field of requiredFields) {
      if (agent[field as keyof Agent] === undefined || agent[field as keyof Agent] === null) {
        result.issues.push(`Missing required field: ${field}`);
        result.status = 'error';
      }
    }

    // Validate specific field types
    if (agent.observe && typeof agent.observe !== 'function') {
      result.issues.push('observe must be a function');
      result.status = 'error';
    }

    if (agent.triggerThreshold && typeof agent.triggerThreshold !== 'number') {
      result.issues.push('triggerThreshold must be a number');
      result.status = 'error';
    }

    if (agent.triggerThreshold && (agent.triggerThreshold < 0 || agent.triggerThreshold > 1) && agent.triggerThreshold !== Infinity) {
      result.issues.push('triggerThreshold should be between 0-1 or Infinity');
      result.status = 'warning';
    }

    // Test observe function
    if (agent.observe && typeof agent.observe === 'function') {
      try {
        const testEvent = {
          type: agent.watchType || 'test',
          timestamp: new Date().toISOString()
        };
        agent.observe(testEvent);
      } catch (error) {
        result.issues.push(`observe() throws error: ${error}`);
        result.status = 'error';
      }
    }

    // Check for memory capability
    if (agent.getMemory && typeof agent.getMemory === 'function') {
      result.details.hasMemory = true;
      try {
        const memory = agent.getMemory();
        if (!Array.isArray(memory)) {
          result.issues.push('getMemory() should return an array');
          result.status = 'warning';
        }
      } catch (error) {
        result.issues.push(`getMemory() throws error: ${error}`);
        result.status = 'error';
      }
    }

    // Store agent details
    result.details.id = agent.id;
    result.details.role = agent.role;
    result.details.glyph = agent.glyph;
    result.details.watchType = agent.watchType;

    // Determine final status
    if (result.issues.length === 0) {
      result.status = 'healthy';
    } else if (result.status !== 'error') {
      result.status = 'warning';
    }

  } catch (error) {
    result.status = 'error';
    result.issues.push(`Failed to import agent: ${error}`);
  }

  return result;
}

async function runHealthCheck(): Promise<void> {
  console.log("\n🏥 Eremos Agent Health Dashboard\n");
  console.log("╭─────────────────────────────────────────────╮");
  console.log("│              System Health Check            │");
  console.log("╰─────────────────────────────────────────────╯\n");

  const agentsDir = path.join(process.cwd(), "agents");
  
  if (!fs.existsSync(agentsDir)) {
    console.log("❌ Agents directory not found!");
    process.exit(1);
  }

  const agentFiles = fs.readdirSync(agentsDir).filter((file: string) => 
    file.endsWith('.ts') && !file.startsWith('.')
  );

  if (agentFiles.length === 0) {
    console.log("⚠️  No agent files found in agents directory");
    return;
  }

  console.log(`📊 Scanning ${agentFiles.length} agent${agentFiles.length > 1 ? 's' : ''}...\n`);

  const results: AgentHealthResult[] = [];
  
  for (const agentFile of agentFiles) {
    console.log(`🔍 Checking ${agentFile.replace('.ts', '')}...`);
    const result = await checkAgentHealth(agentFile);
    results.push(result);
  }

  // Display summary
  console.log("\n" + "═".repeat(60));
  console.log("                    HEALTH SUMMARY");
  console.log("═".repeat(60));

  let healthyCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const result of results) {
    const statusIcon = result.status === 'healthy' ? '✅' : 
                      result.status === 'warning' ? '⚠️' : '❌';
    const statusText = result.status.toUpperCase();
    const spacing1 = '        '.substr(statusText.length);
    const spacing2 = '               '.substr(result.name.length);
    
    console.log(`${statusIcon} ${statusText}${spacing1} ${result.name}${spacing2} ${result.details.glyph || '?'} (${result.details.role || 'unknown'})`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`            └─ ${issue}`);
      });
    }

    if (result.status === 'healthy') healthyCount++;
    else if (result.status === 'warning') warningCount++;
    else errorCount++;
  }

  // Final summary
  console.log("\n" + "─".repeat(60));
  console.log(`📈 Summary: ${healthyCount} healthy, ${warningCount} warnings, ${errorCount} errors`);
  
  if (errorCount > 0) {
    console.log("🚨 Action required: Fix error conditions before production use");
  } else if (warningCount > 0) {
    console.log("⚡ Consider addressing warnings for optimal performance");
  } else {
    console.log("🎉 All agents are healthy and ready for production!");
  }

  // Detailed breakdown
  console.log("\n📋 Agent Details:");
  for (const result of results) {
    if (result.status === 'healthy') {
      console.log(`   ${result.details.glyph || '?'} ${result.name}: ${result.details.watchType} → ${result.details.hasMemory ? 'with memory' : 'stateless'}`);
    }
  }

  console.log("\n💡 Tips:");
  console.log("   • Run 'npm run agent:validate <name>' for detailed agent analysis");
  console.log("   • Use 'npm run demo' to see agents in action");
  console.log("   • Check docs/agents.md for development guidelines\n");
}

runHealthCheck().catch(error => {
  console.error("💥 Health check failed:", error);
  process.exit(1);
});