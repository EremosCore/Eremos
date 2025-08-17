import { Signal } from "../types/signal";

/**
 * Generate a deterministic-but-unique signal hash from event data.
 */
export function generateSignalHash(event: any): string {
  const base = JSON.stringify(event) + Date.now();
  const hash = Buffer.from(base).toString("base64").slice(0, 10);
  return "sig_" + hash;
}

/**
 * Safely create a Signal object from a payload.
 * Ensures required fields exist and are valid.
 * Returns null if validation fails.
 */
export function createSignal(payload: Partial<Signal>): Signal | null {
  if (!payload.type || typeof payload.type !== "string") {
    console.error("[Signal] Missing or invalid type:", payload);
    return null;
  }
  if (!payload.hash || typeof payload.hash !== "string") {
    console.error("[Signal] Missing or invalid hash:", payload);
    return null;
  }
  if (!payload.timestamp || isNaN(Date.parse(payload.timestamp))) {
    console.error("[Signal] Missing or invalid timestamp:", payload);
    return null;
  }
  if (!payload.source || typeof payload.source !== "string") {
    console.error("[Signal] Missing or invalid source:", payload);
    return null;
  }

  return {
    type: payload.type,
    hash: payload.hash,
    timestamp: payload.timestamp,
    source: payload.source,
    details: payload.details ?? {},
  };
}