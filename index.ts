/**
 * Eremos - Autonomous Swarm Agents for Early On-Chain Signal Detection
 * 
 * Main entry point for the Eremos framework.
 * Exports core types, utilities, and agent implementations.
 * 
 * @packageDocumentation
 */

// Core Types
export type { Agent } from './types/agent';
export type { Signal } from './types/signal';
export type { Event } from './types/event';
export type { Config } from './types/config';

// Utilities
export { generateSignalHash } from './utils/signal';
export { logSignal } from './utils/logger';
export { createMetrics } from './utils/metrics';
export { parseEvent } from './utils/eventParser';
export { createThrottle } from './utils/throttle';
export { formatTime } from './utils/time';

// Agent Implementations
export { Theron } from './agents/theron';

// Framework info
export const FRAMEWORK_VERSION = '0.1.0';
export const FRAMEWORK_NAME = 'Eremos';

/**
 * Initialize the Eremos framework with configuration
 */
export function initializeEremos(config?: Partial<Config>) {
  console.log(`🔮 ${FRAMEWORK_NAME} v${FRAMEWORK_VERSION} - Swarm agents initializing...`);
  
  // Framework initialization logic would go here
  // For now, just return a simple status
  return {
    framework: FRAMEWORK_NAME,
    version: FRAMEWORK_VERSION,
    status: 'initialized',
    config: config || {},
  };
}

export default {
  FRAMEWORK_NAME,
  FRAMEWORK_VERSION,
  initializeEremos,
};
