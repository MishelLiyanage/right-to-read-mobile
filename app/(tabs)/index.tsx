import Banner from '@/components/Banner';
import BookReader from '@/components/BookReader';
import BooksSection from '@/components/BooksSection';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { getAllBooks } from '@/data/books';
import { useBookSearch } from '@/hooks/useBookSearch';
import { useDeviceRegistration } from '@/hooks/useDeviceRegistration';
import { useRecentBooks } from '@/hooks/useRecentBooks';
import { Book } from '@/types/book';
import React, { useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function BooksScreen() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'recent'>('all');
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const allBooks = getAllBooks();
  const { analyticsData, clearRegistrationData } = useDeviceRegistration();
  
  const {
    searchQuery,
    filteredBooks,
    isSearching,
    setSearchQuery,
    performSearch,
    clearSearch,
  } = useBookSearch(allBooks);

  const { recentBooks, isLoading, refreshRecentBooks, clearRecentBooks, addRecentBook } = useRecentBooks();

  const handleBookPress = async (book: Book) => {
    // Add book to recent books when clicked
    try {
      await addRecentBook(book);

    } catch (error) {
      console.error('Failed to add book to recent:', error);
    }
    
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handleSearchPress = () => {
    performSearch();
  };

  const handleClearRecent = async () => {
    try {
      await clearRecentBooks();

    } catch (error) {
      console.error('Failed to clear recent books:', error);
    }
  };

  const handleClearRegistration = async () => {
    Alert.alert(
      'Clear Registration',
      'This will clear the device registration and show the registration screen again. This is for testing purposes only.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearRegistrationData();
              Alert.alert('Success', 'Registration cleared! Please restart the app to see the registration screen.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear registration data.');
            }
          }
        }
      ]
    );
  };

  if (selectedBook) {
    return <BookReader book={selectedBook} onClose={handleCloseReader} />;
  }

  const isSearchMode = searchQuery.trim() !== '';
  const displayBooks = activeTab === 'all' ? filteredBooks : recentBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <Header />
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshRecentBooks}
          />
        }
      >
        <Banner />
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Books
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
            onPress={() => setActiveTab('recent')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
              Recent Books
            </ThemedText>
          </TouchableOpacity>
        </View>

        <SearchBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearchPress={handleSearchPress}
          placeholder="Search books by name or author..."
        />

        {/* Clear Recent Books Button (only show for recent tab) */}
        {activeTab === 'recent' && recentBooks.length > 0 && (
          <View style={styles.clearButtonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearRecent}>
              <ThemedText style={styles.clearButtonText}>Clear Recent Books</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <BooksSection 
          books={displayBooks}
          onBookPress={handleBookPress}
          isSearchMode={isSearchMode}
          searchQuery={searchQuery}
        />

        {/* Empty state message */}
        {displayBooks.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <ThemedText style={styles.emptyStateText}>
              {activeTab === 'recent' 
                ? "No recent books yet. Start reading to see them here!" 
                : isSearchMode 
                  ? "No books found matching your search."
                  : "No books available."
              }
            </ThemedText>
          </View>
        )}

        {/* Debug Panel - Toggle visibility */}
        <TouchableOpacity 
          style={styles.debugToggle}
          onPress={() => setShowDebugPanel(!showDebugPanel)}
        >
          <ThemedText style={styles.debugToggleText}>
            {showDebugPanel ? 'Hide' : 'Show'} Debug Panel
          </ThemedText>
        </TouchableOpacity>

        {/* Debug Panel */}
        {showDebugPanel && (
          <View style={styles.debugPanel}>
            <ThemedText style={styles.debugTitle}>Debug Panel</ThemedText>
            
            {analyticsData && (
              <View style={styles.debugInfo}>
                <ThemedText style={styles.debugText}>
                  Current Registration:
                </ThemedText>
                <ThemedText style={styles.debugText}>
                  Grade: {analyticsData.grade}
                </ThemedText>
                <ThemedText style={styles.debugText}>
                  Class: {analyticsData.className}
                </ThemedText>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.debugButton}
              onPress={handleClearRegistration}
            >
              <ThemedText style={styles.debugButtonText}>
                Clear Registration (Test)
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  clearButtonContainer: {
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 6,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  debugToggle: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugToggleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  debugPanel: {
    backgroundColor: '#f8f8f8',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  debugInfo: {
    marginBottom: 12,
  },
  debugText: {
    fontSize: 14,
    marginBottom: 4,
  },
  debugButton: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
