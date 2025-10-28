import { DeviceRegistrationData, DeviceRegistrationService } from '@/services/deviceRegistrationService';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  schoolName: string;
  serialNumber: string;
}

export function useDeviceRegistration() {
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [registrationData, setRegistrationData] = useState<DeviceRegistrationData | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegistrationData();
  }, []);

  const loadRegistrationData = async () => {
    try {
      setIsLoading(true);
      
      // Check if device is registered
      const registered = await DeviceRegistrationService.isDeviceRegistered();
      setIsRegistered(registered);

      if (registered) {
        // Load full registration data
        const data = await DeviceRegistrationService.getRegistrationData();
        setRegistrationData(data);

        // Load analytics data
        const analytics = await DeviceRegistrationService.getAnalyticsData();
        setAnalyticsData(analytics);
      }
    } catch (error) {
      console.error('Error loading registration data:', error);
      setIsRegistered(false);
      setRegistrationData(null);
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRegistrationData = async () => {
    await loadRegistrationData();
  };

  const clearRegistrationData = async () => {
    try {
      await DeviceRegistrationService.clearRegistration();
      setIsRegistered(false);
      setRegistrationData(null);
      setAnalyticsData(null);
    } catch (error) {
      console.error('Error clearing registration data:', error);
    }
  };

  return {
    isRegistered,
    registrationData,
    analyticsData,
    isLoading,
    refreshRegistrationData,
    clearRegistrationData,
  };
}

/**
 * Hook to get analytics data for tracking user behavior
 * @returns Analytics data including grade and class information
 */
export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const data = await DeviceRegistrationService.getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  /**
   * Log an event with analytics data for tracking purposes
   * @param eventName - Name of the event to track
   * @param eventData - Additional data for the event
   */
  const logEvent = (eventName: string, eventData?: any) => {
    if (analyticsData) {
      const fullEventData = {
        ...eventData,
        schoolName: analyticsData.schoolName,
        serialNumber: analyticsData.serialNumber,
        timestamp: new Date().toISOString(),
      };
      
      // Here you would typically send this to your analytics service
      console.log(`Analytics Event: ${eventName}`, fullEventData);
      
      // TODO: Integrate with your preferred analytics service (Firebase, Mixpanel, etc.)
      // Example: analytics.track(eventName, fullEventData);
    }
  };

  return {
    analyticsData,
    logEvent,
    refreshAnalyticsData: loadAnalyticsData,
  };
}