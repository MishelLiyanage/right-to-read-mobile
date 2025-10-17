import DictionaryEntry from '@/components/DictionaryEntry';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { DictionaryEntry as DictionaryEntryType } from '@/types/book';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

interface DictionarySidebarProps {
  isVisible: boolean;
  entries: DictionaryEntryType[];
  onClose: () => void;
  onSpeakWord: (word: string) => Promise<void>;
}

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = 380;

export default function DictionarySidebar({ 
  isVisible, 
  entries, 
  onClose, 
  onSpeakWord 
}: DictionarySidebarProps) {
  const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Show sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide sidebar
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, backdropAnim]);

  const renderDictionaryEntry = ({ item }: { item: DictionaryEntryType }) => (
    <DictionaryEntry
      entry={item}
      onSpeakWord={onSpeakWord}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>
        No nouns found on this page
      </ThemedText>
      <ThemedText style={styles.emptySubtext}>
        The dictionary shows nouns (things, places, people) from the current page content.
      </ThemedText>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ThemedText style={styles.headerTitle}>Page Nouns</ThemedText>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <ThemedText style={styles.closeButtonText}>✕</ThemedText>
      </TouchableOpacity>
    </View>
  );

  if (!isVisible) return null;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <ThemedView style={styles.sidebarContent}>
            {renderHeader()}
            
            <View style={styles.listContainer}>
              {entries.length > 0 ? (
                <FlatList
                  data={entries}
                  renderItem={renderDictionaryEntry}
                  keyExtractor={(item) => item.word}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={true}
                />
              ) : (
                renderEmptyState()
              )}
            </View>

            {/* Footer with word count */}
            <View style={styles.footerContainer}>
              <ThemedText style={styles.footerText}>
                {entries.length} {entries.length === 1 ? 'noun' : 'nouns'} found
              </ThemedText>
            </View>
          </ThemedView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#636161ff',
    backgroundColor: '#000000ff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text on black background
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // White text on black background
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC', // Light gray text on black background
    textAlign: 'center',
    lineHeight: 20,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    backgroundColor: '#000000',
  },
  footerText: {
    fontSize: 12,
    color: '#CCCCCC', // Light gray text on black background
    textAlign: 'center',
  },
});