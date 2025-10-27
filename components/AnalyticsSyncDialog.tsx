import { syncAnalytics } from '@/services/analyticsApiService';
import { AnalyticsService } from '@/services/analyticsService';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface AnalyticsSyncDialogProps {
  visible: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

interface AnalyticsSummary {
  pendingCount: number;
  lastSyncTime?: number;
  totalBooks: number;
  totalActiveTime: number;
}

export default function AnalyticsSyncDialog({
  visible,
  onClose,
  onSyncComplete,
}: AnalyticsSyncDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Load analytics summary when dialog opens
  useEffect(() => {
    if (visible) {
      loadAnalyticsSummary();
    }
  }, [visible]);

  const loadAnalyticsSummary = async () => {
    setIsLoading(true);
    setSyncError(null);
    
    try {
      const analyticsService = AnalyticsService.getInstance();
      const summary = await analyticsService.getAnalyticsSummary();
      setAnalyticsSummary(summary);
    } catch (error) {
      console.error('[AnalyticsSyncDialog] Error loading analytics summary:', error);
      setSyncError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!analyticsSummary || analyticsSummary.pendingCount === 0) {
      Alert.alert('No Data', 'No pending analytics data to sync.');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      const analyticsService = AnalyticsService.getInstance();
      
      // Prepare data for sync
      const schoolAnalytics = await analyticsService.prepareSyncData();
      
      if (!schoolAnalytics) {
        throw new Error('Failed to prepare sync data. Please ensure device is registered.');
      }

      console.log('[AnalyticsSyncDialog] Starting sync with server...');
      
      // Sync with server
      const syncResult = await syncAnalytics(schoolAnalytics);
      
      if (syncResult.success) {
        // Mark data as synced locally
        await analyticsService.markDataAsSynced();
        
        console.log('[AnalyticsSyncDialog] Sync completed successfully');
        
        Alert.alert(
          'Sync Successful',
          `Successfully synced ${syncResult.recordsProcessed || 'all'} analytics records.`,
          [
            {
              text: 'OK',
              onPress: () => {
                onSyncComplete?.();
                onClose();
              },
            },
          ]
        );

        // Refresh summary
        await loadAnalyticsSummary();
      } else {
        throw new Error(syncResult.message || 'Sync failed');
      }
    } catch (error) {
      console.error('[AnalyticsSyncDialog] Sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSyncError(errorMessage);
      
      Alert.alert(
        'Sync Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const formatLastSyncTime = (timestamp?: number): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics Sync</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isSyncing}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Loading analytics data...</Text>
            </View>
          ) : (
            <View style={styles.content}>
              {analyticsSummary && (
                <View style={styles.summaryContainer}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Pending Records:</Text>
                    <Text style={styles.summaryValue}>{analyticsSummary.pendingCount}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Books:</Text>
                    <Text style={styles.summaryValue}>{analyticsSummary.totalBooks}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Reading Time:</Text>
                    <Text style={styles.summaryValue}>
                      {formatTime(analyticsSummary.totalActiveTime)}
                    </Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Last Sync:</Text>
                    <Text style={styles.summaryValue}>
                      {formatLastSyncTime(analyticsSummary.lastSyncTime)}
                    </Text>
                  </View>
                </View>
              )}

              {syncError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{syncError}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isSyncing}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.syncButton,
                    (isSyncing || !analyticsSummary || analyticsSummary.pendingCount === 0) &&
                      styles.syncButtonDisabled,
                  ]}
                  onPress={handleSync}
                  disabled={isSyncing || !analyticsSummary || analyticsSummary.pendingCount === 0}
                >
                  {isSyncing ? (
                    <View style={styles.syncButtonContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.syncButtonText}>Syncing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.syncButtonText}>
                      Sync Analytics
                      {analyticsSummary && analyticsSummary.pendingCount > 0
                        ? ` (${analyticsSummary.pendingCount})`
                        : ''}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  syncButton: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#ccc',
  },
  syncButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  syncButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});