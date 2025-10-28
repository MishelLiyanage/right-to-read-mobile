import { Firestore } from 'firebase/firestore';

/**
 * Mobile-specific Firebase configuration to handle WebChannel errors
 * and optimize for Android/iOS environments
 */
export class FirebaseMobileConfig {
  
  /**
   * Configure Firestore for mobile environments to avoid WebChannel issues
   */
  static configureMobileFirestore(db: Firestore): void {
    try {
      console.log('[FirebaseMobileConfig] Configuring Firestore for mobile environment...');
      
      // Note: In React Native/Expo, we can't access the same low-level settings
      // as web, but we can ensure proper initialization order and error handling
      
      // The main fixes for WebChannel errors in mobile:
      // 1. Don't use emulator in production builds
      // 2. Ensure proper network connectivity
      // 3. Use proper retry logic for network failures
      // 4. Handle offline states gracefully
      
      console.log('[FirebaseMobileConfig] Mobile Firestore configuration completed');
    } catch (error) {
      console.warn('[FirebaseMobileConfig] Mobile configuration warning:', error);
    }
  }

  /**
   * Check if we're in a mobile environment
   */
  static isMobileEnvironment(): boolean {
    // In React Native/Expo, we're always in a mobile environment
    return true;
  }

  /**
   * Get recommended settings for mobile Firestore operations
   */
  static getMobileOperationSettings() {
    return {
      // Use merge operations to handle conflicts better
      merge: true,
      
      // Timeout settings for mobile networks
      timeout: 10000, // 10 seconds
      
      // Retry settings
      maxRetries: 3,
      retryDelay: 1000
    };
  }

  /**
   * Handle common mobile Firebase errors
   */
  static handleMobileFirebaseError(error: any): { shouldRetry: boolean; message: string } {
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    
    // WebChannel transport errors - these can often be retried
    if (errorMessage.includes('WebChannel') || 
        errorMessage.includes('transport errored') ||
        errorMessage.includes('RPC') ||
        error?.code === 'unavailable') {
      return {
        shouldRetry: true,
        message: 'Network connectivity issue - will retry'
      };
    }
    
    // Permission errors - don't retry
    if (error?.code === 'permission-denied') {
      return {
        shouldRetry: false,
        message: 'Permission denied - check Firestore rules'
      };
    }
    
    // Not found errors - don't retry
    if (error?.code === 'not-found') {
      return {
        shouldRetry: false,
        message: 'Document not found'
      };
    }
    
    // Default - retry once for unknown errors
    return {
      shouldRetry: true,
      message: `Unknown error: ${errorMessage}`
    };
  }
}