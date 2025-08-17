import * as dotenv from "dotenv";
dotenv.config();

/**
 * Solana RPC URL
 */
export const SOLANA_RPC_URL =
  process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";

if (!process.env.SOLANA_RPC_URL) {
  console.warn(" SOLANA_RPC_URL not found in .env, defaulting to public mainnet endpoint (rate limited).");
}

/**
 * Ethereum RPC URL
 */
export const ETH_RPC_URL =
  process.env.ETH_RPC_URL || "https://eth.llamarpc.com";

if (!process.env.ETH_RPC_URL) {
  console.warn("ETH_RPC_URL not found in .env, using free public RPC (may be unreliable).");
}

/**
 * Polling defaults
 */
export const DEFAULT_POLL_INTERVAL = Number(process.env.POLL_INTERVAL || 10_000); // 10s
export const DEFAULT_ACTIVITY_THRESHOLD = Number(process.env.ACTIVITY_THRESHOLD || 5); // generic fallback