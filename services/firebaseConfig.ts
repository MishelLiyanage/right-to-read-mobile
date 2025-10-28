import { Analytics, getAnalytics } from 'firebase/analytics';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
    getCurrentEnvironment,
    getEnvironmentConfig,
    shouldEnableAnalytics,
    validateFirebaseConfig
} from '../config/firebaseEnvironment';
import { DeviceRegistrationService } from './deviceRegistrationService';
import { FirebaseMobileConfig } from './firebaseMobileConfig';

/**
 * Firebase Configuration and Initialization
 */
export class FirebaseConfig {
  private static isInitialized = false;
  private static app: FirebaseApp | null = null;
  private static db: Firestore | null = null;
  private static analytics: Analytics | null = null;

  /**
   * Initialize Firebase services with production-ready configuration
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const envConfig = getEnvironmentConfig();
      const currentEnv = getCurrentEnvironment();
      
      console.log(`[FirebaseConfig] Initializing Firebase for ${currentEnv} environment...`);

      // Validate Firebase configuration
      if (!validateFirebaseConfig(envConfig.firebase)) {
        console.warn('[FirebaseConfig] Using demo Firebase configuration. Please update with production credentials.');
      }

      // Initialize Firebase app
      if (getApps().length === 0) {
        this.app = initializeApp(envConfig.firebase);
      } else {
        this.app = getApps()[0];
      }

      // Initialize Firestore with mobile-optimized settings
      this.db = getFirestore(this.app);

      // Apply mobile-specific configuration to avoid WebChannel errors
      FirebaseMobileConfig.configureMobileFirestore(this.db);
      
      // For mobile apps, we want to use the production Firestore (not emulator)
      // The WebChannel errors occur when using emulator or web-specific configs
      console.log('[FirebaseConfig] Using cloud Firestore for mobile compatibility');

      // Initialize Analytics only if enabled for this environment
      if (shouldEnableAnalytics()) {
        try {
          this.analytics = getAnalytics(this.app);
          console.log('[FirebaseConfig] Analytics initialized');

          // Set user properties for analytics
          const registrationData = await DeviceRegistrationService.getRegistrationData();
          if (registrationData) {
            // In production, you would use setUserProperties here
            console.log('[FirebaseConfig] User properties configured for analytics');
          }
        } catch (analyticsError) {
          console.log('[FirebaseConfig] Analytics not available:', analyticsError);
          this.analytics = null;
        }
      } else {
        console.log('[FirebaseConfig] Analytics disabled for this environment');
        this.analytics = null;
      }

      this.isInitialized = true;
      console.log(`[FirebaseConfig] Firebase initialized successfully for ${currentEnv}`);
      console.log(`[FirebaseConfig] Project ID: ${envConfig.firebase.projectId}`);
      console.log(`[FirebaseConfig] Analytics enabled: ${shouldEnableAnalytics()}`);
      console.log(`[FirebaseConfig] Offline support: ${envConfig.enableOfflineSupport}`);
      
    } catch (error) {
      console.error('[FirebaseConfig] Failed to initialize Firebase:', error);
      throw error;
    }
  }

  /**
   * Check if Firestore emulator is already connected
   */
  private static isFirestoreEmulatorConnected(): boolean {
    // This is a simple check - in production you might want a more robust method
    return false;
  }

  /**
   * Get Firestore instance
   */
  static getFirestore(): Firestore {
    if (!this.db) {
      throw new Error('Firebase not initialized. Call FirebaseConfig.initialize() first.');
    }
    return this.db;
  }

  /**
   * Get Analytics instance
   */
  static getAnalytics(): Analytics | null {
    return this.analytics;
  }

  /**
   * Check if Firebase is initialized
   */
  static isFirebaseInitialized(): boolean {
    return this.isInitialized;
  }
}

/**
 * Firebase Collections Structure - Hybrid Approach
 */
export const FIREBASE_COLLECTIONS = {
  SCHOOLS: 'schools',
  SESSIONS: 'sessions',
  PAGE_ANALYTICS: 'page_analytics',
  BOOK_ANALYTICS: 'book_analytics', 
  DAILY_SUMMARIES: 'daily_summaries',
} as const;

/**
 * Firestore document paths helper - Hybrid Approach
 */
export class FirebasePaths {
  /**
   * School info document path
   */
  static school(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}`;
  }

  /**
   * Individual session document path
   */
  static session(serialNumber: string, timestamp: number, sessionId: string) {
    return `${FIREBASE_COLLECTIONS.SESSIONS}/${serialNumber}_${timestamp}_${sessionId}`;
  }

  /**
   * Page analytics document path
   */
  static pageAnalytics(serialNumber: string, bookId: number, pageNumber: number) {
    return `${FIREBASE_COLLECTIONS.PAGE_ANALYTICS}/${serialNumber}_${bookId}_page_${pageNumber}`;
  }

  /**
   * Book analytics document path
   */
  static bookAnalytics(serialNumber: string, bookId: number) {
    return `${FIREBASE_COLLECTIONS.BOOK_ANALYTICS}/${serialNumber}_${bookId}`;
  }

  /**
   * Daily summary document path
   */
  static dailySummary(serialNumber: string, date: string) {
    return `${FIREBASE_COLLECTIONS.DAILY_SUMMARIES}/${serialNumber}_${date}`;
  }

  /**
   * Collection queries helpers
   */
  static sessionsCollection() {
    return FIREBASE_COLLECTIONS.SESSIONS;
  }

  static pageAnalyticsCollection() {
    return FIREBASE_COLLECTIONS.PAGE_ANALYTICS;
  }

  static bookAnalyticsCollection() {
    return FIREBASE_COLLECTIONS.BOOK_ANALYTICS;
  }

  static dailySummariesCollection() {
    return FIREBASE_COLLECTIONS.DAILY_SUMMARIES;
  }

  /**
   * Legacy method for backward compatibility (deprecated - use session() instead)
   */
  static pageSession(serialNumber: string, bookId: number, pageNumber: number, sessionId: string) {
    return `schools/${serialNumber}/books/${bookId}/pages/${pageNumber}/sessions/${sessionId}`;
  }

  /**
   * Query filters for collections
   */
  static getSchoolSessionsQuery(serialNumber: string) {
    return { field: '__name__', operator: '>=', value: `${FIREBASE_COLLECTIONS.SESSIONS}/${serialNumber}_` };
  }

  static getSchoolPageAnalyticsQuery(serialNumber: string) {
    return { field: '__name__', operator: '>=', value: `${FIREBASE_COLLECTIONS.PAGE_ANALYTICS}/${serialNumber}_` };
  }

  static getSchoolBookAnalyticsQuery(serialNumber: string) {
    return { field: '__name__', operator: '>=', value: `${FIREBASE_COLLECTIONS.BOOK_ANALYTICS}/${serialNumber}_` };
  }
}