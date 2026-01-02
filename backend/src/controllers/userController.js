/**
 * User Controller
 * Handles HTTP requests for user-related endpoints
 * Delegates business logic to UserService
 */

const UserService = require('../services/userService');

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
   */
  async getUsersByLetter(req, res, next) {
    try {
      const { letter, cursor = '0', limit = '50' } = req.query;

      // Validation
      if (!letter || letter.length !== 1 || !/^[A-Za-z]$/.test(letter)) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid letter parameter. Must be A-Z',
          code: 'INVALID_LETTER',
        });
      }

      const parsedCursor = parseInt(cursor, 10);
      const parsedLimit = parseInt(limit, 10);

      if (isNaN(parsedCursor) || parsedCursor < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Cursor must be a non-negative number',
          code: 'INVALID_CURSOR',
        });
      }

      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Limit must be between 1 and 100',
          code: 'INVALID_LIMIT',
        });
      }

      const result = await UserService.getUsersByLetter(
        letter.toUpperCase(),
        parsedCursor,
        parsedLimit
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

// Export instance methods
module.exports = new UserController();