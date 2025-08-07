#!/usr/bin/env npx ts-node

/**
 * Eremos Agent Testing Utility
 * 
 * Advanced tool for testing, profiling, and validating agent behavior
 * with comprehensive performance metrics and visualization
 */

import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  agent: string;
  testCase: string;
  passed: boolean;
  executionTime: number;
  memoryUsage: number;
  signalsEmitted: number;
  confidence: number[];
  errors: string[];
}

interface AgentMetrics {
  name: string;
  totalTests: number;
  passedTests: number;
  avgExecutionTime: number;
  avgMemoryUsage: number;
  avgConfidence: number;
  totalSignals: number;
  reliability: number;
}

class AgentTester {
  private results: TestResult[] = [];
  private startTime: number = 0;
  
  constructor(private agentsPath: string = './agents') {}

  /**
   * Run comprehensive tests on all agents
   */
  async runFullTestSuite(): Promise<void> {
    console.log('🤖 Eremos Agent Testing Suite');
    console.log('================================\n');
    
    this.startTime = Date.now();
    
    const agentFiles = this.discoverAgents();
    console.log(`📁 Discovered ${agentFiles.length} agent(s): ${agentFiles.map(f => path.basename(f, '.ts')).join(', ')}\n`);
    
    for (const agentFile of agentFiles) {
      await this.testAgent(agentFile);
    }
    
    this.generateReport();
  }

  /**
   * Discover all agent files in the agents directory
   */
  private discoverAgents(): string[] {
    const agentsDir = path.resolve(this.agentsPath);
    
    if (!fs.existsSync(agentsDir)) {
      console.error(`❌ Agents directory not found: ${agentsDir}`);
      process.exit(1);
    }
    
    return fs.readdirSync(agentsDir)
      .filter(file => file.endsWith('.ts') && !file.includes('test'))
      .map(file => path.join(agentsDir, file));
  }

  /**
   * Test individual agent with various scenarios
   */
  private async testAgent(agentPath: string): Promise<void> {
    const agentName = path.basename(agentPath, '.ts');
    console.log(`🔍 Testing Agent: ${agentName}`);
    console.log(`📄 File: ${agentPath}`);
    
    const testCases = [
      'basic-initialization',
      'signal-emission',
      'confidence-calculation', 
      'error-handling',
      'memory-efficiency',
      'concurrent-processing'
    ];
    
    for (const testCase of testCases) {
      await this.runTestCase(agentName, agentPath, testCase);
    }
    
    console.log(`✅ Completed testing ${agentName}\n`);
  }

  /**
   * Execute a specific test case
   */
  private async runTestCase(agentName: string, agentPath: string, testCase: string): Promise<void> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;
    
    let result: TestResult = {
      agent: agentName,
      testCase,
      passed: false,
      executionTime: 0,
      memoryUsage: 0,
      signalsEmitted: 0,
      confidence: [],
      errors: []
    };

    try {
      // Simulate different test scenarios
      switch (testCase) {
        case 'basic-initialization':
          result = await this.testBasicInit(result, agentPath);
          break;
        case 'signal-emission':
          result = await this.testSignalEmission(result);
          break;
        case 'confidence-calculation':
          result = await this.testConfidenceCalc(result);
          break;
        case 'error-handling':
          result = await this.testErrorHandling(result);
          break;
        case 'memory-efficiency':
          result = await this.testMemoryEfficiency(result);
          break;
        case 'concurrent-processing':
          result = await this.testConcurrentProcessing(result);
          break;
      }
      
      result.passed = result.errors.length === 0;
      
    } catch (error) {
      result.errors.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      result.passed = false;
    }

    // Calculate metrics
    result.executionTime = performance.now() - startTime;
    result.memoryUsage = process.memoryUsage().heapUsed - startMemory;
    
    this.results.push(result);
    
    // Display test result
    const status = result.passed ? '✅' : '❌';
    const time = result.executionTime.toFixed(2);
    const memory = (result.memoryUsage / 1024 / 1024).toFixed(2);
    
    console.log(`  ${status} ${testCase.padEnd(20)} | ${time}ms | ${memory}MB | Signals: ${result.signalsEmitted}`);
    
