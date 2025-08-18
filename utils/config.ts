import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific config
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${env}`);

// Load .env.{environment} first, then .env as fallback
dotenv.config({ path: envPath });
dotenv.config(); // fallback to .env

/**
 * Eremos Configuration Management
 * Type-safe environment configuration for the agent swarm
 */
export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  debug: process.env.DEBUG || '',

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
  },

  // Solana Blockchain Configuration
  solana: {
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    wsUrl: process.env.SOLANA_WS_URL || 'wss://api.mainnet-beta.solana.com',
    network: process.env.SOLANA_NETWORK || 'mainnet-beta',
    commitment: process.env.SOLANA_COMMITMENT || 'confirmed',
    
    // API Keys for premium endpoints
    alchemyApiKey: process.env.ALCHEMY_API_KEY,
    quicknodeApiKey: process.env.QUICKNODE_API_KEY,
    heliusApiKey: process.env.HELIUS_API_KEY,
  },

  // Agent Swarm Configuration
  agents: {
    logLevel: process.env.AGENT_LOG_LEVEL || 'info',
    signalThreshold: parseFloat(process.env.AGENT_SIGNAL_THRESHOLD || '0.7'),
    memoryLimit: parseInt(process.env.AGENT_MEMORY_LIMIT || '1000'),
    maxConcurrent: parseInt(process.env.AGENT_MAX_CONCURRENT || '10'),

    // Individual agent toggles
    enabled: {
      theron: process.env.THERON_ENABLED !== 'false',
      observer: process.env.OBSERVER_ENABLED !== 'false',
      harvester: process.env.HARVESTER_ENABLED !== 'false',
      launchTracker: process.env.LAUNCHTRACKER_ENABLED !== 'false',
      ghostWatcher: process.env.GHOSTWATCHER_ENABLED !== 'false',
    },
  },

  // Signal Processing Configuration
  signals: {
    batchSize: parseInt(process.env.SIGNAL_BATCH_SIZE || '100'),
    processingInterval: parseInt(process.env.SIGNAL_PROCESSING_INTERVAL || '5000'),
    confidenceMin: parseFloat(process.env.SIGNAL_CONFIDENCE_MIN || '0.5'),
    maxHistory: parseInt(process.env.MAX_SIGNAL_HISTORY || '10000'),
    logDetails: process.env.LOG_SIGNAL_DETAILS === 'true',
  },

  // Webhook & Alert Configuration
  webhooks: {
    general: process.env.WEBHOOK_URL,
    discord: process.env.DISCORD_WEBHOOK,
    slack: process.env.SLACK_WEBHOOK,
    telegram: {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    },
  },

  // Alert Thresholds
  alerts: {
    highConfidence: parseFloat(process.env.ALERT_HIGH_CONFIDENCE || '0.9'),
    clusterSize: parseInt(process.env.ALERT_CLUSTER_SIZE || '5'),
    fundingAmount: parseInt(process.env.ALERT_FUNDING_AMOUNT || '1000000000'),
  },

  // Performance & Rate Limiting
  performance: {
    rpcRateLimit: parseInt(process.env.RPC_RATE_LIMIT || '100'),
    rpcBatchSize: parseInt(process.env.RPC_BATCH_SIZE || '50'),
    rpcTimeout: parseInt(process.env.RPC_TIMEOUT || '30000'),
    memoryCleanupInterval: parseInt(process.env.MEMORY_CLEANUP_INTERVAL || '3600000'),
    maxWsConnections: parseInt(process.env.MAX_WS_CONNECTIONS || '5'),
    wsReconnectInterval: parseInt(process.env.WS_RECONNECT_INTERVAL || '5000'),
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'eremos-default-secret-change-in-production',
    apiRateLimit: parseInt(process.env.API_RATE_LIMIT || '1000'),
  },

  // Development & Testing
  development: {
    enableMockEvents: process.env.ENABLE_MOCK_EVENTS === 'true',
    enableStressTest: process.env.ENABLE_STRESS_TEST === 'true',
    testWalletAddress: process.env.TEST_WALLET_ADDRESS,
    testRpcEndpoint: process.env.TEST_RPC_ENDPOINT,
  },

  // Health Check Configuration
  healthCheck: {
    interval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
    timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000'),
  },

  // Container Configuration
  container: {
    memoryLimit: process.env.CONTAINER_MEMORY_LIMIT || '512m',
    cpuLimit: process.env.CONTAINER_CPU_LIMIT || '0.5',
  },
} as const;

/**
 * Configuration validation
 */
export const validateConfig = () => {
  const errors: string[] = [];

  // Validate required Solana configuration
  if (!config.solana.rpcUrl) {
    errors.push('SOLANA_RPC_URL is required');
  }

  // Validate signal thresholds
  if (config.agents.signalThreshold < 0 || config.agents.signalThreshold > 1) {
    errors.push('AGENT_SIGNAL_THRESHOLD must be between 0 and 1');
  }

  // Validate production requirements
  if (config.isProduction) {
    if (config.security.jwtSecret === 'eremos-default-secret-change-in-production') {
      errors.push('JWT_SECRET must be changed in production');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }

  return true;
};

/**
 * Get environment-specific configuration summary
 */
export const getConfigSummary = () => {
  return {
    environment: config.env,
    solana: {
      network: config.solana.network,
      rpcUrl: config.solana.rpcUrl.replace(/\/v2\/.*/, '/v2/***'),
    },
    agents: {
      enabled: Object.entries(config.agents.enabled)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name),
      signalThreshold: config.agents.signalThreshold,
    },
    features: {
      webhooks: !!config.webhooks.discord || !!config.webhooks.slack,
      mockEvents: config.development.enableMockEvents,
      debug: !!config.debug,
    },
  };
};

export default config;