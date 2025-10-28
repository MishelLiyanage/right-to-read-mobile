import { DocumentSnapshot, Timestamp, WhereFilterOp } from 'firebase/firestore';

/**
 * Firebase Firestore data types
 */

export interface FirebasePageSession {
  sessionId: string;
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  startTime: Timestamp;
  endTime?: Timestamp;
  duration?: number; // milliseconds
  isActive: boolean;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseBookAnalytics {
  bookId: number;
  bookTitle: string;
  totalActiveTime: number; // milliseconds
  firstAccessTime: Timestamp;
  lastAccessTime: Timestamp;
  totalPages: number;
  pagesAccessed: number[];
  sessionCount: number;
  averageSessionDuration: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebasePageAnalytics {
  pageId: string; // bookId_pageNumber
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  totalTime: number; // milliseconds
  sessionCount: number;
  averageTime: number; // milliseconds
  lastAccessed: Timestamp;
  sessions: string[]; // Array of session IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseSchoolInfo {
  serialNumber: string;
  schoolName: string;
  registrationDate: Timestamp;
  lastActiveTime: Timestamp;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseAnalyticsSummary {
  totalBooks: number;
  totalActiveTime: number; // milliseconds
  totalSessions: number;
  totalPagesAccessed: number;
  averageSessionDuration: number;
  mostAccessedBooks: Array<{
    bookId: number;
    bookTitle: string;
    accessCount: number;
    totalTime: number;
  }>;
  dailyUsage: Array<{
    date: string; // YYYY-MM-DD
    totalTime: number;
    sessionCount: number;
  }>;
  lastUpdated: Timestamp;
}

/**
 * Firebase Analytics Event Parameters
 */
export interface AnalyticsEventParams {
  book_id?: number;
  book_title?: string;
  page_number?: number;
  session_duration?: number;
  school_serial?: string;
  school_name?: string;
  session_id?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Firebase Analytics Custom Events
 */
export enum AnalyticsEvents {
  // Page tracking events
  PAGE_VIEW_START = 'page_view_start',
  PAGE_VIEW_END = 'page_view_end',
  
  // Book tracking events  
  BOOK_OPENED = 'book_opened',
  BOOK_CLOSED = 'book_closed',
  
  // Reading session events
  READING_SESSION_START = 'reading_session_start',
  READING_SESSION_END = 'reading_session_end',
  
  // App usage events
  APP_SESSION_START = 'app_session_start',
  APP_SESSION_END = 'app_session_end',
  
  // Feature usage events
  AUDIO_PLAYBACK_START = 'audio_playback_start',
  AUDIO_PLAYBACK_END = 'audio_playback_end',
  DICTIONARY_USED = 'dictionary_used',
  WORD_LOOKUP = 'word_lookup',
  
  // Navigation events
  TOC_NAVIGATION = 'toc_navigation',
  PAGE_NAVIGATION = 'page_navigation',
}

/**
 * Firestore Query Options
 */
export interface FirebaseQueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: Array<{
    field: string;
    operator: WhereFilterOp;
    value: any;
  }>;
  startAfter?: DocumentSnapshot;
}