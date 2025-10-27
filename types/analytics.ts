export interface PageAnalytics {
  pageId: string;               // `${bookId}_${pageNumber}`
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  sessionStartTime: number;     // timestamp
  sessionEndTime?: number;      // timestamp
  activeTime: number;           // accumulated milliseconds
  lastActiveTime: number;       // timestamp of last activity
  isActive: boolean;
}

export interface BookAnalytics {
  bookId: number;
  bookTitle: string;
  totalActiveTime: number;      // sum of all pages
  firstAccessTime: number;
  lastAccessTime: number;
  totalPages: number;
  pagesAccessed: number[];
}

export interface SchoolAnalytics {
  schoolName: string;
  serialNumber: string;         // device identifier
  books: BookAnalytics[];
  totalSessionTime: number;
  lastSyncTime?: number;
  pendingSyncData: PageAnalytics[];
}

export interface SyncPayload {
  schoolName: string;
  serialNumber: string;
  syncTimestamp: number;
  analyticsData: {
    books: BookAnalytics[];
    pages: PageAnalytics[];
    deviceInfo: {
      platform: string;
      appVersion: string;
    };
  };
}

export interface SyncStatus {
  isLoading: boolean;
  lastSyncTime?: number;
  pendingCount: number;
  error?: string;
}

export interface AnalyticsSession {
  pageId: string;
  startTime: number;
  lastUpdateTime: number;
  isActive: boolean;
}