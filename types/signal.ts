export type Signal = {
  // Required core fields for any signal
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;

  // Optional metadata
  confidence?: number; // 0..1 likelihood score
  details?: Record<string, any>; // arbitrary structured context
  source?: string; // upstream source identifier, if applicable
};

// TODO: add error handling for malformed signal payloads
