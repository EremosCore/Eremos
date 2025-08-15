import { RealLaunchTracker } from "../agents/real-launch-tracker";
import { debug } from "../utils/debug";

async function startRealMonitoring() {
    console.log("🚀 Starting Eremos Real Blockchain Monitoring");
    console.log("===============================================");

    if (!process.env.SOLANA_RPC_URL) {
        console.error("❌ SOLANA_RPC_URL not configured. Check your .env file.");
        process.exit(1);
    }

    console.log("\n📡 Initializing Blockchain Monitoring:");
    console.log(`├─ ${RealLaunchTracker.name} (${RealLaunchTracker.id})`);
    console.log(`├─ Confidence Threshold: ${RealLaunchTracker.triggerThreshold}`);
    console.log(`└─ Watch Type: ${RealLaunchTracker.watchType}`);

    RealLaunchTracker.startMonitoring?.();

    console.log("\n🎯 Active Monitoring:");
    console.log("├─ Large SOL transfers (>5 SOL)");
    console.log("├─ CEX funding detection");
    console.log("└─ Launch pattern analysis");

    console.log("\n✅ Eremos is now monitoring Solana blockchain");
    console.log("Press Ctrl+C to stop monitoring\n");

    process.on('SIGINT', () => {
        console.log("\n🛑 Shutting down monitoring...");
        RealLaunchTracker.stopMonitoring?.();
        process.exit(0);
    });
}

startRealMonitoring().catch(error => {
    console.error("❌ Failed to start monitoring:", error);
    process.exit(1);
});