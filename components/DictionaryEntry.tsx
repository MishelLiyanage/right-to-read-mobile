import { ThemedView } from '@/components/ThemedView';
import { DictionaryEntry as DictionaryEntryType } from '@/types/book';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DictionaryEntryProps {
  entry: DictionaryEntryType;
  onSpeakWord: (word: string) => Promise<void>;
}

export default function DictionaryEntry({ entry, onSpeakWord }: DictionaryEntryProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeakPress = async () => {
    if (isSpeaking) return;
    
    try {
      setIsSpeaking(true);
      await onSpeakWord(entry.word);
    } catch (error) {
      console.error('Error speaking word:', error);
      // You could show a toast or alert here if desired
    } finally {
      // Add a small delay to show the button was pressed
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1000);
    }
  };

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="small" color="#666" />
      <Text style={styles.loadingText}>Loading definition...</Text>
    </View>
  );

  const renderDefinitions = () => {
    if (!entry.definitions || entry.definitions.length === 0) {
      return (
        <Text style={styles.noDefinitionText}>
          No definition available
        </Text>
      );
    }

    return entry.definitions.map((definition, defIndex) => (
      <View key={defIndex} style={styles.definitionContainer}>
        {definition.phonetic && (
          <Text style={styles.phoneticText}>
            /{definition.phonetic}/
          </Text>
        )}
        
        {definition.meanings.map((meaning, meaningIndex) => (
          <View key={meaningIndex} style={styles.meaningContainer}>
            <Text style={styles.partOfSpeechText}>
              {meaning.partOfSpeech}
            </Text>
            
            {meaning.definitions.slice(0, 2).map((def, index) => ( // Show max 2 definitions per part of speech
              <View key={index} style={styles.definitionItem}>
                <Text style={styles.definitionText}>
                  {index + 1}. {def.definition}
                </Text>
                {def.example && (
                  <Text style={styles.exampleText}>
                    Example: "{def.example}"
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{entry.word}</Text>
        </View>
        
        <TouchableOpacity
          style={[styles.speakerButton, isSpeaking && styles.speakerButtonActive]}
          onPress={handleSpeakPress}
          disabled={isSpeaking}
        >
          {isSpeaking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.speakerIcon}>🔊</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {entry.isLoading && renderLoading()}
        {!entry.isLoading && renderDefinitions()}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 16,
    backgroundColor: '#ffffff', // Ensure white background
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordContainer: {
    flex: 1,
  },
  wordText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000', // Force black color for visibility
  },
  speakerButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  speakerButtonActive: {
    backgroundColor: '#2980b9',
  },
  speakerIcon: {
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    paddingLeft: 8,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000000', // Force black color for visibility
  },
  noDefinitionText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  definitionContainer: {
    marginBottom: 12,
  },
  phoneticText: {
    fontSize: 16,
    color: '#555555', // Darker for better contrast
    marginBottom: 8,
    fontStyle: 'italic',
  },
  meaningContainer: {
    marginBottom: 8,
  },
  partOfSpeechText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e44ad',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  definitionItem: {
    marginBottom: 6,
    paddingLeft: 8,
  },
  definitionText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000', // Force black color for visibility
  },
  exampleText: {
    fontSize: 13,
    color: '#555555', // Darker for better contrast
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 8,
  },
});