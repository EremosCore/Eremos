import { Signal } from "../types/signal";

export interface SignalMetrics {
  totalSignals: number;
  signalsByType: Record<string, number>;
  signalsByAgent: Record<string, number>;
  signalsBySource: Record<string, number>;
  averageConfidence: number;
  signalsPerHour: number;
  signalRate: number;
  confidenceDistribution: {
    low: number;
    medium: number; 
    high: number;
  };
  agentMetrics: Record<string, {
    count: number;
    averageConfidence: number;
  }>;
  averageSignalRate: number;
  topPatterns: Array<{ pattern: string; count: number; confidence: number }>;
  timeRange: { start: string; end: string };
}

export interface AlertRule {
  id: string;
  name: string;
  condition: (signal: Signal) => boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  cooldown: number; // milliseconds
  enabled: boolean;
  description: string;
}

export class SignalAnalytics {
  private signals: Signal[] = [];
  private alertRules: AlertRule[] = [];
  private lastAlerts: Record<string, number> = {};
  private maxSignals = 10000; // Keep last 10k signals

  constructor() {
    this.setupDefaultAlertRules();
  }

  addSignal(signal: Signal): any[] {
    this.signals.push(signal);
    
    // Maintain signal limit
    if (this.signals.length > this.maxSignals) {
      this.signals.shift();
    }

    // Check alert rules and return triggered alerts
    return this.checkAlerts(signal);
  }

  getMetrics(timeWindow?: number): SignalMetrics {
    const now = Date.now();
    const windowMs = timeWindow || 24 * 60 * 60 * 1000; // Default 24 hours
    
    const relevantSignals = this.signals.filter(signal => {
      const signalTime = new Date(signal.timestamp).getTime();
      return (now - signalTime) <= windowMs;
    });

    const signalsByType: Record<string, number> = {};
    const signalsByAgent: Record<string, number> = {};
    const signalsBySource: Record<string, number> = {};
    const agentMetrics: Record<string, { count: number; averageConfidence: number }> = {};
    const patterns: Record<string, { count: number; totalConfidence: number }> = {};
    const confidenceDistribution = { low: 0, medium: 0, high: 0 };
    let totalConfidence = 0;
    let confidenceCount = 0;

    relevantSignals.forEach(signal => {
      // Count by type
      signalsByType[signal.type] = (signalsByType[signal.type] || 0) + 1;
      
      // Count by agent
      const agent = signal.agent || signal.source;
      signalsByAgent[agent] = (signalsByAgent[agent] || 0) + 1;
      signalsBySource[signal.source] = (signalsBySource[signal.source] || 0) + 1;
      
      // Track agent metrics
      if (!agentMetrics[agent]) {
        agentMetrics[agent] = { count: 0, averageConfidence: 0 };
      }
      agentMetrics[agent].count++;
      
      // Track confidence
      if (signal.confidence !== undefined) {
        totalConfidence += signal.confidence;
        confidenceCount++;
        
        // Confidence distribution
        if (signal.confidence >= 0.8) confidenceDistribution.high++;
        else if (signal.confidence >= 0.7) confidenceDistribution.medium++;
        else confidenceDistribution.low++;
        
        // Update agent average confidence
        const currentTotal = agentMetrics[agent].averageConfidence * (agentMetrics[agent].count - 1);
        agentMetrics[agent].averageConfidence = (currentTotal + signal.confidence) / agentMetrics[agent].count;
      }

      // Track patterns (if metadata contains pattern info)
      const pattern = signal.metadata?.pattern || signal.type;
      if (!patterns[pattern]) {
        patterns[pattern] = { count: 0, totalConfidence: 0 };
      }
      patterns[pattern].count++;
      if (signal.confidence !== undefined) {
        patterns[pattern].totalConfidence += signal.confidence;
      }
    });

    const topPatterns = Object.entries(patterns)
      .map(([pattern, data]) => ({
        pattern,
        count: data.count,
        confidence: data.count > 0 ? data.totalConfidence / data.count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const earliestSignal = relevantSignals[0]?.timestamp || new Date().toISOString();
    const latestSignal = relevantSignals[relevantSignals.length - 1]?.timestamp || new Date().toISOString();
    
    const hoursInWindow = windowMs / (1000 * 60 * 60);
    const signalsPerHour = relevantSignals.length / hoursInWindow;
    const signalRate = relevantSignals.length / (windowMs / 1000); // signals per second
    const averageSignalRate = signalRate * 60; // signals per minute

    return {
      totalSignals: relevantSignals.length,
      signalsByType,
      signalsByAgent,
      signalsBySource,
      averageConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
      signalsPerHour,
      signalRate,
      confidenceDistribution,
      agentMetrics,
      averageSignalRate,
      topPatterns,
      timeRange: { start: earliestSignal, end: latestSignal }
    };
  }

  addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule);
  }

  enableAlert(ruleId: string): void {
    const rule = this.alertRules.find(r => r.id === ruleId);
    if (rule) rule.enabled = true;
  }

  disableAlert(ruleId: string): void {
    const rule = this.alertRules.find(r => r.id === ruleId);
    if (rule) rule.enabled = false;
  }

  private checkAlerts(signal: Signal): any[] {
    const now = Date.now();
    const triggeredAlerts: any[] = [];
    
    this.alertRules.forEach(rule => {
      if (!rule.enabled) return;
      
      // Check cooldown
      const lastAlert = this.lastAlerts[rule.id] || 0;
      if (now - lastAlert < rule.cooldown) return;
      
      // Check condition
      if (rule.condition(signal)) {
        const alert = this.triggerAlert(rule, signal);
        triggeredAlerts.push(alert);
        this.lastAlerts[rule.id] = now;
      }
    });
    
    return triggeredAlerts;
  }

  private triggerAlert(rule: AlertRule, signal: Signal): any {
    const priority = rule.priority.toUpperCase();
    const emoji = this.getPriorityEmoji(rule.priority);
    
    console.log(`\n${emoji} ALERT [${priority}]: ${rule.name}`);
    console.log(`├─ Rule: ${rule.description}`);
    console.log(`├─ Triggered by: ${signal.type} from ${signal.source}`);
    console.log(`├─ Signal hash: ${signal.hash}`);
    console.log(`├─ Timestamp: ${signal.timestamp}`);
    
    if (signal.confidence !== undefined) {
      console.log(`├─ Confidence: ${signal.confidence}`);
    }
    
    if (signal.metadata) {
      console.log(`└─ Metadata:`, JSON.stringify(signal.metadata, null, 2));
    }
    
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      priority: rule.priority,
      signal: signal,
      triggeredAt: new Date().toISOString()
    };
  }

