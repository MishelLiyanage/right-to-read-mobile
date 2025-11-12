import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { syncAnalytics } from './analyticsApiService';
import { AnalyticsService } from './analyticsService';

/**
 * Auto-sync service that monitors network connectivity
 * and automatically syncs analytics when internet is available
 */
class AutoSyncService {
  private static instance: AutoSyncService;
  private unsubscribe: (() => void) | null = null;
  private isSyncing = false;
  private lastSyncAttempt = 0;
  private readonly SYNC_COOLDOWN = 5 * 60 * 1000; // 5 minutes between auto-syncs
  private syncListeners: Set<(status: SyncStatus) => void> = new Set();

  private constructor() {}

  static getInstance(): AutoSyncService {
    if (!AutoSyncService.instance) {
      AutoSyncService.instance = new AutoSyncService();
    }
    return AutoSyncService.instance;
  }

  /**
   * Start monitoring network and auto-sync when online
   */
  startMonitoring(): void {
    console.log('[AutoSync] Starting network monitoring...');

    this.unsubscribe = NetInfo.addEventListener(async (state: NetInfoState) => {
      console.log('[AutoSync] Network state changed:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });

      // Only sync if:
      // 1. Connected to internet
      // 2. Not currently syncing
      // 3. Enough time passed since last attempt (cooldown)
      if (
        state.isConnected && 
        state.isInternetReachable && 
        !this.isSyncing &&
        Date.now() - this.lastSyncAttempt > this.SYNC_COOLDOWN
      ) {
        await this.attemptSync();
      }
    });

    // Also attempt sync immediately if online
    this.checkAndSync();
  }

  /**
   * Stop monitoring network
   */
  stopMonitoring(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      console.log('[AutoSync] Stopped network monitoring');
    }
  }

  /**
   * Check current network state and sync if possible
   */
  private async checkAndSync(): Promise<void> {
    const state = await NetInfo.fetch();
    if (
      state.isConnected && 
      state.isInternetReachable && 
      !this.isSyncing &&
      Date.now() - this.lastSyncAttempt > this.SYNC_COOLDOWN
    ) {
      await this.attemptSync();
    }
  }

  /**
   * Attempt to sync analytics
   */
  private async attemptSync(): Promise<void> {
    try {
      this.isSyncing = true;
      this.lastSyncAttempt = Date.now();
      this.notifyListeners({ isLoading: true, error: undefined, pendingCount: 0 });

      const analyticsService = AnalyticsService.getInstance();
      
      // Check if there's pending data
      const summary = await analyticsService.getAnalyticsSummary();
      if (summary.pendingCount === 0) {
        console.log('[AutoSync] No pending data to sync');
        this.notifyListeners({ 
          isLoading: false, 
          error: undefined, 
          pendingCount: 0,
          lastSyncTime: summary.lastSyncTime 
        });
        return;
      }

      console.log(`[AutoSync] Attempting to sync ${summary.pendingCount} records...`);

      // Prepare and send data
      const syncData = await analyticsService.prepareSyncData();
      if (!syncData) {
        throw new Error('Failed to prepare sync data');
      }

      const response = await syncAnalytics(syncData);
      
      // Mark as synced
      await analyticsService.markDataAsSynced();
      
      console.log(`[AutoSync] Successfully synced ${response.recordsProcessed} records`);
      
      this.notifyListeners({ 
        isLoading: false, 
        error: undefined, 
        pendingCount: 0,
        lastSyncTime: response.syncTimestamp 
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Only log error once, don't spam console
      if (errorMessage.includes('Backend not configured')) {
        // Silent fail for backend not configured - just log once at debug level
        if (!this.lastSyncAttempt || Date.now() - this.lastSyncAttempt > 3600000) { // Log once per hour
          console.log('[AutoSync] Backend not configured. Analytics will be stored locally until backend is set up.');
        }
      } else {
        console.error('[AutoSync] Sync failed:', errorMessage);
      }
      
      this.notifyListeners({ 
        isLoading: false, 
        error: errorMessage.includes('Backend not configured') ? undefined : errorMessage,
        pendingCount: 0 
      });
      // Don't throw - just log and retry later
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Force sync immediately (bypass cooldown)
   * Used for manual sync button
   */
  async forceSync(): Promise<{ success: boolean; message: string; recordsProcessed?: number }> {
    try {
      // Check network first
      const state = await NetInfo.fetch();
      if (!state.isConnected || !state.isInternetReachable) {
        throw new Error('No internet connection available');
      }

      this.lastSyncAttempt = 0; // Reset cooldown
      this.isSyncing = true;
      this.notifyListeners({ isLoading: true, error: undefined, pendingCount: 0 });

      const analyticsService = AnalyticsService.getInstance();
      
      // Check if there's pending data
      const summary = await analyticsService.getAnalyticsSummary();
      if (summary.pendingCount === 0) {
        this.notifyListeners({ 
          isLoading: false, 
          error: undefined, 
          pendingCount: 0,
          lastSyncTime: summary.lastSyncTime 
        });
        return {
          success: true,
          message: 'No pending data to sync',
          recordsProcessed: 0,
        };
      }

      // Prepare and send data
      const syncData = await analyticsService.prepareSyncData();
      if (!syncData) {
        throw new Error('Device not registered or failed to prepare sync data');
      }

      const response = await syncAnalytics(syncData);
      
      // Mark as synced
      await analyticsService.markDataAsSynced();
      
      this.notifyListeners({ 
        isLoading: false, 
        error: undefined, 
        pendingCount: 0,
        lastSyncTime: response.syncTimestamp 
      });

      return {
        success: true,
        message: response.message,
        recordsProcessed: response.recordsProcessed,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.notifyListeners({ 
        isLoading: false, 
        error: errorMessage,
        pendingCount: 0 
      });
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Get current sync status
   */
  async getSyncStatus(): Promise<SyncStatus> {
    const analyticsService = AnalyticsService.getInstance();
    const summary = await analyticsService.getAnalyticsSummary();
    
    return {
      isLoading: this.isSyncing,
      lastSyncTime: summary.lastSyncTime,
      pendingCount: summary.pendingCount,
      error: undefined,
    };
  }

  /**
   * Subscribe to sync status changes
   */
  addSyncListener(callback: (status: SyncStatus) => void): () => void {
    this.syncListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.syncListeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(status: SyncStatus): void {
    this.syncListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('[AutoSync] Error in sync listener:', error);
      }
    });
  }

  /**
   * Check if currently syncing
   */
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

export interface SyncStatus {
  isLoading: boolean;
  lastSyncTime?: number;
  pendingCount: number;
  error?: string;
}

export default AutoSyncService;
