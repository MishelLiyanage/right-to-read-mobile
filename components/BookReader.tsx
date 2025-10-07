import BlockPlayButtonsOverlay from '@/components/BlockPlayButtonsOverlay';
import DictionarySidebar from '@/components/DictionarySidebar';
import TableOfContentsSidebar from '@/components/TableOfContentsSidebar';
import TextHighlighter from '@/components/TextHighlighter';
import { ThemedText } from '@/components/ThemedText';
import WordOverlay from '@/components/WordOverlay';
import WordPopup from '@/components/WordPopup';
import { useImageLayout } from '@/hooks/useImageLayout';
import { BookDataService } from '@/services/bookDataService';
import { PageSize } from '@/services/coordinateScaler';
import { DictionaryService } from '@/services/dictionaryService';
import { BlockHighlightData, highlightDataService } from '@/services/highlightDataService';
import { ImagePreloadService } from '@/services/imagePreloadService';
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
const ORIGINAL_PAGE_SIZE: PageSize = { width: 612, height: 738 };

// Audio speed control constants
const MIN_SPEED = 0.25;
const MAX_SPEED = 3.0;
const SPEED_STEP = 0.25;

// Sidebar dimensions
const SIDEBAR_WIDTH = 100;

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
  const [isZoomed, setIsZoomed] = useState(false); // Page zoom state
  const [currentlyPlayingBlockId, setCurrentlyPlayingBlockId] = useState<number | null>(null); // Individual block playback

  const { sourceImageDimensions, containerDimensions, getRenderedImageSize, getImageOffset, onImageLoad, onImageLayout } = useImageLayout();
  const pageTransition = useRef(new Animated.Value(1)).current;

  const ttsService = useRef<TTSService | null>(null);
  const dictionaryService = useRef(DictionaryService.getInstance());
  const wordAudioService = useRef(WordAudioService.getInstance());
  const wordPositionService = useRef(WordPositionService.getInstance());
  const imagePreloadService = useRef(ImagePreloadService.getInstance());
  const currentPage = book.pages?.[currentPageIndex];
  const totalPages = book.pages?.length || 0;



  useEffect(() => {
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
        },
        onPlaybackComplete: () => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentBlockIndex(0);
          setCurrentBlockHighlightData(null);
          setCurrentlyPlayingBlockId(null); // Reset individual block playback
        },
        onPlaybackError: (error) => {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentBlockIndex(0);
          setCurrentBlockHighlightData(null);
          setCurrentlyPlayingBlockId(null); // Reset individual block playback
          Alert.alert('Playbook Error', error);
          console.error('TTS Error:', error);
        },
        onBlockStart: async (blockIndex, text) => {
          setCurrentBlockIndex(blockIndex);
          
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
      console.log('[BookReader] Starting word layout calculation:', {
        hasCurrentPage: !!currentPage,
        hasBlocks: !!currentPage?.blocks,
        blockCount: currentPage?.blocks?.length || 0,
        hasContainerDimensions: !!containerDimensions,
        hasSourceImageDimensions: !!sourceImageDimensions,
        isDictionarySidebarVisible,
        isTOCSidebarVisible,
        isWordPopupVisible
      });

      // Skip calculation if other overlays are visible or in debug mode
      if (isDictionarySidebarVisible || isTOCSidebarVisible || isWordPopupVisible) {
        console.log('[BookReader] Skipping word layout - overlay visible');
        return;
      }

      if (!currentPage?.blocks || !containerDimensions || !sourceImageDimensions) {
        console.log('[BookReader] Missing required data for word layout');
        setWordLayoutData(null);
        return;
      }

      try {
        const renderedImageSize = getRenderedImageSize();
        const imageOffset = getImageOffset();
        
        console.log('[BookReader] Image layout data:', {
          renderedImageSize,
          imageOffset,
          containerDimensions,
          sourceImageDimensions
        });
        
        if (!renderedImageSize || !imageOffset) {
          console.log('[BookReader] Missing image layout data');
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

            console.log('[BookReader] Word layout calculated:', {
              pageNumber: currentPage.pageNumber,
              totalWords: layoutData.totalWords,
              wordsWithPositions: layoutData.words.length,
              firstFewWords: layoutData.words.slice(0, 3).map(w => ({
                word: w.word,
                position: w.position
              }))
            });

            setWordLayoutData(layoutData);
            
            // Preload images for all words on this page
            const allWords = layoutData.words.map(wordPos => wordPos.word);
            imagePreloadService.current.preloadImagesForPage(currentPage.pageNumber, allWords)
              .then(() => {
                // Image preloading completed
              })
              .catch(error => {
                console.error(`Image preloading failed for page ${currentPage.pageNumber}:`, error);
              });
              
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
            
            // Preload images for fallback method too
            const allWords = layoutData.words.map(wordPos => wordPos.word);
            imagePreloadService.current.preloadImagesForPage(currentPage.pageNumber, allWords)
              .then(() => {
                // Image preloading completed (fallback)
              })
              .catch(error => {
                console.error(`Image preloading failed for page ${currentPage.pageNumber} (fallback):`, error);
              });
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
      // Reset individual block playback when starting full page playback
      if (currentlyPlayingBlockId !== null) {
        setCurrentlyPlayingBlockId(null);
      }

      if (isPaused) {
        // Resume if paused
        await ttsService.current.resume();
        setIsPaused(false);
      } else if (!isPlaying) {
        // Start from beginning if not playing
        await ttsService.current.startReading();
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
      setCurrentlyPlayingBlockId(null); // Reset individual block playback
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    if (ttsService.current) {
      await ttsService.current.setPlaybackRate(newSpeed);
    }
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleBlockPlay = async (blockId: number, blockText: string) => {
    if (!ttsService.current) {
      Alert.alert('Error', 'No TTS service available');
      return;
    }

    try {
      // If the same block is currently playing, stop it
      if (currentlyPlayingBlockId === blockId) {
        await ttsService.current.stop();
        setCurrentlyPlayingBlockId(null);
        return;
      }

      // Stop any current playback (both full page and individual block)
      if (isPlaying || currentlyPlayingBlockId !== null) {
        await ttsService.current.stop();
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentlyPlayingBlockId(null);
      }

      // Start playing the specific block
      setCurrentlyPlayingBlockId(blockId);
      
      await ttsService.current.playSpecificBlock(blockId);
      
    } catch (error) {
      console.error('Error with block play:', error);
      Alert.alert('Error', 'Failed to play block');
      setCurrentlyPlayingBlockId(null);
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
    try {
      // Set selected word and position
      setSelectedWord(word);
      setSelectedWordPosition(position);
      setIsWordPopupVisible(true);
      setDefinitionError(null);
      setSelectedWordDefinition(null);
      
      // Load definition
      setIsLoadingDefinition(true);
      
      const definitions = await dictionaryService.current.lookupWord(word, currentPage?.pageNumber);
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
          const definitions = await dictionaryService.current.lookupWord(word, currentPage?.pageNumber);
          
          // Only include words that are nouns
          if (containsNoun(definitions)) {
            validNounEntries.push({
              word,
              definitions,
              isLoading: false
            });
            
            // Update UI with valid nouns as they're found
            setDictionaryEntries([...validNounEntries]);
          }
        } catch (error) {
          // Silently skip words that can't be found - no error display
        }
      }

      // Final update with all found nouns
      setDictionaryEntries(validNounEntries);
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
    <View 
      style={styles.container}
    >
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
      <Animated.View style={[styles.pageContentContainer, { opacity: pageTransition }]}>
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={isZoomed ? styles.scrollContentZoomed : styles.scrollContent}
          showsHorizontalScrollIndicator={isZoomed}
          showsVerticalScrollIndicator={isZoomed}
          scrollEnabled={isZoomed}
        >
          <View style={[styles.imageContainer, isZoomed && styles.imageContainerZoomed]}>
            <Image
              source={currentPage.image}
              style={[
                styles.pageImage, 
                isZoomed && { 
                  transform: [{ scale: 2.0 }],
                  width: '200%',
                  height: '200%'
                }
              ]}
              contentFit="contain"
              onLoad={onImageLoad}
              onLayout={onImageLayout}
            />
            
            {/* Calculate shared display dimensions for consistent positioning */}
            {(() => {
              // Use the useImageLayout hook for CONSISTENT calculations
              const renderedImageSize = getRenderedImageSize();
              const imageOffset = getImageOffset();
              
              // Fallback to manual calculation if hook data not available yet
              if (!renderedImageSize || !imageOffset) {
                console.log('[BookReader] Using fallback calculation - hook data not ready');
                const availableWidth = screenWidth - SIDEBAR_WIDTH;
                const availableHeight = screenHeight;
                const aspectRatio = ORIGINAL_PAGE_SIZE.width / ORIGINAL_PAGE_SIZE.height;
                
                // Use full height and calculate width proportionally
                let fallbackImageSize = {
                  width: availableHeight * aspectRatio,
                  height: availableHeight
                };
                
                // If calculated width exceeds available width, constrain by width instead
                if (fallbackImageSize.width > availableWidth) {
                  fallbackImageSize = {
                    width: availableWidth,
                    height: availableWidth / aspectRatio
                  };
                }
                
                const fallbackOffset = {
                  x: (availableWidth - fallbackImageSize.width) / 2,
                  y: (availableHeight - fallbackImageSize.height) / 2
                };
                
                return (
                  <>
                    {currentBlockHighlightData && (
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
                        renderedImageSize={fallbackImageSize}
                        imageOffset={fallbackOffset}
                        onWordHighlight={(wordIndex, word) => {}}
                      />
                    )}
                    {currentPage?.blocks && (() => {
                      const bookDataService = BookDataService.getInstance();
                      const pageBlocksData = bookDataService.getBlocksForPage(currentPage.pageNumber);
                      const blocksWithBounds = currentPage.blocks.map(block => {
                        const blockData = pageBlocksData?.[block.id.toString()];
                        return {
                          id: block.id,
                          text: block.text,
                          bounding_boxes: blockData?.bounding_boxes
                        };
                      }).filter(block => block.bounding_boxes);

                      return (
                        <BlockPlayButtonsOverlay
                          blocks={blocksWithBounds}
                          originalPageSize={ORIGINAL_PAGE_SIZE}
                          renderedImageSize={fallbackImageSize}
                          imageOffset={fallbackOffset}
                          currentlyPlayingBlockId={currentlyPlayingBlockId}
                          onBlockPlay={handleBlockPlay}
                        />
                      );
                    })()}
                  </>
                );
              }
              
              // Debug logging to verify consistent calculations
              console.log('[BookReader] Using Hook-Based Calculations:', {
                renderedImageSize,
                imageOffset,
                sourceImageDimensions,
                containerDimensions,
                screenWidth,
                screenHeight
              });
              
              return (
                <>
                  {/* Text Highlighting Overlay */}
                  {currentBlockHighlightData && (
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
                      renderedImageSize={renderedImageSize}
                      imageOffset={imageOffset}
                      onWordHighlight={(wordIndex, word) => {
                        // Word highlighting callback
                      }}
                    />
                  )}

                  {/* Block Play Buttons Overlay */}
                  {currentPage?.blocks && (() => {
                    // Load block data with bounding boxes from BookDataService
                    const bookDataService = BookDataService.getInstance();
                    const pageBlocksData = bookDataService.getBlocksForPage(currentPage.pageNumber);
                    
                    // Prepare blocks data with bounding boxes
                    const blocksWithBounds = currentPage.blocks.map(block => {
                      const blockData = pageBlocksData?.[block.id.toString()];
                      return {
                        id: block.id,
                        text: block.text,
                        bounding_boxes: blockData?.bounding_boxes
                      };
                    }).filter(block => block.bounding_boxes); // Only include blocks with bounding boxes

                    return (
                      <BlockPlayButtonsOverlay
                        blocks={blocksWithBounds}
                        originalPageSize={ORIGINAL_PAGE_SIZE}
                        renderedImageSize={renderedImageSize}
                        imageOffset={imageOffset}
                        currentlyPlayingBlockId={currentlyPlayingBlockId}
                        onBlockPlay={handleBlockPlay}
                      />
                    );
                  })()}
                </>
              );
            })()}
          </View>
      </ScrollView>
      </Animated.View>

      {/* Vertical Sidebar Controls */}
      <View 
        style={styles.verticalSidebar}
      >
        {/* Vertical Controls in Order */}
        <View style={styles.sidebarSection}>
          {/* 1. Previous Arrow Button */}
          <TouchableOpacity 
            style={[
              styles.sidebarButton, 
              currentPageIndex <= 0 ? styles.disabledButton : styles.enabledButton
            ]} 
            onPress={handlePreviousPage}
            disabled={isPageTransitioning || currentPageIndex <= 0}
          >
            <ThemedText style={[
              styles.sidebarButtonText,
              currentPageIndex <= 0 ? styles.disabledText : styles.enabledText
            ]}>
              ←
            </ThemedText>
          </TouchableOpacity>

          {/* 2. Zoom Button */}
          <TouchableOpacity 
            style={[styles.sidebarButton, styles.magnifierButton]} 
            onPress={handleZoomToggle}
          >
            <ThemedText style={styles.sidebarButtonText}>
              {isZoomed ? '🔍−' : '🔍+'}
            </ThemedText>
          </TouchableOpacity>

          {/* 3. Play Button */}
          <TouchableOpacity 
            style={[
              styles.sidebarButton, 
              isPaused 
                ? styles.resumeButton 
                : isPlaying 
                  ? styles.pauseButton 
                  : styles.playButton
            ]} 
            onPress={isPaused ? handlePlayPage : isPlaying ? handlePauseReading : handlePlayPage}
          >
            <ThemedText style={styles.sidebarButtonText}>
              {isPaused 
                ? '▶' 
                : isPlaying 
                  ? '⏸' 
                  : '▶'
              }
            </ThemedText>
          </TouchableOpacity>

          {/* 4. Page Number Indicator */}
          <View style={styles.pageIndicator}>
            <ThemedText style={styles.pageText}>
              {currentPageIndex + 1}
            </ThemedText>
            <ThemedText style={styles.pageText}>
              /{book?.pages?.length || 0}
            </ThemedText>
          </View>

          {/* 5. Stop Button */}
          <TouchableOpacity 
            style={[styles.sidebarButton, styles.stopButton]} 
            onPress={handleStopReading}
            disabled={!isPlaying && !isPaused}
          >
            <ThemedText style={styles.sidebarButtonText}>⏹</ThemedText>
          </TouchableOpacity>

          {/* 6. Audio Speed Changer */}
          <View style={styles.speedControlSection}>
            <ThemedText style={styles.speedLabel}>{playbackSpeed}x</ThemedText>
            {[0.5, 0.75, 1.0, 1.25, 1.5].map((speed) => (
              <TouchableOpacity 
                key={speed}
                onPress={() => handleSpeedChange(speed)}
                style={[
                  styles.speedButton,
                  { backgroundColor: playbackSpeed === speed ? '#FF6B6B' : '#ddd' }
                ]}
              >
                <ThemedText style={[
                  styles.speedButtonText,
                  { color: playbackSpeed === speed ? 'white' : 'black' }
                ]}>
                  {speed}x
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          {/* 7. Next Arrow Button */}
          <TouchableOpacity 
            style={[
              styles.sidebarButton, 
              (!book?.pages || currentPageIndex >= book.pages.length - 1) ? styles.disabledButton : styles.enabledButton
            ]} 
            onPress={handleNextPage}
            disabled={isPageTransitioning || !book?.pages || currentPageIndex >= book.pages.length - 1}
          >
            <ThemedText style={[
              styles.sidebarButtonText,
              (!book?.pages || currentPageIndex >= book.pages.length - 1) ? styles.disabledText : styles.enabledText
            ]}>
              →
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
          sidebarOffset={SIDEBAR_WIDTH}
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
        containerDimensions={containerDimensions || { width: screenWidth - SIDEBAR_WIDTH, height: screenHeight }}
        sidebarOffset={SIDEBAR_WIDTH}
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
  pageContentContainer: {
    flex: 1,
    marginLeft: SIDEBAR_WIDTH,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: SIDEBAR_WIDTH + 20, // Position to the right of sidebar
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
  scrollContentZoomed: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: '200%',
    minWidth: '200%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainerZoomed: {
    overflow: 'visible',
  },
  pageImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  verticalSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 1000,
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
  magnifierButton: {
    backgroundColor: '#9C27B0',
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
    marginVertical: 8,
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
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 16,
    paddingLeft: 60,
    gap: 8,
  },
  speedControlTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  sliderContainer: {
    position: 'relative',
    width: 180,
    alignItems: 'center',
  },
  speedSlider: {
    width: 180,
    height: 5,
  },
  speedDots: {
    position: 'absolute',
    top: 13,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  speedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
  },
  speedDotActive: {
    backgroundColor: '#000',
  },
  sidebarSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 30,
  },
  sidebarButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  sidebarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pageText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  speedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  speedButton: {
    padding: 4,
    borderRadius: 4,
    marginVertical: 2,
    minWidth: 35,
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  speedControlSection: {
    alignItems: 'center',
    marginVertical: 8,
  },
});
