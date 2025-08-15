#!/usr/bin/env tsx
/**
 * Eremos Agent Swarm Demo
 * 
 * This script demonstrates the complete Eremos agent framework with:
 * - Individual agent signal detection
 * - Cross-agent coordination
 * - Real-time analytics and alerting
 * 
 * Run with: npm run demo
 */

import { agents } from "../agents";
import { AgentCoordinator } from "../utils/coordinator";
import { SignalAnalytics } from "../utils/analytics";
import { generateSignalHash } from "../utils/signal";

class EremosDemo {
  private coordinator = new AgentCoordinator();
  private analytics = new SignalAnalytics();
  private eventCounter = 0;

  constructor() {
    this.setupCustomAlerts();
    console.log("🚀 Eremos Agent Swarm Demo Starting...\n");
    this.printAgentInfo();
  }

  private setupCustomAlerts(): void {
    // Add demo-specific alert
    this.analytics.addAlertRule({
      id: 'demo_high_activity',
      name: 'High Activity Demo Alert',
      condition: (signal) => signal.metadata?.isDemo === true,
      priority: 'medium',
      cooldown: 5000, // 5 seconds
      enabled: true,
      description: 'Demo alert for high activity patterns'
    });
  }

  private printAgentInfo(): void {
    console.log("📋 Active Agents:");
    agents.forEach(agent => {
      console.log(`   ${agent.glyph} ${agent.name} (${agent.role}) - ${agent.description}`);
    });
    console.log("");
  }

  simulateWalletActivity(): void {
    console.log("💰 Simulating wallet activity...");
    
    // Simulate CEX funding detection
    const cexEvent = {
      type: "wallet_activity",
      wallet: "6Yxk8vP9x2M8",
      source: "kraken",
      fundingDetected: true,
      deployDetected: false,
      bundleCount: 0,
      value: 50000
    };

    // LaunchTracker processes the event
    const launchAgent = agents.find(a => a.name === "LaunchTracker");
    if (launchAgent) {
      console.log(`   ${launchAgent.glyph} LaunchTracker detecting CEX funding...`);
      launchAgent.observe(cexEvent);
      
      // Register with coordinator
      this.coordinator.registerSignal({
        agent: "LaunchTracker",
        type: "cex_funding_detected",
        confidence: 0.85,
        metadata: { wallet: cexEvent.wallet, source: cexEvent.source, isDemo: true }
      });
    }

    // Simulate rapid deployment
    setTimeout(() => {
      console.log("⚡ Simulating rapid contract deployment...");
      
      const deployEvent = {
        type: "wallet_activity",
        wallet: "6Yxk8vP9x2M8",
        cluster: ["addr1", "addr2", "addr3", "addr4", "addr5"],
        deployDetected: true,
        contracts: ["pump.fun"]
      };

      // Observer processes the event
      const observer = agents.find(a => a.name === "Observer");
      if (observer) {
        console.log(`   ${observer.glyph} Observer detecting rapid deployment...`);
        observer.observe(deployEvent);
        
        // Register with coordinator
        this.coordinator.registerSignal({
          agent: "Observer",
          type: "rapid_deployment",
          confidence: 0.78,
          metadata: { wallet: deployEvent.wallet, contracts: deployEvent.contracts, isDemo: true }
        });
      }
    }, 2000);

    // Simulate analytics tracking
    setTimeout(() => {
      console.log("📊 Generating analytics...");
      this.generateAnalytics();
    }, 4000);
  }

  simulateGhostWallet(): void {
    console.log("\n👻 Simulating ghost wallet reactivation...");
    
    const ghostEvent = {
      type: "wallet_activity",
      wallet: "3Bv7x2K9p1X7",
      lastActivity: "2023-12-01T00:00:00Z", // Old activity
      value: 250000,
      suddenReactivation: true
    };

    // Theron (memory vault) processes historical data
    const theron = agents.find(a => a.name === "Theron");
    if (theron) {
      console.log(`   ${theron.glyph} Theron archiving ghost wallet pattern...`);
      theron.observe({ type: "anomaly", wallet: ghostEvent.wallet });
    }

    // Add to analytics
    this.analytics.addSignal({
      type: "dormant_wallet_activated",
      hash: generateSignalHash('dormant_wallet_activated'),
      timestamp: new Date().toISOString(),
      source: "GhostWatcher",
      confidence: 0.82,
      metadata: { 
        wallet: ghostEvent.wallet, 
        dormancyDays: 256, 
        isDemo: true 
      }
    });
  }

  private generateAnalytics(): void {
    // Add some sample signals for demo
    const sampleSignals = [
      { type: "launch_detected", agent: "LaunchTracker", confidence: 0.91 },
      { type: "rapid_deployment", agent: "Observer", confidence: 0.84 },
      { type: "mint_activity", agent: "Harvester", confidence: 0.76 },
      { type: "archival", agent: "Theron", confidence: 0.88 }
    ];

    sampleSignals.forEach(signal => {
      this.analytics.addSignal({
        type: signal.type,
        hash: generateSignalHash(signal.type),
        timestamp: new Date().toISOString(),
        source: signal.agent,
        confidence: signal.confidence,
        metadata: { isDemo: true }
      });
    });

    // Display metrics
    const metrics = this.analytics.getMetrics();
    console.log("\n📈 Current Swarm Metrics:");
    console.log(`   Total Signals: ${metrics.totalSignals}`);
    console.log(`   Average Confidence: ${metrics.averageConfidence.toFixed(3)}`);
    console.log(`   Signals/Hour: ${metrics.signalsPerHour.toFixed(1)}`);
    console.log(`   Active Agents: ${Object.keys(metrics.signalsByAgent).length}`);
    
    console.log("\n🔥 Top Patterns:");
    metrics.topPatterns.slice(0, 3).forEach(pattern => {
      console.log(`   ${pattern.pattern}: ${pattern.count} signals (${pattern.confidence.toFixed(3)} avg confidence)`);
    });

    // Show recent trends
    const trends = this.analytics.getSignalTrends(1);
    console.log(`\n📊 Last Hour: ${trends[0]?.count || 0} signals detected`);
  }

  async runDemo(): Promise<void> {
    console.log("🎯 Starting coordinated wallet analysis...\n");
    
    // Run wallet activity simulation
    this.simulateWalletActivity();
    
    // Wait and run ghost wallet simulation
    setTimeout(() => {
      this.simulateGhostWallet();
    }, 6000);
    
    // Final summary
    setTimeout(() => {
      console.log("\n🏁 Demo Complete!");
      console.log("   ✅ Agent coordination demonstrated");
      console.log("   ✅ Signal analytics working");
      console.log("   ✅ Alert system active");
      console.log("   ✅ Cross-agent pattern detection enabled");
      
      console.log("\n💡 Next steps:");
      console.log("   - Run individual agents: npm run agents:list");
      console.log("   - Export agent memory: npm run agents:export");
      console.log("   - Check test coverage: npm test");
      console.log("   - Review architecture: docs/architecture.md");
    }, 8000);
  }
}

// Run the demo
if (require.main === module) {
  const demo = new EremosDemo();
  demo.runDemo().catch(console.error);
}

export { EremosDemo };
