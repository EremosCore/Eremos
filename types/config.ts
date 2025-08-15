// types/config.ts
export interface AgentConfig {
  id: string;
  triggerThreshold: number;
  passive?: boolean;
  logLevel?: "info" | "warn" | "debug";
}

export interface RippleConfig {
  windowMs: number;
  minOps: number;
  minUniqueWallets: number;
  bandGap: number;
  bandMaxWidth: number;
  minLpSize: number;
  maxLpSize: number;
  debounceMs: number;
  triggerResonance: number;
  analysisInterval: number;
}
