/**
 * Mock Data Generator for Agent Testing
 * Generates realistic blockchain event data for testing agent behavior
 */

export interface MockWalletActivity {
  type: 'wallet_activity';
  timestamp: string;
  address: string;
  amount: number;
  source?: string;
  fundingDetected?: boolean;
  deployDetected?: boolean;
  bundleCount?: number;
  cluster?: string[];
}

export interface MockMintActivity {
  type: 'mint_activity';
  timestamp: string;
  collection: string;
  mintCount: number;
  minter: string;
  price?: number;
  gasUsed?: number;
}

export interface MockLiquidityActivity {
  type: 'liquidity_activity';
  timestamp: string;
  poolAddress: string;
  amount: number;
  token0: string;
  token1: string;
  action: 'add' | 'remove' | 'swap';
  priceImpact?: number;
}

export interface MockGovernanceActivity {
  type: 'governance_activity';
  timestamp: string;
  proposalId: string;
  dao: string;
  proposalType: 'standard' | 'critical' | 'emergency';
  votingPower: number;
  action: 'created' | 'voted' | 'executed';
}

export interface MockSecurityEvent {
  type: 'security_event';
  timestamp: string;
  walletAddress: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  eventType: 'suspicious_pattern' | 'large_transfer' | 'contract_interaction' | 'exploit_detected';
  details: Record<string, any>;
}

export interface MockAnomalyEvent {
  type: 'anomaly';
  timestamp: string;
  pattern: string;
  confidence: number;
  affectedAddresses: string[];
  metadata: Record<string, any>;
}

export type MockEvent = 
  | MockWalletActivity 
  | MockMintActivity 
  | MockLiquidityActivity 
  | MockGovernanceActivity 
  | MockSecurityEvent 
  | MockAnomalyEvent;

export class MockDataGenerator {
  private readonly WALLET_ADDRESSES = [
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b1',
    '0x8ba1f109551bD432803012645Hac136c22C501e',
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    '0xA0b86a33E6441E8e5c3ecE5c3E5c5c5c5c5c5c5c',
    '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  ];

  private readonly COLLECTION_ADDRESSES = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // BAYC
    '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', // MAYC
    '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B', // CloneX
    '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e', // Doodles
    '0x23581767a106ae21c074b2276D25e5C3e136a68b'  // Moonbirds
  ];

  private readonly POOL_ADDRESSES = [
    '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640', // USDC/ETH
    '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8', // USDC/ETH 0.3%
    '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36', // ETH/USDT
    '0x11b815efB8f581194ae79006d24E0d814B7697F6', // WETH/USDT
    '0x60594a405d53811d3BC4766596EFD80fd545A270'  // ETH/DAI
  ];

  private readonly DAO_NAMES = [
    'Uniswap',
    'Compound',
    'Aave',
    'MakerDAO',
    'Curve',
    'Yearn',
    'SushiSwap',
    'Balancer'
  ];

  private readonly CEX_SOURCES = [
    'binance',
    'coinbase',
    'kraken',
    'okx',
    'bybit',
    'kucoin'
  ];

  /**
   * Generate mock wallet activity events
   */
  generateWalletActivity(count: number = 10, options: Partial<MockWalletActivity> = {}): MockWalletActivity[] {
    const events: MockWalletActivity[] = [];
    
    for (let i = 0; i < count; i++) {
      const baseEvent: MockWalletActivity = {
        type: 'wallet_activity',
        timestamp: this.randomTimestamp(),
        address: this.randomChoice(this.WALLET_ADDRESSES),
        amount: this.randomAmount(100, 100000),
        ...options
      };

      // Add random additional properties
      if (Math.random() > 0.7) {
        baseEvent.source = this.randomChoice(this.CEX_SOURCES);
        baseEvent.fundingDetected = Math.random() > 0.5;
        baseEvent.deployDetected = Math.random() > 0.6;
        baseEvent.bundleCount = Math.floor(Math.random() * 10) + 1;
      }

      if (Math.random() > 0.8) {
        baseEvent.cluster = this.randomChoice(this.WALLET_ADDRESSES, Math.floor(Math.random() * 5) + 2);
      }

      events.push(baseEvent);
    }

    return events;
  }

