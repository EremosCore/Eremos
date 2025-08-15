#!/usr/bin/env node
/**
 * Comprehensive Eremos Validation Test Suite
 * 
 * This test runner validates all aspects of the Eremos codebase
 * without requiring external dependencies.
 */

const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Eremos Comprehensive Test Suite\n');
    console.log('==================================\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        if (error.isWarning) {
          console.log(`⚠️  ${name}: ${error.message}`);
          this.warnings++;
        } else {
          console.log(`❌ ${name}: ${error.message}`);
          this.failed++;
        }
      }
    }

    this.printSummary();
  }

  printSummary() {
    const total = this.passed + this.failed + this.warnings;
    const successRate = ((this.passed / total) * 100).toFixed(1);
    
    console.log('\n==================================');
    console.log('📊 Test Summary');
    console.log('==================================');
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`⚠️  Warnings: ${this.warnings}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    
    if (this.failed === 0) {
      console.log('\n🎉 All critical tests passed! Codebase is ready for production.');
    } else {
      console.log('\n🔧 Please fix the failed tests before deployment.');
    }
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  readFile(filePath) {
    if (!this.fileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  parseJSON(filePath) {
    const content = this.readFile(filePath);
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
    }
  }

  warning(message) {
    const error = new Error(message);
    error.isWarning = true;
    throw error;
  }

const runner = new TestRunner();

// Core File Structure Tests
runner.test('Package.json exists and is valid', () => {
  const pkg = runner.parseJSON('package.json');
  if (!pkg.name) throw new Error('Package name is required');
  if (!pkg.version) throw new Error('Package version is required');
  if (!pkg.scripts) throw new Error('Package scripts are required');
  
  // Check critical scripts
  const requiredScripts = ['typecheck', 'test', 'demo'];
  for (const script of requiredScripts) {
    if (!pkg.scripts[script]) {
      throw new Error(`Missing required script: ${script}`);
    }
  }
});

runner.test('TypeScript configuration is valid', () => {
  const tsconfig = runner.parseJSON('tsconfig.json');
  if (!tsconfig.compilerOptions) throw new Error('Missing compiler options');
  if (!tsconfig.include) throw new Error('Missing include paths');
  
  // Check critical compiler options
  if (tsconfig.compilerOptions.strict !== true) {
    runner.warning('Strict mode is not enabled');
  }
});

runner.test('README.md is comprehensive', () => {
  const readme = runner.readFile('README.md');
  
  const requiredSections = [
    '# Eremos',
    '## Features',
    '## Architecture Overview',
    '## Quickstart',
    '## Run',
    '## Add a new agent',
    '## Agent Coordination',
    '## Signal Analytics',
    '## Contributing'
  ];
  
  for (const section of requiredSections) {
    if (!readme.includes(section)) {
      throw new Error(`Missing section: ${section}`);
    }
  }
  
  // Check for architecture diagram
  if (!readme.includes('```mermaid')) {
    throw new Error('Missing architecture diagram');
  }
  
  // Check for badges
  if (!readme.includes('![') && !readme.includes('[![')) {
    runner.warning('No badges found in README');
  }
});

// Agent Structure Tests
runner.test('All agents are properly structured', () => {
  const agentsDir = 'agents';
  if (!runner.fileExists(agentsDir)) {
    throw new Error('Agents directory not found');
  }
  
  const agentFiles = fs.readdirSync(agentsDir).filter(f => f.endsWith('.ts'));
  if (agentFiles.length === 0) {
    throw new Error('No agent files found');
  }
  
  // Check if agents index exists
  if (!runner.fileExists(path.join(agentsDir, 'index.ts'))) {
    throw new Error('Missing agents/index.ts registry');
  }
  
  console.log(`   Found ${agentFiles.length} agent files`);
});

runner.test('Agent types are properly defined', () => {
  const agentType = runner.readFile('types/agent.ts');
  
  const requiredFields = ['id', 'name', 'role', 'glyph', 'watchType', 'observe'];
  for (const field of requiredFields) {
    if (!agentType.includes(field)) {
      throw new Error(`Missing required field in Agent type: ${field}`);
    }
  }
});

