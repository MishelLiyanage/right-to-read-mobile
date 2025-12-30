/**
 * Backend API configuration
 */

// IMPORTANT: Update BASE_URL to point to your backend server
// 
// Development (same network):
//   1. Find your computer's IP address:
//      - Windows: ipconfig (look for IPv4 Address)
//      - Mac/Linux: ifconfig (look for inet)
//   2. Use: http://<YOUR_IP>:8080
//   Example: http://192.168.1.100:8080
//
// Production:
//   Use your deployed backend URL
//   Example: https://api.righttoread.com
//
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.9:8080', 
  ENDPOINTS: {
    CATALOG: '/api/books/catalog',
    BOOK_DETAILS: (bookId: number) => `/api/books/${bookId}/details`,
    BOOK_MANIFEST: (bookId: number) => `/api/books/${bookId}/manifest`,
    DOWNLOAD_URLS: (bookId: number) => `/api/books/${bookId}/download-urls`,
    HEALTH: '/api/books/health',
  },
  TIMEOUT: 30000, // 30 seconds
};
