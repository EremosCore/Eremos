/**
 * Eremos - Autonomous swarm agents for early on-chain signal detection
 * 
 * This is the main entry point for the Eremos framework.
 * Export all core functionality for easy importing.
 */

// Core Types
export * from "./types/agent";
export * from "./types/signal";
export * from "./types/event";
export * from "./types/config";

// Utilities
export * from "./utils/signal";
export * from "./utils/logger";
export * from "./utils/metrics";
export * from "./utils/error";
export * from "./utils/throttle";
export * from "./utils/time";
export * from "./utils/lifecycle";
export * from "./utils/eventParser";
export * from "./utils/debug";

// Agents
export { Theron } from "./agents/theron";
export { default as Observer } from "./agents/observer";
export { default as Harvester } from "./agents/harvester";
export { default as LaunchTracker } from "./agents/launchtracker";
export { default as ExampleAgent } from "./agents/example";

// Version info
export const version = "0.1.0";
export const name = "eremos-core";

/**
 * Initialize the Eremos framework
 * @param config - Optional configuration object
 */
export function initialize(config?: any) {
  console.log(`🤖 Eremos ${version} initialized`);
  console.log("🐝 Autonomous swarm agents for early on-chain signal detection");
  
  if (config) {
    console.log("⚙️ Configuration loaded");
  }
  
  return {
    version,
    name,
    initialized: true,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get framework information
 */
export function getInfo() {
  return {
    name,
    version,
    description: "Autonomous swarm agents for early on-chain signal detection",
    homepage: "https://www.eremos.io",
    repository: "https://github.com/EremosCore/Eremos",
    license: "MIT"
  };
}