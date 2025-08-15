export type Signal = {
  type: string;
  hash: string;
  timestamp: string;
  source: string;
  confidence?: number; // Optional confidence score (0-1)
};

/**
 * Validates that a signal object has all required fields and valid values
 */
export function validateSignal(signal: any): signal is Signal {
  if (!signal || typeof signal !== 'object') {
    return false;
  }

  // Check required fields
  if (typeof signal.type !== 'string' || signal.type.trim() === '') {
    return false;
  }
  if (typeof signal.hash !== 'string' || signal.hash.trim() === '') {
    return false;
  }
  if (typeof signal.timestamp !== 'string' || signal.timestamp.trim() === '') {
    return false;
  }
  if (typeof signal.source !== 'string' || signal.source.trim() === '') {
    return false;
  }

  // Validate optional confidence score
  if (signal.confidence !== undefined) {
    if (typeof signal.confidence !== 'number' ||
      signal.confidence < 0 ||
      signal.confidence > 1) {
      return false;
    }
  }

  return true;
}
