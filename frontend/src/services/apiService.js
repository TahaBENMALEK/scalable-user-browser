/**
 * API Service Layer
 * Handles all HTTP communication with backend
 * Provides type-safe methods for each endpoint
 */

import axios from 'axios';
import API_CONFIG from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.defaults.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

const apiService = {
  /**
   * Check API health status
   */
  async checkHealth() {
    const response = await apiClient.get(API_CONFIG.endpoints.health);
    return response.data;
  },

  /**
   * Get alphabetical index with user counts
   */
  async getIndex() {
    const response = await apiClient.get(API_CONFIG.endpoints.index);
    return response.data;
  },

  /**
   * Get paginated users by letter
   */
  async getUsersByLetter(letter, cursor = 0, limit = API_CONFIG.defaults.pageLimit) {
    const response = await apiClient.get(API_CONFIG.endpoints.users, {
      params: { letter, cursor, limit },
    });
    return response.data;
  },
};

export default apiService;