import { useThemeColor } from '@/hooks/useThemeColor';
import { DeviceRegistrationService } from '@/services/deviceRegistrationService';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
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

const grades = ['3', '4', '5', '6', '7', '8', '9'];

export default function DeviceRegistration({ onRegistrationComplete }: DeviceRegistrationProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [className, setClassName] = useState<string>('');
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
    setIsGradeDropdownOpen(false);
  };

  const validateForm = (): boolean => {
    if (!selectedGrade.trim()) {
      Alert.alert('Validation Error', 'Please select a grade.');
      return false;
    }
    if (!className.trim()) {
      Alert.alert('Validation Error', 'Please enter your class name.');
      return false;
    }
    if (className.trim().length < 1) {
      Alert.alert('Validation Error', 'Class name must be at least 1 character long.');
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
      await DeviceRegistrationService.registerDevice(selectedGrade, className.trim());
      Alert.alert(
        'Registration Successful',
        'Your device has been registered successfully!',
        [{ text: 'Continue', onPress: onRegistrationComplete }]
      );
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        'There was an error registering your device. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/images/registrationBackground.png')}
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
                  Please provide some information to help us customize your experience.
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Grade Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Select Your Grade</Text>
                  <TouchableOpacity
                    style={styles.glassInput}
                    onPress={() => setIsGradeDropdownOpen(true)}
                    disabled={isRegistering}
                  >
                    <Text style={[styles.inputText, !selectedGrade && styles.placeholderText]}>
                      {selectedGrade ? `Grade ${selectedGrade}` : 'Select Grade'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>
                </View>

                {/* Class Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Enter Your Class</Text>
                  <View style={styles.glassInput}>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g., A, B, C, 1, 2, etc."
                      placeholderTextColor="#a0aec0"
                      value={className}
                      onChangeText={setClassName}
                      maxLength={20}
                      autoCapitalize="characters"
                      editable={!isRegistering}
                    />
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={[
                    styles.registerButton,
                    (!selectedGrade || !className.trim() || isRegistering) && styles.disabledButton
                  ]}
                  onPress={handleRegistration}
                  disabled={!selectedGrade || !className.trim() || isRegistering}
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

      {/* Grade Dropdown Modal */}
      <Modal
        visible={isGradeDropdownOpen}
        transparent={true}
        animated={true}
        onRequestClose={() => setIsGradeDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsGradeDropdownOpen(false)}
        >
          <BlurView intensity={30} tint="dark" style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Grade</Text>
            <FlatList
              data={grades}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.gradeOption}
                  onPress={() => handleGradeSelect(item)}
                >
                  <Text style={styles.gradeOptionText}>Grade {item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
              style={styles.gradeList}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setIsGradeDropdownOpen(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </BlurView>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  glassInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(10, 126, 164, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 54,
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
  dropdownArrow: {
    fontSize: 12,
    color: '#4a5568',
  },
  textInput: {
    fontSize: 16,
    color: '#2d3748',
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gradeList: {
    maxHeight: 300,
  },
  gradeOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
  },
  gradeOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(10, 126, 164, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});