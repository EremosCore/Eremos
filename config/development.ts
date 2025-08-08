/**
 * Development Configuration for Eremos
 *
 * This file contains all configuration settings for development mode.
 * Copy and modify as needed for your environment.
 */

export interface EremosConfig {
  // Core settings
  app: {
    name: string;
    version: string;
    port: number;
    environment: 'development' | 'staging' | 'production';
  };

  // Solana configuration
  solana: {
    rpcUrl: string;
    wsUrl: string;
    network: string;
    commitment: string;
    backupRpcUrl?: string;
  };

  // Agent configuration
  agents: {
    swarmSize: number;
    heartbeatInterval: number;
    memoryTTL: number;
    defaultTriggerThreshold: number;
    minConfidenceScore: number;
    maxConfidenceScore: number;
    memoryLimit: number;
    memoryCleanupInterval: number;
  };

  // Signal processing
  signals: {
    batchSize: number;
    processingInterval: number;
    retentionDays: number;
    minConfidence: number;
    maxAgeHours: number;
  };

  // Logging and monitoring
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'text';
    metricsEnabled: boolean;
    metricsPort: number;
    healthCheckEnabled: boolean;
    healthCheckPort: number;
  };

  // Database configuration
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };

  // Redis configuration
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };

  // Security settings
  security: {
    apiKeyRequired: boolean;
    apiKey?: string;
    corsOrigin: string;
    rateLimitEnabled: boolean;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };

  // Development tools
  development: {
    devModeEnabled: boolean;
    devAgentName: string;
    devEventInterval: number;
    devDurationSeconds: number;
    testModeEnabled: boolean;
    testAgentCount: number;
    testEventCount: number;
  };

  // External integrations
  integrations: {
    webhookEnabled: boolean;
    webhookUrl?: string;
    webhookSecret?: string;
    discordWebhookUrl?: string;
    slackWebhookUrl?: string;
    telegramBotToken?: string;
  };

  // Performance tuning
  performance: {
    eventBatchSize: number;
    eventProcessingTimeout: number;
    eventQueueSize: number;
    memoryCleanupInterval: number;
    memoryMaxSizeMB: number;
  };

  // Feature flags
  features: {
    agentCommunication: boolean;
    signalAggregation: boolean;
    memoryPersistence: boolean;
    metricsCollection: boolean;
    healthChecks: boolean;
  };

  // Debug settings
  debug: {
    enabled: boolean;
    agents: string[];
    signals: boolean;
    memory: boolean;
    traceEnabled: boolean;
    traceSampleRate: number;
  };
}

export const developmentConfig: EremosConfig = {
  app: {
    name: 'Eremos',
    version: '0.1.0',
    port: 3000,
    environment: 'development',
  },

  solana: {
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    wsUrl: 'wss://api.mainnet-beta.solana.com',
    network: 'mainnet-beta',
    commitment: 'confirmed',
    backupRpcUrl: 'https://solana-api.projectserum.com',
  },

  agents: {
    swarmSize: 5,
    heartbeatInterval: 30000,
    memoryTTL: 3600000,
    defaultTriggerThreshold: 0.8,
    minConfidenceScore: 0.6,
    maxConfidenceScore: 1.0,
    memoryLimit: 1000,
    memoryCleanupInterval: 3600000,
  },

  signals: {
    batchSize: 100,
    processingInterval: 1000,
    retentionDays: 30,
    minConfidence: 0.5,
    maxAgeHours: 24,
  },

  logging: {
    level: 'info',
    format: 'json',
    metricsEnabled: true,
    metricsPort: 9090,
    healthCheckEnabled: true,
    healthCheckPort: 8080,
  },

  database: {
    host: 'localhost',
    port: 5432,
    name: 'eremos',
    user: 'eremos_user',
    password: 'your_secure_password',
  },

  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
    db: 0,
  },

  security: {
    apiKeyRequired: false,
    apiKey: 'your_api_key_here',
    corsOrigin: '*',
    rateLimitEnabled: true,
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 100,
  },

  development: {
    devModeEnabled: true,
    devAgentName: 'observer',
    devEventInterval: 1000,
    devDurationSeconds: 30,
    testModeEnabled: false,
    testAgentCount: 3,
    testEventCount: 100,
  },

  integrations: {
    webhookEnabled: false,
    webhookUrl: 'https://your-webhook-endpoint.com/eremos',
    webhookSecret: 'your_webhook_secret',
    discordWebhookUrl: undefined,
    slackWebhookUrl: undefined,
    telegramBotToken: undefined,
  },

  performance: {
    eventBatchSize: 50,
    eventProcessingTimeout: 5000,
    eventQueueSize: 1000,
    memoryCleanupInterval: 300000,
    memoryMaxSizeMB: 512,
  },

  features: {
    agentCommunication: true,
    signalAggregation: true,
    memoryPersistence: true,
    metricsCollection: true,
    healthChecks: true,
  },

  debug: {
    enabled: false,
    agents: ['theron', 'observer'],
    signals: true,
    memory: true,
    traceEnabled: false,
    traceSampleRate: 0.1,
  },
};

export default developmentConfig;
