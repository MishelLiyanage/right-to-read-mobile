import { DeviceRegistrationService } from './deviceRegistrationService';

/**
 * Simplified Firebase Analytics Service for Expo development
 * This version stores data locally and simulates Firebase functionality
 */
class FirebaseAnalyticsService {
  private static instance: FirebaseAnalyticsService;
  private isInitialized = false;
  private activeSessions = new Map<string, any>();
  private schoolSerial: string | null = null;

  static getInstance(): FirebaseAnalyticsService {
    if (!FirebaseAnalyticsService.instance) {
      FirebaseAnalyticsService.instance = new FirebaseAnalyticsService();
    }
    return FirebaseAnalyticsService.instance;
  }

  /**
   * Initialize Firebase Analytics Service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      console.log('[FirebaseAnalyticsService] Initializing (Development Mode)...');

      // Get school registration info  
      const registrationData = await DeviceRegistrationService.getRegistrationData();
      this.schoolSerial = registrationData?.serialNumber || null;

      this.isInitialized = true;
      console.log('[FirebaseAnalyticsService] Initialized successfully in development mode');
      console.log('[FirebaseAnalyticsService] School Serial:', this.schoolSerial);
    } catch (error) {
      console.error('[FirebaseAnalyticsService] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Start a page session
   */
  async startPageSession(bookId: number, bookTitle: string, pageNumber: number): Promise<string> {
    try {
      await this.ensureInitialized();
      
      const sessionId = this.generateSessionId(bookId, pageNumber);
      const now = Date.now();

      // End any existing session for this page
      await this.endPageSession(bookId, pageNumber);

      const session = {
        sessionId,
        bookId,
        bookTitle,
        pageNumber,
        startTime: now,
        isActive: true,
        deviceInfo: {
          platform: 'expo',
          appVersion: '1.0.1'
        },
        createdAt: now,
        updatedAt: now
      };

      // Store in local cache
      this.activeSessions.set(`${bookId}_${pageNumber}`, session);

      console.log(`[FirebaseAnalyticsService] Started page session: Book ${bookId}, Page ${pageNumber}, Session ${sessionId}`);

      return sessionId;
    } catch (error) {
      console.error('[FirebaseAnalyticsService] Failed to start page session:', error);
      throw error;
    }
  }

  /**
   * End a page session
   */
  async endPageSession(bookId: number, pageNumber: number): Promise<void> {
    try {
      const sessionKey = `${bookId}_${pageNumber}`;
      const session = this.activeSessions.get(sessionKey);

      if (!session || !session.isActive) return;

      const now = Date.now();
      const duration = now - session.startTime;

      // Remove from active sessions
      this.activeSessions.delete(sessionKey);

      console.log(`[FirebaseAnalyticsService] Ended page session: Book ${bookId}, Page ${pageNumber}, Duration: ${Math.round(duration / 1000)}s`);

    } catch (error) {
      console.error('[FirebaseAnalyticsService] Failed to end page session:', error);
    }
  }

  /**
   * Pause all active sessions
   */
  async pauseAllSessions(): Promise<void> {
    console.log('[FirebaseAnalyticsService] Pausing all active sessions');
    const pausePromises = Array.from(this.activeSessions.entries()).map(
      ([key, session]) => {
        const [bookId, pageNumber] = key.split('_').map(Number);
        return this.endPageSession(bookId, pageNumber);
      }
    );

    await Promise.all(pausePromises);
  }

  /**
   * Resume sessions (typically called when app becomes active)
   */
  async resumeAllSessions(): Promise<void> {
    console.log('[FirebaseAnalyticsService] Resume sessions called');
    // Note: We don't automatically resume sessions as the user might be on a different page
    // This method exists for compatibility with the existing interface
  }

  /**
   * Get analytics summary for the school
   */
  async getAnalyticsSummary(): Promise<any> {
    console.log('[FirebaseAnalyticsService] Getting analytics summary');
    
    // Return mock data for testing
    return {
      totalBooks: 2,
      totalActiveTime: 120000, // 2 minutes in milliseconds
      totalSessions: 5,
      totalPagesAccessed: 10,
      averageSessionDuration: 24000, // 24 seconds
      mostAccessedBooks: [
        {
          bookId: 1,
          bookTitle: "Grade 3 English Book",
          accessCount: 3,
          totalTime: 90000
        },
        {
          bookId: 2,
          bookTitle: "Grade 4 English Book",
          accessCount: 2,
          totalTime: 30000
        }
      ],
      dailyUsage: [],
      lastUpdated: {
        toMillis: () => Date.now()
      }
    };
  }

  /**
   * Log custom analytics event
   */
  async logAnalyticsEvent(eventName: string, parameters: any = {}): Promise<void> {
    console.log(`[FirebaseAnalyticsService] Logging event: ${eventName}`, parameters);
  }

  /**
   * Helper methods
   */
  private generateSessionId(bookId: number, pageNumber: number): string {
    return `${bookId}_${pageNumber}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.isInitialized && this.schoolSerial !== null;
  }

  /**
   * Clean up resources
   */
  cleanup(): void {
    this.activeSessions.clear();
  }
}

export default FirebaseAnalyticsService;