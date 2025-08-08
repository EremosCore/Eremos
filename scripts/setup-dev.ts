#!/usr/bin/env ts-node

/**
 * Development Setup Script
 * 
 * This script helps new contributors set up their development environment
 * by checking prerequisites and providing helpful guidance.
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Prerequisite {
  name: string;
  command: string;
  versionFlag: string;
  minVersion?: string;
  installUrl?: string;
}

const prerequisites: Prerequisite[] = [
  {
    name: 'Node.js',
    command: 'node',
    versionFlag: '--version',
    minVersion: '16.0.0',
    installUrl: 'https://nodejs.org/'
  },
  {
    name: 'npm',
    command: 'npm',
    versionFlag: '--version',
    minVersion: '8.0.0'
  },
  {
    name: 'TypeScript',
    command: 'tsc',
    versionFlag: '--version',
    installUrl: 'https://www.typescriptlang.org/'
  }
];

function checkPrerequisite(prereq: Prerequisite): boolean {
  try {
    const version = execSync(`${prereq.command} ${prereq.versionFlag}`, { 
      encoding: 'utf8' 
    }).trim();
    
    console.log(`✅ ${prereq.name}: ${version}`);
    
    if (prereq.minVersion) {
      const currentVersion = version.replace('v', '');
      if (currentVersion < prereq.minVersion) {
        console.log(`⚠️  ${prereq.name} version ${currentVersion} is below recommended ${prereq.minVersion}`);
        if (prereq.installUrl) {
          console.log(`   Install from: ${prereq.installUrl}`);
        }
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${prereq.name}: Not found`);
    if (prereq.installUrl) {
      console.log(`   Install from: ${prereq.installUrl}`);
    }
    return false;
  }
}

function createEnvExample(): void {
  const envExamplePath = join(process.cwd(), '.env.example');
  
  if (!existsSync(envExamplePath)) {
    const envExample = `# Eremos Development Environment
# Copy this file to .env.local and update values as needed

# Agent Configuration
AGENT_THERON_ENABLED=true
AGENT_OBSERVER_THRESHOLD=0.85
AGENT_HARVESTER_INTERVAL=5000

# Development Settings
NODE_ENV=development
LOG_LEVEL=info

# Add your specific configuration here
`;
    
    writeFileSync(envExamplePath, envExample);
    console.log('📝 Created .env.example file');
  }
}

function runSetup(): void {
  console.log('🚀 Eremos Development Setup\n');
  
  // Check prerequisites
  console.log('Checking prerequisites...');
  let allPrereqsMet = true;
  
  for (const prereq of prerequisites) {
    if (!checkPrerequisite(prereq)) {
      allPrereqsMet = false;
    }
  }
  
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
  }
  
  // Create environment example
  createEnvExample();
  
  // Type check
  console.log('\n🔍 Running type check...');
  try {
    execSync('npm run type-check', { stdio: 'inherit' });
    console.log('✅ TypeScript compilation successful');
  } catch (error) {
    console.log('❌ TypeScript compilation failed');
    console.log('   Run "npm run lint:fix" to fix issues');
  }
  
  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env.local and configure');
  console.log('2. Run "npm run dev" to start development');
  console.log('3. Check out docs/contributing.md for guidelines');
  console.log('4. Explore agents/example.ts to understand the structure');
  
  if (!allPrereqsMet) {
    console.log('\n⚠️  Some prerequisites need attention. See above for details.');
  }
}

if (require.main === module) {
  runSetup();
} 