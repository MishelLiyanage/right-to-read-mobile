import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SchoolData {
  schoolName: string;
  serialNumber: string;
}

const SCHOOLS_KEY = '@valid_schools';

// Predefined valid schools with their census numbers as serial numbers
const VALID_SCHOOLS: SchoolData[] = [
  { schoolName: 'WERALUGOLLA P.V', serialNumber: '03439' },
  { schoolName: 'MANINGAMUWA M.V.', serialNumber: '04038' },
  { schoolName: 'GALEWELA PRIMARY SCHOOL', serialNumber: '04083' },
  { schoolName: 'SRI KUMARAN P .V', serialNumber: '04347' },
  { schoolName: 'MENIKHINNA M.V', serialNumber: '03222' },
  { schoolName: 'AL MUNAWWARA.MUS.P.V.', serialNumber: '03714' },
  { schoolName: 'BT/BT/ERAVUR TAMIL MAHA VIDYALAYAM', serialNumber: '14060' },
  { schoolName: 'BT/BW/MUTHALAIKUDAH JUNIOR SCHOOL', serialNumber: '14423' },
  { schoolName: 'BT/BW/AMPILANTHURAI JUNIOR SCHOOL', serialNumber: '14434' },
  { schoolName: 'BT/KK/KINNAIYADY SARESWATHY VIDYYALAYAM', serialNumber: '14026' },
  { schoolName: 'BT/KK/SUNKANKERNY G T M S', serialNumber: '14027' },
  { schoolName: 'CHEDDIPALAYAM MAHA VIDYALAYAM', serialNumber: '14176' },
  { schoolName: 'NCP/ANU/GB/MIHI/PATHIRAJA THENNAKOON MODEL P . V', serialNumber: '19413' },
  { schoolName: 'KEKIRAWA MODEL PRIMARY', serialNumber: '19430' },
  { schoolName: 'ALUTHWEWA M.V.', serialNumber: '20070' },
  { schoolName: 'PALUGASDAMANA EAST K.V.', serialNumber: '20094' },
  { schoolName: 'VIJITHA P.V', serialNumber: '20232' },
  { schoolName: 'A/GALNEWA PV', serialNumber: '19345' },
  { schoolName: 'HOLY FAMILY BALIKA PRIMARY VIDYALAYA', serialNumber: '18245' },
  { schoolName: 'KALVIYANKADU HINDU TAMIL MIXED SCHOOL', serialNumber: '09439' },
  { schoolName: 'KARAVEDDY SARASWATHY MAHALIR VIDYALAYAM', serialNumber: '09296' },
  { schoolName: 'KERUDAVIL HINDU TAMIL MIXED SCHOOL', serialNumber: '09298' },
  { schoolName: 'MATHAGAL VIGNESWARA VIDYALAYAM', serialNumber: '09152' },
  { schoolName: 'DR.THANGAMMA APPAKUDDY KANISTA VIDYALAYAM', serialNumber: '09163' },
  { schoolName: 'THANTHAI SELVA THODAKKA NILAI PALLI', serialNumber: '09165' },
  { schoolName: 'SRI SHARIPUTHRA M.V.', serialNumber: '23167' },
  { schoolName: 'MEDDEKANDA M.V.', serialNumber: '23211' },
  { schoolName: 'SRI GUNARATHANA V S', serialNumber: '23494' },
  { schoolName: 'RAHULA PRIMARY SCHOOL', serialNumber: '23596' },
  { schoolName: 'KARAWITAKV', serialNumber: '23364' },
  { schoolName: 'WOODLAND PRIMARI SCHOOL', serialNumber: '06057' },
  { schoolName: 'RATHGAMA SIRISUMANA PRIMARY SCHOOL', serialNumber: '06345' },
  { schoolName: 'DENSIL KOBBEKADUWA V.', serialNumber: '06513' },
  { schoolName: 'MAHINDA RAJAPAKSHA V.', serialNumber: '06517' },
  { schoolName: 'ELPITIYA P.V.', serialNumber: '06524' },
  { schoolName: 'OLCOTT MAHA VIDYALAYA', serialNumber: '06378' },
  { schoolName: 'B SUJATHA MAHA VIDYALAYA', serialNumber: '21186' },
  { schoolName: 'ATTAMPITIYA NATIONAL COLLEGE', serialNumber: '21191' },
  { schoolName: 'PALLEWELA M.V.', serialNumber: '22093' },
  { schoolName: 'ANURA ADARSHA K.V.', serialNumber: '01151' },
  { schoolName: 'UDUPILA P.V.', serialNumber: '01214' },
  { schoolName: 'SRI GNANAWASA M.V', serialNumber: '01469' },
  { schoolName: 'SRI JOTHIRATHANA J.S.V.', serialNumber: '01382' },
  { schoolName: 'ST.SEBASTIAN\'S GIRLS P.V.', serialNumber: '01566' },
  { schoolName: 'KANDAWALA NAVODYA M.V.', serialNumber: '00123' },
];

export class SchoolValidationService {
  /**
   * Initialize the valid schools data in local storage
   */
  static async initializeSchools(): Promise<void> {
    try {
      // Force update the schools data with the new list
      await AsyncStorage.setItem(SCHOOLS_KEY, JSON.stringify(VALID_SCHOOLS));
      console.log('Valid schools updated in local storage with new data');
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

  /**
   * Clear cached schools data (for testing/debugging)
   */
  static async clearSchoolsCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SCHOOLS_KEY);
      console.log('Schools cache cleared');
      await this.initializeSchools(); // Reinitialize with fresh data
    } catch (error) {
      console.error('Error clearing schools cache:', error);
    }
  }
}