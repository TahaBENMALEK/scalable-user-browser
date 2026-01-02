/**
 * User Repository
 * Data access layer for username file
 * Handles file streaming without loading entire file into memory
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

class UserRepository {
  constructor(filePath = null) {
    if (filePath) {
        // Test mode - use provided path
        this.filePath = filePath;
    } else {
        // Production mode - hardcode the path
        this.filePath = path.resolve(__dirname, '../../../data/usernames.txt');
    }
    this.index = null;
  }

  /**
   * Build alphabetical index by scanning file once
   * Creates a map of: letter -> { count, startPosition, endPosition }
   * @returns {Promise<Object>} Index data with letter stats
   */
  async buildIndex() {
    return new Promise((resolve, reject) => {
      const index = {};
      let currentLetter = null;
      let lineCount = 0;
      let position = 0;

      // Check if file exists
      if (!fs.existsSync(this.filePath)) {
        return reject(new Error(`File not found: ${this.filePath}`));
      }

      const stream = fs.createReadStream(this.filePath, { encoding: 'utf8' });
      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line) => {
        if (!line.trim()) return; // Skip empty lines

        const firstChar = line.charAt(0).toUpperCase();

        // Only process A-Z
        if (!/^[A-Z]$/.test(firstChar)) {
          position += Buffer.byteLength(line, 'utf8') + 1; // +1 for newline
          return;
        }

        // New letter detected
        if (firstChar !== currentLetter) {
          // Close previous letter
          if (currentLetter && index[currentLetter]) {
            index[currentLetter].endPosition = position;
          }

          // Start new letter
          currentLetter = firstChar;
          if (!index[currentLetter]) {
            index[currentLetter] = {
              letter: currentLetter,
              count: 0,
              startPosition: position,
              endPosition: position,
            };
          }
        }

        // Increment count for current letter
        index[currentLetter].count++;
        lineCount++;

        position += Buffer.byteLength(line, 'utf8') + 1; // +1 for newline
      });

      rl.on('close', () => {
        // Close last letter
        if (currentLetter && index[currentLetter]) {
          index[currentLetter].endPosition = position;
        }

        // Convert to array and sort
        const indexArray = Object.values(index).sort((a, b) =>
          a.letter.localeCompare(b.letter)
        );

        this.index = {
          index: indexArray,
          totalUsers: lineCount,
        };

        resolve(this.index);
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Stream users from file starting at specific position
   * Reads only the required lines without loading entire file
   * @param {number} startPosition - Byte position to start reading
   * @param {number} limit - Maximum number of lines to read
   * @returns {Promise<Array<string>>} Array of usernames
   */
  async streamUsers(startPosition, limit) {
    return new Promise((resolve, reject) => {
      const users = [];
      let linesRead = 0;

      const stream = fs.createReadStream(this.filePath, {
        encoding: 'utf8',
        start: startPosition,
      });

      const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity,
      });

      rl.on('line', (line) => {
        if (linesRead >= limit) {
          rl.close();
          return;
        }

        if (line.trim()) {
          users.push(line.trim());
          linesRead++;
        }

        if (linesRead >= limit) {
          rl.close();
        }
      });

      rl.on('close', () => {
        resolve(users);
      });

      rl.on('error', (error) => {
        reject(error);
      });
    });
  }

  /**
   * Get index entry for specific letter
   * @param {string} letter - Single letter A-Z
   * @returns {Object|null} Index entry or null if not found
   */
  getIndexForLetter(letter) {
    if (!this.index) {
      throw new Error('Index not built. Call buildIndex() first.');
    }

    const entry = this.index.index.find(
      (item) => item.letter === letter.toUpperCase()
    );

    return entry || null;
  }

  /**
   * Get total user count for a letter
   * @param {string} letter - Single letter A-Z
   * @returns {number} Count
   */
  getUserCountForLetter(letter) {
    const entry = this.getIndexForLetter(letter);
    return entry ? entry.count : 0;
  }

  /**
   * Get the cached index
   * @returns {Object|null} Index data
   */
  getIndex() {
    return this.index;
  }
}

module.exports = new UserRepository();