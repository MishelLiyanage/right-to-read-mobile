import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SchoolData {
  schoolName: string;
  serialNumber: string;
}

const SCHOOLS_KEY = '@valid_schools';

// Predefined valid schools with their serial numbers
const VALID_SCHOOLS: SchoolData[] = [
  { schoolName: 'Royal College, Colombo', serialNumber: 'SL-SCH-9247' },
  { schoolName: 'Visakha Vidyalaya, Colombo', serialNumber: 'SL-SCH-5082' },
  { schoolName: 'Trinity College, Kandy', serialNumber: 'SL-SCH-7361' },
  { schoolName: 'St. Joseph\'s College, Colombo', serialNumber: 'SL-SCH-2819' },
  { schoolName: 'Maliyadeva College, Kurunegala', serialNumber: 'SL-SCH-6540' },
  { schoolName: 'Mahinda College, Galle', serialNumber: 'SL-SCH-8793' },
  { schoolName: 'Dharmaraja College, Kandy', serialNumber: 'SL-SCH-1925' },
  { schoolName: 'Musaeus College, Colombo', serialNumber: 'SL-SCH-4678' },
  { schoolName: 'Ananda College, Colombo', serialNumber: 'SL-SCH-3156' },
  { schoolName: 'Richmond College, Galle', serialNumber: 'SL-SCH-7408' },
];

export class SchoolValidationService {
  /**
   * Initialize the valid schools data in local storage
   */
  static async initializeSchools(): Promise<void> {
    try {
      const existingSchools = await AsyncStorage.getItem(SCHOOLS_KEY);
      if (!existingSchools) {
        await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(VALID_SCHOOLS));
        console.log('Valid schools initialized in local storage');
      }
    } catch (error) {
      console.error('Error initializing schools:', error);
    }
  }

  /**
   * Get all valid schools from local storage
   */
  static async getValidSchools(): Promise<SchoolData[]> {
    try {
      await this.initializeSchools(); // Ensure data is initialized
      const schoolsData = await AsyncStorage.getItem(SCHOOLS_KEY);
      return schoolsData ? JSON.parse(schoolsData) : VALID_SCHOOLS;
    } catch (error) {
      console.error('Error getting valid schools:', error);
      return VALID_SCHOOLS; // Return default data if storage fails
    }
  }

  /**
   * Validate school name and serial number combination
   * @param schoolName - The school name to validate
   * @param serialNumber - The serial number to validate
   * @returns Promise<boolean> - true if valid combination, false otherwise
   */
  static async validateSchool(schoolName: string, serialNumber: string): Promise<boolean> {
    try {
      const validSchools = await this.getValidSchools();
      
      // Find school with matching name (case insensitive)
      const school = validSchools.find(
        s => s.schoolName.toLowerCase().trim() === schoolName.toLowerCase().trim()
      );

      if (!school) {
        return false; // School name not found
      }

      // Check if serial number matches (case insensitive)
      return school.serialNumber.toLowerCase().trim() === serialNumber.toLowerCase().trim();
    } catch (error) {
      console.error('Error validating school:', error);
      return false;
    }
  }

  /**
   * Get school names for autocomplete/suggestions
   */
  static async getSchoolNames(): Promise<string[]> {
    try {
      const validSchools = await this.getValidSchools();
      return validSchools.map(school => school.schoolName);
    } catch (error) {
      console.error('Error getting school names:', error);
      return [];
    }
  }

  /**
   * Get serial number for a given school name
   */
  static async getSerialNumberForSchool(schoolName: string): Promise<string | null> {
    try {
      const validSchools = await this.getValidSchools();
      const school = validSchools.find(
        s => s.schoolName.toLowerCase().trim() === schoolName.toLowerCase().trim()
      );
      return school ? school.serialNumber : null;
    } catch (error) {
      console.error('Error getting serial number for school:', error);
      return null;
    }
  }

  /**
   * Get school name for a given serial number
   */
  static async getSchoolNameForSerial(serialNumber: string): Promise<string | null> {
    try {
      const validSchools = await this.getValidSchools();
      const school = validSchools.find(
        s => s.serialNumber.toLowerCase().trim() === serialNumber.toLowerCase().trim()
      );
      return school ? school.schoolName : null;
    } catch (error) {
      console.error('Error getting school name for serial:', error);
      return null;
    }
  }

  /**
   * Validate serial number only
   * @param serialNumber - The serial number to validate
   * @returns Promise<boolean> - true if valid serial number, false otherwise
   */
  static async validateSerialNumber(serialNumber: string): Promise<boolean> {
    try {
      const schoolName = await this.getSchoolNameForSerial(serialNumber);
      return schoolName !== null;
    } catch (error) {
      console.error('Error validating serial number:', error);
      return false;
    }
  }
}