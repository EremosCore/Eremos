import { analytics, AgentMetrics } from './analytics';

export function generateDashboardData() {
  const agentMetrics = analytics.getAgentMetrics();
  const recentSignals = analytics.getRecentSignals(20);
  const signalsByType = analytics.getSignalsByType();
  const totalSignals = analytics.getTotalSignals();

  return {
    overview: {
      totalSignals,
      activeAgents: agentMetrics.length,
      avgConfidence: calculateOverallConfidence(agentMetrics),
      signalsToday: agentMetrics.reduce((sum, agent) => sum + agent.signalsToday, 0)
    },
    agents: agentMetrics,
    recentActivity: recentSignals,
    signalDistribution: signalsByType
  };
}

function calculateOverallConfidence(metrics: AgentMetrics[]): number {
  const withConfidence = metrics.filter(m => m.averageConfidence > 0);
  if (withConfidence.length === 0) return 0;
  
  const sum = withConfidence.reduce((acc, m) => acc + m.averageConfidence, 0);
  return Math.round((sum / withConfidence.length) * 100) / 100;
}

export function getTopPerformers(limit: number = 5): AgentMetrics[] {
  return analytics.getAgentMetrics()
    .sort((a, b) => {
      if (a.averageConfidence !== b.averageConfidence) {
        return b.averageConfidence - a.averageConfidence;
      }
      return b.totalSignals - a.totalSignals;
    })
    .slice(0, limit);
}
