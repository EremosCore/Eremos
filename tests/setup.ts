// Jest setup file for Eremos test suite
// This file runs before each test file

// Mock console methods to avoid noise during testing
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidSignal(): R;
    }
  }
}

// Custom matcher for signal validation
expect.extend({
  toBeValidSignal(received) {
    const pass = 
      received &&
      typeof received.agent === 'string' &&
      typeof received.type === 'string' &&
      typeof received.glyph === 'string' &&
      typeof received.hash === 'string' &&
      typeof received.timestamp === 'string';

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid signal`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid signal with agent, type, glyph, hash, and timestamp`,
        pass: false,
      };
    }
  },
});

export {};
