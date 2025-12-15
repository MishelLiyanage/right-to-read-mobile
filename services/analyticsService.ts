import type {
    AnalyticsSession,
    BookAnalytics,
    PageAnalytics,
    SchoolAnalytics,
} from '@/types/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceRegistrationService } from './deviceRegistrationService';

const ANALYTICS_KEYS = {
  PAGE_SESSIONS: '@analytics_page_sessions',
  BOOK_SUMMARIES: '@analytics_book_summaries',
  PENDING_SYNC: '@analytics_pending_sync',
  SYNC_STATUS: '@analytics_sync_status',
} as const;

export class AnalyticsService {
  private static instance: AnalyticsService;
  private currentSessions: Map<string, AnalyticsSession> = new Map();
  private lastUpdateTime: number = Date.now();

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Start tracking time for a specific page
   */
  async startPageSession(bookId: number, bookTitle: string, pageNumber: number, totalPages?: number): Promise<void> {
    const pageId = `${bookId}_${pageNumber}`;
    const now = Date.now();

    console.log(`[AnalyticsService] Starting page session:`, {
      pageId,
      bookTitle,
      pageNumber,
      totalPages,
      timestamp: new Date(now).toISOString()
    });

    // End any existing session for this page
    if (this.currentSessions.has(pageId)) {
      await this.endPageSession(bookId, bookTitle, pageNumber, totalPages);
    }

    // Create new session
    const session: AnalyticsSession = {
      pageId,
      startTime: now,
      lastUpdateTime: now,
      isActive: true,
    };

    this.currentSessions.set(pageId, session);
    this.lastUpdateTime = now;

    // Save current sessions to storage
    await this.saveCurrentSessions();
  }

  /**
   * End tracking time for a specific page
   */
  async endPageSession(bookId: number, bookTitle: string, pageNumber: number, totalPages?: number): Promise<void> {
    const pageId = `${bookId}_${pageNumber}`;
    const session = this.currentSessions.get(pageId);

    if (!session) {
      console.log(`[AnalyticsService] No active session found for page ${pageId}`);
      return;
    }

    const now = Date.now();
    const sessionDuration = now - session.startTime;

    console.log(`[AnalyticsService] Ending page session:`, {
      pageId,
      bookTitle,
      pageNumber,
      sessionDuration: `${sessionDuration}ms`,
      timestamp: new Date(now).toISOString()
    });

    // Create page analytics record
    const pageAnalytics: PageAnalytics = {
      pageId,
      bookId,
      bookTitle,
      pageNumber,
      sessionStartTime: session.startTime,
      sessionEndTime: now,
      activeTime: sessionDuration,
      lastActiveTime: now,
      isActive: false,
    };

    // Save to pending sync data
    await this.saveToPendingSync(pageAnalytics);

    // Update book analytics
    await this.updateBookAnalytics(bookId, bookTitle, pageNumber, sessionDuration, totalPages);

    // Remove from current sessions
    this.currentSessions.delete(pageId);
    await this.saveCurrentSessions();
  }

  /**
   * Pause all active sessions (app goes to background)
   */
  async pauseAllSessions(): Promise<void> {
    const now = Date.now();
    console.log(`[AnalyticsService] Pausing all sessions at ${new Date(now).toISOString()}`);

    for (const [pageId, session] of this.currentSessions.entries()) {
      if (session.isActive) {
        session.isActive = false;
        session.lastUpdateTime = now;
        
        // Calculate and save accumulated time
        const accumulatedTime = now - session.startTime;
        const [bookId, pageNumber] = pageId.split('_').map(Number);
        
        // We'll need book title - get it from existing data or store it in session
        // For now, we'll update when resuming
        console.log(`[AnalyticsService] Paused session ${pageId}, duration: ${accumulatedTime}ms`);
      }
    }

    await this.saveCurrentSessions();
  }

