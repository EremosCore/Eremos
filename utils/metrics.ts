const metrics: Record<string, number> = {};

interface PerformanceMetrics {
  calls: number;
  totalExecutionTime: number;
  signalsEmitted: number;
  averageExecutionTime: number;
  memoryUsage: number;
}

const performanceMetrics: Record<string, PerformanceMetrics> = {};

export function recordCall(agentId: string) {
  metrics[agentId] = (metrics[agentId] || 0) + 1;
}

export function getCallCount(agentId: string): number {
  return metrics[agentId] || 0;
}

export function startPerformanceTracking(agentId: string): number {
  return performance.now();
}

export function endPerformanceTracking(agentId: string, startTime: number, signalEmitted: boolean = false) {
  const executionTime = performance.now() - startTime;
  
  if (!performanceMetrics[agentId]) {
    performanceMetrics[agentId] = {
      calls: 0,
      totalExecutionTime: 0,
      signalsEmitted: 0,
      averageExecutionTime: 0,
      memoryUsage: 0
    };
  }

  const metrics = performanceMetrics[agentId];
  metrics.calls += 1;
  metrics.totalExecutionTime += executionTime;
  metrics.averageExecutionTime = metrics.totalExecutionTime / metrics.calls;
  
  if (signalEmitted) {
    metrics.signalsEmitted += 1;
  }

  // Track memory usage (approximate)
  try {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      metrics.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    }
  } catch (error) {
    // Fallback for environments without process object
    metrics.memoryUsage = 0;
  }
}

export function getPerformanceMetrics(agentId: string): PerformanceMetrics | null {
  return performanceMetrics[agentId] || null;
}

export function getAllPerformanceMetrics(): Record<string, PerformanceMetrics> {
  return performanceMetrics;
}

export function logPerformanceReport() {
  console.log('\n🔍 Agent Performance Report:');
  console.log('================================');
  
  Object.entries(performanceMetrics).forEach(([agentId, metrics]: [string, PerformanceMetrics]) => {
    console.log(`\n📊 ${agentId}:`);
    console.log(`  Calls: ${metrics.calls}`);
    console.log(`  Avg Execution: ${metrics.averageExecutionTime.toFixed(2)}ms`);
    console.log(`  Signals Emitted: ${metrics.signalsEmitted}`);
    console.log(`  Signal Rate: ${((metrics.signalsEmitted / metrics.calls) * 100).toFixed(1)}%`);
    console.log(`  Memory: ${metrics.memoryUsage.toFixed(2)}MB`);
  });
  
  console.log('\n================================\n');
}
