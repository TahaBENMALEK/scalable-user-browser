/**
 * Custom Error Classes
 * Structured error handling for the application
 */

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, code = 'VALIDATION_ERROR') {
    super(message, 400, code);
  }
}

class NotFoundError extends AppError {
  constructor(message, code = 'NOT_FOUND') {
    super(message, 404, code);
  }
}

class InternalError extends AppError {
  constructor(message, code = 'INTERNAL_ERROR') {
    super(message, 500, code);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  InternalError,
};