  /**
   * Resume all paused sessions (app comes to foreground)
   */
  async resumeAllSessions(): Promise<void> {
    const now = Date.now();
    console.log(`[AnalyticsService] Resuming all sessions at ${new Date(now).toISOString()}`);

    for (const [pageId, session] of this.currentSessions.entries()) {
      if (!session.isActive) {
        // Update start time to now (we don't count background time)
        session.startTime = now;
        session.lastUpdateTime = now;
        session.isActive = true;
        
        console.log(`[AnalyticsService] Resumed session ${pageId}`);
      }
    }

    await this.saveCurrentSessions();
  }

  /**
   * Get current analytics summary for display
   */
  async getAnalyticsSummary(): Promise<{
    pendingCount: number;
    lastSyncTime?: number;
    totalBooks: number;
    totalActiveTime: number;
  }> {
    try {
      const [pendingSyncData, bookSummaries, syncStatus] = await Promise.all([
        this.getPendingSyncData(),
        this.getBookSummaries(),
        this.getSyncStatus(),
      ]);

      const totalActiveTime = bookSummaries.reduce((total, book) => total + book.totalActiveTime, 0);

      return {
        pendingCount: pendingSyncData.length,
        lastSyncTime: syncStatus?.lastSyncTime,
        totalBooks: bookSummaries.length,
        totalActiveTime,
      };
    } catch (error) {
      console.error('[AnalyticsService] Error getting analytics summary:', error);
      return {
        pendingCount: 0,
        totalBooks: 0,
        totalActiveTime: 0,
      };
    }
  }

  /**
   * Prepare data for sync with server
   */
  async prepareSyncData(): Promise<SchoolAnalytics | null> {
    try {
      const registrationData = await DeviceRegistrationService.getRegistrationData();
      if (!registrationData) {
        throw new Error('Device not registered');
      }

      const [pendingSyncData, bookSummaries, syncStatus] = await Promise.all([
        this.getPendingSyncData(),
        this.getBookSummaries(),
        this.getSyncStatus(),
      ]);

      const schoolAnalytics: SchoolAnalytics = {
        schoolName: registrationData.schoolName,
        serialNumber: registrationData.serialNumber,
        books: bookSummaries,
        totalSessionTime: bookSummaries.reduce((total, book) => total + book.totalActiveTime, 0),
        lastSyncTime: syncStatus?.lastSyncTime,
        pendingSyncData,
      };

      return schoolAnalytics;
    } catch (error) {
      console.error('[AnalyticsService] Error preparing sync data:', error);
      return null;
    }
  }

  /**
   * Mark data as synced and clean up
   */
  async markDataAsSynced(): Promise<void> {
    try {
      // Clear pending sync data (page sessions)
      await AsyncStorage.removeItem(ANALYTICS_KEYS.PENDING_SYNC);

      // Clear book summaries (reset reading time and books tracked)
      await AsyncStorage.removeItem(ANALYTICS_KEYS.BOOK_SUMMARIES);

      // Update sync status
      const syncStatus = {
        lastSyncTime: Date.now(),
        pendingCount: 0,
      };
      
      await AsyncStorage.setItem(ANALYTICS_KEYS.SYNC_STATUS, JSON.stringify(syncStatus));
      
      console.log('[AnalyticsService] Data marked as synced successfully - cleared pending data and book summaries');
    } catch (error) {
      console.error('[AnalyticsService] Error marking data as synced:', error);
      throw error;
    }
  }

