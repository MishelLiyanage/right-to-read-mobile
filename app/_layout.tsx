import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, View } from 'react-native';

import DeviceRegistration from '@/components/DeviceRegistration';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AnalyticsService } from '@/services/analyticsService';
import AutoSyncService from '@/services/autoSyncService';
import { DeviceRegistrationService } from '@/services/deviceRegistrationService';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
    initializeAnalytics();
    setupAppStateListener();
    setupAutoSync();
  }, []);

  const initializeAnalytics = async () => {
    try {
      const analyticsService = AnalyticsService.getInstance();
      await analyticsService.initialize();
      console.log('[RootLayout] Analytics service initialized');
    } catch (error) {
      console.error('[RootLayout] Failed to initialize analytics service:', error);
    }
  };

  const setupAutoSync = () => {
    try {
      const autoSync = AutoSyncService.getInstance();
      autoSync.startMonitoring();
      console.log('[RootLayout] Auto-sync service started');
    } catch (error) {
      console.error('[RootLayout] Failed to start auto-sync service:', error);
    }

    // Cleanup function
    return () => {
      const autoSync = AutoSyncService.getInstance();
      autoSync.stopMonitoring();
    };
  };

  const setupAppStateListener = () => {
    const analyticsService = AnalyticsService.getInstance();
    let currentAppState = AppState.currentState;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(`[RootLayout] App state changed: ${currentAppState} -> ${nextAppState}`);
      
      if (currentAppState.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground
        console.log('[RootLayout] App came to foreground - resuming analytics');
        analyticsService.resumeAllSessions().catch((error: any) => {
          console.error('[RootLayout] Error resuming analytics sessions:', error);
        });
      } else if (currentAppState === 'active' && nextAppState.match(/inactive|background/)) {
        // App went to background
        console.log('[RootLayout] App went to background - pausing analytics');
        analyticsService.pauseAllSessions().catch((error: any) => {
          console.error('[RootLayout] Error pausing analytics sessions:', error);
        });
      }
      
      currentAppState = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function
    return () => {
      subscription?.remove();
    };
  };

  const checkRegistrationStatus = async () => {
    try {
      const registered = await DeviceRegistrationService.isDeviceRegistered();
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking registration status:', error);
      // On error, assume not registered to be safe
      setIsRegistered(false);
    } finally {
      setIsCheckingRegistration(false);
    }
  };

  const handleRegistrationComplete = () => {
    setIsRegistered(true);
  };

  if (!loaded || isCheckingRegistration) {
    // Show loading spinner while fonts load or checking registration
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show registration screen if device is not registered
  if (isRegistered === false) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <DeviceRegistration onRegistrationComplete={handleRegistrationComplete} />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  // Show main app if device is registered
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
