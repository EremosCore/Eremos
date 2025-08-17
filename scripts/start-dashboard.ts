import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(__dirname, '../dashboard/server.js');

console.log('🚀 Starting Eremos Analytics Dashboard...\n');

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  cwd: process.cwd()
});

server.on('error', (error) => {
  console.error('❌ Failed to start dashboard:', error.message);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n📊 Dashboard stopped with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down dashboard...');
  server.kill('SIGINT');
  process.exit(0);
});
