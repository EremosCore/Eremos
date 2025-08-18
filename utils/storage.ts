import fs from 'fs';
import path from 'path';

// Storage configuration
const STORAGE_DIR = './data';
const SIGNALS_FILE = path.join(STORAGE_DIR, 'signals.json');
const MEMORIES_FILE = path.join(STORAGE_DIR, 'shared_memories.json');
const AGENT_STATES_FILE = path.join(STORAGE_DIR, 'agent_states.json');
const PATTERNS_FILE = path.join(STORAGE_DIR, 'patterns.json');
const LOG_FILE = path.join(STORAGE_DIR, 'eremos.log');

// Ensure storage directory exists
function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    console.log(`📁 Created storage directory: ${STORAGE_DIR}`);
  }
}

// Initialize storage files if they don't exist
function initializeStorageFiles() {
  ensureStorageDir();
  
  const files = [
    { path: SIGNALS_FILE, default: [] as any[] },
    { path: MEMORIES_FILE, default: [] as any[] },
    { path: AGENT_STATES_FILE, default: {} as Record<string, any> },
    { path: PATTERNS_FILE, default: [] as any[] }
  ];
  
  files.forEach(({ path: filePath, default: defaultValue }) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      console.log(`📄 Created storage file: ${path.basename(filePath)}`);
    }
  });
}

// Generic file read/write functions
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    ensureStorageDir();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error);
  }
}

function appendToLogFile(message: string, data?: any): void {
  try {
    ensureStorageDir();
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      message,
      data
    };
    
    fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
  } catch (error) {
    console.error('❌ Error writing to log file:', error);
  }
}

