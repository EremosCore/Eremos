import { ExampleAgent } from '../agents/example';
import { Theron } from '../agents/theron';
import { LaunchTracker } from '../agents/launchtracker';

console.log('🎯 Running analytics demo...\n');

const mockEvents = [
  {
    type: "wallet_activity",
    source: "kraken",
    fundingDetected: true,
    deployDetected: true,
    bundleCount: 5,
    wallet: "9xS6...r4nD",
    timestamp: new Date().toISOString()
  },
  {
    type: "anomaly",
    severity: "high",
    pattern: "cluster_formation",
    timestamp: new Date().toISOString()
  },
  {
    type: "wallet_activity",
    address: "Bc4f2...o18",
    cluster: ["wallet1", "wallet2", "wallet3", "wallet4"],
    timestamp: new Date().toISOString()
  }
];

console.log('📊 Generating sample signals...');

mockEvents.forEach((event, index) => {
  setTimeout(() => {
    if (event.type === "wallet_activity" && event.source === "kraken") {
      LaunchTracker.observe(event);
    } else if (event.type === "anomaly") {
      Theron.observe(event);
    } else {
      ExampleAgent.observe(event);
    }
  }, index * 1000);
});

setTimeout(() => {
  console.log('\n✅ Demo complete! Check the analytics dashboard.');
  console.log('🚀 Run: npm run dashboard');
}, mockEvents.length * 1000 + 500);
