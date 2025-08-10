/**
 * Core Agent interface for the Eremos swarm system
 * 
 * Agents are autonomous entities that observe blockchain events,
 * process patterns, and emit structured signals when thresholds are met.
 */
export interface Agent {
  /** Unique identifier for the agent (e.g., "agent-000") */
  id: string;
  
  /** Human-readable name of the agent */
  name: string;
  
  /** Role within the swarm ecosystem */
  role: string;
  
  /** Visual symbol representing the agent in logs and outputs */
  glyph: string;
  
  /** Type of blockchain activity this agent monitors */
  watchType: WatchType;
  
  /** Minimum confidence threshold required to emit a signal */
  triggerThreshold: number;
  
  /** Hash of the last signal emitted, or null if no signals yet */
  lastSignal: string | null;
  
  /** ISO timestamp when this agent was first activated */
  originTimestamp: string;
  
  /** Human-readable description of the agent's purpose and behavior */
  description: string;
  
  /** 
   * Core observation function called when relevant events occur
   * @param event - The blockchain event to process
   */
  observe: (event: BlockchainEvent) => void;
  
  /** 
   * Optional function to retrieve agent's historical memory
   * @returns Array of memory fragments or signal hashes
   */
  getMemory?: () => string[];
}

/**
 * Types of blockchain activity that agents can monitor
 */
export type WatchType = 
  | "wallet_activity"
  | "contract_deploy" 
  | "bundle_activity"
  | "anomaly_detection"
  | "liquidity_events"
  | "dormant_revival";

/**
 * Generic blockchain event structure
 */
export interface BlockchainEvent {
  /** Type of the event */
  type: string;
  
  /** Event timestamp */
  timestamp: string;
  
  /** Additional event-specific data */
  data?: Record<string, any>;
  
  /** Confidence score for the event (0.0 - 1.0) */
  confidence?: number;
}