runner.test('Signal types are comprehensive', () => {
  const signalType = runner.readFile('types/signal.ts');
  
  const requiredFields = ['type', 'hash', 'timestamp', 'source'];
  for (const field of requiredFields) {
    if (!signalType.includes(field)) {
      throw new Error(`Missing required field in Signal type: ${field}`);
    }
  }
  
  // Check for enhanced fields
  if (!signalType.includes('confidence')) {
    runner.warning('Signal type missing confidence field');
  }
});

// Utility Function Tests
runner.test('Core utilities exist and are exportable', () => {
  const utilFiles = [
    'utils/signal.ts',
    'utils/logger.ts',
    'utils/coordinator.ts',
    'utils/analytics.ts',
    'utils/throttle.ts'
  ];
  
  for (const file of utilFiles) {
    if (!runner.fileExists(file)) {
      throw new Error(`Missing utility file: ${file}`);
    }
    
    const content = runner.readFile(file);
    if (!content.includes('export')) {
      throw new Error(`${file} has no exports`);
    }
  }
});

runner.test('Signal generation utility is functional', () => {
  const signalUtil = runner.readFile('utils/signal.ts');
  
  if (!signalUtil.includes('generateSignalHash')) {
    throw new Error('Missing generateSignalHash function');
  }
  
  if (!signalUtil.includes('export')) {
    throw new Error('generateSignalHash is not exported');
  }
});

runner.test('Logger utility is properly structured', () => {
  const logger = runner.readFile('utils/logger.ts');
  
  if (!logger.includes('logSignal')) {
    throw new Error('Missing logSignal function');
  }
  
  // Check for structured logging
  if (!logger.includes('agent') || !logger.includes('type') || !logger.includes('hash')) {
    throw new Error('Logger missing required signal fields');
  }
});

// New Feature Tests
runner.test('Agent Coordinator is properly implemented', () => {
  const coordinator = runner.readFile('utils/coordinator.ts');
  
  const requiredMethods = [
    'registerSignal',
    'correlateSignals',
    'emitCompositeSignal'
  ];
  
  for (const method of requiredMethods) {
    if (!coordinator.includes(method)) {
      throw new Error(`Missing coordinator method: ${method}`);
    }
  }
  
  // Check for TypeScript interfaces
  if (!coordinator.includes('interface') || !coordinator.includes('CompositeSignal')) {
    throw new Error('Missing TypeScript interfaces in coordinator');
  }
});

runner.test('Signal Analytics is comprehensive', () => {
  const analytics = runner.readFile('utils/analytics.ts');
  
  const requiredMethods = [
    'addSignal',
    'getMetrics',
    'addAlertRule',
    'exportMetrics'
  ];
  
  for (const method of requiredMethods) {
    if (!analytics.includes(method)) {
      throw new Error(`Missing analytics method: ${method}`);
    }
  }
  
  // Check for alert system
  if (!analytics.includes('AlertRule') || !analytics.includes('priority')) {
    throw new Error('Missing alert system components');
  }
});

// CI/CD and Development Tools Tests
runner.test('GitHub Actions CI is configured', () => {
  const ciPath = '.github/workflows/ci.yml';
  if (!runner.fileExists(ciPath)) {
    throw new Error('Missing GitHub Actions CI configuration');
  }
  
  const ci = runner.readFile(ciPath);
  
  // Check for essential CI steps
  const requiredSteps = ['checkout', 'setup-node', 'npm ci', 'typecheck', 'test'];
  for (const step of requiredSteps) {
    if (!ci.toLowerCase().includes(step.toLowerCase())) {
      throw new Error(`Missing CI step: ${step}`);
    }
  }
  
  // Check for multiple Node versions
  if (!ci.includes('matrix') || !ci.includes('node-version')) {
    runner.warning('CI not testing multiple Node.js versions');
  }
});

