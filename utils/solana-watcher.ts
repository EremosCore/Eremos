import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { logSignal } from './logger';
import { generateSignalHash } from './signal';

export interface WalletActivityEvent {
    type: 'wallet_activity';
    wallet: string;
    txSignature: string;
    timestamp: string;
    balanceChange: number;
    programInteractions: string[];
    source?: 'cex' | 'unknown';
    fundingDetected?: boolean;
    deployDetected?: boolean;
    bundleCount?: number;
}

export class SolanaWatcher {
    private connection: Connection;
    private isRunning = false;
    private watchers: Map<string, NodeJS.Timeout> = new Map();

    constructor(rpcUrl: string) {
        this.connection = new Connection(rpcUrl, 'confirmed');
    }

    async start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('[SolanaWatcher] Starting blockchain monitoring...');
    }

    stop() {
        this.isRunning = false;
        this.watchers.forEach(timer => clearInterval(timer));
        this.watchers.clear();
        console.log('[SolanaWatcher] Stopped blockchain monitoring');
    }

    /**
     * Watch for large SOL transfers (potential whale activity)
     */
    watchLargeTransfers(thresholdSol: number = 100, callback: (event: WalletActivityEvent) => void) {
        const watcherId = `large-transfers-${thresholdSol}`;

        const timer = setInterval(async () => {
            try {
                const signatures = await this.connection.getSignaturesForAddress(
                    new PublicKey('11111111111111111111111111111112'), // System Program
                    { limit: 50 }
                );

                for (const sigInfo of signatures.slice(0, 10)) {
                    const tx = await this.connection.getParsedTransaction(sigInfo.signature);

                    if (tx && this.isLargeTransfer(tx, thresholdSol)) {
                        const event = this.createWalletActivityEvent(tx, sigInfo.signature);
                        callback(event);
                    }
                }
            } catch (error) {
                console.error('[SolanaWatcher] Error watching large transfers:', error);
            }
        }, 10000); // Check every 10 seconds

        this.watchers.set(watcherId, timer);
        console.log(`[SolanaWatcher] Watching for transfers > ${thresholdSol} SOL`);
    }

    /**
     * Watch specific wallet for activity
     */
    watchWallet(walletAddress: string, callback: (event: WalletActivityEvent) => void) {
        const watcherId = `wallet-${walletAddress}`;

        const timer = setInterval(async () => {
            try {
                const pubkey = new PublicKey(walletAddress);
                const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit: 5 });

                for (const sigInfo of signatures) {
                    const tx = await this.connection.getParsedTransaction(sigInfo.signature);

                    if (tx) {
                        const event = this.createWalletActivityEvent(tx, sigInfo.signature, walletAddress);
                        callback(event);
                    }
                }
            } catch (error) {
                console.error(`[SolanaWatcher] Error watching wallet ${walletAddress}:`, error);
            }
        }, 5000);

        this.watchers.set(watcherId, timer);
        console.log(`[SolanaWatcher] Watching wallet: ${walletAddress}`);
    }

    /**
     * Detect CEX funding patterns
     */
    async detectCexFunding(walletAddress: string): Promise<boolean> {
        try {
            const pubkey = new PublicKey(walletAddress);
            const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit: 10 });

            for (const sigInfo of signatures) {
                const tx = await this.connection.getParsedTransaction(sigInfo.signature);

                if (tx && this.isCexTransfer(tx)) {
                    return true;
                }
            }
            return false;
        } catch {
            return false;
        }
    }

    private isLargeTransfer(tx: ParsedTransactionWithMeta, thresholdSol: number): boolean {
        if (!tx.meta?.preBalances || !tx.meta?.postBalances) return false;

        for (let i = 0; i < tx.meta.preBalances.length; i++) {
            const preBalance = tx.meta.preBalances[i];
            const postBalance = tx.meta.postBalances[i];
            const change = Math.abs(postBalance - preBalance) / 1e9;

            if (change >= thresholdSol) {
                return true;
            }
        }
        return false;
    }

    private isCexTransfer(tx: ParsedTransactionWithMeta): boolean {
        // Known CEX addresses (simplified - would need comprehensive list)
        const knownCexAddresses = [
            'H8UekPGwePSmQ3ttuYGPU1szyFfjZR4N53rymSFwpLPm', // Kraken
            'GThUX1Atko4tqhN2NaiTazWSeFWMuiUiswPztRCJjBkE', // Kraken
            'FWuZS7s6wZj2nJQBQsAQ7q9j9s8ZePWKm2FQe6gKy8tV', // Coinbase
        ];

        return tx.transaction.message.accountKeys.some(key =>
            knownCexAddresses.includes(key.pubkey.toString())
        );
    }

    private createWalletActivityEvent(
        tx: ParsedTransactionWithMeta,
        signature: string,
        targetWallet?: string
    ): WalletActivityEvent {
        const balanceChange = this.calculateBalanceChange(tx);
        const programInteractions = this.extractProgramInteractions(tx);

        return {
            type: 'wallet_activity',
            wallet: targetWallet || tx.transaction.message.accountKeys[0]?.pubkey.toString() || 'unknown',
            txSignature: signature,
            timestamp: new Date().toISOString(),
            balanceChange,
            programInteractions,
            source: this.isCexTransfer(tx) ? 'cex' : 'unknown',
            fundingDetected: balanceChange > 0,
            deployDetected: programInteractions.includes('BPFLoaderUpgradeab1e11111111111111111111111'),
            bundleCount: tx.transaction.message.accountKeys.length
        };
    }

    private calculateBalanceChange(tx: ParsedTransactionWithMeta): number {
        if (!tx.meta?.preBalances || !tx.meta?.postBalances) return 0;

        let maxChange = 0;
        for (let i = 0; i < tx.meta.preBalances.length; i++) {
            const change = Math.abs(tx.meta.postBalances[i] - tx.meta.preBalances[i]) / 1e9;
            maxChange = Math.max(maxChange, change);
        }
        return maxChange;
    }

    private extractProgramInteractions(tx: ParsedTransactionWithMeta): string[] {
        return tx.transaction.message.instructions
            .map((inst: any) => inst.programId?.toString())
            .filter((id: string) => id && id !== '11111111111111111111111111111112');
    }
}

// Export singleton instance
export const solanaWatcher = new SolanaWatcher(
    process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
);