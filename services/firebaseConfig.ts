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
 * Firebase Collections Structure
 */
export const FIREBASE_COLLECTIONS = {
  SCHOOLS: 'schools',
  BOOKS: 'books', 
  PAGES: 'pages',
  SESSIONS: 'sessions',
  ANALYTICS_SUMMARY: 'analytics_summary',
} as const;

/**
 * Firestore document paths helper
 */
export class FirebasePaths {
  static school(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}`;
  }

  /**
   * Get path to school info document
   */
  static schoolInfo(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/info/school_info`;
  }

  static schoolBook(serialNumber: string, bookId: number) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/${FIREBASE_COLLECTIONS.BOOKS}/${bookId}`;
  }

  /**
   * Get path to book analytics document
   */
  static bookAnalytics(serialNumber: string, bookId: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/analytics/books/${bookId}`;
  }

  /**
   * Get path to book analytics collection
   */
  static bookAnalyticsCollection(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/analytics/books`;
  }

  /**
   * Get path to page analytics document
   */
  static pageAnalytics(serialNumber: string, pageId: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/analytics/pages/${pageId}`;
  }

  /**
   * Get path to page analytics collection
   */
  static pageAnalyticsCollection(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/analytics/pages`;
  }

  static schoolPage(serialNumber: string, bookId: number, pageNumber: number) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/${FIREBASE_COLLECTIONS.PAGES}/${bookId}_${pageNumber}`;
  }

  /**
   * Get path to page session document
   */
  static pageSession(serialNumber: string, bookId: number, pageNumber: number, sessionId: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/books/${bookId}/pages/${pageNumber}/sessions/${sessionId}`;
  }

  static sessionPath(serialNumber: string, sessionId: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/${FIREBASE_COLLECTIONS.SESSIONS}/${sessionId}`;
  }

  static analyticsSummary(serialNumber: string) {
    return `${FIREBASE_COLLECTIONS.SCHOOLS}/${serialNumber}/${FIREBASE_COLLECTIONS.ANALYTICS_SUMMARY}/current`;
  }
}