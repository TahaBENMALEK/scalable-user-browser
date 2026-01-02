/**
 * User Repository - Data access layer for user information
 * Handles file streaming and index building with memory efficiency
 * Exports both class and singleton instance for backward compatibility
 */

const fs = require('fs');
const readline = require('readline');
const config = require('../config');

class UserRepository {
  constructor(filePath) {
    this.filePath = filePath || config.data.filePath;
    this.index = null;
    this.totalUsers = 0;
  }

  /**
   * Build alphabetical index from file
   * Streams file line-by-line to avoid loading entire file into memory
   * @returns {Object} Index metadata with letter counts and positions
   */
  async buildIndex() {
    const indexMap = new Map();
    let currentPosition = 0;
    let totalCount = 0;

    const fileStream = fs.createReadStream(this.filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const username = line.trim();
      if (username) {
        const firstLetter = username.charAt(0).toUpperCase();

        if (!indexMap.has(firstLetter)) {
          indexMap.set(firstLetter, {
            letter: firstLetter,
            count: 0,
            startPosition: currentPosition,
          });
        }

        indexMap.get(firstLetter).count++;
        currentPosition++;
        totalCount++;
      }
    }

    this.index = Array.from(indexMap.values()).sort((a, b) =>
      a.letter.localeCompare(b.letter)
    );
    this.totalUsers = totalCount;

    return this.getFullIndex();
  }

  /**
   * Get complete index with total count
   */
  getFullIndex() {
    return {
      index: this.index,
      totalUsers: this.totalUsers,
    };
  }

  /**
   * Get index entry for specific letter (case insensitive)
   */
  getIndexForLetter(letter) {
    const upperLetter = letter.toUpperCase();
    return this.index.find((entry) => entry.letter === upperLetter) || null;
  }

  /**
   * Get user count for letter
   */
  getUserCountForLetter(letter) {
    const entry = this.getIndexForLetter(letter);
    return entry ? entry.count : 0;
  }

  /**
   * Stream users from file position
   * Reads file from startPosition and returns up to 'limit' usernames
   * @param {number} startPosition - Starting line number
   * @param {number} limit - Maximum results to return
   */
  async streamUsers(startPosition, limit) {
    const users = [];
    let currentPosition = 0;

    const fileStream = fs.createReadStream(this.filePath, { encoding: 'utf8' });
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      const username = line.trim();

      if (username && currentPosition >= startPosition) {
        users.push(username);
        if (users.length >= limit) {
          rl.close();
          fileStream.destroy();
          break;
        }
      }

      if (username) {
        currentPosition++;
      }
    }

    return users;
  }
}

// Export both class and singleton instance for backward compatibility
// Tests use class constructor, service uses singleton
const instance = new UserRepository(config.data.filePath);

module.exports = instance;
module.exports.UserRepository = UserRepository;
module.exports.constructor = UserRepository;