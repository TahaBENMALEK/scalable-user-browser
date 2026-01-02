/**
 * User Service
 * Business logic for user operations
 * Orchestrates data access through UserRepository
 */

const UserRepository = require('../repositories/userRepository');

class UserService {
  /**
   * Get alphabetical index with user counts
   * @returns {Promise<Object>} Index data
   */
  async getAlphabetIndex() {
    // TODO: Implement in Issue #6
    // This will build the index at startup and cache it
    throw new Error('Not implemented yet');
  }

  /**
   * Get users by letter with pagination
   * @param {string} letter - Single letter A-Z
   * @param {number} cursor - Starting position
   * @param {number} limit - Number of results
   * @returns {Promise<Object>} Paginated results
   */
  async getUsersByLetter(letter, cursor, limit) {
    // TODO: Implement in Issue #6
    // This will use the cached index to find the start position
    // Then stream from the file
    throw new Error('Not implemented yet');
  }
}

module.exports = new UserService();