import { Agent } from "../types/agent";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";
import { solanaWatcher, WalletActivityEvent } from "../utils/solana-watcher";
import { shouldEmit } from "../utils/throttle";

// Helper function to calculate launch confidence
function calculateLaunchConfidence(event: WalletActivityEvent): number {
    let confidence = 0.3;

    if (event.source === 'cex') confidence += 0.3;
    if (event.balanceChange > 10) confidence += 0.2;
    if (event.deployDetected) confidence += 0.25;
    if (event.programInteractions.length > 3) confidence += 0.15;
    if (event.bundleCount && event.bundleCount > 5) confidence += 0.1;

    return Math.min(confidence, 1.0);
}

export const RealLaunchTracker: Agent = {
    id: "agent-launch-real",
    name: "RealLaunchTracker",
    role: "live_launch_monitor",
    watchType: "wallet_activity",
    glyph: "Σ",
    triggerThreshold: 0.8,
    lastSignal: null,
    originTimestamp: new Date().toISOString(),

    description:
        "REAL blockchain monitoring for token launches. Detects CEX-funded wallets, rapid deployments, and coordinated launch patterns using live Solana data.",

    observe: (event: WalletActivityEvent) => {
        if (event.type === "wallet_activity") {
            const confidence = calculateLaunchConfidence(event);

            if (confidence >= RealLaunchTracker.triggerThreshold) {
                const hash = generateSignalHash(event);

                if (shouldEmit(RealLaunchTracker.id, 60000)) {
                    logSignal({
                        agent: RealLaunchTracker.name,
                        type: "launch_detected",
                        glyph: "Σ",
                        hash,
                        timestamp: new Date().toISOString(),
                        details: {
                            wallet: event.wallet,
                            confidence,
                            txSignature: event.txSignature,
                            balanceChange: event.balanceChange,
                            source: event.source,
                            bundleCount: event.bundleCount,
                            programs: event.programInteractions
                        }
                    });

                    RealLaunchTracker.lastSignal = hash;
                }
            }
        }
    },

    startMonitoring: () => {
        console.log(`[${RealLaunchTracker.name}] Starting live blockchain monitoring...`);

        solanaWatcher.watchLargeTransfers(5, (event) => {
            RealLaunchTracker.observe(event);
        });

        solanaWatcher.start();
    },

    stopMonitoring: () => {
        console.log(`[${RealLaunchTracker.name}] Stopping blockchain monitoring...`);
        solanaWatcher.stop();
    },

    getMemory: () => {
        return [
            `last_signal: ${RealLaunchTracker.lastSignal}`,
            `monitoring_started: ${RealLaunchTracker.originTimestamp}`,
            `confidence_threshold: ${RealLaunchTracker.triggerThreshold}`
        ];
    }
};