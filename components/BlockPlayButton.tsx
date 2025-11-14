import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';

interface BlockPlayButtonProps {
  blockId: number;
  blockText: string;
  position: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  isPlaying: boolean;
  onPlay: (blockId: number, blockText: string) => void;
}

export default function BlockPlayButton({
  blockId,
  blockText,
  position,
  isPlaying,
  onPlay
}: BlockPlayButtonProps) {
  const handlePress = () => {
    // console.log(`[BlockPlayButton] Button pressed for block ${blockId}:`, {
    //   blockId,
    //   blockText: blockText.substring(0, 30) + '...'
    // });
    onPlay(blockId, blockText);
  };

  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = 35; // Button width from styles
  
  // Position the play button OUTSIDE the text block to avoid interfering with word clicks
  // Try to position to the right of the block first
  let buttonLeft = position.left + position.width + 5; // 5px gap from the right edge of text
  
  // If button would be off-screen, position it to the left of the block
  if (buttonLeft + buttonWidth > screenWidth - 10) { // 10px margin from screen edge
    buttonLeft = Math.max(10, position.left - buttonWidth - 5); // 5px gap from the left edge of text
  }
  
  // If still off-screen (very wide block), position at screen edge
  if (buttonLeft < 10) {
    buttonLeft = 10;
  }
  
  const buttonPosition = {
    left: buttonLeft,
    top: position.top + (position.height / 2) - 17.5, // Vertically centered (35px button height / 2)
  };

  // Debug logging to help troubleshoot positioning
  if (__DEV__) {
    // console.log(`[BlockPlayButton] Rendering button for block ${blockId}:`, {
    //   position,
    //   buttonPosition,
    //   isPlaying,
    //   screenWidth
    // });
  }

  return (
    <TouchableOpacity
      style={[
        styles.playButton,
        buttonPosition,
        isPlaying && styles.playingButton,
        // Make buttons more visible
        { 
          backgroundColor: isPlaying ? 'rgba(255, 59, 48, 0.9)' : 'rgba(0, 122, 255, 0.9)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 12,
        }
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <ThemedText style={[
        styles.playButtonText,
        isPlaying && styles.playingButtonText
      ]}>
        {isPlaying ? '⏸' : '▶'}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playButton: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 2000,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  playingButton: {
    backgroundColor: 'rgba(240, 159, 36, 0.58)',
    borderColor: '#edc833a9',
  },
  playButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  playingButtonText: {
    color: '#fff',
  },
});