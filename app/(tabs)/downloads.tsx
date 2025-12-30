/**
 * Book Download Manager Screen
 * Shows available books from backend and manages downloads
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { bookCatalogApi } from '@/services/bookCatalogApiService';
import { bookDownloader } from '@/services/bookDownloadService';
import { bookStorage, DownloadProgress } from '@/services/bookStorageService';
import { BookCatalogItem } from '@/types/bookCatalog';

interface BookItemProps {
  book: BookCatalogItem;
  progress: DownloadProgress | null;
  onDownload: () => void;
  onDelete: () => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, progress, onDownload, onDelete }) => {
  const getStatusText = () => {
    if (!progress) return 'Not Downloaded';
    
    switch (progress.status) {
      case 'completed':
        return 'Downloaded';
      case 'downloading':
        const percent = Math.round((progress.downloadedBytes / progress.totalBytes) * 100);
        return `Downloading ${percent}%`;
      case 'failed':
        return `Failed: ${progress.error}`;
      case 'paused':
        return 'Paused';
      default:
        return 'Pending';
    }
  };

  const getActionButton = () => {
    if (!progress || progress.status === 'failed') {
      return (
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      );
    }

    if (progress.status === 'downloading') {
      return (
        <TouchableOpacity style={styles.cancelButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      );
    }

    if (progress.status === 'completed') {
      return (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title || 'Untitled Book'}</Text>
        <Text style={styles.bookDetails}>
          Grade {book.grade ?? '?'} • {book.total_pages || '?'} pages • {formatSize(book.total_size_bytes)}
        </Text>
        <Text style={styles.bookStatus}>{getStatusText()}</Text>
        {progress && progress.status === 'downloading' && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progress.downloadedBytes / progress.totalBytes) * 100}%` },
              ]}
            />
          </View>
        )}
      </View>
      {getActionButton()}
    </View>
  );
};

export default function BookDownloadScreen() {
  const [books, setBooks] = useState<BookCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadStates, setDownloadStates] = useState<{ [key: number]: DownloadProgress }>({});

  useEffect(() => {
    loadCatalog();
    loadDownloadStates();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const catalog = await bookCatalogApi.fetchCatalog();
      setBooks(catalog);
    } catch (err) {
      console.error('Error loading catalog:', err);
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  const loadDownloadStates = async () => {
    try {
      const states = await bookStorage.getDownloadState();
      setDownloadStates(states as any);
    } catch (err) {
      console.error('Error loading download states:', err);
    }
  };

  const handleDownload = async (book: BookCatalogItem) => {
    try {
      const bookId = book.id || book.book_id;
      if (!bookId) {
        throw new Error('Book ID is missing');
      }
      
      await bookDownloader.downloadBook(bookId, (progress) => {
        setDownloadStates((prev) => ({
          ...prev,
          [bookId]: progress,
        }));
      });
      
      Alert.alert('Success', `${book.title} downloaded successfully!`);
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Download Failed', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleDelete = async (book: BookCatalogItem) => {
    const bookId = book.id || book.book_id;
    if (!bookId) {
      Alert.alert('Error', 'Book ID is missing');
      return;
    }
    
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await bookDownloader.deleteBook(Number(bookId), book.s3_folder_name, Number(book.grade));
              setDownloadStates((prev) => {
                const newState = { ...prev };
                delete newState[bookId];
                return newState;
              });
              Alert.alert('Success', 'Book deleted');
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading catalog...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCatalog}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Books</Text>
        <TouchableOpacity onPress={loadCatalog}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => (item.id || item.book_id || Math.random()).toString()}
        renderItem={({ item }) => {
          const bookId = item.id || item.book_id;
          return (
            <BookItem
              book={item}
              progress={bookId ? (downloadStates[bookId] || null) : null}
              onDownload={() => handleDownload(item)}
              onDelete={() => handleDelete(item)}
            />
          );
        }}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No books available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookInfo: {
    flex: 1,
    marginRight: 12,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  downloadButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  cancelButton: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
