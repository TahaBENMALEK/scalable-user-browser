/**
 * User Pagination Tests
 * Tests for GET /api/users?letter=X&cursor=Y&limit=Z
 */

const { get } = require('./setup');

describe('GET /api/users - Validation', () => {
  it('should return 400 if letter is missing', async () => {
    const response = await get('/api/users');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_LETTER');
  });

  it('should return 400 if letter is not A-Z', async () => {
    const response = await get('/api/users?letter=1');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_LETTER');
  });

  it('should return 400 if letter is multiple characters', async () => {
    const response = await get('/api/users?letter=AB');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_LETTER');
  });

  it('should return 400 if cursor is negative', async () => {
    const response = await get('/api/users?letter=A&cursor=-1');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_CURSOR');
  });

  it('should return 400 if cursor is not a number', async () => {
    const response = await get('/api/users?letter=A&cursor=abc');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_CURSOR');
  });

  it('should return 400 if limit is less than 1', async () => {
    const response = await get('/api/users?letter=A&limit=0');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_LIMIT');
  });

  it('should return 400 if limit exceeds 100', async () => {
    const response = await get('/api/users?letter=A&limit=101');

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_LIMIT');
  });

  it('should accept lowercase letters', async () => {
    const response = await get('/api/users?letter=a&cursor=0&limit=10');

    // Should not return 400 validation error
    expect(response.status).not.toBe(400);
  });
});

describe('GET /api/users - Response Structure', () => {
  it('should return 200 for valid request', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    expect(response.status).toBe(200);
  });

  it('should return correct response structure', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    expect(response.body).toHaveProperty('letter');
    expect(response.body).toHaveProperty('cursor');
    expect(response.body).toHaveProperty('limit');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('hasMore');
    expect(response.body).toHaveProperty('nextCursor');
    expect(response.body).toHaveProperty('total');
  });

  it('should return array of usernames in data', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should respect limit parameter', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=5');

    expect(response.body.limit).toBe(5);
    if (response.body.data.length > 0) {
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    }
  });

  it('should use default limit of 50 when not specified', async () => {
    const response = await get('/api/users?letter=A');

    expect(response.body.limit).toBe(50);
  });

  it('should use default cursor of 0 when not specified', async () => {
    const response = await get('/api/users?letter=A');

    expect(response.body.cursor).toBe(0);
  });

  it('should return hasMore as boolean', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    expect(typeof response.body.hasMore).toBe('boolean');
  });

  it('should calculate nextCursor correctly', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    if (response.body.hasMore) {
      expect(response.body.nextCursor).toBe(10);
    }
  });

  it('should return total count for letter', async () => {
    const response = await get('/api/users?letter=A&cursor=0&limit=10');

    expect(typeof response.body.total).toBe('number');
    expect(response.body.total).toBeGreaterThanOrEqual(0);
  });
});

describe('GET /api/users - Pagination Logic', () => {
  it('should return different results for different cursors', async () => {
    const response1 = await get('/api/users?letter=A&cursor=0&limit=2');
    const response2 = await get('/api/users?letter=A&cursor=2&limit=2');

    if (
      response1.body.data.length > 0 &&
      response2.body.data.length > 0
    ) {
      expect(response1.body.data).not.toEqual(response2.body.data);
    }
  });

  it('should set hasMore to false when reaching end', async () => {
    const response = await get('/api/users?letter=A&cursor=999999&limit=10');

    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(0);
    expect(response.body.hasMore).toBe(false);
  });

  it('should handle letter case insensitively', async () => {
    const responseUpper = await get('/api/users?letter=A&cursor=0&limit=5');
    const responseLower = await get('/api/users?letter=a&cursor=0&limit=5');

    expect(responseUpper.body.letter).toBe('A');
    expect(responseLower.body.letter).toBe('A');
  });
});
