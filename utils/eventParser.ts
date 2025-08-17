import { WalletEvent } from "../types/event";

export function parseWalletEvent(event: WalletEvent): WalletEvent {
  return {
    wallet: event.wallet || "unknown",
    txCount: event.txCount || 0,
    timestamp: event.timestamp || new Date().toISOString(),
  };
}
