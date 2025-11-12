# Analytics Implementation - DynamoDB Backend

## Overview

This app uses a **local-first analytics system** with automatic and manual sync to a DynamoDB backend. All Firebase dependencies have been removed.

## Architecture

```
Mobile App (React Native + Expo)
├── AnalyticsService.ts → Tracks & stores locally (AsyncStorage)
├── AutoSyncService.ts → Auto-syncs when internet available
├── analyticsApiService.ts → HTTP sync to backend
└── AnalyticsSyncButton.tsx → Manual sync UI component

Backend API (To be built)
├── POST /api/analytics/sync → Receives analytics data
├── AWS DynamoDB → Stores analytics in 3 tables
└── Admin Dashboard → View/export analytics (optional)
```

## Features Implemented

### ✅ Auto-Sync (Background)
- Monitors network connectivity using `@react-native-community/netinfo`
- Automatically syncs when internet becomes available
- 5-minute cooldown between auto-syncs to prevent excessive requests
- Initialized in `app/_layout.tsx` on app startup

### ✅ Manual Sync (User-Controlled)
- Sync button in dropdown menu (Header component)
- Sync analytics card in Debug Panel
- Shows pending records count
- Displays last sync time
- Shows sync status and errors

### ✅ Local Data Collection
- Tracks page reading sessions (start/end times)
- Calculates active reading time
- Aggregates book statistics
- Handles app background/foreground transitions
- Stores data locally in AsyncStorage

## Components

### `services/analyticsService.ts`
**Purpose:** Local analytics tracking and storage

**Key Methods:**
- `startPageSession()` - Begin tracking a page
- `endPageSession()` - End tracking and calculate duration
- `pauseAllSessions()` - Pause when app goes to background
- `resumeAllSessions()` - Resume when app returns to foreground
- `prepareSyncData()` - Package analytics for server sync
- `markDataAsSynced()` - Clear pending data after successful sync

### `services/autoSyncService.ts`
**Purpose:** Automatic network-aware sync

**Key Methods:**
- `startMonitoring()` - Begin network monitoring
- `stopMonitoring()` - Stop network monitoring
- `forceSync()` - Manual sync (bypasses cooldown)
- `getSyncStatus()` - Get current sync state
- `addSyncListener()` - Subscribe to sync status changes

### `services/analyticsApiService.ts`
**Purpose:** HTTP communication with backend

**Key Methods:**
- `syncAnalytics(schoolAnalytics)` - POST analytics to server
- `testConnection()` - Check server availability
- `getSyncStatus(serialNumber)` - Get sync status from server

**Environment Variable:**
```bash
EXPO_PUBLIC_API_URL=https://your-backend-url.com/api
```

### `components/AnalyticsSyncButton.tsx`
**Purpose:** UI component for manual sync

**Variants:**
- `variant="button"` - Simple sync button
- `variant="card"` - Detailed card with stats

**Props:**
- `variant?: 'button' | 'card'`
- `showDetails?: boolean` - Show analytics summary

### `hooks/useAnalyticsTracking.ts`
**Purpose:** React hook for component-level tracking

**Usage:**
```typescript
const { startPageTracking, endPageTracking, isTracking } = useAnalyticsTracking(bookId, bookTitle);

// When page changes
startPageTracking(pageNumber);

// When leaving page
endPageTracking(pageNumber);
```

## Data Structure

### PageAnalytics
```typescript
{
  pageId: string;           // "${bookId}_${pageNumber}"
  bookId: number;
  bookTitle: string;
  pageNumber: number;
  sessionStartTime: number; // timestamp
  sessionEndTime: number;   // timestamp
  activeTime: number;       // milliseconds
  lastActiveTime: number;
  isActive: boolean;
}
```

### BookAnalytics
```typescript
{
  bookId: number;
  bookTitle: string;
  totalActiveTime: number;  // sum of all pages
  firstAccessTime: number;
  lastAccessTime: number;
  totalPages: number;
  pagesAccessed: number[];  // list of page numbers
}
```

### SchoolAnalytics (Sync Payload)
```typescript
{
  schoolName: string;
  serialNumber: string;     // device identifier
  books: BookAnalytics[];
  totalSessionTime: number;
  lastSyncTime: number;
  pendingSyncData: PageAnalytics[];
}
```

## Backend Setup Required

### DynamoDB Tables

Create 3 tables:

