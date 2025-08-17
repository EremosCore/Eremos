import * as fs from "fs";
import * as path from "path";

const agentsPath = path.join(__dirname, "../agents");
const agentFiles = fs
  .readdirSync(agentsPath)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts");

agentFiles.forEach((file) => {
  try {
    const agent = require(path.join(agentsPath, file));
    const agentObj = agent[Object.keys(agent)[0]]; // Get the exported agent object
    if (agentObj && agentObj.name && agentObj.id && agentObj.description) {
      console.log(
        `${agentObj.name} (${agentObj.id}) - ${agentObj.description}`
      );
    } else {
      console.log(`${file.replace(".ts", "")} - Agent structure needs review`);
    }
  } catch (error) {
    console.log(`${file.replace(".ts", "")} - Error loading agent`);
  }
});
