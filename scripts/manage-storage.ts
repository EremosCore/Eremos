#!/usr/bin/env ts-node

import { 
  getStorageStats, 
  exportAllData, 
  cleanupOldData, 
  getSignals, 
  getSharedMemories, 
  getPatterns,
  getAllAgentStates 
} from '../utils/storage';

function displayStorageStats() {
  console.log('\n==================================================');
  console.log('📊 STORAGE STATISTICS');
  console.log('==================================================');
  
  const stats = getStorageStats();
  
  console.log('\n📈 Signals:');
  console.log(`   Total: ${stats.signals?.total || 0}`);
  if (stats.signals?.byAgent) {
    Object.entries(stats.signals.byAgent).forEach(([agentId, count]) => {
      console.log(`   ${agentId}: ${count}`);
    });
  }
  
  console.log('\n🧠 Shared Memories:');
  console.log(`   Total: ${stats.memories?.total || 0}`);
  if (stats.memories?.byType) {
    Object.entries(stats.memories.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }
  
  console.log('\n🔍 Patterns:');
  console.log(`   Total: ${stats.patterns?.total || 0}`);
  if (stats.patterns?.byType) {
    Object.entries(stats.patterns.byType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  }
  
  console.log('\n💾 Storage Files:');
  if (stats.storage?.files) {
    stats.storage.files.forEach((file: any) => {
      const sizeKB = (file.size / 1024).toFixed(2);
      console.log(`   ${file.name}: ${sizeKB} KB`);
    });
  }
  
  console.log('\n📁 Storage Directory:', stats.storage?.directory || './data');
}

function displayRecentSignals(limit: number = 10) {
  console.log(`\n📡 Recent Signals (Last ${limit}):`);
  const signals = getSignals();
  const recentSignals = signals.slice(-limit).reverse();
  
  recentSignals.forEach((signal, index) => {
    console.log(`\n${index + 1}. ${signal.type.toUpperCase()} (${signal.confidence || 'N/A'})`);
    console.log(`   Agent: ${signal.agent}`);
    console.log(`   Hash: ${signal.hash}`);
    console.log(`   Time: ${signal.timestamp || signal.storedAt}`);
    if (signal.details) {
      console.log(`   Details: ${JSON.stringify(signal.details)}`);
    }
  });
}

function displayRecentPatterns(limit: number = 10) {
  console.log(`\n🔍 Recent Patterns (Last ${limit}):`);
  const patterns = getPatterns();
  const recentPatterns = patterns.slice(-limit).reverse();
  
  recentPatterns.forEach((pattern, index) => {
    console.log(`\n${index + 1}. ${pattern.type.toUpperCase()} (${pattern.confidence || 'N/A'})`);
    console.log(`   Discovered: ${pattern.discoveredAt || pattern.timestamp}`);
    if (pattern.data) {
      console.log(`   Data: ${JSON.stringify(pattern.data)}`);
    }
  });
}

function displayRecentMemories(limit: number = 10) {
  console.log(`\n🧠 Recent Shared Memories (Last ${limit}):`);
  const memories = getSharedMemories();
  const recentMemories = memories.slice(-limit).reverse();
  
  recentMemories.forEach((memory, index) => {
    console.log(`\n${index + 1}. ${memory.type.toUpperCase()} (${memory.confidence || 'N/A'})`);
    console.log(`   Source: ${memory.sourceAgent}`);
    console.log(`   Time: ${memory.timestamp || memory.storedAt}`);
    if (memory.tags && memory.tags.length > 0) {
      console.log(`   Tags: ${memory.tags.join(', ')}`);
    }
  });
}

function displayAgentStates() {
  console.log('\n🤖 Agent States:');
  const states = getAllAgentStates();
  
  Object.entries(states).forEach(([agentId, state]) => {
    console.log(`\n${agentId}:`);
    console.log(`   Last Updated: ${(state as any).lastUpdated}`);
    if ((state as any).correlationCount !== undefined) {
      console.log(`   Correlations: ${(state as any).correlationCount}`);
    }
    if ((state as any).sharedIntelligenceCount !== undefined) {
      console.log(`   Intelligence Shared: ${(state as any).sharedIntelligenceCount}`);
    }
    if ((state as any).lastSignal) {
      console.log(`   Last Signal: ${(state as any).lastSignal}`);
    }
  });
}

function showHelp() {
  console.log('\n==================================================');
  console.log('🗄️  STORAGE MANAGEMENT COMMANDS');
  console.log('==================================================');
  console.log('\nUsage: npm run storage [command]');
  console.log('\nCommands:');
  console.log('  stats          - Show storage statistics');
  console.log('  signals        - Show recent signals');
  console.log('  patterns       - Show recent patterns');
  console.log('  memories       - Show recent shared memories');
  console.log('  agents         - Show agent states');
  console.log('  export         - Export all data to file');
  console.log('  cleanup        - Clean up old data (30+ days)');
  console.log('  help           - Show this help message');
  console.log('\nExamples:');
  console.log('  npm run storage stats');
  console.log('  npm run storage signals');
  console.log('  npm run storage export');
}

// Main function
function main() {
  const command = process.argv[2] || 'help';
  
  switch (command) {
    case 'stats':
      displayStorageStats();
      break;
      
    case 'signals':
      displayRecentSignals();
      break;
      
    case 'patterns':
      displayRecentPatterns();
      break;
      
    case 'memories':
      displayRecentMemories();
      break;
      
    case 'agents':
      displayAgentStates();
      break;
      
    case 'export':
      console.log('\n📤 Exporting all data...');
      exportAllData();
      console.log('✅ Export completed!');
      break;
      
    case 'cleanup':
      console.log('\n🧹 Cleaning up old data...');
      cleanupOldData(30);
      console.log('✅ Cleanup completed!');
      break;
      
    case 'help':
    default:
      showHelp();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
