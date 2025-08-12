export type WalletActivityEvent = {
  type: "wallet_activity";
  address: string;
  timestamp: number;
  cluster?: string[];
  txCount?: number;
  volume?: number;
  source?: "solana" | "kraken" | "coinbase" | "binance";
  fundingDetected?: boolean;
  deployDetected?: boolean;
  bundleCount?: number;
  confidence?: number;
  blockHeight?: number;
  txHash?: string;
};

export type WalletReactivationEvent = {
  type: "reactivation";
  address: string;
  timestamp: number;
  walletAgeDays: number;
  source?: string;
  confidence?: number;
};

export type Signal = {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
};
