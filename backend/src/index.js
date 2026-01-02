/**
 * Main application entry point
 * Starts Express server and initializes routes
 * Handles graceful error responses using custom error classes
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const userRoutes = require('./routes/userRoutes');
const UserService = require('./services/userService');
const { AppError } = require('./utils/errors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// Global error handler
// Catches all errors and returns consistent JSON responses
app.use((err, req, res, next) => {
  console.error('Error:', err);

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
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;