1. **`analytics-page-sessions`**
   - Primary Key: `serialNumber` (String)
   - Sort Key: `sessionId` (String)

2. **`analytics-book-summaries`**
   - Primary Key: `serialNumber` (String)
   - Sort Key: `bookId` (String format: "BOOK#{bookId}")

3. **`analytics-school-summaries`**
   - Primary Key: `serialNumber` (String)
   - Sort Key: `date` (String format: "SUMMARY#{YYYY-MM-DD}")

### API Endpoint

**POST /api/analytics/sync**

Request:
```json
{
  "schoolName": "ABC School",
  "serialNumber": "DEVICE123",
  "syncTimestamp": 1699123456789,
  "analyticsData": {
    "books": [...],
    "pages": [...],
    "deviceInfo": {
      "platform": "android",
      "appVersion": "1.0.1"
    }
  }
}
```

Response:
```json
{
  "success": true,
  "message": "Analytics synced successfully",
  "syncTimestamp": 1699123456789,
  "recordsProcessed": 42
}
```

## Usage in App

### Manual Sync
1. Open app
2. Click menu (⋮) in header
3. Select "Sync Analytics"
4. Modal shows sync details and button
5. Click "Sync Now" to manually sync

### Auto Sync
- Happens automatically in background
- No user action needed
- Syncs when:
  - Internet connection is available
  - 5 minutes have passed since last sync
  - There's pending data to sync

### Debug Panel
- Toggle debug panel in home screen
- Shows:
  - Device registration details
  - Pending analytics count
  - Last sync time
  - Total reading time
  - Manual sync button

## Configuration

### Environment Variables

Create `.env` file (copy from `.env.example`):
```bash
# Analytics Backend Configuration
# Leave empty or commented out to use local-only mode
EXPO_PUBLIC_API_URL=https://your-backend-api.com/api
```

**Local-Only Mode:**
If `EXPO_PUBLIC_API_URL` is not set or empty, the app will:
- ✅ Track analytics locally in AsyncStorage
- ✅ Show pending analytics count
- ❌ Skip auto-sync (no backend to sync to)
- ❌ Show "Backend not configured" when manual sync is attempted

**Backend Mode:**
Once you set a valid backend URL:
- ✅ Auto-sync will activate
- ✅ Manual sync will work
- ✅ Analytics data sent to DynamoDB
- ✅ Local data cleared after successful sync

### Package Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-native-community/netinfo": "^11.4.1"
}
```

## Testing

### Test Local Tracking
1. Open a book
2. Navigate through pages
3. Check AsyncStorage for stored sessions
4. Verify analytics in Debug Panel

### Test Auto-Sync
1. Disable internet
2. Read some pages
3. Enable internet
4. Watch console logs for auto-sync
5. Verify data clears after sync

### Test Manual Sync
1. Read some pages
2. Open Sync Analytics dialog
3. Verify pending count is correct
4. Click "Sync Now"
5. Verify success message

## Migration from Firebase

All Firebase code has been removed:
- ❌ `firebase` npm package removed
- ❌ Firebase service files deleted
- ❌ Firebase config files deleted
- ❌ Firestore rules deleted
- ✅ Using local AsyncStorage
- ✅ Using custom backend API
- ✅ Using AWS DynamoDB

## Next Steps

1. **Build Backend API**
   - Node.js/Express + AWS SDK
   - Deploy to AWS Lambda + API Gateway
   - Or use AWS App Runner / Elastic Beanstalk

2. **Create Admin Dashboard**
   - View analytics by school
   - Export data as CSV/Excel
   - Generate reading reports

3. **Add Analytics Visualization**
   - Charts showing reading progress
   - Time spent per book
   - Most read pages/books

4. **Enhance Sync Logic**
   - Retry failed syncs with exponential backoff
   - Handle partial sync failures
   - Add sync queue persistence

## Cost Estimate

### AWS DynamoDB Free Tier
- 25 GB storage (FREE)
- 25 WCU/RCU per month (FREE)
- ~2.16M writes/month
- ~8.64M reads/month

**For 100 devices:** $0/month (within free tier)
**For 1000 devices:** ~$5-10/month

### Backend Hosting Options
- **AWS Lambda:** $0-5/month (free tier covers most usage)
- **AWS App Runner:** $5-10/month
- **AWS EC2 t3.micro:** $8-10/month

**Total Estimated Cost:** $0-15/month for 100-1000 devices
