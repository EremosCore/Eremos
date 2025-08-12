import { AnomalyEvent, WalletActivityEvent } from "../types/event";

export function parseAnomalyEvent(event: any): AnomalyEvent | null {
  if (
    typeof event !== "object" ||
    event === null ||
    !("type" in event) ||
    (event as any).type !== "anomaly"
  ) {
    return null;
  }

  return {
    type: "anomaly"
  };
}


export function parseWalletActivityEvent(event: any): WalletActivityEvent | null {
  if (
    typeof event !== "object" ||
    event === null ||
    !("type" in event) ||
    (event as any).type !== "wallet_activity"
  ) {
    return null;
  }

  return {
    type: "wallet_activity",
    address: event.address || "",
    timestamp: event.timestamp || Date.now(),
    cluster: event.cluster || undefined,
    txCount: event.txCount || undefined,
    volume: event.volume || undefined,
    source: event.source || undefined,
    fundingDetected: event.fundingDetected || undefined,
    deployDetected: event.deployDetected || undefined,
    bundleCount: event.bundleCount || undefined,
    confidence: event.confidence || undefined,
    blockHeight: event.blockHeight || undefined,
    txHash: event.txHash || undefined,
  };
}