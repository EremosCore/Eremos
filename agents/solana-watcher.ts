// agents/solana-watcher.ts

import { Agent } from "../types/agent";
import { Connection, PublicKey } from "@solana/web3.js";
import { SOLANA_RPC_URL } from "../utils/config";
import { generateSignalHash } from "../utils/signal";
import { logSignal } from "../utils/logger";

let connection: Connection;
let pollHandle: NodeJS.Timeout | null = null;
let lastFetched: string | null = null;

const WATCH_PROGRAM = new PublicKey("11111111111111111111111111111111");

// Emit a signal if a tx logs at least this many messages
const SIGNAL_THRESHOLD = 2;
// Poll interval
const POLL_INTERVAL = 1_000; // 1s

export const SolanaWatcher: Agent = {
  id: "agent-solana-watcher",
  name: "SolanaWatcher",
  role: "blockchain-monitor",
  glyph: "◎",
  watchType: "onchain_activity",
  triggerThreshold: SIGNAL_THRESHOLD,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "Monitors Solana for high-activity transactions using HTTP polling.",

  init: async () => {
    console.log(`[${SolanaWatcher.name}] Initializing with HTTP RPC: ${SOLANA_RPC_URL}`);
    connection = new Connection(SOLANA_RPC_URL, { commitment: "confirmed" });

    try {
      const version = await connection.getVersion();
      console.log(`[${SolanaWatcher.name}] Connected to Solana ${version["solana-core"]}`);
    } catch (error) {
      console.error(`[${SolanaWatcher.name}] Failed to connect`, error);
    }

    // Start polling loop
    pollHandle = setInterval(async () => {
      try {
        const sigs = await connection.getSignaturesForAddress(WATCH_PROGRAM, {
          limit: 5,
          before: lastFetched ?? undefined,
        });

        if (sigs.length === 0) return;

        // Process oldest → newest
        for (const sig of sigs.reverse()) {
          const tx = await connection.getParsedTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
            commitment: "confirmed",
          });

          if (tx?.meta?.logMessages) {
            SolanaWatcher.observe({
              type: "onchain_activity",
              payload: {
                signature: sig.signature,
                logs: tx.meta.logMessages,
                slot: tx.slot,
                err: tx.meta.err,
              },
            });
          }

          lastFetched = sig.signature;
        }
      } catch (err) {
        console.error(`[${SolanaWatcher.name}] Poll error:`, err);
      }
    }, POLL_INTERVAL);

    console.log(`[${SolanaWatcher.name}] Polling every ${POLL_INTERVAL / 1000}s for activity...`);
  },

  observe: (event) => {
    if (event?.type !== "onchain_activity") return;
    const { signature, logs, slot, err } = event.payload;
    if (err || !logs) return;

    if (logs.length >= SolanaWatcher.triggerThreshold) {
      const hash = generateSignalHash(event);
      logSignal({
        agent: SolanaWatcher.name,
        type: "high_activity_detected",
        glyph: SolanaWatcher.glyph,
        hash,
        timestamp: new Date().toISOString(),
        details: {
          signature,
          logCount: logs.length,
          slot,
          preview: logs.slice(0, 3),
        },
      });

      SolanaWatcher.lastSignal = hash;
    }
  },

  getMemory: () => [
    SolanaWatcher.lastSignal || "no_signals_yet",
    `lastFetched_${lastFetched}`,
    `watching_${WATCH_PROGRAM.toBase58()}`,
  ],

  cleanup: async () => {
    if (pollHandle) {
      clearInterval(pollHandle);
      console.log(`[${SolanaWatcher.name}] Polling stopped.`);
    }
  },
};

