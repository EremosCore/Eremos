export type Signal = {
  type: string;
  hash: string;
  timestamp: string;
  source: string;
  agent?: string;
  id?: string;
  glyph?: string;
  confidence?: number;
  metadata?: Record<string, any>;
};

export type SignalType = string;

// TODO: add error handling for malformed signal payloads
