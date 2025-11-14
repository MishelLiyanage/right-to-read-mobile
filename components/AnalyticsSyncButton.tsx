import { AnalyticsService } from '@/services/analyticsService';
import AutoSyncService, { SyncStatus } from '@/services/autoSyncService';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AnalyticsSyncButtonProps {
  variant?: 'button' | 'card';
  showDetails?: boolean;
}

export function AnalyticsSyncButton({ 
  variant = 'button', 
  showDetails = false 
}: AnalyticsSyncButtonProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    pendingCount: 0,
  });
  const [summary, setSummary] = useState<{
    pendingCount: number;
    lastSyncTime?: number;
    totalBooks: number;
    totalActiveTime: number;
  }>({
    pendingCount: 0,
    lastSyncTime: undefined,
    totalBooks: 0,
    totalActiveTime: 0,
  });

  // Load initial summary
  useEffect(() => {
    loadSummary();
  }, []);

  // Subscribe to sync status changes
  useEffect(() => {
    const autoSync = AutoSyncService.getInstance();
    
    // Load initial status
    autoSync.getSyncStatus().then(setSyncStatus);
    
    // Subscribe to changes
    const unsubscribe = autoSync.addSyncListener((status) => {
      setSyncStatus(status);
      // Reload summary after sync completes
      if (!status.isLoading && !status.error) {
        loadSummary();
      }
    });

    return unsubscribe;
  }, []);

  const loadSummary = async () => {
    try {
      const analyticsService = AnalyticsService.getInstance();
      const data = await analyticsService.getAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error('[AnalyticsSyncButton] Error loading summary:', error);
    }
  };

  const handleManualSync = async () => {
    try {
      const autoSync = AutoSyncService.getInstance();
      const result = await autoSync.forceSync();
      
      if (result.success) {
        Alert.alert(
          'Sync Successful',
          result.recordsProcessed && result.recordsProcessed > 0
            ? `Successfully synced ${result.recordsProcessed} records`
            : result.message,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Sync Failed',
          result.message,
          [{ text: 'OK' }]
        );
      }
      
      // Reload summary
      await loadSummary();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', message);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (variant === 'card') {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="analytics-outline" size={24} color="#007AFF" />
          <Text style={styles.cardTitle}>Analytics</Text>
        </View>

        {showDetails && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pending Records</Text>
              <Text style={styles.statValue}>{summary.pendingCount}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Books Tracked</Text>
              <Text style={styles.statValue}>{summary.totalBooks}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Reading Time</Text>
              <Text style={styles.statValue}>{formatTime(summary.totalActiveTime)}</Text>
            </View>
          </View>
        )}

        <View style={styles.syncInfoContainer}>
          <View style={styles.syncInfo}>
            <Text style={styles.syncLabel}>Last Sync:</Text>
            <Text style={styles.syncValue}>{formatDate(summary.lastSyncTime)}</Text>
          </View>
          
          {syncStatus.error && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning-outline" size={16} color="#FF3B30" />
              <Text style={styles.errorText}>{syncStatus.error}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.syncButton,
            syncStatus.isLoading && styles.syncButtonDisabled,
            summary.pendingCount === 0 && styles.syncButtonDisabled,
          ]}
          onPress={handleManualSync}
          disabled={syncStatus.isLoading || summary.pendingCount === 0}
        >
          {syncStatus.isLoading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.syncButtonText}>Syncing...</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
              <Text style={styles.syncButtonText}>
                {summary.pendingCount === 0 ? 'All Synced' : 'Sync Now'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.autoSyncHint}>
          Auto-sync enabled when internet is available
        </Text>
      </View>
    );
  }

  // Button variant
  return (
    <TouchableOpacity
      style={[
        styles.button,
        syncStatus.isLoading && styles.buttonDisabled,
        summary.pendingCount === 0 && styles.buttonDisabled,
      ]}
      onPress={handleManualSync}
      disabled={syncStatus.isLoading || summary.pendingCount === 0}
    >
      {syncStatus.isLoading ? (
        <>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.buttonText}>Syncing...</Text>
        </>
      ) : (
        <>
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            Sync Analytics {summary.pendingCount > 0 ? `(${summary.pendingCount})` : ''}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Card variant styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginRight: 16
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  syncInfoContainer: {
    marginBottom: 12,
  },
  syncInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  syncLabel: {
    fontSize: 14,
    color: '#666',
  },
  syncValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginLeft: 6,
    flex: 1,
  },
  syncButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  syncButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  autoSyncHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  // Button variant styles
  button: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
