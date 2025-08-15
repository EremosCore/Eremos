import { Signal } from "../types/signal";

export interface CompositeSignal {
  type: string;
  confidence: number;
  contributingAgents: string[];
  pattern: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface CorrelationRule {
  id: string;
  name?: string;
  requiredSignals: string[];
  timeWindow: number; // milliseconds
  minConfidence: number;
  outputPattern: string;
  action?: (signals: Signal[]) => any;
}

export class AgentCoordinator {
  private signalBuffer: Signal[] = [];
  private readonly bufferSize: number;
  private readonly defaultTimeWindow = 60000; // 1 minute
  
  constructor(options?: { maxBufferSize?: number }) {
    this.bufferSize = options?.maxBufferSize || 1000;
  }
  
  private correlationRules: CorrelationRule[] = [
    {
      id: "cex_rapid_deploy",
      requiredSignals: ["cex_funding_detected", "rapid_deployment"],
      timeWindow: 30000, // 30 seconds
      minConfidence: 0.8,
      outputPattern: "coordinated_launch_pattern"
    },
    {
      id: "ghost_wallet_activation",
      requiredSignals: ["dormant_wallet_activated", "high_value_transaction"],
      timeWindow: 120000, // 2 minutes
      minConfidence: 0.75,
      outputPattern: "suspicious_reactivation"
    }
  ];

  registerSignal(signal: Partial<Signal> & { agent: string; type: string; confidence: number }): void {
    const fullSignal: Signal = {
      id: this.generateId(),
      hash: this.generateHash(),
      timestamp: new Date().toISOString(),
      glyph: "⊕", // coordination symbol
      source: signal.agent,
      ...signal
    };

    this.signalBuffer.push(fullSignal);
    
    // Maintain buffer size
    if (this.signalBuffer.length > this.bufferSize) {
      this.signalBuffer.shift();
    }

    // Check for correlations
    this.checkCorrelations();
  }

  correlateSignals(signalTypes: string[], timeWindow?: number): boolean {
    const window = timeWindow || this.defaultTimeWindow;
    const now = Date.now();
    
    const recentSignals = this.signalBuffer.filter(signal => {
      const signalTime = new Date(signal.timestamp).getTime();
      return (now - signalTime) <= window;
    });

    // Check if all required signal types are present
    const foundTypes = new Set(recentSignals.map(s => s.type));
    return signalTypes.every(type => foundTypes.has(type));
  }

  emitCompositeSignal(composite: Omit<CompositeSignal, 'timestamp'>): CompositeSignal {
    const fullComposite: CompositeSignal = {
      ...composite,
      timestamp: new Date().toISOString()
    };

    console.log(`[Coordinator] 🔗 Composite signal detected: ${composite.type}`);
    console.log(`├─ Pattern: ${composite.pattern}`);
    console.log(`├─ Confidence: ${composite.confidence}`);
    console.log(`├─ Contributing agents: ${composite.contributingAgents.join(', ')}`);
    
    if (composite.metadata) {
      console.log(`├─ Metadata:`, JSON.stringify(composite.metadata, null, 2));
    }

    return fullComposite;
  }

  private checkCorrelations(): any {
    const results = [];
    
    for (const rule of this.correlationRules) {
      if (this.correlateSignals(rule.requiredSignals, rule.timeWindow)) {
        const relevantSignals = this.getRelevantSignals(rule.requiredSignals, rule.timeWindow);
        const avgConfidence = this.calculateAverageConfidence(relevantSignals);
        
        if (avgConfidence >= rule.minConfidence) {
          const composite = this.emitCompositeSignal({
            type: rule.outputPattern,
            confidence: Math.min(avgConfidence * 1.1, 1.0), // Boost for correlation
            contributingAgents: [...new Set(relevantSignals.map(s => s.source))],
            pattern: rule.id,
            metadata: {
              ruleId: rule.id,
              triggerSignals: relevantSignals.map(s => ({ type: s.type, hash: s.hash }))
            }
          });
          
          results.push(composite);
          
          // Execute action if defined
          if (rule.action) {
            rule.action(relevantSignals);
          }
        }
      }
    }
    
    return results.length > 0 ? results[0] : null;
  }

  private getRelevantSignals(signalTypes: string[], timeWindow: number): Signal[] {
    const now = Date.now();
    return this.signalBuffer.filter(signal => {
      const signalTime = new Date(signal.timestamp).getTime();
      return (now - signalTime) <= timeWindow && signalTypes.includes(signal.type);
    });
  }

  private calculateAverageConfidence(signals: Signal[]): number {
    if (signals.length === 0) return 0;
    const sum = signals.reduce((acc, signal) => acc + (signal.confidence || 0), 0);
    return sum / signals.length;
  }

  private generateId(): string {
    return `coord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateHash(): string {
    return `sig_coord_${Math.random().toString(36).substr(2, 10)}`;
  }

  addCorrelationRule(rule: CorrelationRule): void {
    this.correlationRules.push(rule);
  }

  getActiveSignals(timeWindow: number = this.defaultTimeWindow): Signal[] {
    const now = Date.now();
    return this.signalBuffer.filter(signal => {
      const signalTime = new Date(signal.timestamp).getTime();
      return (now - signalTime) <= timeWindow;
    });
  }

  getSignalStats(): { total: number; unique_types: number; agents: number } {
    const types = new Set(this.signalBuffer.map(s => s.type));
    const agents = new Set(this.signalBuffer.map(s => s.source));
    
    return {
      total: this.signalBuffer.length,
      unique_types: types.size,
      agents: agents.size
    };
  }

  // Additional methods expected by tests
  processSignal(signal: Signal): any {
    this.signalBuffer.push(signal);
    
    // Maintain buffer size
    if (this.signalBuffer.length > this.bufferSize) {
      this.signalBuffer.shift();
    }

    // Check for correlations and return any results
    return this.checkCorrelations();
  }

  getActiveRules(): CorrelationRule[] {
    return this.correlationRules;
  }

  getStats(): any {
    const stats = this.getSignalStats();
    return {
      bufferedSignals: stats.total,
      uniqueSignalTypes: stats.unique_types,
      activeAgents: stats.agents,
      correlationRules: this.correlationRules.length,
      bufferUtilization: (stats.total / this.bufferSize) * 100
    };
  }
}
