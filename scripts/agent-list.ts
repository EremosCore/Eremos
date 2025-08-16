import * as fs from "fs";
import * as path from "path";

const agentsPath = path.join(__dirname, "../agents");
const agentFiles = fs
  .readdirSync(agentsPath)
  .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

for (const file of agentFiles) {
  const full = path.join(agentsPath, file);
  try {
    // Support both ESM transpiled and TS via tsx
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(full);
    const exportKeys = Object.keys(mod);
    const exported = exportKeys.length === 1 ? mod[exportKeys[0]] : mod.ExampleAgent || mod.default || mod;
    const name = exported?.name ?? path.basename(file, path.extname(file));
    const id = exported?.id ?? "unknown";
    const desc = exported?.description ?? "(no description)";
    console.log(`${name} (${id}) - ${desc}`);
  } catch (err) {
    console.error(`Failed to load agent from ${file}:`, (err as Error).message);
  }
}
