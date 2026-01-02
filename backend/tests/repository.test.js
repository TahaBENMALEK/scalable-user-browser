/**
 * UserRepository Tests
 * Tests for file streaming and index building
 */

const path = require('path');
const UserRepository = require('../src/repositories/userRepository');

// Use test fixture
const testFilePath = path.join(__dirname, 'fixtures', 'test-usernames.txt');

describe('UserRepository', () => {
  let repository;

  beforeEach(() => {
    // Create new instance with test file
    const RepositoryClass = require('../src/repositories/userRepository').constructor;
    repository = new RepositoryClass(testFilePath);
  });

  describe('buildIndex', () => {
    it('should build index successfully', async () => {
      const index = await repository.buildIndex();

      expect(index).toHaveProperty('index');
      expect(index).toHaveProperty('totalUsers');
      expect(Array.isArray(index.index)).toBe(true);
    });

    it('should count users correctly', async () => {
      const index = await repository.buildIndex();

      expect(index.totalUsers).toBe(15);
    });

    it('should group users by first letter', async () => {
      const index = await repository.buildIndex();

      const letterA = index.index.find((item) => item.letter === 'A');
      const letterB = index.index.find((item) => item.letter === 'B');

      expect(letterA).toBeDefined();
      expect(letterA.count).toBe(3); // alice123, aaron_smith, andy_jones
      expect(letterB).toBeDefined();
      expect(letterB.count).toBe(2); // bob_wilson, barbara_lee
    });

    it('should store start positions', async () => {
      const index = await repository.buildIndex();

      const letterA = index.index.find((item) => item.letter === 'A');
      expect(letterA.startPosition).toBe(0);
    });
  });

  describe('streamUsers', () => {
    beforeEach(async () => {
      await repository.buildIndex();
    });

    it('should stream users from start position', async () => {
      const letterA = repository.getIndexForLetter('A');
      const users = await repository.streamUsers(letterA.startPosition, 2);

      expect(users).toHaveLength(2);
      expect(users[0]).toBe('alice123');
      expect(users[1]).toBe('aaron_smith');
    });

    it('should respect limit parameter', async () => {
      const letterA = repository.getIndexForLetter('A');
      const users = await repository.streamUsers(letterA.startPosition, 1);

      expect(users).toHaveLength(1);
    });
  });

  describe('getIndexForLetter', () => {
    beforeEach(async () => {
      await repository.buildIndex();
    });

    it('should return index for existing letter', () => {
      const entry = repository.getIndexForLetter('A');

      expect(entry).toBeDefined();
      expect(entry.letter).toBe('A');
      expect(entry.count).toBe(3);
    });

    it('should return null for non-existing letter', () => {
      const entry = repository.getIndexForLetter('Z');

      expect(entry).toBeNull();
    });

    it('should be case insensitive', () => {
      const entryUpper = repository.getIndexForLetter('A');
      const entryLower = repository.getIndexForLetter('a');

      expect(entryUpper).toEqual(entryLower);
    });
  });

  describe('getUserCountForLetter', () => {
    beforeEach(async () => {
      await repository.buildIndex();
    });

    it('should return correct count', () => {
      expect(repository.getUserCountForLetter('A')).toBe(3);
      expect(repository.getUserCountForLetter('B')).toBe(2);
      expect(repository.getUserCountForLetter('C')).toBe(2);
    });

    it('should return 0 for non-existing letter', () => {
      expect(repository.getUserCountForLetter('Z')).toBe(0);
    });
  });
});