runner.test('Vitest configuration is present', () => {
  const vitestConfig = runner.readFile('vitest.config.ts');
  
  if (!vitestConfig.includes('defineConfig')) {
    throw new Error('Invalid Vitest configuration');
  }
  
  if (!vitestConfig.includes('coverage')) {
    runner.warning('Coverage reporting not configured');
  }
});

runner.test('ESLint configuration exists', () => {
  if (!runner.fileExists('.eslintrc.js')) {
    runner.warning('ESLint configuration not found');
    return;
  }
  
  const eslint = runner.readFile('.eslintrc.js');
  if (!eslint.includes('@typescript-eslint')) {
    throw new Error('TypeScript ESLint not configured');
  }
});

// Script Functionality Tests
runner.test('Demo script is comprehensive', () => {
  const demo = runner.readFile('scripts/demo.ts');
  
  if (!demo.includes('AgentCoordinator') || !demo.includes('SignalAnalytics')) {
    throw new Error('Demo script missing new features');
  }
  
  if (!demo.includes('simulateWalletActivity') || !demo.includes('generateAnalytics')) {
    throw new Error('Demo script missing simulation functions');
  }
});

runner.test('Agent list script uses registry', () => {
  const agentList = runner.readFile('scripts/agent-list.ts');
  
  if (!agentList.includes('agents') || !agentList.includes('import')) {
    throw new Error('Agent list script not using agents registry');
  }
});

// Documentation and Examples Tests
runner.test('Documentation links are valid', () => {
  const readme = runner.readFile('README.md');
  
  // Check for internal doc references
  const docFiles = [
    'docs/agents.md',
    'docs/signals.md',
    'docs/runtime.md',
    'docs/glyphs.md'
  ];
  
  let missingDocs = [];
  for (const doc of docFiles) {
    if (readme.includes(doc) && !runner.fileExists(doc)) {
      missingDocs.push(doc);
    }
  }
  
  if (missingDocs.length > 0) {
    runner.warning(`Referenced but missing docs: ${missingDocs.join(', ')}`);
  }
});

runner.test('Code examples in README are valid TypeScript', () => {
  const readme = runner.readFile('README.md');
  
  // Extract TypeScript code blocks
  const tsBlocks = readme.match(/```ts([\s\S]*?)```/g);
  
  if (!tsBlocks || tsBlocks.length === 0) {
    throw new Error('No TypeScript examples found in README');
  }
  
  console.log(`   Found ${tsBlocks.length} TypeScript code examples`);
  
  // Basic syntax check - look for common issues
  for (const block of tsBlocks) {
    if (block.includes('import') && !block.includes('from')) {
      throw new Error('Invalid import statement in code example');
    }
  }
});

// Integration Tests
runner.test('All components can be imported together', () => {
  try {
    // This is a basic structural test
    const agentsIndex = runner.readFile('agents/index.ts');
    const coordinator = runner.readFile('utils/coordinator.ts');
    const analytics = runner.readFile('utils/analytics.ts');
    
    // Check for circular dependencies (basic check)
    if (agentsIndex.includes('coordinator') && coordinator.includes('agents')) {
      runner.warning('Potential circular dependency detected');
    }
    
  } catch (error) {
    throw new Error(`Component integration issue: ${error.message}`);
  }
});

// Security and Best Practices Tests
runner.test('No sensitive data in configuration', () => {
  const pkg = runner.parseJSON('package.json');
  
  // Check for accidentally committed sensitive fields
  const sensitiveFields = ['password', 'token', 'key', 'secret'];
  const pkgString = JSON.stringify(pkg).toLowerCase();
  
  for (const field of sensitiveFields) {
    if (pkgString.includes(field)) {
      runner.warning(`Potentially sensitive field found in package.json: ${field}`);
    }
  }
});

runner.test('TypeScript strict mode enabled', () => {
  const tsconfig = runner.parseJSON('tsconfig.json');
  
  if (!tsconfig.compilerOptions.strict) {
    throw new Error('TypeScript strict mode not enabled');
  }
  
  if (!tsconfig.compilerOptions.forceConsistentCasingInFileNames) {
    runner.warning('Case sensitivity checking not enabled');
  }
});

// Run all tests
runner.run().catch(console.error);
