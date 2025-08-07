import { Theron } from '../agents/theron';

const mockEvent = {
  type: 'wallet_activity',
  wallet: '0x4f2...e18',
  txCount: 6,
  timestamp: new Date().toISOString(),
};

Theron.observe(mockEvent);
