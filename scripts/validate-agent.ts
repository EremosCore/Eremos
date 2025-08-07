import { Agent } from '../types/agent';
import fs from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('❌ Please provide a file path as argument.');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf-8');
const agent: Agent = JSON.parse(raw);

if (!agent.id || !agent.observe || !agent.triggerThreshold) {
  console.error('❌ Invalid agent config.');
  process.exit(1);
} else {
  console.log('✅ Agent config looks valid.');
}
