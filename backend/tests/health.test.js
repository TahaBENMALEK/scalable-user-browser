/**
 * Health Check Endpoint Tests
 * Tests for GET /health
 */

const { get } = require('./setup');

describe('GET /health', () => {
  it('should return status ok', async () => {
    const response = await get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return valid ISO timestamp', async () => {
    const response = await get('/health');

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.toString()).not.toBe('Invalid Date');
  });
});