export type Signal = {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  source?: string;
  confidence?: number;
  details?: Record<string, any>;
};

// TODO: add error handling for malformed signal payloads