  private getPriorityEmoji(priority: string): string {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  }

  private setupDefaultAlertRules(): void {
    this.alertRules = [
      {
        id: 'high_confidence_launch',
        name: 'High Confidence Launch Detection',
        condition: (signal) => 
          signal.type === 'launch_detected' && 
          (signal.confidence || 0) > 0.9,
        priority: 'high',
        cooldown: 30000, // 30 seconds
        enabled: true,
        description: 'Triggers when a launch is detected with >90% confidence'
      },
      {
        id: 'coordinated_pattern',
        name: 'Coordinated Pattern Alert',
        condition: (signal) => 
          signal.type === 'coordinated_launch_pattern' || 
          signal.type === 'suspicious_reactivation',
        priority: 'critical',
        cooldown: 60000, // 1 minute
        enabled: true,
        description: 'Triggers on coordinated or suspicious wallet patterns'
      },
      {
        id: 'ghost_wallet_activity',
        name: 'Ghost Wallet Reactivation',
        condition: (signal) => 
          signal.type === 'dormant_wallet_activated' && 
          (signal.metadata?.dormancyDays || 0) > 180,
        priority: 'medium',
        cooldown: 120000, // 2 minutes
        enabled: true,
        description: 'Triggers when wallets dormant for >180 days become active'
      },
      {
        id: 'rapid_deployment_burst',
        name: 'Rapid Deployment Burst',
        condition: (signal) => 
          signal.type === 'rapid_deployment' && 
          (signal.metadata?.deploysPerMinute || 0) > 5,
        priority: 'medium',
        cooldown: 180000, // 3 minutes
        enabled: true,
        description: 'Triggers when >5 contracts deployed per minute from same wallet'
      }
    ];
  }

