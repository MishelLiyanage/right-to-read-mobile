// Analytics API Configuration
export const API_CONFIG = {
  // Analytics server base URL
  ANALYTICS_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://your-analytics-server.com/api',
  
  // For development, you can use a local server:
  // ANALYTICS_BASE_URL: 'http://localhost:3000/api',
  
  // For testing without a real server, you can use a mock service:
  // ANALYTICS_BASE_URL: 'https://jsonplaceholder.typicode.com',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  ANALYTICS_SYNC: '/analytics/sync',
  ANALYTICS_STATUS: '/analytics/status',
  HEALTH_CHECK: '/health',
} as const;