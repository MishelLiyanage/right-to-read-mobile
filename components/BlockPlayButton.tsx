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
    onPlay(blockId, blockText);
  };

  // Get screen dimensions
  const screenWidth = Dimensions.get('window').width;
  
  // Position the play button, ensuring it stays within screen bounds
  let buttonLeft = position.left + position.width + 10; // 10px to the right of the block
  
  // If button would be off-screen, position it to the left of the block instead
  if (buttonLeft + 40 > screenWidth) { // 40 is button width
    buttonLeft = position.left - 50; // 50px to the left of the block (40px button + 10px margin)
  }
  
  // If still off-screen (block too far left), position it overlapping the block on the right side
  if (buttonLeft < 0) {
    buttonLeft = position.left + position.width - 20; // Overlapping on the right edge
  }
  
  const buttonPosition = {
    left: buttonLeft,
    top: position.top + (position.height / 2) - 20, // Vertically centered
  };

  // Debug logging to help troubleshoot positioning


  return (
    <TouchableOpacity
      style={[
        styles.playButton,
        buttonPosition,
        isPlaying && styles.playingButton,
        // Debug: Make buttons very visible with bright background
        { backgroundColor: isPlaying ? 'rgba(219, 65, 65, 0.66)' : 'rgba(73, 113, 233, 0.69)' }
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