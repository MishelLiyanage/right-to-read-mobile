/**
 * Simplified Firebase Configuration for Android-only Expo App
 * 
 * Since this app is Android-only with Expo, we only need:
 * - projectId (for Firestore)
 * - storageBucket (for Firestore)
 * - messagingSenderId (optional, for push notifications if needed later)
 * 
 * We DON'T need:
 * - apiKey (only needed for web/iOS authentication)
 * - authDomain (only needed for web authentication)
 * - appId (only needed for web)
 * - measurementId (only needed for web analytics)
 */

export interface FirebaseEnvironmentConfig {
  projectId: string;
  storageBucket: string;
  messagingSenderId?: string; // Optional for future push notifications
}

export interface EnvironmentConfig {
  firebase: FirebaseEnvironmentConfig;
  environment: 'development' | 'staging' | 'production';
  enableAnalytics: boolean;
  enableOfflineSupport: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Environment Detection
 */
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // In Expo, we can use __DEV__ or process.env
  if (__DEV__) {
    return 'development';
  }
  
  // You can set EXPO_PUBLIC_ENVIRONMENT in your build process
  const envVar = process.env.EXPO_PUBLIC_ENVIRONMENT;
  if (envVar === 'staging' || envVar === 'production') {
    return envVar;
  }
  
  return 'development';
};

/**
 * Firebase Configuration per Environment
 * 
 * IMPORTANT: Replace these with your actual Firebase project credentials
 */
const firebaseConfigs: Record<string, FirebaseEnvironmentConfig> = {
  development: {
    // Your actual Firebase project
    projectId: "right-to-read-c7ea9",
    storageBucket: "right-to-read-c7ea9.firebasestorage.app",
    messagingSenderId: "947732622209"
  },
  
  staging: {
    // Same project for staging (you can create a separate one later if needed)
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID_STAGING || "right-to-read-c7ea9",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET_STAGING || "right-to-read-c7ea9.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_STAGING || "947732622209"
  },
  
  production: {
    // Same project for production
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID_PROD || "right-to-read-c7ea9",
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD || "right-to-read-c7ea9.firebasestorage.app",
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD || "947732622209"
  }
};

/**
 * Environment-specific settings
 */
const environmentSettings: Record<string, Omit<EnvironmentConfig, 'firebase'>> = {
  development: {
    environment: 'development',
    enableAnalytics: true, // Enable analytics for testing
    enableOfflineSupport: true,
    logLevel: 'debug'
  },
  
  staging: {
    environment: 'staging',
    enableAnalytics: true,
    enableOfflineSupport: true,
    logLevel: 'info'
  },
  
  production: {
    environment: 'production',
    enableAnalytics: true,
    enableOfflineSupport: true,
    logLevel: 'warn'
  }
};

/**
 * Get current environment configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentEnv = getEnvironment();
  
  return {
    firebase: firebaseConfigs[currentEnv],
    ...environmentSettings[currentEnv]
  };
};

/**
 * Validate Firebase configuration
 */
export const validateFirebaseConfig = (config: FirebaseEnvironmentConfig): boolean => {
  // Check required fields for Android-only Expo app
  if (!config.projectId || config.projectId.includes('demo') || config.projectId.includes('placeholder')) {
    console.warn(`[Firebase Config] Invalid projectId: ${config.projectId}`);
    return false;
  }
  
  if (!config.storageBucket || config.storageBucket.includes('demo') || config.storageBucket.includes('placeholder')) {
    console.warn(`[Firebase Config] Invalid storageBucket: ${config.storageBucket}`);
    return false;
  }
  
  // messagingSenderId is optional but should be valid if provided
  if (config.messagingSenderId && 
      (config.messagingSenderId.includes('demo') || config.messagingSenderId.includes('placeholder'))) {
    console.warn(`[Firebase Config] Invalid messagingSenderId: ${config.messagingSenderId}`);
    return false;
  }
  
  return true;
};

/**
 * Get current environment name
 */
export const getCurrentEnvironment = (): string => {
  return getEnvironment();
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return getEnvironment() === 'production';
};

/**
 * Check if analytics should be enabled
 */
export const shouldEnableAnalytics = (): boolean => {
  const config = getEnvironmentConfig();
  return config.enableAnalytics; // Remove __DEV__ check to enable in all builds
};