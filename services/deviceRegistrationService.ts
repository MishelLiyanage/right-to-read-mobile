import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DeviceRegistrationData {
  schoolName: string;
  serialNumber: string;
  registrationDate: string;
}

const REGISTRATION_KEY = '@device_registration';
const REGISTRATION_STATUS_KEY = '@registration_status';

export class DeviceRegistrationService {
  /**
   * Check if the device has been registered
   * @returns Promise<boolean> - true if device is registered, false otherwise
   */
  static async isDeviceRegistered(): Promise<boolean> {
    try {
      const status = await AsyncStorage.getItem(REGISTRATION_STATUS_KEY);
      return status === 'true';
    } catch (error) {
      console.error('Error checking registration status:', error);
      return false;
    }
  }

  /**
   * Register the device with user's school name and serial number
   * @param schoolName - Student's school name
   * @param serialNumber - Device serial number
   */
  static async registerDevice(schoolName: string, serialNumber: string): Promise<void> {
    try {
      const registrationData: DeviceRegistrationData = {
        schoolName,
        serialNumber,
        registrationDate: new Date().toISOString(),
      };

      // Store registration data
      await AsyncStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrationData));
      
      // Mark device as registered
      await AsyncStorage.setItem(REGISTRATION_STATUS_KEY, 'true');
      
      console.log('Device registered successfully:', registrationData);
    } catch (error) {
      console.error('Error registering device:', error);
      throw new Error('Failed to register device');
    }
  }

  /**
   * Get the current registration data
   * @returns Promise<DeviceRegistrationData | null> - registration data or null if not registered
   */
  static async getRegistrationData(): Promise<DeviceRegistrationData | null> {
    try {
      const data = await AsyncStorage.getItem(REGISTRATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting registration data:', error);
      return null;
    }
  }

  /**
   * Clear registration data (for testing purposes)
   */
  static async clearRegistration(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REGISTRATION_KEY);
      await AsyncStorage.removeItem(REGISTRATION_STATUS_KEY);
      console.log('Registration data cleared');
    } catch (error) {
      console.error('Error clearing registration data:', error);
    }
  }

  /**
   * Get analytics data for tracking purposes
   * @returns Promise<{schoolName: string, serialNumber: string} | null>
   */
  static async getAnalyticsData(): Promise<{schoolName: string, serialNumber: string} | null> {
    try {
      const data = await this.getRegistrationData();
      return data ? { 
        schoolName: data.schoolName, 
        serialNumber: data.serialNumber 
      } : null;
    } catch (error) {
      console.error('Error getting analytics data:', error);
      return null;
    }
  }
}