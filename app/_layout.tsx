import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import DeviceRegistration from '@/components/DeviceRegistration';
import { useColorScheme } from '@/hooks/useColorScheme';
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
  }, []);

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
