import HybridFirebaseAnalyticsService from '@/services/hybridFirebaseAnalyticsService';
import { useCallback, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface UseAnalyticsTrackingReturn {
  startPageTracking: (pageNumber: number) => Promise<void>;
  endPageTracking: (pageNumber: number) => Promise<void>;
  isTracking: boolean;
}

export function useAnalyticsTracking(
  bookId: number,
  bookTitle: string
): UseAnalyticsTrackingReturn {
  const analyticsService = useRef(HybridFirebaseAnalyticsService.getInstance());
  const currentPageRef = useRef<number | null>(null);
  const isTrackingRef = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const startPageTracking = useCallback(async (pageNumber: number) => {
    try {
      console.log(`[useAnalyticsTracking] Starting tracking for book ${bookId}, page ${pageNumber}`);
      
      // End previous page tracking if exists
      if (currentPageRef.current !== null) {
        await analyticsService.current.endPageSession(bookId, currentPageRef.current);
      }

      // Start new page tracking
      await analyticsService.current.startPageSession(bookId, bookTitle, pageNumber);
      currentPageRef.current = pageNumber;
      isTrackingRef.current = true;
      
    } catch (error) {
      console.error('[useAnalyticsTracking] Error starting page tracking:', error);
    }
  }, [bookId, bookTitle]);

  const endPageTracking = useCallback(async (pageNumber: number) => {
    try {
      if (currentPageRef.current === pageNumber && isTrackingRef.current) {
        console.log(`[useAnalyticsTracking] Ending tracking for book ${bookId}, page ${pageNumber}`);
        
        await analyticsService.current.endPageSession(bookId, pageNumber);
        currentPageRef.current = null;
        isTrackingRef.current = false;
      }
    } catch (error) {
      console.error('[useAnalyticsTracking] Error ending page tracking:', error);
    }
  }, [bookId, bookTitle]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(`[useAnalyticsTracking] App state changed: ${appStateRef.current} -> ${nextAppState}`);
      
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        console.log('[useAnalyticsTracking] App came to foreground - resuming sessions');
        analyticsService.current.resumeAllSessions();
      } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App went to background
        console.log('[useAnalyticsTracking] App went to background - pausing sessions');
        analyticsService.current.pauseAllSessions();
      }
      
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentPageRef.current !== null && isTrackingRef.current) {
        console.log('[useAnalyticsTracking] Component unmounting - ending current page tracking');
        // End current session on unmount
        analyticsService.current.endPageSession(bookId, currentPageRef.current);
      }
    };
  }, [bookId, bookTitle]);

  // Initialize analytics service on mount
  useEffect(() => {
    analyticsService.current.initialize().catch((error: any) => {
      console.error('[useAnalyticsTracking] Failed to initialize analytics service:', error);
    });
  }, []);

  return {
    startPageTracking,
    endPageTracking,
    isTracking: isTrackingRef.current,
  };
}