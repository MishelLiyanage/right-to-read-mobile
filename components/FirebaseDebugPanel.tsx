import { DeviceRegistrationService } from '@/services/deviceRegistrationService';
import FirebaseAnalyticsService from '@/services/firebaseAnalyticsServiceProduction';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function FirebaseDebugPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const analyticsService = FirebaseAnalyticsService.getInstance();
      const result = await analyticsService.testFirebaseConnection();
      
      const message = result 
        ? '✅ Firebase connection successful!' 
        : '❌ Firebase connection failed';
      
      setLastResult(message);
      Alert.alert('Firebase Test', message);
    } catch (error) {
      const errorMessage = `❌ Error: ${error}`;
      setLastResult(errorMessage);
      Alert.alert('Firebase Test', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestRegistration = async () => {
    try {
      const regData = await DeviceRegistrationService.getRegistrationData();
      const message = regData 
        ? `✅ Device registered: ${regData.schoolName} (${regData.serialNumber})`
        : '❌ Device not registered';
      
      setLastResult(message);
      Alert.alert('Registration Test', message);
    } catch (error) {
      const errorMessage = `❌ Registration error: ${error}`;
      setLastResult(errorMessage);
      Alert.alert('Registration Test', errorMessage);
    }
  };

  const handleTestSession = async () => {
    setIsLoading(true);
    try {
      const analyticsService = FirebaseAnalyticsService.getInstance();
      
      // Start a test session
      const sessionId = await analyticsService.startPageSession(999, 'Test Book', 1);
      console.log('[DEBUG] Test session started:', sessionId);
      
      // Wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // End the session
      await analyticsService.endPageSession(999, 1);
      console.log('[DEBUG] Test session ended');
      
      const message = '✅ Test session completed - check Firebase console!';
      setLastResult(message);
      Alert.alert('Session Test', message);
    } catch (error) {
      const errorMessage = `❌ Session test error: ${error}`;
      setLastResult(errorMessage);
      Alert.alert('Session Test', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>🔥 Firebase Debug Panel</ThemedText>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleTestRegistration}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>Test Registration</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleTestConnection}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>Test Connection</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleTestSession}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>Test Session</ThemedText>
        </TouchableOpacity>
      </View>

      {lastResult ? (
        <View style={styles.resultContainer}>
          <ThemedText style={styles.resultText}>
            {lastResult}
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Platform: Android Mobile (Expo)
          </ThemedText>
          <ThemedText style={styles.infoText}>
            Firebase SDK: Web SDK with mobile optimizations
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.instructions}>
        <ThemedText style={styles.instructionText}>
          Instructions:
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          1. First test registration
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          2. Then test Firebase connection
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          3. Finally test a session
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          4. Check Firebase Console for data
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  resultText: {
    fontSize: 14,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.7,
  },
});