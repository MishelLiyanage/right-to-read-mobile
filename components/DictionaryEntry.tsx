import { ThemedView } from '@/components/ThemedView';
import { getPictureDictionaryImage } from '@/constants/PictureDictionary';
import { DictionaryEntry as DictionaryEntryType } from '@/types/book';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DictionaryEntryProps {
  entry: DictionaryEntryType;
  onSpeakWord: (word: string) => Promise<void>;
}

export default function DictionaryEntry({ entry, onSpeakWord }: DictionaryEntryProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  // Get picture dictionary image for this word
  const pictureDictionaryImage = getPictureDictionaryImage(entry.word);

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
                  {def.definition}
                </Text>
                
                {/* Sinhala Translation */}
                {def.sinhala_translation && (
                  <View style={styles.translationContainer}>
                    <Text style={styles.translationLabel}>Sinhala:</Text>
                    <Text style={styles.translationText}>{def.sinhala_translation}</Text>
                  </View>
                )}
                
                {/* Tamil Translation */}
                {def.tamil_translation && (
                  <View style={styles.translationContainer}>
                    <Text style={styles.translationLabel}>Tamil:</Text>
                    <Text style={styles.translationText}>{def.tamil_translation}</Text>
                  </View>
                )}
                
                {def.example && (
                  <Text style={styles.exampleText}>
                    Example: &ldquo;{def.example}&rdquo;
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

      {/* Picture Dictionary Image */}
      {pictureDictionaryImage && !imageLoadError && (
        <View style={styles.pictureContainer}>
          <Image
            source={{ uri: pictureDictionaryImage }}
            style={styles.pictureImage}
            contentFit="contain"
            transition={300}
            cachePolicy="memory-disk"
            onError={() => setImageLoadError(true)}
          />
        </View>
      )}

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
    borderBottomColor: '#333333',
    paddingBottom: 16,
    backgroundColor: 'transparent', // Transparent background to inherit from sidebar
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
    color: '#FFFFFF', // White text on dark background
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
  pictureContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  pictureImage: {
    width: '100%',
    height: '100%',
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
    color: '#FFFFFF', // White text on dark background
  },
  noDefinitionText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  definitionContainer: {
    marginBottom: 12,
  },
  phoneticText: {
    fontSize: 16,
    color: '#CCCCCC', // Light gray on dark background
    marginBottom: 8,
    fontStyle: 'italic',
  },
  meaningContainer: {
    marginBottom: 8,
  },
  partOfSpeechText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#BB86FC', // Purple accent color for dark theme
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
    color: '#FFFFFF', // White text on dark background
  },
  exampleText: {
    fontSize: 13,
    color: '#CCCCCC', // Light gray on dark background
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 8,
  },
  translationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginLeft: 8,
  },
  translationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b8b8b8ff',
    marginRight: 6,
    minWidth: 50,
  },
  translationText: {
    fontSize: 12,
    color: '#f8f8f8ff',
    flex: 1,
    lineHeight: 16,
  },
});