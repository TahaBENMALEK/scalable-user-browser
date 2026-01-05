/**
 * Rate Limiting Middleware
 * Protects API from abuse by limiting requests per IP address
 * Configured for 1000 requests per 15 minutes per IP
 */

const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter
 * Limits all API endpoints to prevent abuse and ensure fair resource distribution
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  // Skip rate limiting in test environment
  skip: (req) => process.env.NODE_ENV === 'test',
});

module.exports = {
  apiLimiter,
};