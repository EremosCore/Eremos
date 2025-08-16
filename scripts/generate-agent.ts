import fs from 'fs';
import path from 'path';

const name = process.argv[2];
if (!name) throw new Error("Please specify agent name.");

const targetPath = path.join(process.cwd(), 'agents', `${name.toLowerCase()}.ts`);
if (fs.existsSync(targetPath)) {
  throw new Error(`Agent file already exists: ${targetPath}`);
}

const content = `import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

export const ${name}: Agent = {
  id: "${name.toLowerCase()}",
  name: "${name}",
  role: "template",
  glyph: "?",
  watchType: "wallet_activity",
  triggerThreshold: 3,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "${name} agent",
  observe: (event) => {
    if (!event) return;
    const hash = generateSignalHash(event);
    logSignal({ agent: "${name}", type: "observe", glyph: "?", hash, timestamp: new Date().toISOString() });
  },
  getMemory: () => [],
};
`;

fs.writeFileSync(targetPath, content, 'utf8');
console.log(`Created ${targetPath}`);
