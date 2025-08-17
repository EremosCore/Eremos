import { Agent } from "../types/agent";
import { ethers } from "ethers";
import { ETH_RPC_URL } from "../utils/config";
import { generateSignalHash, createSignal } from "../utils/signal";
import { logSignal } from "../utils/logger";

let provider: ethers.JsonRpcProvider;
let pollHandle: NodeJS.Timeout | null = null;

const POLL_INTERVAL = 1_000; // 1s
const TX_THRESHOLD = 10;

export const EthereumWatcher: Agent = {
  id: "agent-ethereum-watcher",
  name: "EthereumWatcher",
  role: "blockchain-monitor",
  watchType: "onchain_activity",
  glyph: "Ξ",
  triggerThreshold: TX_THRESHOLD,
  lastSignal: null,
  originTimestamp: new Date().toISOString(),
  description: "Monitors Ethereum blocks with high transaction counts using HTTP polling.",

  init: async () => {
    provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
    const net = await provider.getNetwork();
    console.log(`[EthereumWatcher] Connected to Ethereum (chainId=${net.chainId})`);

    // Polling loop
    pollHandle = setInterval(async () => {
      try {
        const block = await provider.getBlock("latest", true); // include tx list
        if (!block) return;

        EthereumWatcher.observe({
          type: "onchain_activity",
          payload: {
            blockNumber: block.number,
            blockHash: block.hash,
            txCount: block.transactions.length,
          },
        });
      } catch (err) {
        console.error("[EthereumWatcher] Poll error:", err);
      }
    }, POLL_INTERVAL);

    console.log(`[EthereumWatcher] Polling every ${POLL_INTERVAL / 1000}s for blocks...`);
  },

  observe: (event) => {
    if (event?.type !== "onchain_activity") return;
    const { blockNumber, txCount, blockHash } = event.payload || {};

    if (typeof txCount !== "number") return;

    if (txCount >= EthereumWatcher.triggerThreshold) {
      const hash = generateSignalHash(event);

      const signal = createSignal({
        type: "high_block_activity",
        hash,
        timestamp: new Date().toISOString(),
        source: EthereumWatcher.name,
        details: { blockNumber, blockHash, txCount },
      });

      if (signal) {
        logSignal({
          agent: EthereumWatcher.name,
          type: signal.type,
          glyph: EthereumWatcher.glyph,
          hash: signal.hash,
          timestamp: signal.timestamp,
          details: signal.details,
        });
        EthereumWatcher.lastSignal = signal.hash;
      }
    }
  },

  getMemory: () => [
    EthereumWatcher.lastSignal || "no_signals_yet",
    "watching_ethereum_blocks",
  ],

  cleanup: async () => {
    if (pollHandle) {
      clearInterval(pollHandle);
      console.log("[EthereumWatcher] Polling stopped.");
    }
  },
};