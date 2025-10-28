import FirebaseAnalyticsService from '@/services/firebaseAnalyticsServiceProduction';
import { FirebaseAnalyticsSummary } from '@/types/firebase';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AnalyticsSyncDialogProps {
  visible: boolean;
  onClose: () => void;
  onRefreshComplete?: () => void;
}

export default function AnalyticsSyncDialog({
  visible,
  onClose,
  onRefreshComplete,
}: AnalyticsSyncDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState<FirebaseAnalyticsSummary | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');
  const [error, setError] = useState<string | null>(null);

  // Load analytics summary when dialog opens
  useEffect(() => {
    if (visible) {
      loadAnalyticsSummary();
    }
  }, [visible]);

  const loadAnalyticsSummary = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const analyticsService = FirebaseAnalyticsService.getInstance();
      
      // Check connection status
      const isConnected = analyticsService.isConnected();
      setConnectionStatus(isConnected ? 'connected' : 'offline');
      
      // Load summary
      const summary = await analyticsService.getAnalyticsSummary();
      setAnalyticsSummary(summary);
      
      console.log('[AnalyticsSyncDialog] Analytics summary loaded:', summary);
    } catch (error) {
      console.error('[AnalyticsSyncDialog] Error loading analytics summary:', error);
      setError('Failed to load analytics data');
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalyticsSummary();
    onRefreshComplete?.();
    setIsRefreshing(false);
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
            <Text style={styles.title}>Firebase Analytics</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              disabled={isRefreshing}
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
              {/* Connection Status */}
              <View style={styles.statusContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Firebase Status:</Text>
                  <View style={styles.statusIndicator}>
                    <View 
                      style={[
                        styles.statusDot, 
                        connectionStatus === 'connected' && styles.statusConnected,
                        connectionStatus === 'offline' && styles.statusOffline,
                        connectionStatus === 'error' && styles.statusError,
                      ]} 
                    />
                    <Text style={[
                      styles.statusText,
                      connectionStatus === 'connected' && styles.statusTextConnected,
                      connectionStatus === 'offline' && styles.statusTextOffline,
                    ]}>
                      {connectionStatus === 'connected' && 'Online - Auto Sync'}
                      {connectionStatus === 'offline' && 'Offline - Will Sync Later'}
                      {connectionStatus === 'error' && 'Connection Error'}
                      {connectionStatus === 'checking' && 'Checking...'}
                    </Text>
                  </View>
                </View>
              </View>

              {analyticsSummary && (
                <View style={styles.summaryContainer}>
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
                    <Text style={styles.summaryLabel}>Total Sessions:</Text>
                    <Text style={styles.summaryValue}>{analyticsSummary.totalSessions}</Text>
                  </View>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Last Updated:</Text>
                    <Text style={styles.summaryValue}>
                      {formatLastSyncTime(analyticsSummary.lastUpdated.toMillis())}
                    </Text>
                  </View>

                  {analyticsSummary.mostAccessedBooks.length > 0 && (
                    <View style={styles.booksContainer}>
                      <Text style={styles.booksTitle}>Most Read Books:</Text>
                      {analyticsSummary.mostAccessedBooks.slice(0, 3).map((book, index) => (
                        <View key={book.bookId} style={styles.bookRow}>
                          <Text style={styles.bookTitle}>{index + 1}. {book.bookTitle}</Text>
                          <Text style={styles.bookTime}>{formatTime(book.totalTime)}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isRefreshing}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.syncButton,
                    isRefreshing && styles.syncButtonDisabled,
                  ]}
                  onPress={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <View style={styles.syncButtonContent}>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.syncButtonText}>Refreshing...</Text>
                    </View>
                  ) : (
                    <Text style={styles.syncButtonText}>Refresh Data</Text>
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
  statusContainer: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  statusConnected: {
    backgroundColor: '#4caf50',
  },
  statusOffline: {
    backgroundColor: '#ff9800',
  },
  statusError: {
    backgroundColor: '#f44336',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  statusTextConnected: {
    color: '#4caf50',
  },
  statusTextOffline: {
    color: '#ff9800',
  },
  booksContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  booksTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  bookRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  bookTitle: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bookTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});