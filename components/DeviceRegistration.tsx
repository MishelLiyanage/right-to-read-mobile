import { useThemeColor } from '@/hooks/useThemeColor';
import { DeviceRegistrationService } from '@/services/deviceRegistrationService';
import { SchoolValidationService } from '@/services/schoolValidationService';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface DeviceRegistrationProps {
  onRegistrationComplete: () => void;
}

export default function DeviceRegistration({ onRegistrationComplete }: DeviceRegistrationProps) {
  const [serialNumber, setSerialNumber] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Initialize schools data when component mounts
  useEffect(() => {
    SchoolValidationService.initializeSchools();
  }, []);

  const validateForm = (): boolean => {
    if (!serialNumber.trim()) {
      Alert.alert('Validation Error', 'Please enter the device serial number.');
      return false;
    }
    return true;
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    try {
      // Validate serial number and get school name
      const schoolName = await SchoolValidationService.getSchoolNameForSerial(
        serialNumber.trim()
      );

      if (!schoolName) {
        Alert.alert(
          'Invalid Serial Number',
          'The serial number you entered is not valid. Please check your device serial number and try again.',
          [{ text: 'OK' }]
        );
        setIsRegistering(false);
        return;
      }

      // If validation passes, register the device
      await DeviceRegistrationService.registerDevice(
        schoolName, 
        serialNumber.trim()
      );
      
      Alert.alert(
        'Registration Successful',
        'Your device has been registered successfully!',
        [
          { 
            text: 'Back', 
            style: 'cancel',
            onPress: () => setIsRegistering(false) 
          },
          { 
            text: 'Continue', 
            onPress: onRegistrationComplete 
          }
        ]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        'There was an error registering your device. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      // Don't set isRegistering to false here if success alert is shown
      // It will be handled by the alert buttons
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/registration.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            {/* Glassmorphism Card Container */}
            <BlurView intensity={10} tint="light" style={styles.glassCard}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>DEVICE REGISTRATION</Text>
                <Text style={styles.subtitle}>
                  Please enter your device serial number to register and authenticate your device.
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Serial Number Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Device Serial Number</Text>
                  <View style={styles.glassInput}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter device serial number"
                      placeholderTextColor="#a0aec0"
                      value={serialNumber}
                      onChangeText={setSerialNumber}
                      maxLength={50}
                      autoCapitalize="characters"
                      editable={!isRegistering}
                    />
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    (!serialNumber.trim() || isRegistering) && styles.disabledButton
                  ]}
                  onPress={handleRegistration}
                  disabled={!serialNumber.trim() || isRegistering}
                >
                  {isRegistering ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.registerButtonText}>Register Device</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Info Text */}
              <View style={styles.footer}>
                <Text style={styles.infoText}>
                  This information is used for analytics purposes to improve the app experience.
                </Text>
              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </View>




    </ImageBackground>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glassCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 15,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 6,
  },
  glassInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(10, 126, 164, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputText: {
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
  },
  placeholderText: {
    color: '#718096',
  },
  textInput: {
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    minHeight: 56,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    marginTop: 15,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },

});