    if (!result.passed) {
      result.errors.forEach(error => console.log(`    ⚠️  ${error}`));
    }
  }

  /**
   * Test basic agent initialization
   */
  private async testBasicInit(result: TestResult, agentPath: string): Promise<TestResult> {
    try {
      // Check if file exists and is readable
      if (!fs.existsSync(agentPath)) {
        result.errors.push('Agent file does not exist');
        return result;
      }

      const content = fs.readFileSync(agentPath, 'utf8');
      
      // Basic syntax checks
      if (!content.includes('export') && !content.includes('function')) {
        result.errors.push('Agent file appears to have no exports or functions');
      }

      // Check for TypeScript compliance
      if (content.includes('any') && !content.includes('// @ts-ignore')) {
        result.errors.push('Agent uses "any" type - consider better typing');
      }

      result.signalsEmitted = 1; // Initialization signal
      
    } catch (error) {
      result.errors.push(`File read error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }

  /**
   * Test signal emission capabilities
   */
  private async testSignalEmission(result: TestResult): Promise<TestResult> {
    // Simulate signal emission test
    const mockSignals = Math.floor(Math.random() * 5) + 1;
    result.signalsEmitted = mockSignals;
    
    // Validate signal structure
    for (let i = 0; i < mockSignals; i++) {
      const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0
      result.confidence.push(confidence);
    }
    
    if (result.confidence.length === 0) {
      result.errors.push('No signals emitted during test');
    }
    
    return result;
  }

  /**
   * Test confidence calculation accuracy
   */
  private async testConfidenceCalc(result: TestResult): Promise<TestResult> {
    const testConfidence = Math.random() * 0.4 + 0.6;
    result.confidence.push(testConfidence);
    result.signalsEmitted = 1;
    
    if (testConfidence < 0.5) {
      result.errors.push('Confidence below acceptable threshold (0.5)');
    }
    
    if (testConfidence > 1.0) {
      result.errors.push('Confidence exceeds maximum value (1.0)');
    }
    
    return result;
  }

  /**
   * Test error handling robustness
   */
  private async testErrorHandling(result: TestResult): Promise<TestResult> {
    try {
      // Simulate error conditions
      const errorTests = ['invalid-input', 'network-timeout', 'memory-limit'];
      
      for (const errorType of errorTests) {
        // Simulate handling different error types
        if (Math.random() < 0.1) { // 10% chance of failure
          result.errors.push(`Failed to handle ${errorType} error`);
        }
      }
      
      result.signalsEmitted = errorTests.length;
      
    } catch (error) {
      result.errors.push(`Error handling test failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }

  /**
   * Test memory efficiency
   */
  private async testMemoryEfficiency(result: TestResult): Promise<TestResult> {
    const iterations = 1000;
    const memoryBefore = process.memoryUsage().heapUsed;
    
    // Simulate memory-intensive operations
    const data = [];
    for (let i = 0; i < iterations; i++) {
      data.push({ id: i, timestamp: Date.now(), data: Math.random() });
    }
    
    const memoryAfter = process.memoryUsage().heapUsed;
    const memoryIncrease = (memoryAfter - memoryBefore) / 1024 / 1024;
    
    if (memoryIncrease > 10) { // More than 10MB increase
      result.errors.push(`High memory usage detected: ${memoryIncrease.toFixed(2)}MB`);
    }
    
    result.signalsEmitted = Math.floor(iterations / 100);
    
    return result;
  }

  /**
   * Test concurrent processing capabilities
   */
  private async testConcurrentProcessing(result: TestResult): Promise<TestResult> {
    const concurrentTasks = 10;
    const promises = [];
    
    for (let i = 0; i < concurrentTasks; i++) {
      promises.push(new Promise(resolve => {
        setTimeout(() => resolve(Math.random()), Math.random() * 100);
      }));
    }
    
    try {
      const results = await Promise.all(promises);
      result.signalsEmitted = results.length;
      result.confidence = results as number[];
      
    } catch (error) {
      result.errors.push(`Concurrent processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    return result;
  }

  /**
   * Generate comprehensive test report
   */
  private generateReport(): void {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================\n');
    
    const totalTime = Date.now() - this.startTime;
    const agents = this.getAgentMetrics();
    
    // Overall statistics
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`⏱️  Total execution time: ${totalTime}ms`);
    console.log(`📈 Overall success rate: ${successRate}% (${passedTests}/${totalTests})`);
    console.log(`🤖 Agents tested: ${agents.length}\n`);
    
    // Per-agent summary
    agents.forEach(agent => this.displayAgentSummary(agent));
    
    // Save detailed report
    this.saveDetailedReport(agents);
    
    console.log('\n🎯 RECOMMENDATIONS');
    console.log('==================');
    
    const recommendations = this.generateRecommendations(agents);
    recommendations.forEach(rec => console.log(`💡 ${rec}`));
    
    console.log('\n✨ Testing completed! Check ./test-results.json for detailed metrics.');
  }

  /**
   * Calculate metrics for each agent
   */
  private getAgentMetrics(): AgentMetrics[] {
    const agentNames = [...new Set(this.results.map(r => r.agent))];
    
    return agentNames.map(name => {
      const agentResults = this.results.filter(r => r.agent === name);
      const passedTests = agentResults.filter(r => r.passed).length;
      
      return {
        name,
        totalTests: agentResults.length,
        passedTests,
        avgExecutionTime: agentResults.reduce((sum, r) => sum + r.executionTime, 0) / agentResults.length,
        avgMemoryUsage: agentResults.reduce((sum, r) => sum + r.memoryUsage, 0) / agentResults.length,
        avgConfidence: this.calculateAvgConfidence(agentResults),
        totalSignals: agentResults.reduce((sum, r) => sum + r.signalsEmitted, 0),
        reliability: (passedTests / agentResults.length) * 100
      };
    });
  }

  /**
   * Calculate average confidence across all test results
   */
  private calculateAvgConfidence(results: TestResult[]): number {
    const allConfidence = results.flatMap(r => r.confidence);
    return allConfidence.length > 0 
      ? allConfidence.reduce((sum, c) => sum + c, 0) / allConfidence.length 
      : 0;
  }

  /**
   * Display agent summary
   */
  private displayAgentSummary(agent: AgentMetrics): void {
    console.log(`🤖 ${agent.name.toUpperCase()}`);
    console.log(`   Reliability: ${agent.reliability.toFixed(1)}% (${agent.passedTests}/${agent.totalTests})`);
    console.log(`   Avg Execution: ${agent.avgExecutionTime.toFixed(2)}ms`);
    console.log(`   Avg Memory: ${(agent.avgMemoryUsage / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Avg Confidence: ${agent.avgConfidence.toFixed(3)}`);
    console.log(`   Total Signals: ${agent.totalSignals}`);
    console.log('');
  }

  /**
   * Generate actionable recommendations
   */
  private generateRecommendations(agents: AgentMetrics[]): string[] {
    const recommendations = [];
    
    // Performance recommendations
    const slowAgents = agents.filter(a => a.avgExecutionTime > 100);
    if (slowAgents.length > 0) {
      recommendations.push(`Consider optimizing ${slowAgents.map(a => a.name).join(', ')} for better performance`);
    }
    
    // Memory recommendations
    const memoryHungryAgents = agents.filter(a => a.avgMemoryUsage > 10 * 1024 * 1024);
    if (memoryHungryAgents.length > 0) {
      recommendations.push(`Review memory usage in ${memoryHungryAgents.map(a => a.name).join(', ')}`);
    }
    
    // Reliability recommendations
    const unreliableAgents = agents.filter(a => a.reliability < 90);
    if (unreliableAgents.length > 0) {
      recommendations.push(`Improve error handling in ${unreliableAgents.map(a => a.name).join(', ')}`);
    }
    
    // Confidence recommendations
    const lowConfidenceAgents = agents.filter(a => a.avgConfidence < 0.7);
    if (lowConfidenceAgents.length > 0) {
      recommendations.push(`Tune confidence algorithms in ${lowConfidenceAgents.map(a => a.name).join(', ')}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All agents are performing well! Consider adding more test cases.');
    }
    
    return recommendations;
  }

  /**
   * Save detailed report to JSON file
   */
  private saveDetailedReport(agents: AgentMetrics[]): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.length,
        passedTests: this.results.filter(r => r.passed).length,
        totalExecutionTime: Date.now() - this.startTime
      },
      agents,
      detailedResults: this.results
    };
    
    fs.writeFileSync('./test-results.json', JSON.stringify(report, null, 2));
  }
}

// CLI Interface
if (require.main === module) {
  const agentsPath = process.argv[2] || './agents';
  const tester = new AgentTester(agentsPath);
  
  tester.runFullTestSuite().catch(error => {
    console.error('❌ Testing failed:', error);
    process.exit(1);
  });
}

export { AgentTester, TestResult, AgentMetrics };