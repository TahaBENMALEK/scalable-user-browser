/**
 * Input Validation Utilities
 * Reusable validation functions
 */

const { ValidationError } = require('./errors');

/**
 * Validate letter parameter (A-Z, case insensitive)
 * @param {string} letter - Letter to validate
 * @returns {string} Uppercase letter
 * @throws {ValidationError} If invalid
 */
function validateLetter(letter) {
  if (!letter || typeof letter !== 'string') {
    throw new ValidationError(
      'Letter parameter is required',
      'INVALID_LETTER'
    );
  }

  if (letter.length !== 1) {
    throw new ValidationError(
      'Letter must be a single character',
      'INVALID_LETTER'
    );
  }

  const upperLetter = letter.toUpperCase();
  if (!/^[A-Z]$/.test(upperLetter)) {
    throw new ValidationError(
      'Invalid letter parameter. Must be A-Z',
      'INVALID_LETTER'
    );
  }

  return upperLetter;
}

/**
 * Validate cursor parameter
 * @param {string|number} cursor - Cursor value
 * @returns {number} Validated cursor
 * @throws {ValidationError} If invalid
 */
function validateCursor(cursor) {
  const cursorNum = parseInt(cursor, 10);

  if (isNaN(cursorNum)) {
    throw new ValidationError(
      'Cursor must be a valid number',
      'INVALID_CURSOR'
    );
  }

  if (cursorNum < 0) {
    throw new ValidationError(
      'Cursor must be non-negative',
      'INVALID_CURSOR'
    );
  }

  return cursorNum;
}

/**
 * Validate limit parameter
 * @param {string|number} limit - Limit value
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {number} Validated limit
 * @throws {ValidationError} If invalid
 */
function validateLimit(limit, maxLimit) {
  const limitNum = parseInt(limit, 10);

  if (isNaN(limitNum)) {
    throw new ValidationError(
      'Limit must be a valid number',
      'INVALID_LIMIT'
    );
  }

  if (limitNum < 1) {
    throw new ValidationError(
      'Limit must be at least 1',
      'INVALID_LIMIT'
    );
  }

  if (limitNum > maxLimit) {
    throw new ValidationError(
      `Limit cannot exceed ${maxLimit}`,
      'INVALID_LIMIT'
    );
  }

  return limitNum;
}

module.exports = {
  validateLetter,
  validateCursor,
  validateLimit,
};