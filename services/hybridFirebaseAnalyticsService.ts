import AsyncStorage from '@react-native-async-storage/async-storage';
import { logEvent } from 'firebase/analytics';
import {
    doc,
    enableNetwork,
    getDoc,
    increment,
    setDoc,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { getEnvironmentConfig } from '../config/firebaseEnvironment';
import { DeviceRegistrationService } from './deviceRegistrationService';
import { FirebaseConfig, FirebasePaths } from './firebaseConfig';
import { FirebaseMobileConfig } from './firebaseMobileConfig';

/**
 * Hybrid Firebase Analytics Service - Option 4 Implementation
 * 
 * Features:
 * - Sessions: Raw reading session data
 * - Page Analytics: Aggregated page-level statistics
 * - Book Analytics: Book-level progress and patterns
 * - Daily Summaries: Time-based activity summaries
 * - Real-time updates with offline support
 */

// Data Interfaces
interface SessionData {
  sessionId: string;
  schoolSerial: string;
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  readingMetrics?: {
    wordsOnPage?: number;
    estimatedWordsRead?: number;
    readingSpeed?: number; // words per minute
  };
}

interface PageAnalyticsData {
  schoolSerial: string;
  bookId: number;
  pageNumber: number;
  aggregatedStats: {
    totalVisits: number;
    totalTimeSpent: number;
    averageTimePerVisit: number;
    medianTime: number;
    minTime: number;
    maxTime: number;
    uniqueSessions: number;
    revisitCount: number;
  };
  temporalData: {
    firstVisit: Timestamp;
    lastVisit: Timestamp;
    visitsByWeek: Record<string, number>;
  };
  difficulty: {
    readingLevel: 'easy' | 'moderate' | 'challenging';
    strugglingIndicators: number; // 0-1 scale
    masteryLevel: number; // 0-1 scale
  };
  lastUpdated: Timestamp;
}

interface BookAnalyticsData {
  schoolSerial: string;
  bookId: number;
  bookTitle: string;
  overallStats: {
    totalPages: number;
    pagesAccessed: number;
    completionPercentage: number;
    totalTimeSpent: number;
    averageTimePerPage: number;
    totalSessions: number;
  };
  progressTracking: {
    currentPage: number;
    farthestPageReached: number;
    consecutivePagesRead: number;
    pagesSkipped: number[];
    pagesRevisited: number[];
  };
  readingPatterns: {
    averageSessionLength: number; // minutes
    preferredReadingTime: string;
    readingConsistency: number; // 0-1 scale
    difficultyProgression: 'improving' | 'stable' | 'struggling';
  };
  pagePerformance: {
    easiestPages: number[];
    challengingPages: number[];
    popularPages: number[];
  };
  lastUpdated: Timestamp;
}

interface DailySummaryData {
  date: string;
  schoolSerial: string;
  dailyActivity: {
    totalSessionsStarted: number;
    totalSessionsCompleted: number;
    totalReadingTime: number;
    booksAccessed: number[];
    pagesRead: number;
    uniquePagesVisited: number;
  };
  performance: {
    averageSessionDuration: number;
    readingEfficiency: number; // completion rate
    focusScore: number; // based on session patterns
    improvementFromYesterday: number;
  };
  usage: {
    firstSessionTime: string;
    lastSessionTime: string;
    totalActiveHours: number;
    peakReadingHour: string;
  };
  lastUpdated: Timestamp;
}

interface QueuedOperation {
  id: string;
  type: 'session_start' | 'session_end' | 'analytics_update' | 'daily_summary';
  data: any;
  timestamp: number;
  retryCount: number;
}

class HybridFirebaseAnalyticsService {
  private static instance: HybridFirebaseAnalyticsService;
  private isInitialized = false;
  private activeSessions = new Map<string, SessionData>();
  private schoolSerial: string | null = null;
  private db: any = null;
  private analytics: any = null;
  private isOnline = true;
  private offlineQueue: QueuedOperation[] = [];
  private retryTimer: any = null;
  private envConfig = getEnvironmentConfig();

  // Constants
  private readonly OFFLINE_QUEUE_KEY = '@hybrid_firebase_analytics_queue';
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_BASE_DELAY = 1000;
  private readonly BATCH_SIZE = 10;

  static getInstance(): HybridFirebaseAnalyticsService {
    if (!HybridFirebaseAnalyticsService.instance) {
      HybridFirebaseAnalyticsService.instance = new HybridFirebaseAnalyticsService();
    }
    return HybridFirebaseAnalyticsService.instance;
  }

  /**
   * Initialize the hybrid analytics service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      console.log('[HybridAnalytics] Initializing Hybrid Firebase Analytics Service...');

      // Initialize Firebase Config
      await FirebaseConfig.initialize();
      this.db = FirebaseConfig.getFirestore();
      this.analytics = FirebaseConfig.getAnalytics();

      // Get school registration info
      const registrationData = await DeviceRegistrationService.getRegistrationData();
      this.schoolSerial = registrationData?.serialNumber || null;

      if (!this.schoolSerial) {
        console.warn('[HybridAnalytics] No school registration found - analytics will be limited');
        return;
      }

      // Initialize school document
      await this.initializeSchoolDocument(registrationData);

      // Load offline queue
      await this.loadOfflineQueue();

      // Setup network monitoring and retry timer
      this.setupNetworkMonitoring();
      this.startRetryTimer();

      this.isInitialized = true;
      console.log('[HybridAnalytics] Hybrid Firebase Analytics Service initialized successfully');
      console.log(`[HybridAnalytics] School Serial: ${this.schoolSerial}`);

    } catch (error) {
      console.error('[HybridAnalytics] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Start a reading session with comprehensive data collection
   */
  async startPageSession(bookId: number, bookTitle: string, pageNumber: number, wordsOnPage?: number): Promise<string> {
    try {
      await this.ensureInitialized();
      
      if (!this.schoolSerial) {
        throw new Error('Device not registered - cannot start analytics session');
      }

      const sessionId = this.generateSessionId(bookId, pageNumber);
      const now = Date.now();
      const timestamp = Timestamp.fromMillis(now);

      console.log(`[HybridAnalytics] Starting session - Book: ${bookId}, Page: ${pageNumber}, Session: ${sessionId}`);

      // End any existing session for this page
      await this.endPageSession(bookId, pageNumber);

      // Create session data
      const sessionData: SessionData = {
        sessionId,
        schoolSerial: this.schoolSerial,
        bookId,
        bookTitle,
        pageNumber,
        startTime: timestamp,
        deviceInfo: {
          platform: 'expo',
          appVersion: '1.0.1'
        }
      };

      // Only add readingMetrics if wordsOnPage is provided
      if (wordsOnPage) {
        sessionData.readingMetrics = {
          wordsOnPage,
          estimatedWordsRead: 0,
          readingSpeed: 0
        };
      }

      // Store in local cache
      this.activeSessions.set(`${bookId}_${pageNumber}`, sessionData);

      // Create session document
      const operation: QueuedOperation = {
        id: `session_start_${sessionId}`,
        type: 'session_start',
        data: sessionData,
        timestamp: now,
        retryCount: 0
      };

      await this.executeOrQueue(operation);

      // Log Analytics event
      await this.logAnalyticsEvent('page_view_start', {
        book_id: bookId,
        book_title: bookTitle,
        page_number: pageNumber,
        session_id: sessionId
      });

      return sessionId;
    } catch (error) {
      console.error('[HybridAnalytics] Failed to start page session:', error);
      return this.generateSessionId(bookId, pageNumber);
    }
  }

  /**
   * End a reading session and update all analytics
   */
  async endPageSession(bookId: number, pageNumber: number): Promise<void> {
    try {
      const sessionKey = `${bookId}_${pageNumber}`;
      const session = this.activeSessions.get(sessionKey);

      if (!session) return;

      const now = Date.now();
      const endTime = Timestamp.fromMillis(now);
      const duration = now - session.startTime.toMillis();

      console.log(`[HybridAnalytics] Ending session - Book: ${bookId}, Page: ${pageNumber}, Duration: ${duration}ms`);

      // Update session with end data
      session.endTime = endTime;
      session.duration = duration;

      // Calculate reading metrics if available
      if (session.readingMetrics?.wordsOnPage) {
        const minutes = duration / 60000;
        session.readingMetrics.estimatedWordsRead = session.readingMetrics.wordsOnPage;
        session.readingMetrics.readingSpeed = minutes > 0 ? session.readingMetrics.wordsOnPage / minutes : 0;
      }

      // Update session document
      const sessionOperation: QueuedOperation = {
        id: `session_end_${session.sessionId}`,
        type: 'session_end',
        data: session,
        timestamp: now,
        retryCount: 0
      };

      await this.executeOrQueue(sessionOperation);

      // Update analytics
      await this.updatePageAnalytics(session);
      await this.updateBookAnalytics(session);
      await this.updateDailySummary(session);

      // Remove from active sessions
      this.activeSessions.delete(sessionKey);

      // Log Analytics event
      await this.logAnalyticsEvent('page_view_end', {
        book_id: bookId,
        page_number: pageNumber,
        session_id: session.sessionId,
        duration_ms: duration
      });

    } catch (error) {
      console.error('[HybridAnalytics] Failed to end page session:', error);
    }
  }

  /**
   * Update page-level analytics
   */
  private async updatePageAnalytics(session: SessionData): Promise<void> {
    if (!session.endTime || !session.duration) return;

    const pageAnalyticsPath = FirebasePaths.pageAnalytics(session.schoolSerial, session.bookId, session.pageNumber);
    
    try {
      const pageAnalyticsRef = doc(this.db, pageAnalyticsPath);
      const existingDoc = await getDoc(pageAnalyticsRef);

      if (existingDoc.exists()) {
        // Update existing analytics
        const currentData = existingDoc.data() as PageAnalyticsData;
        const newTotalVisits = currentData.aggregatedStats.totalVisits + 1;
        const newTotalTime = currentData.aggregatedStats.totalTimeSpent + session.duration;
        const newAverageTime = newTotalTime / newTotalVisits;

        const updates = {
          'aggregatedStats.totalVisits': increment(1),
          'aggregatedStats.totalTimeSpent': increment(session.duration),
          'aggregatedStats.averageTimePerVisit': newAverageTime,
          'aggregatedStats.minTime': Math.min(currentData.aggregatedStats.minTime, session.duration),
          'aggregatedStats.maxTime': Math.max(currentData.aggregatedStats.maxTime, session.duration),
          'aggregatedStats.uniqueSessions': increment(1),
          'temporalData.lastVisit': session.endTime,
          'lastUpdated': Timestamp.now()
        };

        // Calculate difficulty level
        if (session.duration > 30000) { // More than 30 seconds indicates difficulty
          (updates as any)['difficulty.strugglingIndicators'] = Math.min(1, (currentData.difficulty.strugglingIndicators * currentData.aggregatedStats.totalVisits + 1) / newTotalVisits);
        }

        await updateDoc(pageAnalyticsRef, updates);
      } else {
        // Create new analytics document
        const newAnalytics: PageAnalyticsData = {
          schoolSerial: session.schoolSerial,
          bookId: session.bookId,
          pageNumber: session.pageNumber,
          aggregatedStats: {
            totalVisits: 1,
            totalTimeSpent: session.duration,
            averageTimePerVisit: session.duration,
            medianTime: session.duration,
            minTime: session.duration,
            maxTime: session.duration,
            uniqueSessions: 1,
            revisitCount: 0
          },
          temporalData: {
            firstVisit: session.startTime,
            lastVisit: session.endTime,
            visitsByWeek: {
              [this.getWeekKey(new Date())]: 1
            }
          },
          difficulty: {
            readingLevel: session.duration > 30000 ? 'challenging' : session.duration > 15000 ? 'moderate' : 'easy',
            strugglingIndicators: session.duration > 30000 ? 0.5 : 0.1,
            masteryLevel: session.duration < 15000 ? 0.8 : 0.5
          },
          lastUpdated: Timestamp.now()
        };

        await setDoc(pageAnalyticsRef, newAnalytics);
      }

      console.log(`[HybridAnalytics] Updated page analytics for Book ${session.bookId}, Page ${session.pageNumber}`);
    } catch (error) {
      console.error('[HybridAnalytics] Failed to update page analytics:', error);
    }
  }

  /**
   * Update book-level analytics
   */
  private async updateBookAnalytics(session: SessionData): Promise<void> {
    if (!session.endTime || !session.duration) return;

    const bookAnalyticsPath = FirebasePaths.bookAnalytics(session.schoolSerial, session.bookId);
    
    try {
      const bookAnalyticsRef = doc(this.db, bookAnalyticsPath);
      const existingDoc = await getDoc(bookAnalyticsRef);

      if (existingDoc.exists()) {
        // Update existing book analytics
        const currentData = existingDoc.data() as BookAnalyticsData;
        const newTotalSessions = currentData.overallStats.totalSessions + 1;
        const newTotalTime = currentData.overallStats.totalTimeSpent + session.duration;
        const newPagesAccessed = new Set([...Array(currentData.overallStats.pagesAccessed), session.pageNumber]).size;

        const updates = {
          'overallStats.totalSessions': increment(1),
          'overallStats.totalTimeSpent': increment(session.duration),
          'overallStats.averageTimePerPage': newTotalTime / newPagesAccessed,
          'overallStats.pagesAccessed': newPagesAccessed,
          'overallStats.completionPercentage': (newPagesAccessed / currentData.overallStats.totalPages) * 100,
          'progressTracking.currentPage': session.pageNumber,
          'progressTracking.farthestPageReached': Math.max(currentData.progressTracking.farthestPageReached, session.pageNumber),
          'readingPatterns.averageSessionLength': (newTotalTime / newTotalSessions) / 60000, // in minutes
          'lastUpdated': Timestamp.now()
        };

        await updateDoc(bookAnalyticsRef, updates);
      } else {
        // Create new book analytics document
        const newBookAnalytics: BookAnalyticsData = {
          schoolSerial: session.schoolSerial,
          bookId: session.bookId,
          bookTitle: session.bookTitle,
          overallStats: {
            totalPages: 50, // Default, should be updated with actual page count
            pagesAccessed: 1,
            completionPercentage: 2, // 1/50 * 100
            totalTimeSpent: session.duration,
            averageTimePerPage: session.duration,
            totalSessions: 1
          },
          progressTracking: {
            currentPage: session.pageNumber,
            farthestPageReached: session.pageNumber,
            consecutivePagesRead: 1,
            pagesSkipped: [],
            pagesRevisited: []
          },
          readingPatterns: {
            averageSessionLength: session.duration / 60000, // in minutes
            preferredReadingTime: this.getTimeOfDay(new Date()),
            readingConsistency: 1.0,
            difficultyProgression: 'stable'
          },
          pagePerformance: {
            easiestPages: session.duration < 15000 ? [session.pageNumber] : [],
            challengingPages: session.duration > 30000 ? [session.pageNumber] : [],
            popularPages: [session.pageNumber]
          },
          lastUpdated: Timestamp.now()
        };

        await setDoc(bookAnalyticsRef, newBookAnalytics);
      }

      console.log(`[HybridAnalytics] Updated book analytics for Book ${session.bookId}`);
    } catch (error) {
      console.error('[HybridAnalytics] Failed to update book analytics:', error);
    }
  }

  /**
   * Update daily summary
   */
  private async updateDailySummary(session: SessionData): Promise<void> {
    if (!session.endTime || !session.duration) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dailySummaryPath = FirebasePaths.dailySummary(session.schoolSerial, today);
    
    try {
      const dailySummaryRef = doc(this.db, dailySummaryPath);
      const existingDoc = await getDoc(dailySummaryRef);

      const sessionTime = new Date(session.startTime.toMillis());
      const timeString = sessionTime.toTimeString().split(' ')[0]; // HH:MM:SS

      if (existingDoc.exists()) {
        // Update existing daily summary
        const currentData = existingDoc.data() as DailySummaryData;
        const newTotalSessions = currentData.dailyActivity.totalSessionsStarted + 1;
        const newTotalTime = currentData.dailyActivity.totalReadingTime + session.duration;
        const booksAccessed = Array.from(new Set([...currentData.dailyActivity.booksAccessed, session.bookId]));

        const updates = {
          'dailyActivity.totalSessionsStarted': increment(1),
          'dailyActivity.totalSessionsCompleted': increment(1),
          'dailyActivity.totalReadingTime': increment(session.duration),
          'dailyActivity.booksAccessed': booksAccessed,
          'dailyActivity.pagesRead': increment(1),
          'dailyActivity.uniquePagesVisited': increment(1),
          'performance.averageSessionDuration': newTotalTime / newTotalSessions,
          'usage.lastSessionTime': timeString,
          'usage.totalActiveHours': newTotalTime / 3600000, // convert to hours
          'lastUpdated': Timestamp.now()
        };

        // Update first session time if this is earlier
        if (timeString < currentData.usage.firstSessionTime) {
          (updates as any)['usage.firstSessionTime'] = timeString;
        }

        await updateDoc(dailySummaryRef, updates);
      } else {
        // Create new daily summary
        const newDailySummary: DailySummaryData = {
          date: today,
          schoolSerial: session.schoolSerial,
          dailyActivity: {
            totalSessionsStarted: 1,
            totalSessionsCompleted: 1,
            totalReadingTime: session.duration,
            booksAccessed: [session.bookId],
            pagesRead: 1,
            uniquePagesVisited: 1
          },
          performance: {
            averageSessionDuration: session.duration,
            readingEfficiency: 1.0,
            focusScore: session.duration > 10000 ? 0.8 : 0.5,
            improvementFromYesterday: 0
          },
          usage: {
            firstSessionTime: timeString,
            lastSessionTime: timeString,
            totalActiveHours: session.duration / 3600000,
            peakReadingHour: timeString.split(':')[0] + ':00'
          },
          lastUpdated: Timestamp.now()
        };

        await setDoc(dailySummaryRef, newDailySummary);
      }

      console.log(`[HybridAnalytics] Updated daily summary for ${today}`);
    } catch (error) {
      console.error('[HybridAnalytics] Failed to update daily summary:', error);
    }
  }

  /**
   * Execute operation or add to offline queue
   */
  private async executeOrQueue(operation: QueuedOperation): Promise<void> {
    try {
      await this.executeOperation(operation);
    } catch (error) {
      console.log(`[HybridAnalytics] Operation failed, queuing for retry: ${operation.id}`);
      this.offlineQueue.push(operation);
      await this.saveOfflineQueue();
    }
  }

  /**
   * Execute a queued operation
   */
  private async executeOperation(operation: QueuedOperation): Promise<void> {
    if (!this.db || !this.schoolSerial) {
      throw new Error('Firebase not available');
    }

    try {
      await enableNetwork(this.db);
      
      switch (operation.type) {
        case 'session_start':
        case 'session_end':
          // Handle timestamp conversion for offline queue operations
          let startTimeMillis: number;
          if (operation.data.startTime && typeof operation.data.startTime.toMillis === 'function') {
            // Fresh timestamp object
            startTimeMillis = operation.data.startTime.toMillis();
          } else if (operation.data.startTime && typeof operation.data.startTime === 'object' && operation.data.startTime.seconds) {
            // Deserialized timestamp from AsyncStorage
            startTimeMillis = operation.data.startTime.seconds * 1000 + (operation.data.startTime.nanoseconds || 0) / 1000000;
          } else if (typeof operation.data.startTime === 'number') {
            // Already a number
            startTimeMillis = operation.data.startTime;
          } else {
            // Fallback to operation timestamp
            startTimeMillis = operation.timestamp;
          }

          // Convert timestamps back to proper Timestamp objects for Firestore
          const sessionData = { ...operation.data };
          if (sessionData.startTime) {
            sessionData.startTime = Timestamp.fromMillis(typeof sessionData.startTime === 'number' ? sessionData.startTime : startTimeMillis);
          }
          if (sessionData.endTime && typeof sessionData.endTime !== 'object') {
            sessionData.endTime = Timestamp.fromMillis(typeof sessionData.endTime === 'number' ? sessionData.endTime : Date.now());
          }
          if (sessionData.lastUpdated && typeof sessionData.lastUpdated !== 'object') {
            sessionData.lastUpdated = Timestamp.now();
          }

          const sessionPath = FirebasePaths.session(
            operation.data.schoolSerial,
            startTimeMillis,
            operation.data.sessionId
          );
          const sessionRef = doc(this.db, sessionPath);
          await setDoc(sessionRef, sessionData, { merge: true });
          break;

        default:
          console.warn(`[HybridAnalytics] Unknown operation type: ${operation.type}`);
      }
    } catch (error: any) {
      const errorInfo = FirebaseMobileConfig.handleMobileFirebaseError(error);
      console.log(`[HybridAnalytics] Operation error: ${errorInfo.message}`);
      if (errorInfo.shouldRetry) {
        throw new Error(`Retryable error: ${errorInfo.message}`);
      } else {
        throw new Error(`Permanent error: ${errorInfo.message}`);
      }
    }
  }

  // Helper methods
  private generateSessionId(bookId: number, pageNumber: number): string {
    return `${bookId}_${pageNumber}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private async initializeSchoolDocument(registrationData: any): Promise<void> {
    try {
      const schoolPath = FirebasePaths.school(this.schoolSerial!);
      const schoolRef = doc(this.db, schoolPath);
      const schoolData = {
        schoolName: registrationData.schoolName,
        serialNumber: registrationData.serialNumber,
        registrationDate: registrationData.registrationDate,
        lastUpdated: Timestamp.now()
      };
      await setDoc(schoolRef, schoolData, { merge: true });
    } catch (error) {
      console.error('[HybridAnalytics] Failed to initialize school document:', error);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  private setupNetworkMonitoring(): void {
    this.isOnline = true;
  }

  private startRetryTimer(): void {
    if (this.retryTimer) {
      clearInterval(this.retryTimer);
    }

    this.retryTimer = setInterval(async () => {
      if (this.isOnline && this.offlineQueue.length > 0) {
        await this.processOfflineQueue();
      }
    }, this.RETRY_BASE_DELAY * 2);
  }

  private async processOfflineQueue(): Promise<void> {
    if (!this.isOnline || !this.db || !this.schoolSerial || this.offlineQueue.length === 0) {
      return;
    }

    console.log(`[HybridAnalytics] Processing offline queue: ${this.offlineQueue.length} operations`);

    const batches = this.chunkArray(this.offlineQueue, this.BATCH_SIZE);
    
    for (const batch of batches) {
      const successfulOperations: string[] = [];
      
      for (const operation of batch) {
        try {
          await this.executeOperation(operation);
          successfulOperations.push(operation.id);
        } catch (error) {
          operation.retryCount++;
          
          if (operation.retryCount >= this.MAX_RETRY_ATTEMPTS) {
            console.error(`[HybridAnalytics] Operation failed after ${this.MAX_RETRY_ATTEMPTS} attempts, removing from queue:`, operation.id);
            successfulOperations.push(operation.id); // Remove from queue
          }
        }
      }

      // Remove successful operations from queue
      this.offlineQueue = this.offlineQueue.filter(op => !successfulOperations.includes(op.id));
    }

    await this.saveOfflineQueue();
  }

  private async loadOfflineQueue(): Promise<void> {
    try {
      const queueData = await AsyncStorage.getItem(this.OFFLINE_QUEUE_KEY);
      if (queueData) {
        const rawQueue = JSON.parse(queueData);
        
        // Filter out potentially corrupted operations and fix timestamps
        this.offlineQueue = rawQueue.filter((op: any) => {
          try {
            // Basic validation
            if (!op.id || !op.type || !op.data || !op.data.sessionId) {
              console.warn(`[HybridAnalytics] Removing invalid queued operation: ${op.id || 'unknown'}`);
              return false;
            }
            
            // Fix timestamp issues
            if (op.data.startTime && typeof op.data.startTime === 'object' && !op.data.startTime.toMillis) {
              // Convert deserialized timestamp back to proper format
              if (op.data.startTime.seconds) {
                op.data.startTime = op.data.startTime.seconds * 1000 + (op.data.startTime.nanoseconds || 0) / 1000000;
              }
            }
            
            if (op.data.endTime && typeof op.data.endTime === 'object' && !op.data.endTime.toMillis) {
              if (op.data.endTime.seconds) {
                op.data.endTime = op.data.endTime.seconds * 1000 + (op.data.endTime.nanoseconds || 0) / 1000000;
              }
            }
            
            return true;
          } catch (error) {
            console.warn(`[HybridAnalytics] Removing corrupted queued operation: ${op.id || 'unknown'}`, error);
            return false;
          }
        });
        
        console.log(`[HybridAnalytics] Loaded offline queue: ${this.offlineQueue.length} operations`);
      }
    } catch (error) {
      console.error('[HybridAnalytics] Failed to load offline queue:', error);
      // Clear corrupted queue
      this.offlineQueue = [];
      await this.saveOfflineQueue();
    }
  }

  private async saveOfflineQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.OFFLINE_QUEUE_KEY, JSON.stringify(this.offlineQueue));
    } catch (error) {
      console.error('[HybridAnalytics] Failed to save offline queue:', error);
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private async logAnalyticsEvent(eventName: string, parameters: any): Promise<void> {
    try {
      if (this.analytics) {
        await logEvent(this.analytics, eventName, parameters);
      }
    } catch (error) {
      console.warn('[HybridAnalytics] Failed to log analytics event:', error);
    }
  }

  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[HybridAnalytics][${level.toUpperCase()}][${timestamp}] ${message}`;
    
    if (true) { // Enable logging by default
      switch (level) {
        case 'error':
          console.error(logMessage, ...args);
          break;
        case 'warn':
          console.warn(logMessage, ...args);
          break;
        case 'debug':
          console.log(logMessage, ...args);
          break;
        default:
          console.log(logMessage, ...args);
      }
    }
  }

  /**
   * Test connection and create test documents
   */
  async testFirebaseConnection(): Promise<boolean> {
    try {
      console.log('[HybridAnalytics] Testing Firebase connection...');
      await this.ensureInitialized();
      
      if (!this.db || !this.schoolSerial) {
        return false;
      }

      // Test session creation
      const testSessionData: SessionData = {
        sessionId: 'test_999_1_' + Date.now(),
        schoolSerial: this.schoolSerial,
        bookId: 999,
        bookTitle: 'Test Book',
        pageNumber: 1,
        startTime: Timestamp.now(),
        endTime: Timestamp.now(),
        duration: 5000,
        deviceInfo: {
          platform: 'expo',
          appVersion: '1.0.1'
        }
      };

      const sessionPath = FirebasePaths.session(this.schoolSerial, Date.now(), testSessionData.sessionId);
      const sessionRef = doc(this.db, sessionPath);
      await setDoc(sessionRef, testSessionData);

      console.log('[HybridAnalytics] Test session created successfully!');
      return true;
    } catch (error) {
      console.error('[HybridAnalytics] Firebase test failed:', error);
      return false;
    }
  }

  /**
   * Resume all active sessions (for app state management)
   */
  async resumeAllSessions(): Promise<void> {
    console.log('[HybridAnalytics] Resuming all active sessions');
    // For now, just log - implement session resumption logic if needed
  }

  /**
   * Pause all active sessions (for app state management)
   */
  async pauseAllSessions(): Promise<void> {
    console.log('[HybridAnalytics] Pausing all active sessions');
    // End all active sessions when app goes to background
    const sessionPromises = Array.from(this.activeSessions.values()).map(session =>
      this.endPageSession(session.bookId, session.pageNumber)
    );
    await Promise.all(sessionPromises);
  }

  /**
   * Check if Firebase is connected and working
   */
  isConnected(): boolean {
    return this.isInitialized && this.db !== null && this.schoolSerial !== null;
  }

  /**
   * Clear offline queue (useful for debugging corrupted queue issues)
   */
  async clearOfflineQueue(): Promise<void> {
    try {
      this.offlineQueue = [];
      await AsyncStorage.removeItem(this.OFFLINE_QUEUE_KEY);
      console.log('[HybridAnalytics] Offline queue cleared');
    } catch (error) {
      console.error('[HybridAnalytics] Failed to clear offline queue:', error);
    }
  }

  /**
   * Get analytics summary for sync dialog
   */
  async getAnalyticsSummary(): Promise<any> {
    // For now, return a mock summary - implement actual data aggregation later
    return {
      totalSessions: this.activeSessions.size,
      totalBooks: 2,
      totalPagesAccessed: 10,
      totalActiveTime: 120000,
      averageSessionDuration: 24000,
      lastUpdated: Timestamp.now(),
      mostAccessedBooks: [
        { bookId: 1, bookTitle: "Grade 3 English Book", accessCount: 3, totalTime: 90000 },
        { bookId: 2, bookTitle: "Grade 4 English Book", accessCount: 2, totalTime: 30000 }
      ],
      dailyUsage: []
    };
  }
}

export default HybridFirebaseAnalyticsService;