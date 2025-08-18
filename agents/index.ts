export { Theron } from './theron';
export { Observer } from './observer';
export { Harvester } from './harvester';
export { LaunchTracker } from './launchtracker';
export { GhostWatcher } from './skieró';
export { ExampleAgent } from './example';

// Agent registry for scripts that need it
import { Theron } from './theron';
import { Observer } from './observer';
import { Harvester } from './harvester';
import { LaunchTracker } from './launchtracker';
import { GhostWatcher } from './skieró';
import { ExampleAgent } from './example';

export const agents = [
  Theron,
  Observer,
  Harvester,
  LaunchTracker,
  GhostWatcher,
  ExampleAgent
];
