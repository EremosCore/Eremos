import { validateSignal } from "../types/signal";
import { logAgentError } from "./error";

export function generateSignalHash(event: any): string {
  const base = JSON.stringify(event) + Date.now();
  const hash = btoa(base).slice(0, 10); // using btoa instead of Buffer for browser compatibility
  return "sig_" + hash;
}

/**
 * Safely validates and processes a signal before emission
 * @param signal The signal to validate
 * @param agentName Name of the agent for error logging
 * @returns true if signal is valid, false otherwise
 */
export function validateAndLogSignal(signal: any, agentName: string): boolean {
  if (!validateSignal(signal)) {
    logAgentError(agentName, new Error(`Invalid signal format: ${JSON.stringify(signal)}`));
    return false;
  }
  return true;
}
