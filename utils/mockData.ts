// Solana-specific mock data generator for testing agents
// Simulates pump.fun token launches, rug pulls, and suspicious wallet activity

interface MockWallet {
  address: string;
  type: 'cex' | 'fresh' | 'dev' | 'bot' | 'normal';
  fundingSource?: string;
}

interface MockSolanaEvent {
  type: 'wallet_funding' | 'token_creation' | 'pump_interaction' | 'wallet_activity' | 'bundle_activity';
  timestamp: string;
  signature: string;
  wallet?: string;
  token?: string;
  amount?: number;
  confidence?: number;
  metadata?: any;
}

// Mock Solana wallet addresses (realistic format)
const MOCK_WALLETS: MockWallet[] = [
  // CEX wallets (known exchange addresses)
  { address: 'DjVE6JNiYqPL2QXyCjtBN8WBo7y6Hgg2gVgzYECEkxRE', type: 'cex', fundingSource: 'binance' },
  { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', type: 'cex', fundingSource: 'coinbase' },
  { address: 'HsYh6QjpkgfbEoZNbCXRRCLqwn35x9i3VZDKoEKtANe7', type: 'cex', fundingSource: 'kraken' },
  
  // Fresh wallets (newly funded)
  { address: '6YxkPmTrBvZHh8S5g7QK9P2M8cNf4vRLjWxE3dCr2XzA', type: 'fresh' },
  { address: 'AcZm2vN8fH4pK7wR9xLy3bQe5sT1jY6uM9dP0gX2cV8B', type: 'fresh' },
  { address: 'BpY3nQ9cTx7hV2mK5wP8rZ4sL6fG0jH9dA1eC3xN7M5E', type: 'fresh' },
  
  // Dev wallets (suspicious)
  { address: 'DevZ8nK2mP5hT7wQ9vL3fG6sR4jY1xC0bA9eN2dX8M7V', type: 'dev' },
  { address: 'ScamG5hY8nP2vM4wK7rL9sZ3fX6jC1bA0eR4dQ9mT2H', type: 'dev' },
  
  // Bot wallets (bundled activity)
  { address: 'BotX7mL9hP5vQ2wK8rN4sF3jY6eC1bT0dA9gZ7nM5Lx', type: 'bot' },
  { address: 'BotY4nF7hM2vP9wL5rK8sQ3jX6eB1cT0dA7gN4mZ9Ly', type: 'bot' },
  { address: 'BotZ1mQ9hL5vN2wP8rF4sK3jY6eX1bC0dT7gM4nZ8Mx', type: 'bot' }
];

// Mock pump.fun token addresses
const PUMP_FUN_TOKENS = [
  'pump1TokenScamZ9x7Y2hN4mP8vQ5wL3rK6sF9jC2bA0e',
  'pump2RugPullM5hT8nP2vK7wQ9rL4sZ6fY3jC0bA1e',
  'pump3HoneyPotL7mQ9hP5vN2wK8rF4sL3jY6eC1bT0',
  'pump4SafeMoonN2wP9hL5vM8rQ4sK7fX3jY6eB1cT9',
  'pump5ShibaDogeP8rQ4sK7fX3jY6eB1cT9dA5mN2wH'
];

// Generate realistic Solana signatures
function generateSolanaSignature(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate mock CEX funding event
export function generateCexFunding(): MockSolanaEvent {
  const cexWallet = MOCK_WALLETS.filter(w => w.type === 'cex')[Math.floor(Math.random() * 3)];
  const freshWallet = MOCK_WALLETS.filter(w => w.type === 'fresh')[Math.floor(Math.random() * 3)];
  
  return {
    type: 'wallet_funding',
    timestamp: new Date().toISOString(),
    signature: generateSolanaSignature(),
    wallet: freshWallet.address,
    amount: Math.random() * 50 + 10, // 10-60 SOL
    confidence: 0.85 + Math.random() * 0.15, // High confidence for CEX funding
    metadata: {
      source: cexWallet.fundingSource,
      sourceWallet: cexWallet.address,
      fundingPattern: 'cex_withdrawal'
    }
  };
}

// Generate mock pump.fun interaction
export function generatePumpFunInteraction(): MockSolanaEvent {
  const wallet = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
  const token = PUMP_FUN_TOKENS[Math.floor(Math.random() * PUMP_FUN_TOKENS.length)];
  
  return {
    type: 'pump_interaction',
    timestamp: new Date().toISOString(),
    signature: generateSolanaSignature(),
    wallet: wallet.address,
    token: token,
    confidence: wallet.type === 'fresh' ? 0.9 : 0.6, // Fresh wallets more suspicious
    metadata: {
      program: 'pump.fun',
      action: Math.random() > 0.5 ? 'create_token' : 'buy_token',
      walletType: wallet.type
    }
  };
}

// Generate mock token creation event
export function generateTokenCreation(): MockSolanaEvent {
  const devWallet = MOCK_WALLETS.filter(w => w.type === 'dev')[Math.floor(Math.random() * 2)];
  const token = PUMP_FUN_TOKENS[Math.floor(Math.random() * PUMP_FUN_TOKENS.length)];
  
  return {
    type: 'token_creation',
    timestamp: new Date().toISOString(),
    signature: generateSolanaSignature(),
    wallet: devWallet.address,
    token: token,
    confidence: 0.75 + Math.random() * 0.25,
    metadata: {
      tokenName: `SCAM${Math.floor(Math.random() * 1000)}`,
      symbol: `SC${Math.floor(Math.random() * 100)}`,
      supply: Math.floor(Math.random() * 1000000000) + 1000000,
      timeSinceCreation: Math.floor(Math.random() * 300) + 5 // 5-305 seconds
    }
  };
}

// Generate coordinated bot activity (suspicious bundled transactions)
export function generateBundleActivity(): MockSolanaEvent {
  const botWallets = MOCK_WALLETS.filter(w => w.type === 'bot');
  const token = PUMP_FUN_TOKENS[Math.floor(Math.random() * PUMP_FUN_TOKENS.length)];
  
  return {
    type: 'bundle_activity',
    timestamp: new Date().toISOString(),
    signature: generateSolanaSignature(),
    token: token,
    confidence: 0.95, // Very high confidence for coordinated activity
    metadata: {
      walletCount: botWallets.length,
      coordinatedWallets: botWallets.map(w => w.address),
      timeWindow: '5s', // All transactions within 5 seconds
      pattern: 'coordinated_buy',
      suspiciousScore: 0.98
    }
  };
}

// Generate random wallet activity
export function generateWalletActivity(): MockSolanaEvent {
  const wallet = MOCK_WALLETS[Math.floor(Math.random() * MOCK_WALLETS.length)];
  
  return {
    type: 'wallet_activity',
    timestamp: new Date().toISOString(),
    signature: generateSolanaSignature(),
    wallet: wallet.address,
    confidence: Math.random() * 0.5 + 0.3, // Lower confidence for general activity
    metadata: {
      action: ['transfer', 'swap', 'stake', 'create_account'][Math.floor(Math.random() * 4)],
      walletType: wallet.type,
      amount: Math.random() * 10 + 0.1
    }
  };
}

// Generate a realistic sequence of pump.fun scam events
export function generateScamSequence(): MockSolanaEvent[] {
  const events: MockSolanaEvent[] = [];
  const baseTime = Date.now();
  
  // 1. CEX funding (fresh wallet gets funded)
  const funding = generateCexFunding();
  funding.timestamp = new Date(baseTime).toISOString();
  events.push(funding);
  
  // 2. Token creation (4 seconds later)
  const creation = generateTokenCreation();
  creation.timestamp = new Date(baseTime + 4000).toISOString();
  events.push(creation);
  
  // 3. Bundle activity (8 seconds after creation)
  const bundle = generateBundleActivity();
  bundle.timestamp = new Date(baseTime + 12000).toISOString();
  events.push(bundle);
  
  // 4. Pump.fun interactions (spread over next 30 seconds)
  for (let i = 0; i < 5; i++) {
    const interaction = generatePumpFunInteraction();
    interaction.timestamp = new Date(baseTime + 15000 + (i * 6000)).toISOString();
    events.push(interaction);
  }
  
  return events;
}

// Get random event generator
export function getRandomEventGenerator(): () => MockSolanaEvent {
  const generators = [
    generateCexFunding,
    generatePumpFunInteraction,
    generateTokenCreation,
    generateBundleActivity,
    generateWalletActivity
  ];
  
  return generators[Math.floor(Math.random() * generators.length)];
}