import { config, validateConfig, getConfigSummary } from '../utils/config';

console.log('🔧 Eremos Configuration Validation\n');

try {
  // Validate configuration
  validateConfig();
  console.log('✅ Configuration validation passed\n');

  // Display configuration summary
  const summary = getConfigSummary();
  console.log('📊 Configuration Summary:');
  console.log(`Environment: ${summary.environment}`);
  console.log(`Solana Network: ${summary.solana.network}`);
  console.log(`RPC Endpoint: ${summary.solana.rpcUrl}`);
  console.log(`Active Agents: ${summary.agents.enabled.join(', ')}`);
  console.log(`Signal Threshold: ${summary.agents.signalThreshold}`);
  console.log(`Webhooks Configured: ${summary.features.webhooks ? 'Yes' : 'No'}`);
  console.log(`Debug Mode: ${summary.features.debug ? 'Yes' : 'No'}`);

} catch (error) {
  console.error('❌ Configuration validation failed:');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}