export type Signal = {
  type: string;
  payload: any;
  timestamp: number;
  source: string;
};

// New real-time event types for streaming
export type BlockchainEvent = {
  id: string;
  type: "block" | "transaction" | "contract_event" | "mempool" | "wallet_activity";
  chainId: number;
  timestamp: number;
  source: "ethereum" | "polygon" | "arbitrum" | "optimism";
  data: BlockEvent | TransactionEvent | ContractEvent | MempoolEvent | WalletActivityEvent;
  priority: "low" | "medium" | "high" | "critical";
};

export type BlockEvent = {
  blockNumber: number;
  blockHash: string;
  timestamp: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
};

export type TransactionEvent = {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasUsed: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  input: string;
  nonce: number;
};

export type ContractEvent = {
  contractAddress: string;
  eventName: string;
  eventSignature: string;
  topics: string[];
  data: string;
  transactionHash: string;
  logIndex: number;
};

export type MempoolEvent = {
  transactionHash: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  timestamp: number;
  pending: boolean;
};

export type WalletActivityEvent = {
  address: string;
  balanceChange: string;
  transactionCount: number;
  lastActivity: number;
  clusterId?: string;
  fundingSource?: "cex" | "dex" | "bridge" | "unknown";
  anomalyScore?: number;
};

// Event correlation types
export type EventCorrelation = {
  correlationId: string;
  events: string[]; // Array of event IDs
  pattern: string;
  confidence: number;
  timestamp: number;
  agents: string[];
};
