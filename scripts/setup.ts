#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

class ProjectSetup {
  private readonly requiredDirectories = [
    'agents',
    'types', 
    'utils',
    'scripts',
    'tests',
    'dist',
    'coverage',
    '.husky'
  ];

  private readonly requiredFiles = [
    'package.json',
    'tsconfig.json',
    '.eslintrc.js',
    '.prettierrc',
    'vitest.config.ts'
  ];

  async setup(): Promise<void> {
    console.log('🚀 Setting up Eremos development environment...\n');

    try {
      // Check Node.js version
      this.checkNodeVersion();
      
      // Create required directories
      this.createDirectories();
      
      // Verify required files
      this.verifyFiles();
      
      // Install dependencies
      await this.installDependencies();
      
      // Setup git hooks
      await this.setupGitHooks();
      
      // Build project
      await this.buildProject();
      
      // Run initial validation
      await this.runInitialValidation();
      
      console.log('✅ Setup completed successfully!\n');
      this.printNextSteps();

    } catch (error) {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    }
  }

  private checkNodeVersion(): void {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js 18+ required. Current version: ${nodeVersion}`);
    }
    
    console.log(`✅ Node.js version: ${nodeVersion}`);
  }

  private createDirectories(): void {
    console.log('📁 Creating required directories...');
    
    this.requiredDirectories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`  Created: ${dir}`);
      } else {
        console.log(`  Exists: ${dir}`);
      }
    });
  }

  private verifyFiles(): void {
    console.log('\n📄 Verifying required files...');
    
    const missingFiles = this.requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      console.warn('⚠️  Missing files:', missingFiles.join(', '));
      console.log('   These files should be created by the setup process.');
    } else {
      console.log('✅ All required files present');
    }
  }

  private async installDependencies(): Promise<void> {
    console.log('\n📦 Installing dependencies...');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      throw new Error('Failed to install dependencies');
    }
  }

  private async setupGitHooks(): Promise<void> {
    console.log('\n🪝 Setting up Git hooks...');
    
    try {
      // Initialize husky if .git exists
      if (fs.existsSync('.git')) {
        execSync('npx husky install', { stdio: 'inherit' });
        
        // Make hook files executable
        const hookFiles = ['.husky/pre-commit', '.husky/commit-msg'];
        hookFiles.forEach(hookFile => {
          if (fs.existsSync(hookFile)) {
            fs.chmodSync(hookFile, '755');
          }
        });
        
        console.log('✅ Git hooks configured');
      } else {
        console.log('⚠️  Not a git repository, skipping hook setup');
      }
    } catch (error) {
      console.warn('⚠️  Failed to setup git hooks:', error);
    }
  }

  private async buildProject(): Promise<void> {
    console.log('\n🔨 Building project...');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      console.log('✅ Project built successfully');
    } catch (error) {
      throw new Error('Failed to build project');
    }
  }

  private async runInitialValidation(): Promise<void> {
    console.log('\n🔍 Running initial validation...');
    
    try {
      // Type check
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ Type checking passed');
      
      // Lint check
      execSync('npm run lint:check', { stdio: 'inherit' });
      console.log('✅ Linting passed');
      
      // Format check
      execSync('npm run format:check', { stdio: 'inherit' });
      console.log('✅ Formatting check passed');
      
      // Test run
      execSync('npm run test', { stdio: 'inherit' });
      console.log('✅ Tests passed');
      
    } catch (error) {
      console.warn('⚠️  Some validation checks failed. You may need to fix issues manually.');
    }
  }

  private printNextSteps(): void {
    console.log(`
🎉 Eremos development environment is ready!

Next steps:
1. Create your first agent:
   npm run generate:agent

2. Start the development server:
   npm run dev

3. Run tests:
   npm test

4. Validate agents:
   npm run validate:all-agents

5. Build for production:
   npm run build

📚 Available commands:
   npm run dev              - Start development server with hot reloading
   npm run generate:agent   - Interactive agent generator
   npm run validate:agent   - Validate specific agent
   npm run test:watch       - Run tests in watch mode
   npm run lint             - Fix linting issues
   npm run format           - Format code

🔗 Useful links:
   - Agent development guide: docs/agents.md
   - Architecture overview: docs/architecture.md
   - Contributing guide: CONTRIBUTING.md

Happy coding! 🚀
    `);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  const setup = new ProjectSetup();
  setup.setup().catch(console.error);
}

export { ProjectSetup };