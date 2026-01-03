/**
 * API Configuration
 * Centralized configuration for backend communication
 * Provides base URL and endpoint definitions
 */

const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  endpoints: {
    health: '/health',
    index: '/api/users/index',
    users: '/api/users',
  },
  defaults: {
    timeout: 10000,
    pageLimit: 50,
  },
};

export default API_CONFIG;