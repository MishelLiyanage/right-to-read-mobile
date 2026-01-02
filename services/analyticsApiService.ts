import type { SchoolAnalytics, SyncPayload } from '@/types/analytics';

/**
 * Analytics API Service
 * 
 * Handles communication with the backend analytics API.
 * 
 * Configuration:
 * - Set EXPO_PUBLIC_API_URL in .env file (can be local or production URL)
 * - If not configured, analytics will be stored locally only
 * 
 * Backend Endpoints Required:
 * - POST /analytics/sync - Receive and store analytics
 * - GET /analytics/status/:serialNumber - Get sync status
 * - GET /health - Health check
 */

export interface SyncResponse {
  success: boolean;
  message: string;
  syncTimestamp: number;
  recordsProcessed?: number;
}

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.9:8080/api';
const SYNC_ENDPOINT = '/analytics/sync';

/**
 * Check if backend is configured
 */
function isBackendConfigured(): boolean {
  return !!BASE_URL && BASE_URL.trim() !== '';
}

/**
 * Sync analytics data with the server
 */
export async function syncAnalytics(schoolAnalytics: SchoolAnalytics): Promise<SyncResponse> {
    try {
      // Check if backend is configured
      if (!isBackendConfigured()) {
        console.warn('[AnalyticsApiService] Backend URL not configured. Skipping sync.');
        throw new Error('Backend not configured. Please set EXPO_PUBLIC_API_URL in your .env file.');
      }

      console.log('[AnalyticsApiService] Starting sync process:', {
        schoolName: schoolAnalytics.schoolName,
        serialNumber: schoolAnalytics.serialNumber,
        booksCount: schoolAnalytics.books.length,
        pendingRecords: schoolAnalytics.pendingSyncData.length,
      });

      // Prepare sync payload
      const syncPayload: SyncPayload = {
        schoolName: schoolAnalytics.schoolName,
        serialNumber: schoolAnalytics.serialNumber,
        syncTimestamp: Date.now(),
        analyticsData: {
          books: schoolAnalytics.books,
          pages: schoolAnalytics.pendingSyncData,
          deviceInfo: {
            platform: 'mobile', // You can get this from Platform.OS if needed
            appVersion: '1.0.1', // Get from app.json or package.json
          },
        },
      };

      console.log('[AnalyticsApiService] Sending sync payload:', {
        size: JSON.stringify(syncPayload).length,
        timestamp: new Date(syncPayload.syncTimestamp).toISOString(),
        url: `${BASE_URL}${SYNC_ENDPOINT}`,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const response = await fetch(`${BASE_URL}${SYNC_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-School-Serial': schoolAnalytics.serialNumber,
        },
        body: JSON.stringify(syncPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const result: SyncResponse = await response.json();
      
      console.log('[AnalyticsApiService] Sync completed successfully:', {
        recordsProcessed: result.recordsProcessed,
        message: result.message,
      });

      return result;

    } catch (error) {
      console.error('[AnalyticsApiService] Sync failed:', error);
      
      // Handle different types of errors
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection.');
      } else if (error instanceof Error && error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try again later.');
      } else if (error instanceof Error && error.message.includes('HTTP 401')) {
        throw new Error('Device not authorized. Please re-register the device.');
      } else if (error instanceof Error && error.message.includes('HTTP 400')) {
        throw new Error('Invalid data format. Please contact support.');
      } else {
        throw new Error(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

/**
 * Test connection to the analytics server
 */
export async function testConnection(): Promise<boolean> {
  try {
    if (!isBackendConfigured()) {
      console.warn('[AnalyticsApiService] Backend URL not configured.');
      return false;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    return response.ok;
  } catch (error) {
    console.error('[AnalyticsApiService] Connection test failed:', error);
    return false;
  }
}

/**
 * Get sync status from server for a specific school
 */
export async function getSyncStatus(serialNumber: string): Promise<{
  lastSyncTime?: number;
  totalRecords: number;
  schoolName?: string;
} | null> {
  try {
    if (!isBackendConfigured()) {
      console.warn('[AnalyticsApiService] Backend URL not configured.');
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(`${BASE_URL}/analytics/status/${serialNumber}`, {
      method: 'GET',
      headers: {
        'X-School-Serial': serialNumber,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('[AnalyticsApiService] Failed to get sync status:', error);
    return null;
  }
}