  /**
   * Generate mock mint activity events
   */
  generateMintActivity(count: number = 10, options: Partial<MockMintActivity> = {}): MockMintActivity[] {
    const events: MockMintActivity[] = [];
    
    for (let i = 0; i < count; i++) {
      const event: MockMintActivity = {
        type: 'mint_activity',
        timestamp: this.randomTimestamp(),
        collection: this.randomChoice(this.COLLECTION_ADDRESSES),
        mintCount: Math.floor(Math.random() * 50) + 1,
        minter: this.randomChoice(this.WALLET_ADDRESSES),
        price: this.randomAmount(0.01, 5),
        gasUsed: Math.floor(Math.random() * 200000) + 50000,
        ...options
      };

      events.push(event);
    }

    return events;
  }

  /**
   * Generate mock liquidity activity events
   */
  generateLiquidityActivity(count: number = 10, options: Partial<MockLiquidityActivity> = {}): MockLiquidityActivity[] {
    const events: MockLiquidityActivity[] = [];
    const actions: Array<'add' | 'remove' | 'swap'> = ['add', 'remove', 'swap'];
    
    for (let i = 0; i < count; i++) {
      const event: MockLiquidityActivity = {
        type: 'liquidity_activity',
        timestamp: this.randomTimestamp(),
        poolAddress: this.randomChoice(this.POOL_ADDRESSES),
        amount: this.randomAmount(1000, 1000000),
        token0: 'USDC',
        token1: 'ETH',
        action: this.randomChoice(actions),
        priceImpact: Math.random() * 10,
        ...options
      };

      events.push(event);
    }

    return events;
  }

  /**
   * Generate mock governance activity events
   */
  generateGovernanceActivity(count: number = 10, options: Partial<MockGovernanceActivity> = {}): MockGovernanceActivity[] {
    const events: MockGovernanceActivity[] = [];
    const proposalTypes: Array<'standard' | 'critical' | 'emergency'> = ['standard', 'critical', 'emergency'];
    const actions: Array<'created' | 'voted' | 'executed'> = ['created', 'voted', 'executed'];
    
    for (let i = 0; i < count; i++) {
      const event: MockGovernanceActivity = {
        type: 'governance_activity',
        timestamp: this.randomTimestamp(),
        proposalId: `prop-${Math.floor(Math.random() * 1000)}`,
        dao: this.randomChoice(this.DAO_NAMES),
        proposalType: this.randomChoice(proposalTypes),
        votingPower: this.randomAmount(1000, 100000),
        action: this.randomChoice(actions),
        ...options
      };

      events.push(event);
    }

    return events;
  }

  /**
   * Generate mock security events
   */
  generateSecurityEvents(count: number = 10, options: Partial<MockSecurityEvent> = {}): MockSecurityEvent[] {
    const events: MockSecurityEvent[] = [];
    const riskLevels: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
    const eventTypes: Array<'suspicious_pattern' | 'large_transfer' | 'contract_interaction' | 'exploit_detected'> = 
      ['suspicious_pattern', 'large_transfer', 'contract_interaction', 'exploit_detected'];
    
    for (let i = 0; i < count; i++) {
      const event: MockSecurityEvent = {
        type: 'security_event',
        timestamp: this.randomTimestamp(),
        walletAddress: this.randomChoice(this.WALLET_ADDRESSES),
        riskLevel: this.randomChoice(riskLevels),
        eventType: this.randomChoice(eventTypes),
        details: {
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          gasPrice: Math.floor(Math.random() * 100) + 20,
          value: this.randomAmount(0.1, 1000)
        },
        ...options
      };

      events.push(event);
    }

    return events;
  }

