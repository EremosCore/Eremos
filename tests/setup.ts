// Test setup file for Jest
// This file runs before each test suite

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';
process.env.SIMULATION_MODE = 'true';
process.env.MOCK_BLOCKCHAIN_DATA = 'true';

// Export to make this a module
export {};
