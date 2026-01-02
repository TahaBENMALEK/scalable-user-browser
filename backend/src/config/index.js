/**
 * Application Configuration
 * Centralized configuration management
 * Validates and provides typed access to environment variables
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

class Config {
  constructor() {
    this.server = {
      port: parseInt(process.env.PORT, 10) || 3001,
      nodeEnv: process.env.NODE_ENV || 'development',
    };

    this.data = {
      filePath: process.env.DATA_FILE_PATH || path.join(__dirname, '../../data/usernames.txt'),
    };

    this.pagination = {
      defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 50,
      maxLimit: parseInt(process.env.MAX_PAGE_LIMIT, 10) || 100,
    };
  }

  /**
   * Validate required configuration
   * Throws error if critical config is missing or invalid
   */
  validate() {
    if (!this.data.filePath) {
      throw new Error('DATA_FILE_PATH is required');
    }

    if (this.pagination.maxLimit < this.pagination.defaultLimit) {
      throw new Error('MAX_PAGE_LIMIT must be >= DEFAULT_PAGE_LIMIT');
    }
  }
}

const config = new Config();
config.validate();

module.exports = config;