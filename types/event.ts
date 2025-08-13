export type WalletActivityEvent = {
  type: "wallet_activity";
  address: string;
  timestamp: number;
  cluster?: string[];
};

export type Signal = {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
};

export interface LPOperation {
  poolId: string;
  walletAddress: string;
  timestamp: number;
  tickOrBin: number;
  operationType: "add" | "remove";
  amount: number;
}

export interface LiquidityEvent {
  type: "liquidity_operations";
  poolId: string;
  walletAddress: string;
  tickOrBin: number;
  operationType: "add" | "remove";
  amount: number;
}
