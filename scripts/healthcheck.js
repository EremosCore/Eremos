#!/usr/bin/env node

/**
 * Health check script for Docker containers
 * This script verifies that the Eremos service is running properly
 */

const http = require('http');
const { URL } = require('url');

// Configuration
const HEALTH_CHECK_URL = process.env.HEALTH_CHECK_URL || 'http://localhost:3000/health';
const TIMEOUT = parseInt(process.env.HEALTH_CHECK_TIMEOUT || '5000', 10);

/**
 * Perform health check
 */
function healthCheck() {
  return new Promise((resolve, reject) => {
    const url = new URL(HEALTH_CHECK_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 80,
      path: url.pathname,
      method: 'GET',
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Eremos-HealthCheck/1.0.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            if (response.status === 'healthy' || response.status === 'ok') {
              resolve({
                success: true,
                status: res.statusCode,
                response: response
              });
            } else {
              reject(new Error(`Service unhealthy: ${response.status}`));
            }
          } catch (err) {
            // If it's not JSON, but status is 200, consider it healthy
            if (data.includes('OK') || data.includes('healthy')) {
              resolve({
                success: true,
                status: res.statusCode,
                response: data
              });
            } else {
              reject(new Error(`Invalid response format: ${err.message}`));
            }
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Health check timeout after ${TIMEOUT}ms`));
    });

    req.end();
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`[${new Date().toISOString()}] Performing health check on ${HEALTH_CHECK_URL}`);
    
    const result = await healthCheck();
    
    console.log(`[${new Date().toISOString()}] Health check passed:`, {
      status: result.status,
      url: HEALTH_CHECK_URL
    });
    
    process.exit(0);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Health check failed:`, {
      error: error.message,
      url: HEALTH_CHECK_URL
    });
    
    process.exit(1);
  }
}

// Handle signals
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Health check interrupted');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('[SIGINT] Health check interrupted');
  process.exit(1);
});

// Run health check
if (require.main === module) {
  main();
}

module.exports = { healthCheck };