  exportMetrics(format: 'json' | 'csv' | 'object' = 'object'): any {
    const metrics = this.getMetrics();
    const exportData = {
      ...metrics,
      timestamp: new Date().toISOString()
    };
    
    if (format === 'json') {
      return JSON.stringify(exportData, null, 2);
    }
    
    if (format === 'object') {
      return exportData;
    }
    
    // CSV format
    const csvLines = [
      'metric,value',
      `total_signals,${metrics.totalSignals}`,
      `average_confidence,${metrics.averageConfidence.toFixed(3)}`,
      `signals_per_hour,${metrics.signalsPerHour.toFixed(2)}`,
      '',
      'signal_type,count',
      ...Object.entries(metrics.signalsByType).map(([type, count]) => `${type},${count}`),
      '',
      'agent,count',
      ...Object.entries(metrics.signalsByAgent).map(([agent, count]) => `${agent},${count}`)
    ];
    
    return csvLines.join('\n');
  }

  getRecentSignals(limit: number = 50): Signal[] {
    return this.signals.slice(-limit);
  }

  getSignalTrends(hours: number = 24): Array<{ hour: string; count: number; avgConfidence: number }> {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const trends: Array<{ hour: string; count: number; avgConfidence: number }> = [];
    
    for (let i = hours - 1; i >= 0; i--) {
      const hourStart = now - (i + 1) * hourMs;
      const hourEnd = now - i * hourMs;
      
      const hourSignals = this.signals.filter(signal => {
        const signalTime = new Date(signal.timestamp).getTime();
        return signalTime >= hourStart && signalTime < hourEnd;
      });
      
      const avgConfidence = hourSignals.length > 0 
        ? hourSignals.reduce((sum, s) => sum + (s.confidence || 0), 0) / hourSignals.length
        : 0;
      
      trends.push({
        hour: new Date(hourStart).toISOString().slice(0, 13) + ':00',
        count: hourSignals.length,
        avgConfidence
      });
    }
    
    return trends;
  }

  // Additional methods expected by tests
  recordSignal(signal: Signal): void {
    this.addSignal(signal);
  }

  getTimeSeriesData(metric: string, windowMs: number): any[] {
    const now = Date.now();
    const intervals = 10;
    const intervalMs = windowMs / intervals;
    const result = [];

    for (let i = 0; i < intervals; i++) {
      const start = now - windowMs + (i * intervalMs);
      const end = start + intervalMs;
      
      const intervalSignals = this.signals.filter(signal => {
        const signalTime = new Date(signal.timestamp).getTime();
        return signalTime >= start && signalTime < end;
      });

      let value = 0;
      if (metric === 'confidence') {
        value = intervalSignals.length > 0 
          ? intervalSignals.reduce((sum, s) => sum + (s.confidence || 0), 0) / intervalSignals.length
          : 0;
      } else if (metric === 'count') {
        value = intervalSignals.length;
      }

      result.push({
        timestamp: new Date(start).toISOString(),
        value
      });
    }

    return result;
  }

  setMaxHistorySize(size: number): void {
    this.maxSignals = size;
    if (this.signals.length > size) {
      this.signals = this.signals.slice(-size);
    }
  }

  getActiveAlerts(): any[] {
    return this.alertRules.filter(rule => rule.enabled);
  }

  removeAlertRule(ruleId: string): void {
    this.alertRules = this.alertRules.filter(rule => rule.id !== ruleId);
    delete this.lastAlerts[ruleId];
  }

  exportData(): any {
    return {
      signals: this.signals,
      metrics: this.getMetrics(),
      alertRules: this.alertRules,
      exportedAt: new Date().toISOString()
    };
  }

  reset(): void {
    this.signals = [];
    this.lastAlerts = {};
  }

  analyzeTrends(): any {
    const metrics = this.getMetrics();
    const hourlyTrends = this.getSignalTrends(24);
    
    return {
      overall: metrics,
      hourly: hourlyTrends,
      trending: {
        mostActiveAgent: Object.entries(metrics.signalsByAgent)
          .sort(([,a], [,b]) => b - a)[0],
        mostCommonType: Object.entries(metrics.signalsByType)
          .sort(([,a], [,b]) => b - a)[0],
        averageConfidenceTrend: hourlyTrends.map(h => h.avgConfidence)
      }
    };
  }
}
