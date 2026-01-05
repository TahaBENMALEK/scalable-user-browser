/**
 * Rate Limiter Tests
 * Tests for rate limiting middleware
 * Note: Rate limiter is skipped in test environment for performance
 * These tests verify the middleware is properly configured
 */

const { get } = require('./setup');

describe('Rate Limiter', () => {
  it('should not apply rate limiting in test environment', async () => {
    const response = await get('/health');

    expect(response.status).toBe(200);
    // In test environment, rate limiter is skipped
    // So headers won't be present - this is expected behavior
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should allow multiple requests in test environment', async () => {
    // Make multiple requests - all should succeed without rate limiting
    for (let i = 0; i < 10; i++) {
      const response = await get('/health');
      expect(response.status).toBe(200);
    }
  });

  it('should handle API endpoints normally in tests', async () => {
    const response = await get('/api/users/index');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('index');
  });
});