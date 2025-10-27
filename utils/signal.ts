import { createSignal, validateSignal, Signal } from "../types/signal";
import { logAgentError } from "./error";

export function generateSignalHash(event: any): string {
  const eventStr = typeof event === 'string' 
    ? event 
    : JSON.stringify(event, Object.keys(event).sort());
  
  const base = eventStr + Date.now() + Math.random().toString(36).substring(2, 9);
  const hash = btoa(base).slice(0, 12);
  return `sig_${hash}`;
}

/**
 * Calculates confidence score based on signal characteristics
 * Heuristics: CEX origin, timing, wallet linkage, metadata validation
 */
export function calculateConfidence(params: {
  isCexOrigin?: boolean;
  timeDelta?: number;
  walletLinkage?: number;
  hasValidMetadata?: boolean;
}): number {
  let score = 0.5;
  
  if (params.isCexOrigin) score += 0.2;
  if (params.timeDelta !== undefined && params.timeDelta < 10) score += 0.15;
  if (params.walletLinkage !== undefined) score += params.walletLinkage * 0.15;
  if (params.hasValidMetadata) score += 0.1;
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Safely validates and processes a signal before emission
 */
export function validateAndLogSignal(signal: any, agentName: string): boolean {
  if (!validateSignal(signal)) {
    logAgentError(agentName, new Error(`Invalid signal format: ${JSON.stringify(signal)}`));
    return false;
  }
  return true;
}

/**
 * Creates, validates, and emits a signal with automatic hash generation
 */
export function emitSignal(
  agent: string,
  type: string,
  source: string,
  event: any,
  confidence?: number,
  glyph?: string
): Signal | null {
  const hash = generateSignalHash(event);
  const signal = createSignal(agent, type, hash, source, confidence, glyph);
  
  if (!validateAndLogSignal(signal, agent)) {
    return null;
  }
  
  return signal;
}

/**
 * Filters signals by minimum confidence threshold
 */
export function filterByConfidence(signals: Signal[], threshold: number): Signal[] {
  return signals.filter(signal => 
    signal.confidence !== undefined && signal.confidence >= threshold
  );
}