  /**
   * Generate mock anomaly events
   */
  generateAnomalyEvents(count: number = 10, options: Partial<MockAnomalyEvent> = {}): MockAnomalyEvent[] {
    const events: MockAnomalyEvent[] = [];
    const patterns = [
      'unusual_gas_pattern',
      'coordinated_activity',
      'flash_loan_pattern',
      'sandwich_attack',
      'mev_extraction',
      'wash_trading'
    ];
    
    for (let i = 0; i < count; i++) {
      const event: MockAnomalyEvent = {
        type: 'anomaly',
        timestamp: this.randomTimestamp(),
        pattern: this.randomChoice(patterns),
        confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        affectedAddresses: this.randomChoice(this.WALLET_ADDRESSES, Math.floor(Math.random() * 5) + 1),
        metadata: {
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          networkId: 1,
          severity: Math.random() > 0.5 ? 'high' : 'medium'
        },
        ...options
      };

      events.push(event);
    }

    return events;
  }

  /**
   * Generate mixed events for comprehensive testing
   */
  generateMixedEvents(count: number = 50): MockEvent[] {
    const events: MockEvent[] = [];
    const eventTypes = [
      'wallet_activity',
      'mint_activity', 
      'liquidity_activity',
      'governance_activity',
      'security_event',
      'anomaly'
    ];

    for (let i = 0; i < count; i++) {
      const eventType = this.randomChoice(eventTypes);
      
      switch (eventType) {
        case 'wallet_activity':
          events.push(...this.generateWalletActivity(1));
          break;
        case 'mint_activity':
          events.push(...this.generateMintActivity(1));
          break;
        case 'liquidity_activity':
          events.push(...this.generateLiquidityActivity(1));
          break;
        case 'governance_activity':
          events.push(...this.generateGovernanceActivity(1));
          break;
        case 'security_event':
          events.push(...this.generateSecurityEvents(1));
          break;
        case 'anomaly':
          events.push(...this.generateAnomalyEvents(1));
          break;
      }
    }

    // Sort by timestamp
    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Generate scenario-specific test data
   */
  generateScenario(scenario: 'launch_detection' | 'mint_surge' | 'liquidity_drain' | 'governance_attack'): MockEvent[] {
    switch (scenario) {
      case 'launch_detection':
        return this.generateLaunchDetectionScenario();
      case 'mint_surge':
        return this.generateMintSurgeScenario();
      case 'liquidity_drain':
        return this.generateLiquidityDrainScenario();
      case 'governance_attack':
        return this.generateGovernanceAttackScenario();
      default:
        return [];
    }
  }

  private generateLaunchDetectionScenario(): MockEvent[] {
    const events: MockEvent[] = [];
    const launchWallet = this.WALLET_ADDRESSES[0];
    
    // Funding from CEX
    events.push(...this.generateWalletActivity(3, {
      address: launchWallet,
      source: 'kraken',
      fundingDetected: true,
      amount: this.randomAmount(50000, 100000)
    }));

    // Contract deployment
    events.push(...this.generateWalletActivity(1, {
      address: launchWallet,
      deployDetected: true,
      bundleCount: 5
    }));

    return events;
  }

  private generateMintSurgeScenario(): MockEvent[] {
    const collection = this.COLLECTION_ADDRESSES[0];
    return this.generateMintActivity(20, {
      collection,
      mintCount: this.randomAmount(15, 50)
    });
  }

  private generateLiquidityDrainScenario(): MockEvent[] {
    const pool = this.POOL_ADDRESSES[0];
    return this.generateLiquidityActivity(10, {
      poolAddress: pool,
      action: 'remove',
      amount: this.randomAmount(500000, 2000000)
    });
  }

  private generateGovernanceAttackScenario(): MockEvent[] {
    const dao = this.DAO_NAMES[0];
    return this.generateGovernanceActivity(5, {
      dao,
      proposalType: 'critical',
      votingPower: this.randomAmount(100000, 500000)
    });
  }

  // Utility methods
  private randomChoice<T>(array: T[], count?: number): T | T[] {
    if (count !== undefined) {
      const shuffled = [...array].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  private randomAmount(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomTimestamp(daysBack: number = 7): string {
    const now = new Date();
    const pastTime = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
    return pastTime.toISOString();
  }
}

// Export singleton instance
export const mockDataGenerator = new MockDataGenerator();