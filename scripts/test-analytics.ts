/**
 * Test script to verify analytics data collection
 * Run this to check if analytics are being captured correctly
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_KEYS = {
  PAGE_SESSIONS: '@analytics_page_sessions',
  BOOK_SUMMARIES: '@analytics_book_summaries',
  PENDING_SYNC: '@analytics_pending_sync',
  SYNC_STATUS: '@analytics_sync_status',
} as const;

async function testAnalytics() {
  console.log('=== Analytics Data Test ===\n');

  try {
    // Get all analytics data
    const [pageSessions, bookSummaries, pendingSync, syncStatus] = await Promise.all([
      AsyncStorage.getItem(ANALYTICS_KEYS.PAGE_SESSIONS),
      AsyncStorage.getItem(ANALYTICS_KEYS.BOOK_SUMMARIES),
      AsyncStorage.getItem(ANALYTICS_KEYS.PENDING_SYNC),
      AsyncStorage.getItem(ANALYTICS_KEYS.SYNC_STATUS),
    ]);

    console.log('1. Active Page Sessions:');
    if (pageSessions) {
      const sessions = JSON.parse(pageSessions);
      console.log(`   Count: ${sessions.length}`);
      console.log('   Data:', JSON.stringify(sessions, null, 2));
    } else {
      console.log('   No active sessions');
    }

    console.log('\n2. Book Summaries:');
    if (bookSummaries) {
      const summaries = JSON.parse(bookSummaries);
      console.log(`   Count: ${summaries.length}`);
      console.log('   Data:', JSON.stringify(summaries, null, 2));
    } else {
      console.log('   No book summaries');
    }

    console.log('\n3. Pending Sync Data:');
    if (pendingSync) {
      const pending = JSON.parse(pendingSync);
      console.log(`   Count: ${pending.length}`);
      console.log('   Sample:', JSON.stringify(pending.slice(0, 2), null, 2));
    } else {
      console.log('   No pending data');
    }

    console.log('\n4. Sync Status:');
    if (syncStatus) {
      const status = JSON.parse(syncStatus);
      console.log('   Data:', JSON.stringify(status, null, 2));
      if (status.lastSyncTime) {
        console.log(`   Last Sync: ${new Date(status.lastSyncTime).toISOString()}`);
      }
    } else {
      console.log('   No sync status');
    }

    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Error reading analytics data:', error);
  }
}

// Clear all analytics data (for testing)
async function clearAnalytics() {
  console.log('Clearing all analytics data...');
  await Promise.all([
    AsyncStorage.removeItem(ANALYTICS_KEYS.PAGE_SESSIONS),
    AsyncStorage.removeItem(ANALYTICS_KEYS.BOOK_SUMMARIES),
    AsyncStorage.removeItem(ANALYTICS_KEYS.PENDING_SYNC),
    AsyncStorage.removeItem(ANALYTICS_KEYS.SYNC_STATUS),
  ]);
  console.log('Analytics data cleared!');
}

export { testAnalytics, clearAnalytics };
