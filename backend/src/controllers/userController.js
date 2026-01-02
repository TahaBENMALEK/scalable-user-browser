/**
 * User Controller
 * Handles HTTP requests for user-related endpoints
 * Delegates business logic to UserService, focuses on request/response handling
 */

const UserService = require('../services/userService');
const config = require('../config');
const {
  validateLetter,
  validateCursor,
  validateLimit,
} = require('../utils/validators');

class UserController {
  /**
   * Get alphabetical index
   * GET /api/users/index
   */
  async getIndex(req, res, next) {
    try {
      const index = await UserService.getAlphabetIndex();
      res.json(index);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get users by letter with pagination
   * GET /api/users?letter=A&cursor=0&limit=50
   * Validates input and delegates to service layer
   */
  async getUsersByLetter(req, res, next) {
    try {
      const { letter, cursor = '0', limit } = req.query;

      // Validate and normalize parameters
      const validatedLetter = validateLetter(letter);
      const validatedCursor = validateCursor(cursor);
      const validatedLimit = limit
        ? validateLimit(limit, config.pagination.maxLimit)
        : config.pagination.defaultLimit;

      const result = await UserService.getUsersByLetter(
        validatedLetter,
        validatedCursor,
        validatedLimit
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();