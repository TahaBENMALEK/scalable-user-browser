/**
 * Alphabet Index Tests
 * Tests for GET /api/users/index
 */

const { get } = require('./setup');

describe('GET /api/users/index', () => {
  it('should return 200 status', async () => {
    const response = await get('/api/users/index');
    expect(response.status).toBe(200);
  });

  it('should return index array with letter objects', async () => {
    const response = await get('/api/users/index');

    expect(response.body).toHaveProperty('index');
    expect(Array.isArray(response.body.index)).toBe(true);
  });

  it('should have letter, count, and startPosition for each entry', async () => {
    const response = await get('/api/users/index');

    if (response.body.index && response.body.index.length > 0) {
      const firstEntry = response.body.index[0];
      expect(firstEntry).toHaveProperty('letter');
      expect(firstEntry).toHaveProperty('count');
      expect(firstEntry).toHaveProperty('startPosition');
      expect(typeof firstEntry.count).toBe('number');
      expect(typeof firstEntry.startPosition).toBe('number');
    }
  });

  it('should return totalUsers count', async () => {
    const response = await get('/api/users/index');

    expect(response.body).toHaveProperty('totalUsers');
    expect(typeof response.body.totalUsers).toBe('number');
  });

  it('should have letters in alphabetical order', async () => {
    const response = await get('/api/users/index');

    const letters = response.body.index.map((entry) => entry.letter);
    const sortedLetters = [...letters].sort();
    expect(letters).toEqual(sortedLetters);
  });
});