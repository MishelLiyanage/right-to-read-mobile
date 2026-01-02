import BookCard from '@/components/BookCard';
import { ThemedText } from '@/components/ThemedText';
import { Book } from '@/types/book';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface BooksSectionProps {
  books: Book[];
  onBookPress: (book: Book) => void;
  isSearchMode?: boolean;
  searchQuery?: string;
}

export default function BooksSection({ books, onBookPress, isSearchMode = false, searchQuery = '' }: BooksSectionProps) {
  const handleBookPress = (book: Book) => {

    if (book.hasData) {
      onBookPress(book);
    } else {

    }
  };

  // Show message when no books found in search
  if (isSearchMode && books.length === 0 && searchQuery.trim() !== '') {
    return (
      <View style={styles.section}>
        <View style={styles.noResultsContainer}>
          <ThemedText style={styles.noResultsText}>
            No books found for "{searchQuery}"
          </ThemedText>
          <ThemedText style={styles.noResultsSubtext}>
            Try searching with different keywords
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {isSearchMode && books.length > 0 && searchQuery.trim() !== '' && (
        <View style={styles.searchResultsHeader}>
          <ThemedText style={styles.searchResultsText}>
            Found {books.length} book{books.length !== 1 ? 's' : ''} for "{searchQuery}"
          </ThemedText>
        </View>
      )}
      <View style={styles.gridContainer}>
        {books.map((book: Book) => (
          <BookCard
            key={book.id}
            title={book.title}
            backgroundColor={book.backgroundColor}
            hasData={book.hasData}
            onPress={() => handleBookPress(book)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'flex-start',
  },
  noResultsContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  searchResultsHeader: {
    paddingBottom: 10,
  },
  searchResultsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});
