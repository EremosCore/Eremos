// utils/validateEnv.js
function validateEnv() {
    const requiredVars = [
      'API_KEY',       // replace with real vars
      'DATABASE_URL',  // replace with real vars
      'NODE_ENV'
    ];
  
    const missing = requiredVars.filter(v => !process.env[v]);
    if (missing.length) {
      console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
      process.exit(1);
    }
  
    console.log(`✅ Environment validated at ${new Date().toLocaleTimeString()}`);
  }
  
  module.exports = validateEnv;
  