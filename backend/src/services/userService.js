/**
 * User Service - Business logic for user operations
 * Orchestrates data access through UserRepository singleton
 * Handles pagination logic and cursor calculations
 */

const UserRepository = require('../repositories/userRepository');
const { NotFoundError } = require('../utils/errors');

class UserService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize service by building index
   * Called once at application startup
   */
  async initialize() {
    if (!this.initialized) {
      await UserRepository.buildIndex();
      this.initialized = true;
      console.log('UserService initialized with index');
    }
  }

  /**
   * Get alphabetical index with user counts per letter
   */
  async getAlphabetIndex() {
    if (!this.initialized) {
      await this.initialize();
    }

    return UserRepository.getFullIndex();
  }

  /**
   * Get users by letter with cursor-based pagination
   * Validates cursor bounds before streaming to avoid unnecessary file reads
   */
  async getUsersByLetter(letter, cursor, limit) {
    if (!this.initialized) {
      await this.initialize();
    }

    const letterUpper = letter.toUpperCase();
    const indexEntry = UserRepository.getIndexForLetter(letterUpper);

    if (!indexEntry) {
      throw new NotFoundError(
        `No users found for letter ${letterUpper}`,
        'LETTER_NOT_FOUND'
      );
    }

    const totalForLetter = indexEntry.count;

    // Return empty result if cursor exceeds available data
    if (cursor >= totalForLetter) {
      return {
        letter: letterUpper,
        cursor,
        limit,
        data: [],
        hasMore: false,
        nextCursor: null,
        total: totalForLetter,
      };
    }

    // Calculate actual file position for this cursor
    const startPosition = indexEntry.startPosition + cursor;

    // Stream users from file
    const users = await UserRepository.streamUsers(startPosition, limit);

    // Calculate pagination metadata
    const currentPosition = cursor + users.length;
    const hasMore = currentPosition < totalForLetter;
    const nextCursor = hasMore ? currentPosition : null;

    return {
      letter: letterUpper,
      cursor,
      limit,
      data: users,
      hasMore,
      nextCursor,
      total: totalForLetter,
    };
  }
}

module.exports = new UserService();