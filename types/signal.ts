export type Signal = {
  agent: string;
  type: string;
  glyph?: string;
  hash: string;
  timestamp: string;
  source: string;
  confidence?: number;
};

export function validateSignal(signal: any): signal is Signal {
  if (!signal || typeof signal !== 'object') {
    return false;
  }
  
  if (typeof signal.agent !== 'string' || signal.agent.trim() === '') {
    return false;
  }
  
  if (typeof signal.type !== 'string' || signal.type.trim() === '') {
    return false;
  }
  
  if (signal.glyph !== undefined && typeof signal.glyph !== 'string') {
    return false;
  }
  
  if (typeof signal.hash !== 'string' || signal.hash.trim() === '') {
    return false;
  }
  
  // Validate ISO timestamp
  if (typeof signal.timestamp !== 'string') {
    return false;
  }
  const timestampDate = new Date(signal.timestamp);
  if (isNaN(timestampDate.getTime())) {
    return false;
  }
  
  if (typeof signal.source !== 'string' || signal.source.trim() === '') {
    return false;
  }
  
  if (signal.confidence !== undefined) {
    if (typeof signal.confidence !== 'number' ||
      signal.confidence < 0 ||
      signal.confidence > 1) {
      return false;
    }
  }
  
  return true;
}

export function createSignal(
  agent: string,
  type: string,
  hash: string,
  source: string,
  confidence?: number,
  glyph?: string
): Signal {
  return {
    agent,
    type,
    glyph,
    hash,
    timestamp: new Date().toISOString(),
    source,
    confidence,
  };
}
