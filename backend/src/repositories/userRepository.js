/**
 * User Repository
 * Data access layer for username file
 * Handles file streaming and line reading
 */

const fs = require('fs');
const path = require('path');

class UserRepository {
  constructor() {
    this.filePath = path.resolve(
      __dirname,
      process.env.DATA_FILE_PATH || '../../data/usernames.txt'
    );
    this.index = null; // Will be built at startup
  }

  /**
   * Build alphabetical index
   * Scans file once to create position map
   * @returns {Promise<Object>} Index data
   */
  async buildIndex() {
    // TODO: Implement in Issue #5
    // This will scan the file once and create an index
    throw new Error('Not implemented yet');
  }

  /**
   * Stream users from file starting at position
   * @param {number} startPosition - Byte position in file
   * @param {number} limit - Number of lines to read
   * @returns {Promise<Array<string>>} Array of usernames
   */
  async streamUsers(startPosition, limit) {
    // TODO: Implement in Issue #5
    // This will use fs.createReadStream with start option
    throw new Error('Not implemented yet');
  }

  /**
   * Get total user count for a letter
   * @param {string} letter - Single letter A-Z
   * @returns {number} Count
   */
  getUserCountForLetter(letter) {
    // TODO: Implement in Issue #5
    // This will use the cached index
    throw new Error('Not implemented yet');
  }
}

module.exports = new UserRepository();