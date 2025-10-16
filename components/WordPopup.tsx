import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { WordPosition } from '@/services/wordPositionService';
import { WordDefinition } from '@/types/book';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface WordPopupProps {
  isVisible: boolean;
  word: string;
  wordPosition: WordPosition | null;
  definition: WordDefinition | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSpeakWord: (word: string) => Promise<void>;
  containerDimensions: { width: number; height: number };
  sidebarOffset?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const POPUP_WIDTH = 320;
const POPUP_MAX_HEIGHT = 450;
const ARROW_SIZE = 12;

export default function WordPopup({
  isVisible,
  word,
  wordPosition,
  definition,
  isLoading,
  error,
  onClose,
  onSpeakWord,
  containerDimensions,
  sidebarOffset = 0,
}: WordPopupProps) {
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, arrowPosition: 'bottom' });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible && wordPosition) {
      calculatePopupPosition();
      showPopup();
      setImageLoadError(false); // Reset image error state
    } else {
      hidePopup();
    }
  }, [isVisible, wordPosition, sidebarOffset]);

  const calculatePopupPosition = () => {
    if (!wordPosition) return;

    const wordCenter = {
      x: (wordPosition.position.topLeft[0] + wordPosition.position.bottomRight[0]) / 2 + sidebarOffset,
      y: (wordPosition.position.topLeft[1] + wordPosition.position.bottomRight[1]) / 2,
    };

    let popupX = wordCenter.x - POPUP_WIDTH / 2;
    let popupY = wordPosition.position.topLeft[1] - POPUP_MAX_HEIGHT - ARROW_SIZE - 10;
    let arrowPosition = 'bottom';

    // Adjust horizontal position if popup goes off screen
    if (popupX < 20) {
      popupX = 20;
    } else if (popupX + POPUP_WIDTH > containerDimensions.width - 20) {
      popupX = containerDimensions.width - POPUP_WIDTH - 20;
    }

    // If popup doesn't fit above the word, show it below
    if (popupY < 20) {
      popupY = wordPosition.position.bottomRight[1] + ARROW_SIZE + 10;
      arrowPosition = 'top';
    }

    // If still doesn't fit, show beside the word
    if (popupY + POPUP_MAX_HEIGHT > containerDimensions.height - 20) {
      if (wordCenter.x < containerDimensions.width / 2) {
        // Show on the right
        popupX = wordPosition.position.bottomRight[0] + sidebarOffset + ARROW_SIZE + 10;
        popupY = wordCenter.y - POPUP_MAX_HEIGHT / 2;
        arrowPosition = 'left';
      } else {
        // Show on the left
        popupX = wordPosition.position.topLeft[0] + sidebarOffset - POPUP_WIDTH - ARROW_SIZE - 10;
        popupY = wordCenter.y - POPUP_MAX_HEIGHT / 2;
        arrowPosition = 'right';
      }
    }

    setPopupPosition({ x: popupX, y: popupY, arrowPosition });
  };

  const showPopup = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hidePopup = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSpeakWord = async () => {
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      await onSpeakWord(word);
    } catch (error) {
      console.error('Error speaking word:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  if (!isVisible) return null;

  const arrowStyle = getArrowStyle(popupPosition.arrowPosition, wordPosition);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} accessibilityLabel="Close word definition popup">
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.popup,
                {
                  left: popupPosition.x,
                  top: popupPosition.y,
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                },
              ]}
              accessibilityRole="alert"
              accessibilityLabel={`Definition for word: ${word}`}
            >
              <ThemedView style={styles.container}>
                {/* Header with word and speaker */}
                <View style={styles.header}>
                  <View style={styles.wordContainer}>
                    <ThemedText style={styles.word}>{word}</ThemedText>
                    {definition?.phonetic && (
                      <ThemedText style={styles.phonetic}>
                        {definition.phonetic}
                      </ThemedText>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={handleSpeakWord}
                    style={styles.speakerButton}
                    disabled={isSpeaking}
                  >
                    <Ionicons
                      name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                      size={24}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                  style={styles.content}
                  showsVerticalScrollIndicator={false}
                >
                  {isLoading && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color="#007AFF" />
                      <ThemedText style={styles.loadingText}>
                        Looking up definition...
                      </ThemedText>
                    </View>
                  )}

                  {error && (
                    <View style={styles.errorContainer}>
                      <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
                      <ThemedText style={styles.errorText}>{error}</ThemedText>
                    </View>
                  )}

                  {definition && !isLoading && !error && (
                    <View style={styles.definitionContainer}>
                      {definition.imageUrl && !imageLoadError && (
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: definition.imageUrl }}
                            style={styles.wordImage}
                            contentFit="cover"
                            placeholder={{ uri: `https://picsum.photos/seed/${word}/80/80` }}
                            transition={300}
                            cachePolicy="memory-disk"
                            onLoad={() => {

                              setImageLoadError(false);
                            }}
                            onError={(error) => {

                              setImageLoadError(true);
                            }}
                          />
                        </View>
                      )}
                      {definition.imageUrl && imageLoadError && (
                        <View style={styles.imageContainer}>
                          <Image
                            source={{ uri: `https://picsum.photos/seed/${word}/140/140` }}
                            style={styles.wordImage}
                            contentFit="cover"
                            transition={300}
                            cachePolicy="memory-disk"
                          />
                        </View>
                      )}
                      {definition.meanings.map((meaning, index) => (
                        <View key={index} style={styles.meaningSection}>
                          <ThemedText style={styles.partOfSpeech}>
                            {meaning.partOfSpeech}
                          </ThemedText>
                          {meaning.definitions.slice(0, 2).map((def, defIndex) => (
                            <View key={defIndex} style={styles.definition}>
                              <ThemedText style={styles.definitionText}>
                                {def.definition}
                              </ThemedText>
                              
                              {/* Sinhala Translation */}
                              {def.sinhala_translation && (
                                <View style={styles.translationContainer}>
                                  <ThemedText style={styles.translationLabel}>
                                    Sinhala:
                                  </ThemedText>
                                  <ThemedText style={styles.translationText}>
                                    {def.sinhala_translation}
                                  </ThemedText>
                                </View>
                              )}
                              
                              {/* Tamil Translation */}
                              {def.tamil_translation && (
                                <View style={styles.translationContainer}>
                                  <ThemedText style={styles.translationLabel}>
                                    Tamil:
                                  </ThemedText>
                                  <ThemedText style={styles.translationText}>
                                    {def.tamil_translation}
                                  </ThemedText>
                                </View>
                              )}
                              
                              {def.example && (
                                <ThemedText style={styles.example}>
                                  Example: &ldquo;{def.example}&rdquo;
                                </ThemedText>
                              )}
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}
                </ScrollView>
              </ThemedView>

              {/* Arrow pointing to word */}
              <View style={[styles.arrow, arrowStyle]} />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

function getArrowStyle(arrowPosition: string, wordPosition: WordPosition | null) {
  if (!wordPosition) return {};

  const baseArrowStyle = {
    position: 'absolute' as const,
    width: 0,
    height: 0,
  };

  switch (arrowPosition) {
    case 'bottom':
      return {
        ...baseArrowStyle,
        bottom: -ARROW_SIZE,
        left: POPUP_WIDTH / 2 - ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
      };
    case 'top':
      return {
        ...baseArrowStyle,
        top: -ARROW_SIZE,
        left: POPUP_WIDTH / 2 - ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
      };
    case 'left':
      return {
        ...baseArrowStyle,
        left: -ARROW_SIZE,
        top: POPUP_MAX_HEIGHT / 2 - ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderRightWidth: ARROW_SIZE,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: '#FFFFFF',
      };
    case 'right':
      return {
        ...baseArrowStyle,
        right: -ARROW_SIZE,
        top: POPUP_MAX_HEIGHT / 2 - ARROW_SIZE,
        borderTopWidth: ARROW_SIZE,
        borderBottomWidth: ARROW_SIZE,
        borderLeftWidth: ARROW_SIZE,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: '#FFFFFF',
      };
    default:
      return baseArrowStyle;
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  popup: {
    position: 'absolute',
    width: POPUP_WIDTH,
    maxHeight: POPUP_MAX_HEIGHT,
  },
  container: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    paddingBottom: 6,
  },
  wordContainer: {
    flex: 1,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  phonetic: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  speakerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    maxHeight: POPUP_MAX_HEIGHT - 100,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF3B30',
  },
  definitionContainer: {
    paddingBottom: 8,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  wordImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  meaningSection: {
    marginBottom: 12,
  },
  partOfSpeech: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  definition: {
    marginBottom: 6,
  },
  definitionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  example: {
    fontSize: 13,
    fontStyle: 'italic',
    opacity: 0.8,
    marginTop: 4,
    marginLeft: 12,
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
    color: '#b0b0b0ff',
    marginRight: 6,
    minWidth: 50,
  },
  translationText: {
    fontSize: 12,
    color: '#ecececff',
    flex: 1,
    lineHeight: 16,
  },
  arrow: {
    zIndex: -1,
  },
});