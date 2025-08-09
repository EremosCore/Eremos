import { ExampleAgent } from "./example";
import { Theron } from "./theron";
import { Observer } from "./observer";
import { LaunchTracker } from "./launchtracker";
import { Harvester } from "./harvester";
import { GhostWatcher } from "./skieró";
import { Agent } from "../types/agent";

export { ExampleAgent } from "./example";
export { Theron } from "./theron";
export { Observer } from "./observer";
export { LaunchTracker } from "./launchtracker";
export { Harvester } from "./harvester";
export { GhostWatcher } from "./skieró";


export const agents: Agent[] = [
  ExampleAgent,
  Theron,
  Observer,
  LaunchTracker,
  Harvester,
  GhostWatcher,
];

