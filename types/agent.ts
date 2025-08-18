export type Agent = {
  id: string;
  name: string;
  role: string;
  glyph: string;
  watchType: string;
  triggerThreshold: number;
  lastSignal: string | null;
  originTimestamp: string;
  description: string;
  observe: (event: any) => void;
  getMemory?: () => string[];
};
