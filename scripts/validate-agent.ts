import * as fs from "fs";
import * as path from "path";

type ValidationIssue = { file: string; message: string };

const agentsDir = path.join(__dirname, "../agents");
const files = fs
  .readdirSync(agentsDir)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

const issues: ValidationIssue[] = [];

for (const file of files) {
  const full = path.join(agentsDir, file);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(full);
    const exportKeys = Object.keys(mod);
    const agent = exportKeys.length === 1 ? mod[exportKeys[0]] : mod.default || mod.ExampleAgent || mod;

    const required = [
      "id",
      "name",
      "role",
      "glyph",
      "watchType",
      "triggerThreshold",
      "originTimestamp",
      "description",
      "observe",
    ];
    for (const key of required) {
      if (!(key in agent)) {
        issues.push({ file, message: `Missing required field: ${key}` });
      }
    }

    if (typeof agent.observe !== "function") {
      issues.push({ file, message: `observe must be a function` });
    }
  } catch (e) {
    issues.push({ file, message: `Failed to load: ${(e as Error).message}` });
  }
}

if (issues.length === 0) {
  console.log("All agents look valid.");
  process.exit(0);
} else {
  console.error("Validation issues found:\n");
  for (const issue of issues) {
    console.error(`- ${issue.file}: ${issue.message}`);
  }
  process.exit(1);
}

import { Agent } from "../types/agent";
import fs from "fs";

const raw = fs.readFileSync(process.argv[2], "utf-8");
const agent: Agent = JSON.parse(raw);

if (!agent.id || !agent.observe || !agent.triggerThreshold) {
  console.error("❌ Invalid agent config.");
  process.exit(1);
} else {
  console.log("✅ Agent config looks valid.");
}
