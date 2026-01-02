/**
 * User routes
 * Defines endpoints for user-related operations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * GET /api/users/index
 * Get alphabetical index with user counts per letter
 */
router.get('/index', userController.getIndex);

/**
 * GET /api/users?letter=A&cursor=0&limit=50
 * Get paginated users for a specific letter
 */
router.get('/', userController.getUsersByLetter);

module.exports = router;