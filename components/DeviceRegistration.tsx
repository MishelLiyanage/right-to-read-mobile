import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DeviceRegistrationService } from '@/services/deviceRegistrationService';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
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

  const renderGradeItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.dropdownItem, { borderBottomColor: textColor + '20' }]}
      onPress={() => handleGradeSelect(item)}
    >
      <ThemedText style={styles.dropdownItemText}>Grade {item}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Welcome to Right to Read!
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Please provide some information to help us customize your experience.
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Grade Selection */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Select Your Grade
              </ThemedText>
              <TouchableOpacity
                style={[
                  styles.dropdown,
                  { borderColor: textColor + '30', backgroundColor: backgroundColor }
                ]}
                onPress={() => setIsGradeDropdownOpen(true)}
                disabled={isRegistering}
              >
                <ThemedText style={[styles.dropdownText, !selectedGrade && styles.placeholderText]}>
                  {selectedGrade ? `Grade ${selectedGrade}` : 'Select Grade'}
                </ThemedText>
                <ThemedText style={styles.dropdownArrow}>▼</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Class Input */}
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Enter Your Class
              </ThemedText>
              <TextInput
                style={[
                  styles.textInput,
                  { 
                    borderColor: textColor + '30', 
                    backgroundColor: backgroundColor,
                    color: textColor
                  }
                ]}
                placeholder="e.g., A, B, C, 1, 2, etc."
                placeholderTextColor={textColor + '60'}
                value={className}
                onChangeText={setClassName}
                maxLength={20}
                autoCapitalize="characters"
                editable={!isRegistering}
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: tintColor },
                (!selectedGrade || !className.trim() || isRegistering) && styles.disabledButton
              ]}
              onPress={handleRegistration}
              disabled={!selectedGrade || !className.trim() || isRegistering}
            >
              {isRegistering ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <ThemedText style={styles.registerButtonText}>
                  Register Device
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <View style={styles.footer}>
            <ThemedText style={styles.infoText}>
              This information is used for analytics purposes to improve the app experience.
            </ThemedText>
          </View>
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
            <View style={[styles.modalContent, { backgroundColor }]}>
              <ThemedText type="defaultSemiBold" style={styles.modalTitle}>
                Select Grade
              </ThemedText>
              <FlatList
                data={grades}
                renderItem={renderGradeItem}
                keyExtractor={(item) => item}
                style={styles.gradeList}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                style={[styles.modalCloseButton, { backgroundColor: tintColor }]}
                onPress={() => setIsGradeDropdownOpen(false)}
              >
                <ThemedText style={styles.modalCloseButtonText}>Close</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 12,
    minHeight: 54,
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    opacity: 0.6,
  },
  dropdownArrow: {
    fontSize: 12,
    opacity: 0.6,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 54,
  },
  registerButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 56,
  },
  disabledButton: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  gradeList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});