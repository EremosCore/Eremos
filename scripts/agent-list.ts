import { agents } from "../agents/index";

console.log("📋 Available Agents:\n");

agents.forEach(agent => {
  console.log(`🧠 ${agent.name} (${agent.id})`);
  console.log(`   Glyph: ${agent.glyph}`);
  console.log(`   Role: ${agent.role}`);
  console.log(`   Watch: ${agent.watchType}`);
  console.log(`   Description: ${agent.description}`);
  console.log("");
});

console.log(`Total agents: ${agents.length}`);
