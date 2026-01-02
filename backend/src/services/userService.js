/**
 * User Service
 * Business logic for user operations
 * Orchestrates data access through UserRepository
 */

const UserRepository = require('../repositories/userRepository');

class UserService {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize service by building index
   * Should be called once at application startup
   */
  async initialize() {
    if (!this.initialized) {
      await UserRepository.buildIndex();
      this.initialized = true;
      console.log('UserService initialized with index');
    }
  }

  /**
   * Get alphabetical index with user counts
   */
  async getAlphabetIndex() {
    if (!this.initialized) {
      await this.initialize();
    }

    const indexData = UserRepository.getIndex();

    if (!indexData) {
      throw new Error('Index not available');
    }

    return indexData;
  }

  /**
   * Get users by letter with pagination
   * Validates cursor bounds before streaming to prevent unnecessary file reads
   */
  async getUsersByLetter(letter, cursor, limit) {
    if (!this.initialized) {
      await this.initialize();
    }

    const letterUpper = letter.toUpperCase();
    const indexEntry = UserRepository.getIndexForLetter(letterUpper);

    if (!indexEntry) {
      throw {
        status: 404,
        name: 'Not Found',
        message: `No users found for letter ${letterUpper}`,
        code: 'LETTER_NOT_FOUND',
      };
    }

    const totalForLetter = indexEntry.count;

    // Check if cursor exceeds available data
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

    // Calculate file position
    const startPosition = await this.calculateBytePosition(
      indexEntry.startPosition,
      cursor
    );

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

  /**
   * Calculate byte position after skipping N lines
   * Used for cursor-based pagination within a letter group
   */
  async calculateBytePosition(startPosition, linesToSkip) {
    if (linesToSkip === 0) {
      return startPosition;
    }

    return new Promise((resolve, reject) => {
      const fs = require('fs');
      const readline = require('readline');

      const stream = fs.createReadStream(UserRepository.filePath, {
        encoding: 'utf8',
        start: startPosition,
      });

      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      let linesSkipped = 0;
      let currentPosition = startPosition;

      rl.on('line', (line) => {
        if (linesSkipped >= linesToSkip) {
          rl.close();
          return;
        }

        currentPosition += Buffer.byteLength(line, 'utf8') + 1;
        linesSkipped++;

        if (linesSkipped >= linesToSkip) {
          rl.close();
        }
      });

      rl.on('close', () => {
        resolve(currentPosition);
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }
}

module.exports = new UserService();