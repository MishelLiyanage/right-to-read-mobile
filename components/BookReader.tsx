import DictionarySidebar from '@/components/DictionarySidebar';
import TableOfContentsSidebar from '@/components/TableOfContentsSidebar';
import TextHighlighter from '@/components/TextHighlighter';
import { ThemedText } from '@/components/ThemedText';
import WordOverlay from '@/components/WordOverlay';
import WordPopup from '@/components/WordPopup';
import { useImageLayout } from '@/hooks/useImageLayout';
import { PageSize } from '@/services/coordinateScaler';
import { DictionaryService } from '@/services/dictionaryService';
import { BlockHighlightData, highlightDataService } from '@/services/highlightDataService';
import { TextProcessor } from '@/services/textProcessor';
import { TTSService, TTSServiceCallbacks } from '@/services/ttsService';
import { WordAudioService } from '@/services/wordAudioService';
import { WordLayoutData, WordPosition, WordPositionService } from '@/services/wordPositionService';
import { Book, DictionaryEntry, WordDefinition } from '@/types/book';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Original page dimensions based on coordinate analysis
const ORIGINAL_PAGE_SIZE: PageSize = { width: 612, height: 774 };

export default function BookReader({ book, onClose }: BookReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  const [currentPlaybackPosition, setCurrentPlaybackPosition] = useState(0);
  const [currentBlockHighlightData, setCurrentBlockHighlightData] = useState<BlockHighlightData | null>(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isTOCSidebarVisible, setIsTOCSidebarVisible] = useState(false);
  const [isDictionarySidebarVisible, setIsDictionarySidebarVisible] = useState(false);
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([]);
  
  // Word selection states
  const [wordLayoutData, setWordLayoutData] = useState<WordLayoutData | null>(null);
  const [isWordPopupVisible, setIsWordPopupVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [selectedWordPosition, setSelectedWordPosition] = useState<WordPosition | null>(null);
  const [selectedWordDefinition, setSelectedWordDefinition] = useState<WordDefinition | null>(null);
  const [isLoadingDefinition, setIsLoadingDefinition] = useState(false);
  const [definitionError, setDefinitionError] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Audio playback speed

  const { sourceImageDimensions, containerDimensions, getRenderedImageSize, getImageOffset, onImageLoad, onImageLayout } = useImageLayout();
  const pageTransition = useRef(new Animated.Value(1)).current;

  const ttsService = useRef<TTSService | null>(null);
  const dictionaryService = useRef(DictionaryService.getInstance());
  const wordAudioService = useRef(WordAudioService.getInstance());
  const wordPositionService = useRef(WordPositionService.getInstance());
  const currentPage = book.pages?.[currentPageIndex];
  const totalPages = book.pages?.length || 0;

  useEffect(() => {
    console.log(`Initializing page ${currentPageIndex + 1} of ${totalPages}`);
    
    // Cleanup previous TTS service
    const cleanupPrevious = async () => {
      if (ttsService.current) {
        await ttsService.current.cleanup();
        ttsService.current = null;
      }
    };

    // Initialize new page
    const initializePage = async () => {
      // Clean up previous instance first
      await cleanupPrevious();
      
      // Reset states for new page
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentBlockIndex(0);
      setCurrentBlockHighlightData(null);
      setCurrentPlaybackPosition(0);

      // Initialize TTS Service with callbacks
      const callbacks: TTSServiceCallbacks = {
        onPlaybackStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          console.log('Started reading page content');
        },
        onPlaybackComplete: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentBlockIndex(0);
          setCurrentBlockHighlightData(null);
          console.log('Completed reading page content');
        },
        onPlaybackError: (error) => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentBlockIndex(0);
          setCurrentBlockHighlightData(null);
          Alert.alert('Playback Error', error);
          console.error('TTS Error:', error);
        },
        onBlockStart: async (blockIndex, text) => {
          setCurrentBlockIndex(blockIndex);
          console.log(`Reading block ${blockIndex + 1}: "${text}"`);
          
          // Load highlighting data for current block
          const blockId = currentPage?.blocks?.[blockIndex]?.id;
          if (blockId) {
            try {
              const highlightData = await highlightDataService.getBlockHighlightData(blockId, currentPage.pageNumber);
              setCurrentBlockHighlightData(highlightData);
            } catch (error) {
              console.error('Failed to load highlight data:', error);
            }
          }
        },
        onBlockComplete: (blockIndex) => {
          console.log(`Completed block ${blockIndex + 1}`);
        },
        onPlaybackProgress: (position, duration, blockIndex) => {
          setCurrentPlaybackPosition(position);
        }
      };

      // Create and initialize new TTS service
      ttsService.current = new TTSService(callbacks);

      if (currentPage?.blocks && ttsService.current) {
        try {
          await ttsService.current.initialize();
          ttsService.current.loadContent(currentPage.blocks);
          console.log(`TTS initialized and loaded ${currentPage.blocks.length} blocks for page ${currentPageIndex + 1}`);
        } catch (error) {
          console.error('Failed to initialize TTS Service:', error);
        }
      }
    };

    initializePage();

    // Cleanup on unmount
    return () => {
      if (ttsService.current) {
        ttsService.current.cleanup();
      }
      // Clear word position cache
      wordPositionService.current.clearCache();
    };
  }, [currentPageIndex]);

  // Calculate word positions when image layout is ready
  useEffect(() => {
    const calculateWordLayout = async () => {
      // Skip calculation if other overlays are visible or in debug mode
      if (isDictionarySidebarVisible || isTOCSidebarVisible || isWordPopupVisible) {
        return;
      }

      if (!currentPage?.blocks || !containerDimensions || !sourceImageDimensions) {
        setWordLayoutData(null);
        return;
      }

      try {
        console.log('Calculating word layout for page', currentPageIndex + 1);
        
        const renderedImageSize = getRenderedImageSize();
        const imageOffset = getImageOffset();
        
        if (!renderedImageSize || !imageOffset) {
          console.warn('Image dimensions not ready for word layout calculation');
          return;
        }

        // Use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
          try {
            // Use the new method that loads your actual coordinate data
            const layoutData = wordPositionService.current.calculateWordPositionsFromData(
              currentPage.pageNumber,
              ORIGINAL_PAGE_SIZE,
              renderedImageSize,
              imageOffset
            );

            setWordLayoutData(layoutData);
            console.log(`Word layout calculated from data files: ${layoutData.totalWords} words (displaying ${layoutData.words.length})`);
          } catch (error) {
            console.error('Failed to load word layout from data files:', error);
            // Fallback to the old method if data files are not available
            const layoutData = wordPositionService.current.calculateWordPositions(
              currentPage.blocks!,
              ORIGINAL_PAGE_SIZE,
              renderedImageSize,
              imageOffset
            );
            setWordLayoutData(layoutData);
            console.log(`Word layout calculated (fallback): ${layoutData.totalWords} words`);
          }
        });
      } catch (error) {
        console.error('Failed to calculate word layout:', error);
        setWordLayoutData(null);
      }
    };

    // Debounce the calculation to avoid excessive calls
    const timeoutId = setTimeout(calculateWordLayout, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPageIndex, containerDimensions, sourceImageDimensions, currentPage, isDictionarySidebarVisible, isTOCSidebarVisible, isWordPopupVisible]);

  // Navigation functions
  const handlePreviousPage = () => {
    if (isPageTransitioning || currentPageIndex <= 0) return;
    
    setIsPageTransitioning(true);
    
    // Fade out
    Animated.timing(pageTransition, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPageIndex(currentPageIndex - 1);
      
      // Fade in
      Animated.timing(pageTransition, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setIsPageTransitioning(false);
      });
    });
  };

  const handleNextPage = () => {
    if (isPageTransitioning || !book?.pages || currentPageIndex >= book.pages.length - 1) return;
    
    setIsPageTransitioning(true);
    
    // Fade out
    Animated.timing(pageTransition, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentPageIndex(currentPageIndex + 1);
      
      // Fade in
      Animated.timing(pageTransition, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setIsPageTransitioning(false);
      });
    });
  };

  const handlePlayPage = async () => {
    if (!ttsService.current || !currentPage?.blocks) {
      Alert.alert('Error', 'No content available to read');
      return;
    }

    try {
      if (isPaused) {
        // Resume if paused
        await ttsService.current.resume();
        setIsPaused(false);
        console.log('Resumed reading from pause');
      } else if (!isPlaying) {
        // Start from beginning if not playing
        await ttsService.current.startReading();
        console.log('Started reading from beginning');
      }
    } catch (error) {
      console.error('Error with play/resume:', error);
      Alert.alert('Error', 'Failed to start/resume reading');
    }
  };

  const handlePauseReading = async () => {
    if (ttsService.current && isPlaying && !isPaused) {
      try {
        await ttsService.current.pause();
        setIsPaused(true);
        console.log('Paused reading');
      } catch (error) {
        console.error('Error pausing TTS:', error);
        Alert.alert('Error', 'Failed to pause reading');
      }
    }
  };

  const handleStopReading = async () => {
    if (ttsService.current) {
      await ttsService.current.stop();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (ttsService.current) {
      await ttsService.current.setPlaybackRate(newSpeed);
    }
  };

  const handleTOCNavigation = (targetPageNumber: number) => {
    // Find the page index that corresponds to the target page number
    const targetPageIndex = book.pages?.findIndex(page => page.pageNumber === targetPageNumber);
    
    if (targetPageIndex !== undefined && targetPageIndex !== -1) {
      setCurrentPageIndex(targetPageIndex);
    }
  };

  const handleCloseTOCSidebar = () => {
    setIsTOCSidebarVisible(false);
  };

  // Word selection handlers
  const handleWordSelect = async (word: string, position: WordPosition) => {
    console.log(`Word selected: "${word}"`);
    
    try {
      // Set selected word and position
      setSelectedWord(word);
      setSelectedWordPosition(position);
      setIsWordPopupVisible(true);
      setDefinitionError(null);
      setSelectedWordDefinition(null);
      
      // Load definition
      setIsLoadingDefinition(true);
      
      const definitions = await dictionaryService.current.lookupWord(word);
      if (definitions && definitions.length > 0) {
        setSelectedWordDefinition(definitions[0]);
      } else {
        setDefinitionError(`No definition found for "${word}"`);
      }
    } catch (error) {
      console.error('Error loading word definition:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          setDefinitionError(`"${word}" not found in dictionary`);
        } else if (error.message.includes('network')) {
          setDefinitionError('Please check your internet connection');
        } else {
          setDefinitionError(`Unable to load definition for "${word}"`);
        }
      } else {
        setDefinitionError(`Failed to load definition for "${word}"`);
      }
    } finally {
      setIsLoadingDefinition(false);
    }
  };

  const handleWordPopupClose = () => {
    setIsWordPopupVisible(false);
    setSelectedWord('');
    setSelectedWordPosition(null);
    setSelectedWordDefinition(null);
    setDefinitionError(null);
    setIsLoadingDefinition(false);
  };

  const handleSpeakSelectedWord = async (word: string) => {
    try {
      await wordAudioService.current.speakWord(word);
      console.log(`Spoken word: "${word}"`);
    } catch (error) {
      console.error('Error speaking word:', error);
      Alert.alert('Error', `Failed to speak "${word}"`);
    }
  };

  const handleDictionaryToggle = async () => {
    if (!isDictionarySidebarVisible) {
      // Extract words from current page and load dictionary entries
      await loadDictionaryForCurrentPage();
    }
    setIsDictionarySidebarVisible(!isDictionarySidebarVisible);
  };

  const handleCloseDictionarySidebar = () => {
    setIsDictionarySidebarVisible(false);
  };

  const loadDictionaryForCurrentPage = async () => {
    if (!currentPage?.blocks || currentPage.blocks.length === 0) {
      setDictionaryEntries([]);
      return;
    }

    try {
      // Extract words from current page blocks
      const words = TextProcessor.extractWordsFromBlocks(currentPage.blocks, false);
      const potentialNouns = TextProcessor.getPotentialNouns(words);
      const limitedWords = TextProcessor.limitWordCount(potentialNouns, 15); // Further reduced for better performance

      console.log(`Loading dictionary for ${limitedWords.length} potential nouns from page ${currentPageIndex + 1}`);

      // Helper function to check if a word definition contains nouns
      const containsNoun = (definitions: any[]): boolean => {
        return definitions.some(def => 
          def.meanings?.some((meaning: any) => 
            meaning.partOfSpeech?.toLowerCase().includes('noun')
          )
        );
      };

      // Load definitions and filter for nouns only
      const validNounEntries: DictionaryEntry[] = [];
      
      // Set initial loading state
      const initialEntries: DictionaryEntry[] = limitedWords.map(word => ({
        word,
        definitions: [],
        isLoading: true
      }));
      setDictionaryEntries(initialEntries);

      for (const word of limitedWords) {
        try {
          const definitions = await dictionaryService.current.lookupWord(word);
          
          // Only include words that are nouns
          if (containsNoun(definitions)) {
            validNounEntries.push({
              word,
              definitions,
              isLoading: false
            });
            
            // Update UI with valid nouns as they're found
            setDictionaryEntries([...validNounEntries]);
          } else {
            console.log(`Skipping "${word}" - not a noun`);
          }
        } catch (error) {
          // Silently skip words that can't be found - no error display
          console.log(`Skipping "${word}" - definition not found`);
        }
      }

      // Final update with all found nouns
      setDictionaryEntries(validNounEntries);
      console.log(`Found ${validNounEntries.length} nouns out of ${limitedWords.length} words`);
    } catch (error) {
      console.error('Error loading dictionary for current page:', error);
      setDictionaryEntries([]);
    }
  };

  const handleSpeakWord = async (word: string): Promise<void> => {
    try {
      await wordAudioService.current.speakWord(word);
    } catch (error) {
      console.error(`Error speaking word "${word}":`, error);
      throw new Error(`Failed to pronounce "${word}"`);
    }
  };

  if (!currentPage) {
    return (
      <View style={styles.container}>
        <ThemedText>No content available for this book.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity onPress={onClose} style={styles.floatingBackButton}>
        <ThemedText style={styles.backText}>←</ThemedText>
      </TouchableOpacity>

      {/* Floating TOC Button */}
      {book.tableOfContents && book.tableOfContents.length > 0 && (
        <TouchableOpacity 
          onPress={() => setIsTOCSidebarVisible(true)} 
          style={styles.floatingTOCButton}
        >
          <ThemedText style={styles.tocText}>☰</ThemedText>
        </TouchableOpacity>
      )}

      {/* Floating Dictionary Button */}
      <TouchableOpacity 
        onPress={handleDictionaryToggle} 
        style={styles.floatingDictionaryButton}
      >
        <ThemedText style={styles.dictionaryText}>📚</ThemedText>
      </TouchableOpacity>

      {/* Page Content */}
      <Animated.View style={{ flex: 1, opacity: pageTransition }}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            <Image
              source={currentPage.image}
              style={styles.pageImage}
              contentFit="contain"
              onLoad={onImageLoad}
              onLayout={onImageLayout}
            />
            
            {/* Text Highlighting Overlay */}
          {currentBlockHighlightData && (() => {
            // Calculate display image size based on full height layout
            // The image takes the full available height (from top to audio controls) and adjusts width maintaining aspect ratio
            const availableHeight = screenHeight - 100; // Only subtract space for audio controls at bottom
            const aspectRatio = ORIGINAL_PAGE_SIZE.width / ORIGINAL_PAGE_SIZE.height;
            
            // Calculate display size - image fills height, width is calculated from aspect ratio
            const displayImageSize = {
              width: availableHeight * aspectRatio,
              height: availableHeight
            };
            
            // If calculated width exceeds screen width, limit by width instead
            if (displayImageSize.width > screenWidth) {
              displayImageSize.width = screenWidth;
              displayImageSize.height = screenWidth / aspectRatio;
            }
            
            // Calculate image offset for centering
            const imageOffset = {
              x: (screenWidth - displayImageSize.width) / 2,
              y: (availableHeight - displayImageSize.height) / 2
            };
            
            console.log(`Using display image size for highlighting: ${displayImageSize.width}x${displayImageSize.height}`);
            console.log(`Original page size: ${ORIGINAL_PAGE_SIZE.width}x${ORIGINAL_PAGE_SIZE.height}`);
            console.log(`Image offset: x=${imageOffset.x}, y=${imageOffset.y}`);
            console.log(`Available height: ${availableHeight}, Screen height: ${screenHeight}, Aspect ratio: ${aspectRatio}`);
            
            return (
              <TextHighlighter
                blockData={{
                  id: currentBlockHighlightData.blockId,
                  text: currentBlockHighlightData.text,
                  words: currentBlockHighlightData.words,
                  bounding_boxes: currentBlockHighlightData.bounding_boxes
                }}
                speechMarks={currentBlockHighlightData.speechMarks}
                isPlaying={isPlaying && !isPaused}
                currentTime={currentPlaybackPosition}
                originalPageSize={ORIGINAL_PAGE_SIZE}
                renderedImageSize={displayImageSize}
                imageOffset={imageOffset}
                onWordHighlight={(wordIndex, word) => {
                  console.log(`Highlighting word ${wordIndex}: ${word}`);
                }}
              />
            );
          })()}
        </View>
      </ScrollView>
      </Animated.View>

      {/* Audio Controls */}
      <View style={styles.audioControls}>
        <ThemedText style={styles.audioTitle}>Listen to this page:</ThemedText>
        
        {/* All Controls in One Row */}
        <View style={styles.allControlsRow}>
          {/* Previous Navigation Button - Left */}
          <TouchableOpacity 
            style={[
              styles.navigationButton, 
              currentPageIndex <= 0 ? styles.disabledButton : styles.enabledButton
            ]} 
            onPress={handlePreviousPage}
            disabled={isPageTransitioning || currentPageIndex <= 0}
          >
            <ThemedText style={[
              styles.navigationButtonText,
              currentPageIndex <= 0 ? styles.disabledText : styles.enabledText
            ]}>
              ← Previous
            </ThemedText>
          </TouchableOpacity>

          {/* Center Audio Controls */}
          <View style={styles.centerAudioControls}>
            {/* Play Button */}
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                isPaused 
                  ? styles.resumeButton 
                  : isPlaying 
                    ? styles.pauseButton 
                    : styles.playButton
              ]} 
              onPress={isPaused ? handlePlayPage : isPlaying ? handlePauseReading : handlePlayPage}
              disabled={false}
            >
              <ThemedText style={styles.controlButtonText}>
                {isPaused 
                  ? '▶ Resume' 
                  : isPlaying 
                    ? '⏸ Pause' 
                    : '▶ Play'
                }
              </ThemedText>
            </TouchableOpacity>
            
            {/* Page Indicator */}
            <View style={styles.pageIndicatorCenter}>
              <ThemedText style={styles.pageIndicatorText}>
                Page {currentPageIndex + 1} of {book?.pages?.length || 0}
              </ThemedText>
            </View>
            
            {/* Stop Button */}
            <TouchableOpacity 
              style={[styles.controlButton, styles.stopButton]} 
              onPress={handleStopReading}
              disabled={!isPlaying && !isPaused}
            >
              <ThemedText style={styles.controlButtonText}>⏹ Stop</ThemedText>
            </TouchableOpacity>
            
            {/* Speed Control */}
            <View style={styles.speedControl}>
              <ThemedText style={styles.speedLabel}>{playbackSpeed}×</ThemedText>
              <View style={styles.speedButtons}>
                <TouchableOpacity 
                  style={styles.speedButton} 
                  onPress={() => handleSpeedChange(Math.max(0.25, playbackSpeed - 0.25))}
                >
                  <ThemedText style={styles.speedButtonText}>−</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.speedButton} 
                  onPress={() => handleSpeedChange(Math.min(3.0, playbackSpeed + 0.25))}
                >
                  <ThemedText style={styles.speedButtonText}>+</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Next Navigation Button - Right */}
          <TouchableOpacity 
            style={[
              styles.navigationButton, 
              (!book?.pages || currentPageIndex >= book.pages.length - 1) ? styles.disabledButton : styles.enabledButton
            ]} 
            onPress={handleNextPage}
            disabled={isPageTransitioning || !book?.pages || currentPageIndex >= book.pages.length - 1}
          >
            <ThemedText style={[
              styles.navigationButtonText,
              (!book?.pages || currentPageIndex >= book.pages.length - 1) ? styles.disabledText : styles.enabledText
            ]}>
              Next →
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table of Contents Sidebar */}
      {book.tableOfContents && (
        <TableOfContentsSidebar
          isVisible={isTOCSidebarVisible}
          sections={book.tableOfContents}
          currentPageNumber={currentPage.pageNumber}
          onClose={handleCloseTOCSidebar}
          onSectionPress={handleTOCNavigation}
        />
      )}

      {/* Word Overlay for word selection */}
      {containerDimensions && (
        <WordOverlay
          layoutData={wordLayoutData}
          onWordSelect={handleWordSelect}
          isEnabled={!isWordPopupVisible && !isDictionarySidebarVisible && !isTOCSidebarVisible}
          containerDimensions={containerDimensions}
        />
      )}

      {/* Word Definition Popup */}
      <WordPopup
        isVisible={isWordPopupVisible}
        word={selectedWord}
        wordPosition={selectedWordPosition}
        definition={selectedWordDefinition}
        isLoading={isLoadingDefinition}
        error={definitionError}
        onClose={handleWordPopupClose}
        onSpeakWord={handleSpeakSelectedWord}
        containerDimensions={containerDimensions || { width: screenWidth, height: screenHeight }}
      />

      {/* Dictionary Sidebar */}
      <DictionarySidebar
        isVisible={isDictionarySidebarVisible}
        entries={dictionaryEntries}
        onClose={handleCloseDictionarySidebar}
        onSpeakWord={handleSpeakWord}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backText: {
    fontSize: 24,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  floatingTOCButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tocText: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  floatingDictionaryButton: {
    position: 'absolute',
    top: 110, // Position below TOC button
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dictionaryText: {
    fontSize: 18,
    color: '#8e44ad',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  audioControls: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingBottom: 32,
    paddingHorizontal: 26,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  audioTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 0,
  },
  allControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  centerAudioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  controlButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  resumeButton: {
    backgroundColor: '#2196F3',
  },
  stopButton: {
    backgroundColor: '#F44336',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  navigationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#4A90E2',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  navigationButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  enabledText: {
    color: '#fff',
  },
  disabledText: {
    color: '#888',
  },
  pageIndicator: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 20,
  },
  pageIndicatorCenter: {
    alignItems: 'center',
    minWidth: 80,
    marginHorizontal: 8,
  },
  pageIndicatorText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  speedControl: {
    alignItems: 'center',
    minWidth: 60,
    marginLeft: 16,
    paddingLeft: 98,
  },
  speedLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: 2,
  },
  speedButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
  },
});
