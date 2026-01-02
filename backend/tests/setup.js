/**
 * Test setup and utilities
 * Provides helpers for all test files
 */

const request = require('supertest');
const app = require('../src/index');

/**
 * Make a GET request to the API
 * @param {string} url - Endpoint URL
 * @returns {Promise} Supertest request
 */
const get = (url) => request(app).get(url);

/**
 * Create mock usernames for testing
 * @param {string} letter - Starting letter
 * @param {number} count - Number of names
 * @returns {Array<string>} Mock usernames
 */
const createMockUsernames = (letter, count) => {
  const names = [];
  for (let i = 0; i < count; i++) {
    names.push(`${letter.toLowerCase()}user${i}`);
  }
  return names;
};

module.exports = {
  app,
  get,
  createMockUsernames,
};