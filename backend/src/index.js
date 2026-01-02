/**
 * Main application entry point
 * Starts Express server, initializes UserService, and sets up Swagger documentation
 * Handles graceful error responses using custom error classes
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const UserService = require('./services/userService');
const { AppError } = require('./utils/errors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON spec at /api-docs.json
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and responsive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2026-01-02T10:30:00.000Z
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler - must come before error handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Global error handler - catches all errors and returns consistent JSON responses
app.use((err, req, res, next) => {
  if (config.server.nodeEnv !== 'test') {
    console.error('Error:', err);
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      code: err.code,
    });
  }

  // Handle legacy error format (for backward compatibility)
  if (err.status && err.code) {
    return res.status(err.status).json({
      error: err.name || 'Error',
      message: err.message,
      code: err.code,
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.server.nodeEnv === 'development' ? err.message : 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
  });
});

// Initialize and start server
async function startServer() {
  try {
    console.log('Building alphabetical index...');
    await UserService.initialize();
    console.log('Index built successfully');

    app.listen(config.server.port, () => {
      console.log(`Server running on http://localhost:${config.server.port}`);
      console.log(`Health check: http://localhost:${config.server.port}/health`);
      console.log(`API Docs: http://localhost:${config.server.port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Only start server if this file is run directly (not during tests)
if (require.main === module) {
  startServer();
}

module.exports = app;