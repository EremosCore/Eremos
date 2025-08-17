import { ExampleAgent } from '../agents/example';
import { Theron } from '../agents/theron';
import { LaunchTracker } from '../agents/launchtracker';
import { Observer } from '../agents/observer';
import { Harvester } from '../agents/harvester';
import { GhostWatcher } from '../agents/skieró';

console.log('🎯 Populating dashboard with diverse signals...\n');

const scenarios = [
  // Launch detection scenario
  {
    agent: LaunchTracker,
    event: {
      type: "wallet_activity",
      source: "kraken",
      fundingDetected: true,
      deployDetected: true,
      bundleCount: 7,
      wallet: "9xS6...r4nD",
      timestamp: new Date().toISOString()
    }
  },
  // High-value mint scenario  
  {
    agent: Harvester,
    event: {
      type: "mint_activity",
      amount: 25,
      collection: "DeGods",
      timestamp: new Date().toISOString()
    }
  },
  // Wallet clustering scenario
  {
    agent: Observer,
    event: {
      type: "wallet_activity",
      address: "Bc4f2...o18",
      cluster: ["wallet1", "wallet2", "wallet3", "wallet4", "wallet5"],
      timestamp: new Date().toISOString()
    }
  },
  // Ghost wallet reactivation
  {
    agent: GhostWatcher,
    event: {
      type: "reactivation",
      walletAgeDays: 240,
      lastActivity: "2024-01-15",
      timestamp: new Date().toISOString()
    }
  },
  // Anomaly detection
  {
    agent: Theron,
    event: {
      type: "anomaly",
      severity: "high",
      pattern: "coordinated_funding",
      timestamp: new Date().toISOString()
    }
  }
];

console.log('📊 Generating realistic signals...');

scenarios.forEach((scenario, index) => {
  setTimeout(() => {
    console.log(`   → Processing scenario ${index + 1}/${scenarios.length}`);
    scenario.agent.observe(scenario.event);
  }, index * 800);
});

setTimeout(() => {
  console.log('\n✨ Dashboard populated with diverse data!');
  console.log('🚀 Visit: http://localhost:3001');
  console.log('💡 Refresh the page to see the updated analytics\n');
}, scenarios.length * 800 + 500);