// Signal storage
export function saveSignal(signal: any): void {
  try {
    const signals = readJsonFile(SIGNALS_FILE, [] as any[]);
    signals.push({
      ...signal,
      storedAt: new Date().toISOString(),
      id: signal.hash || `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    
    writeJsonFile(SIGNALS_FILE, signals);
    appendToLogFile('Signal stored', signal);
    console.log(`💾 Signal saved to file: ${signal.hash || 'unknown'}`);
  } catch (error) {
    console.error('❌ Error saving signal:', error);
  }
}

export function getSignals(): any[] {
  return readJsonFile(SIGNALS_FILE, []);
}

export function getSignalsByAgent(agentId: string): any[] {
  const signals = getSignals();
  return signals.filter(signal => signal.agent === agentId);
}

// Shared memory storage
export function saveSharedMemory(memory: any): void {
  try {
    const memories = readJsonFile(MEMORIES_FILE, [] as any[]);
    memories.push({
      ...memory,
      storedAt: new Date().toISOString()
    });
    
    // Keep only last 1000 memories to prevent file bloat
    if (memories.length > 1000) {
      memories.splice(0, memories.length - 1000);
    }
    
    writeJsonFile(MEMORIES_FILE, memories);
    appendToLogFile('Shared memory stored', memory);
  } catch (error) {
    console.error('❌ Error saving shared memory:', error);
  }
}

export function getSharedMemories(): any[] {
  return readJsonFile(MEMORIES_FILE, []);
}

export function getSharedMemoriesByAgent(agentId: string): any[] {
  const memories = getSharedMemories();
  return memories.filter(memory => memory.sourceAgent === agentId);
}

// Agent state storage
export function saveAgentState(agentId: string, state: any): void {
  try {
    const states = readJsonFile(AGENT_STATES_FILE, {} as Record<string, any>);
    states[agentId] = {
      ...state,
      lastUpdated: new Date().toISOString()
    };
    
    writeJsonFile(AGENT_STATES_FILE, states);
  } catch (error) {
    console.error(`❌ Error saving agent state for ${agentId}:`, error);
  }
}

export function getAgentState(agentId: string): any {
  const states = readJsonFile(AGENT_STATES_FILE, {} as Record<string, any>);
  return states[agentId] || null;
}

export function getAllAgentStates(): any {
  return readJsonFile(AGENT_STATES_FILE, {});
}

// Pattern storage
export function savePattern(pattern: any): void {
  try {
    const patterns = readJsonFile(PATTERNS_FILE, [] as any[]);
    patterns.push({
      ...pattern,
      discoveredAt: new Date().toISOString()
    });
    
    // Keep only last 500 patterns
    if (patterns.length > 500) {
      patterns.splice(0, patterns.length - 500);
    }
    
    writeJsonFile(PATTERNS_FILE, patterns);
    appendToLogFile('Pattern discovered', pattern);
  } catch (error) {
    console.error('❌ Error saving pattern:', error);
  }
}

export function getPatterns(): any[] {
  return readJsonFile(PATTERNS_FILE, []);
}

export function getPatternsByType(patternType: string): any[] {
  const patterns = getPatterns();
  return patterns.filter(pattern => pattern.type === patternType);
}

// Statistics and analytics
export function getStorageStats(): any {
  try {
    const signals = getSignals();
    const memories = getSharedMemories();
    const patterns = getPatterns();
    const agentStates = getAllAgentStates();
    
    return {
      signals: {
        total: signals.length,
        byAgent: Object.fromEntries(
          Object.keys(agentStates).map(agentId => [
            agentId,
            signals.filter(s => s.agent === agentId).length
          ])
        )
      },
      memories: {
        total: memories.length,
        byType: memories.reduce((acc: any, mem) => {
          acc[mem.type] = (acc[mem.type] || 0) + 1;
          return acc;
        }, {})
      },
      patterns: {
        total: patterns.length,
        byType: patterns.reduce((acc: any, pat) => {
          acc[pat.type] = (acc[pat.type] || 0) + 1;
          return acc;
        }, {})
      },
      storage: {
        directory: STORAGE_DIR,
        files: [
          { name: 'signals.json', size: fs.existsSync(SIGNALS_FILE) ? fs.statSync(SIGNALS_FILE).size : 0 },
          { name: 'shared_memories.json', size: fs.existsSync(MEMORIES_FILE) ? fs.statSync(MEMORIES_FILE).size : 0 },
          { name: 'agent_states.json', size: fs.existsSync(AGENT_STATES_FILE) ? fs.statSync(AGENT_STATES_FILE).size : 0 },
          { name: 'patterns.json', size: fs.existsSync(PATTERNS_FILE) ? fs.statSync(PATTERNS_FILE).size : 0 },
          { name: 'eremos.log', size: fs.existsSync(LOG_FILE) ? fs.statSync(LOG_FILE).size : 0 }
        ]
      }
    };
  } catch (error) {
    console.error('❌ Error getting storage stats:', error);
    return {};
  }
}

// Export data functions
export function exportDataToFile(filename: string, data: any): void {
  try {
    ensureStorageDir();
    const exportPath = path.join(STORAGE_DIR, filename);
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    console.log(`📤 Data exported to: ${exportPath}`);
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  }
}

export function exportAllData(): void {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportData = {
      exportTimestamp: timestamp,
      signals: getSignals(),
      sharedMemories: getSharedMemories(),
      agentStates: getAllAgentStates(),
      patterns: getPatterns(),
      stats: getStorageStats()
    };
    
    const filename = `eremos_export_${timestamp}.json`;
    exportDataToFile(filename, exportData);
  } catch (error) {
    console.error('❌ Error exporting all data:', error);
  }
}

// Cleanup old data
export function cleanupOldData(maxAgeDays: number = 30): void {
  try {
    const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
    
    // Clean up old signals
    const signals = getSignals();
    const filteredSignals = signals.filter(signal => 
      new Date(signal.storedAt || signal.timestamp).getTime() > cutoffTime
    );
    writeJsonFile(SIGNALS_FILE, filteredSignals);
    
    // Clean up old memories
    const memories = getSharedMemories();
    const filteredMemories = memories.filter(memory => 
      new Date(memory.storedAt || memory.timestamp).getTime() > cutoffTime
    );
    writeJsonFile(MEMORIES_FILE, filteredMemories);
    
    // Clean up old patterns
    const patterns = getPatterns();
    const filteredPatterns = patterns.filter(pattern => 
      new Date(pattern.discoveredAt || pattern.timestamp).getTime() > cutoffTime
    );
    writeJsonFile(PATTERNS_FILE, filteredPatterns);
    
    console.log(`🧹 Cleaned up data older than ${maxAgeDays} days`);
  } catch (error) {
    console.error('❌ Error cleaning up old data:', error);
  }
}

// Initialize storage on module load
initializeStorageFiles();
