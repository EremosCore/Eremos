/**
 * Signal emitted by agents when patterns are detected
 * 
 * Signals are the primary output of the Eremos system, representing
 * detected patterns or anomalies in blockchain activity.
 */
export interface Signal {
  /** Type of signal emitted */
  type: SignalType;
  
  /** Unique hash identifier for this signal */
  hash: string;
  
  /** ISO timestamp when signal was generated */
  timestamp: string;
  
  /** Source agent that emitted this signal */
  source: string;
  
  /** Agent's visual glyph */
  glyph: string;
  
  /** Confidence score (0.0 - 1.0) */
  confidence: number;
  
  /** Optional metadata specific to the signal type */
  metadata?: SignalMetadata;
}

/**
 * Types of signals that can be emitted
 */
export type SignalType = 
  | "launch_detected"
  | "bundle_detected"
  | "anomaly_detected" 
  | "wallet_cluster_found"
  | "liquidity_spike"
  | "dormant_activation"
  | "template_log"
  | "archival";

/**
 * Signal-specific metadata
 */
export interface SignalMetadata {
  /** Wallet addresses involved */
  wallets?: string[];
  
  /** Contract addresses involved */
  contracts?: string[];
  
  /** Transaction hashes */
  transactions?: string[];
  
  /** Additional context data */
  context?: Record<string, any>;
}

/**
 * Error handling for malformed signal payloads
 */
export class SignalValidationError extends Error {
  constructor(message: string, public signal: Partial<Signal>) {
    super(`Signal validation failed: ${message}`);
    this.name = 'SignalValidationError';
  }
}

/**
 * Validates a signal object structure
 * @param signal - Signal to validate
 * @throws SignalValidationError if validation fails
 */
export function validateSignal(signal: Partial<Signal>): asserts signal is Signal {
  if (!signal.type) {
    throw new SignalValidationError('Missing signal type', signal);
  }
  
  if (!signal.hash) {
    throw new SignalValidationError('Missing signal hash', signal);
  }
  
  if (!signal.timestamp) {
    throw new SignalValidationError('Missing timestamp', signal);
  }
  
  if (!signal.source) {
    throw new SignalValidationError('Missing source agent', signal);
  }
  
  if (typeof signal.confidence !== 'number' || signal.confidence < 0 || signal.confidence > 1) {
    throw new SignalValidationError('Invalid confidence score (must be 0.0-1.0)', signal);
  }
}
