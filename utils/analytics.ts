import fs from 'fs';
import path from 'path';

export interface SignalRecord {
  id: string;
  agent: string;
  type: string;
  confidence?: number;
  timestamp: string;
  hash: string;
}

export interface AgentMetrics {
  agent: string;
  totalSignals: number;
  averageConfidence: number;
  signalTypes: Record<string, number>;
  lastActive: string;
  signalsToday: number;
}

class Analytics {
  private dataPath: string;
  private signals: SignalRecord[] = [];

  constructor() {
    this.dataPath = path.join(process.cwd(), 'data', 'analytics.json');
    this.ensureDataDir();
    this.loadSignals();
  }

  private ensureDataDir() {
    const dir = path.dirname(this.dataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private loadSignals() {
    try {
      if (fs.existsSync(this.dataPath)) {
        const data = fs.readFileSync(this.dataPath, 'utf-8');
        this.signals = JSON.parse(data);
      }
    } catch (error) {
      this.signals = [];
    }
  }

  private saveSignals() {
    fs.writeFileSync(this.dataPath, JSON.stringify(this.signals, null, 2));
  }

  recordSignal(signal: SignalRecord) {
    // Always add the signal, don't deduplicate
    this.signals.push({
      ...signal,
      id: `${signal.agent}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    this.saveSignals();
  }

  getAgentMetrics(): AgentMetrics[] {
    const agentMap = new Map<string, AgentMetrics>();
    const today = new Date().toDateString();

    this.signals.forEach(signal => {
      const agent = signal.agent;
      
      if (!agentMap.has(agent)) {
        agentMap.set(agent, {
          agent,
          totalSignals: 0,
          averageConfidence: 0,
          signalTypes: {},
          lastActive: signal.timestamp,
          signalsToday: 0
        });
      }

      const metrics = agentMap.get(agent)!;
      metrics.totalSignals++;
      
      if (signal.confidence) {
        const currentAvg = metrics.averageConfidence;
        metrics.averageConfidence = (currentAvg * (metrics.totalSignals - 1) + signal.confidence) / metrics.totalSignals;
      }

      metrics.signalTypes[signal.type] = (metrics.signalTypes[signal.type] || 0) + 1;
      
      if (new Date(signal.timestamp).toDateString() === today) {
        metrics.signalsToday++;
      }

      if (new Date(signal.timestamp) > new Date(metrics.lastActive)) {
        metrics.lastActive = signal.timestamp;
      }
    });

    return Array.from(agentMap.values());
  }

  getRecentSignals(limit: number = 50): SignalRecord[] {
    return this.signals
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getSignalsByType(): Record<string, number> {
    const typeMap: Record<string, number> = {};
    this.signals.forEach(signal => {
      typeMap[signal.type] = (typeMap[signal.type] || 0) + 1;
    });
    return typeMap;
  }

  getTotalSignals(): number {
    return this.signals.length;
  }
}

export const analytics = new Analytics();
