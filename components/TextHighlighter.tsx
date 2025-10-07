import { CoordinateScaler, PageSize } from '@/services/coordinateScaler';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

interface SpeechMark {
  time: number;
  type: string;
  start: number;
  end: number;
  value: string;
}

interface BlockData {
  id: number;
  text: string;
  words: string[];
  bounding_boxes: number[][][];
}

interface TextHighlighterProps {
  blockData: BlockData;
  speechMarks: SpeechMark[];
  isPlaying: boolean;
  currentTime: number;
  originalPageSize: PageSize;
  renderedImageSize: PageSize;
  imageOffset: { x: number; y: number };
  onWordHighlight?: (wordIndex: number, word: string) => void;
}

export default function TextHighlighter({
  blockData,
  speechMarks,
  isPlaying,
  currentTime,
  originalPageSize,
  renderedImageSize,
  imageOffset,
  onWordHighlight
}: TextHighlighterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [coordinateScaler, setCoordinateScaler] = useState<CoordinateScaler | null>(null);

  // Initialize coordinate scaler when dimensions are available
  useEffect(() => {
    if (originalPageSize && renderedImageSize) {
      // Log environment details for debugging coordinate shifts
      console.log('[TextHighlighter] Environment Info:', {
        screenData: Dimensions.get('screen'),
        windowData: Dimensions.get('window'),
        originalPageSize,
        renderedImageSize,
        imageOffset
      });
      
      const scaler = new CoordinateScaler(originalPageSize, renderedImageSize);
      setCoordinateScaler(scaler);
    }
  }, [originalPageSize, renderedImageSize, imageOffset]);

  useEffect(() => {
    if (!isPlaying || !speechMarks.length) {
      setCurrentWordIndex(-1);
      return;
    }

    // Find current word based on timing
    let wordIndex = -1;
    for (let i = 0; i < speechMarks.length; i++) {
      if (currentTime >= speechMarks[i].time) {
        wordIndex = i;
      } else {
        break;
      }
    }

    if (wordIndex !== currentWordIndex) {
      setCurrentWordIndex(wordIndex);
      if (wordIndex >= 0 && onWordHighlight) {
        onWordHighlight(wordIndex, speechMarks[wordIndex].value);
      }
    }
  }, [currentTime, isPlaying, speechMarks, currentWordIndex, onWordHighlight]);

  const renderWordHighlights = () => {
    if (!blockData.bounding_boxes || !speechMarks.length || !coordinateScaler) {
      console.log('[TextHighlighter] Missing required data:', {
        hasBoundingBoxes: !!blockData.bounding_boxes,
        speechMarksLength: speechMarks.length,
        hasCoordinateScaler: !!coordinateScaler
      });
      return null;
    }

    console.log('[TextHighlighter] Rendering highlights:', {
      blockId: blockData.id,
      speechMarksCount: speechMarks.length,
      boundingBoxesCount: blockData.bounding_boxes.length,
      currentWordIndex,
      isPlaying,
      currentTime
    });

    return speechMarks.map((speechMark, index) => {
      const isCurrentWord = index === currentWordIndex;
      const isPassedWord = index < currentWordIndex;
      
      // Get bounding box for this word
      const boundingBox = blockData.bounding_boxes[index];
      if (!boundingBox || !boundingBox[0]) {
        console.warn(`[TextHighlighter] No bounding box for word ${index}:`, speechMark.value);
        return null;
      }

      // Scale coordinates using the coordinate scaler
      const scaledBox = coordinateScaler.scaleCoordinates(boundingBox);
      
      // Apply pixel-perfect positioning
      const left = Math.round(scaledBox.topLeft[0] + imageOffset.x);
      const top = Math.round(scaledBox.topLeft[1] + imageOffset.y);
      const width = Math.round(scaledBox.bottomRight[0] - scaledBox.topLeft[0]);
      const height = Math.round(scaledBox.bottomRight[1] - scaledBox.topLeft[1]);

      // Validate dimensions
      if (width <= 0 || height <= 0) {
        console.warn(`[TextHighlighter] Invalid dimensions for word "${speechMark.value}":`, { width, height, left, top });
        return null;
      }

      if (__DEV__ && index < 5) {
        console.log(`[TextHighlighter] Rendering highlight for "${speechMark.value}":`, {
          index,
          isCurrentWord,
          isPassedWord,
          position: { left, top, width, height },
          originalBox: boundingBox,
          scaledBox
        });
      }

      return (
        <View
          key={`word-${index}-${speechMark.value}`}
          style={[
            styles.wordHighlight,
            {
              left,
              top,
              width,
              height,
              backgroundColor: isCurrentWord 
                ? 'rgba(255, 255, 0, 0.8)' // Bright yellow for current word
                : isPassedWord 
                  ? 'rgba(0, 255, 0, 0.5)' // Light green for completed words
                  : 'transparent', // Transparent for upcoming words
              borderColor: isCurrentWord ? '#FFD700' : 'transparent',
              borderWidth: isCurrentWord ? 2 : 0,
              zIndex: isCurrentWord ? 1000 : 500,
            }
          ]}
        />
      );
    });
  };

  const renderBlockHighlight = () => {
    if (!blockData.bounding_boxes || !blockData.bounding_boxes.length || !coordinateScaler) return null;

    // Calculate overall block bounds from original coordinates
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    blockData.bounding_boxes.forEach(wordBox => {
      if (wordBox && wordBox[0] && wordBox[1]) {
        const [topLeft, bottomRight] = wordBox;
        minX = Math.min(minX, topLeft[0]);
        minY = Math.min(minY, topLeft[1]);
        maxX = Math.max(maxX, bottomRight[0]);
        maxY = Math.max(maxY, bottomRight[1]);
      }
    });

    if (minX === Infinity) return null;

    // Scale the overall block bounds
    const scaledTopLeft = coordinateScaler.scalePoint(minX, minY);
    const scaledBottomRight = coordinateScaler.scalePoint(maxX, maxY);
    
    // Apply pixel-perfect positioning
    const left = Math.round(scaledTopLeft[0] + imageOffset.x);
    const top = Math.round(scaledTopLeft[1] + imageOffset.y);
    const width = Math.round(scaledBottomRight[0] - scaledTopLeft[0]);
    const height = Math.round(scaledBottomRight[1] - scaledTopLeft[1]);

    return (
      <View
        style={[
          styles.blockHighlight,
          {
            left: left - 5,
            top: top - 5,
            width: width + 10,
            height: height + 10,
            borderColor: isPlaying ? '#FF6B6B' : '#E0E0E0',
            backgroundColor: isPlaying ? 'rgba(255, 107, 107, 0.1)' : 'rgba(224, 224, 224, 0.1)',
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderBlockHighlight()}
      {renderWordHighlights()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  blockHighlight: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
    borderStyle: 'dashed',
  },
  wordHighlight: {
    position: 'absolute',
    borderRadius: 2,
  },
});
