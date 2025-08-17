export type Signal = {
  type: string;
  hash: string;
  timestamp: string;
  source: string;
};
export type SignalLog = {
  agent: string;
  type: string;
  glyph: string;
  hash: string;
  timestamp: string;
  details?: Record<string, any>;
}

