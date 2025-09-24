import { WordLayoutData, WordPosition } from '@/services/wordPositionService';
import React, { memo, useMemo } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

interface WordOverlayProps {
  layoutData: WordLayoutData | null;
  onWordSelect: (word: string, position: WordPosition) => void;
  isEnabled?: boolean;
  containerDimensions: { width: number; height: number };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Memoized word area component for better performance
const WordArea = memo(({ 
  wordPos, 
  style, 
  onPress 
}: { 
  wordPos: WordPosition; 
  style: any; 
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={style}
    onPress={onPress}
    activeOpacity={0.2}
    hitSlop={{ top: 2, bottom: 2, left: 2, right: 2 }}
    accessibilityRole="button"
    accessibilityLabel={`Select word: ${wordPos.word}`}
    accessibilityHint="Tap to see definition"
  />
));

function WordOverlay({
  layoutData,
  onWordSelect,
  isEnabled = true,
  containerDimensions
}: WordOverlayProps) {
  // Memoize word areas to prevent unnecessary re-renders
  const wordAreas = useMemo(() => {
    if (!layoutData || !isEnabled) return [];

    return layoutData.words.map((wordPos, index) => {
      const { topLeft, bottomRight } = wordPos.position;
      const width = bottomRight[0] - topLeft[0];
      const height = bottomRight[1] - topLeft[1];

      // Make touch area fit exactly around the word with small padding
      const padding = 2; // Small padding for easier tapping
      const touchWidth = width + (padding * 2);
      const touchHeight = height + (padding * 2);

      // Position with padding
      const adjustedLeft = topLeft[0] - padding;
      const adjustedTop = topLeft[1] - padding;

      return {
        key: `word-${wordPos.blockId}-${wordPos.wordIndex}-${index}`,
        style: {
          position: 'absolute' as const,
          left: adjustedLeft,
          top: adjustedTop,
          width: touchWidth,
          height: touchHeight,
          backgroundColor: 'transparent', // Always transparent
        },
        wordPos,
        onPress: () => handleWordPress(wordPos),
      };
    });
  }, [layoutData, isEnabled, containerDimensions]);

  const handleWordPress = (wordPos: WordPosition) => {
    console.log(`Word selected: "${wordPos.word}" from block ${wordPos.blockId}`);
    onWordSelect(wordPos.word, wordPos);
  };

  if (!layoutData || !isEnabled || wordAreas.length === 0) {
    return null;
  }

  return (
    <View style={[styles.overlay, { 
      width: containerDimensions.width, 
      height: containerDimensions.height 
    }]}>
      {wordAreas.map(({ key, style, wordPos, onPress }) => (
        <WordArea
          key={key}
          style={style}
          wordPos={wordPos}
          onPress={onPress}
        />
      ))}
      
      {/* Debug overlay to show total word count */}
      {__DEV__ && layoutData && (
        <View style={styles.debugInfo}>
          <View style={styles.debugBadge}>
            {/* Simple debug indicator - shows word count as colored dots */}
            <View style={styles.debugIndicator} />
          </View>
        </View>
      )}
    </View>
  );
}

export default memo(WordOverlay);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10, // Above the image but below other UI components
    pointerEvents: 'box-none', // Allow touches to pass through to child elements
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 20,
  },
  debugBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  debugIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'lime',
  },
});