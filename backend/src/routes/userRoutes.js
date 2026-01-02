/**
 * User Routes with Swagger Documentation
 * Defines endpoints for user-related operations with OpenAPI annotations
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /api/users/index:
 *   get:
 *     summary: Get alphabetical index
 *     description: Returns list of all available letters with user counts and positions
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful response with alphabet index
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 index:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       letter:
 *                         type: string
 *                         example: A
 *                       count:
 *                         type: integer
 *                         example: 125430
 *                       startPosition:
 *                         type: integer
 *                         example: 0
 *                 totalUsers:
 *                   type: integer
 *                   example: 10000000
 *       500:
 *         description: Internal server error
 */
router.get('/index', userController.getIndex);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get paginated users by letter
 *     description: Returns paginated list of usernames starting with specified letter
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: letter
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Za-z]$'
 *         description: Single letter A-Z (case insensitive)
 *         example: A
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Starting position offset
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of results to return (max 100)
 *         example: 50
 *     responses:
 *       200:
 *         description: Successful response with paginated users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 letter:
 *                   type: string
 *                   example: A
 *                 cursor:
 *                   type: integer
 *                   example: 0
 *                 limit:
 *                   type: integer
 *                   example: 50
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["aaron123", "abby_cool", "abraham_smith"]
 *                 hasMore:
 *                   type: boolean
 *                   example: true
 *                 nextCursor:
 *                   type: integer
 *                   nullable: true
 *                   example: 50
 *                 total:
 *                   type: integer
 *                   example: 125430
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Bad Request
 *                 message:
 *                   type: string
 *                   example: Invalid letter parameter. Must be A-Z
 *                 code:
 *                   type: string
 *                   example: INVALID_LETTER
 *       404:
 *         description: Letter not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Not Found
 *                 message:
 *                   type: string
 *                   example: No users found for letter X
 *                 code:
 *                   type: string
 *                   example: LETTER_NOT_FOUND
 *       500:
 *         description: Internal server error
 */
router.get('/', userController.getUsersByLetter);

module.exports = router;