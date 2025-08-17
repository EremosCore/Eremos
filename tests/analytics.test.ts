import { analytics } from '../utils/analytics';
import { generateDashboardData } from '../utils/dashboard';

test('analytics records signals correctly', () => {
  const signal = {
    id: 'test_123',
    agent: 'TestAgent',
    type: 'test_signal',
    confidence: 0.85,
    timestamp: new Date().toISOString(),
    hash: 'sig_test123'
  };

  analytics.recordSignal(signal);
  const metrics = analytics.getAgentMetrics();
  
  expect(metrics.length).toBeGreaterThan(0);
  const testAgent = metrics.find(m => m.agent === 'TestAgent');
  expect(testAgent).toBeDefined();
  expect(testAgent?.totalSignals).toBe(1);
});

test('dashboard data generates correctly', () => {
  const data = generateDashboardData();
  
  expect(data).toHaveProperty('overview');
  expect(data).toHaveProperty('agents');
  expect(data).toHaveProperty('recentActivity');
  expect(data).toHaveProperty('signalDistribution');
  
  expect(typeof data.overview.totalSignals).toBe('number');
  expect(Array.isArray(data.agents)).toBe(true);
});