  /**
   * Clear all analytics data (for testing/debugging)
   */
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ANALYTICS_KEYS.PAGE_SESSIONS),
        AsyncStorage.removeItem(ANALYTICS_KEYS.BOOK_SUMMARIES),
        AsyncStorage.removeItem(ANALYTICS_KEYS.PENDING_SYNC),
        AsyncStorage.removeItem(ANALYTICS_KEYS.SYNC_STATUS),
      ]);
      
      this.currentSessions.clear();
      console.log('[AnalyticsService] All analytics data cleared');
    } catch (error) {
      console.error('[AnalyticsService] Error clearing analytics data:', error);
      throw error;
    }
  }

  // Private helper methods

  private async saveCurrentSessions(): Promise<void> {
    try {
      const sessionsArray = Array.from(this.currentSessions.entries()).map(([pageId, session]) => ({
        ...session,
        pageId,
      }));
      
      await AsyncStorage.setItem(ANALYTICS_KEYS.PAGE_SESSIONS, JSON.stringify(sessionsArray));
    } catch (error) {
      console.error('[AnalyticsService] Error saving current sessions:', error);
    }
  }

  private async loadCurrentSessions(): Promise<void> {
    try {
      const sessionsData = await AsyncStorage.getItem(ANALYTICS_KEYS.PAGE_SESSIONS);
      if (sessionsData) {
        const sessionsArray = JSON.parse(sessionsData);
        this.currentSessions.clear();
        
        sessionsArray.forEach((sessionData: any) => {
          const { pageId, ...session } = sessionData;
          this.currentSessions.set(pageId, session);
        });
      }
    } catch (error) {
      console.error('[AnalyticsService] Error loading current sessions:', error);
    }
  }

  private async saveToPendingSync(pageAnalytics: PageAnalytics): Promise<void> {
    try {
      const existingData = await this.getPendingSyncData();
      existingData.push(pageAnalytics);
      
      await AsyncStorage.setItem(ANALYTICS_KEYS.PENDING_SYNC, JSON.stringify(existingData));
    } catch (error) {
      console.error('[AnalyticsService] Error saving to pending sync:', error);
    }
  }

  private async getPendingSyncData(): Promise<PageAnalytics[]> {
    try {
      const data = await AsyncStorage.getItem(ANALYTICS_KEYS.PENDING_SYNC);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[AnalyticsService] Error getting pending sync data:', error);
      return [];
    }
  }

  private async updateBookAnalytics(bookId: number, bookTitle: string, pageNumber: number, sessionDuration: number, totalPages?: number): Promise<void> {
    try {
      const bookSummaries = await this.getBookSummaries();
      let bookAnalytics = bookSummaries.find(book => book.bookId === bookId);

      if (!bookAnalytics) {
        bookAnalytics = {
          bookId,
          bookTitle,
          totalActiveTime: 0,
          firstAccessTime: Date.now(),
          lastAccessTime: Date.now(),
          totalPages: totalPages || 0,
          pagesAccessed: [],
        };
        bookSummaries.push(bookAnalytics);
      }

      // Update book analytics
      bookAnalytics.totalActiveTime += sessionDuration;
      bookAnalytics.lastAccessTime = Date.now();
      
      // Update totalPages if provided and different
      if (totalPages && totalPages > bookAnalytics.totalPages) {
        bookAnalytics.totalPages = totalPages;
      }
      
      if (!bookAnalytics.pagesAccessed.includes(pageNumber)) {
        bookAnalytics.pagesAccessed.push(pageNumber);
      }

      await AsyncStorage.setItem(ANALYTICS_KEYS.BOOK_SUMMARIES, JSON.stringify(bookSummaries));
    } catch (error) {
      console.error('[AnalyticsService] Error updating book analytics:', error);
    }
  }

  private async getBookSummaries(): Promise<BookAnalytics[]> {
    try {
      const data = await AsyncStorage.getItem(ANALYTICS_KEYS.BOOK_SUMMARIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[AnalyticsService] Error getting book summaries:', error);
      return [];
    }
  }

  private async getSyncStatus(): Promise<{ lastSyncTime?: number; pendingCount: number } | null> {
    try {
      const data = await AsyncStorage.getItem(ANALYTICS_KEYS.SYNC_STATUS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[AnalyticsService] Error getting sync status:', error);
      return null;
    }
  }

  // Initialize on app startup
  async initialize(): Promise<void> {
    await this.loadCurrentSessions();
    console.log('[AnalyticsService] Initialized successfully');
  }
}