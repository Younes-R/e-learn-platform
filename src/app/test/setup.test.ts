import { beforeAll, afterAll } from 'vitest';

// Mock environment variables for all tests
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';

beforeAll(() => {
  // Set up any global test configuration here
  console.log('Setting up test environment...');
});

afterAll(() => {
  // Clean up any global test resources here
  console.log('Cleaning up test environment...');
});

// Global test utilities
global.createTestRequest = (url = 'http://localhost:3000/test', options = {}) => {
  return new Request(url, { method: 'GET', ...options });
};

// Custom matchers
expect.extend({
  toBeValidApiResponse(received) {
    const pass = received instanceof Response && received.status === 200;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid API response`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid API response with status 200`,
        pass: false,
      };
    }
  },
});

declare global {
  function createTestRequest(url?: string, options?: RequestInit): Request;
  
  namespace Vi {
    interface Assertion<T = any> {
      toBeValidApiResponse(): T;
    }
  }
}

export {};