export type Signal = {
  type: string;
  hash: string;
  timestamp: string;
  source: string;
  details?: Record<string, any>;
};

/**
 * Validate and safely create a Signal object.
 * Returns null if the payload is malformed.
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
    details: payload.details,
  };
}