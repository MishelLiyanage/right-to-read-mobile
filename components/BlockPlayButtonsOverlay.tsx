import { CoordinateScaler, PageSize } from '@/services/coordinateScaler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BlockPlayButton from './BlockPlayButton';

interface BlockPlayButtonsOverlayProps {
  blocks: Array<{
    id: number;
    text: string;
    bounding_boxes?: number[][] | number[][][];
  }>;
  originalPageSize: PageSize;
  renderedImageSize: PageSize;
  imageOffset: { x: number; y: number };
  currentlyPlayingBlockId: number | null;
  onBlockPlay: (blockId: number, blockText: string) => void;
}

export default function BlockPlayButtonsOverlay({
  blocks,
  originalPageSize,
  renderedImageSize,
  imageOffset,
  currentlyPlayingBlockId,
  onBlockPlay
}: BlockPlayButtonsOverlayProps) {
  const coordinateScaler = React.useMemo(() => {
    if (originalPageSize && renderedImageSize) {
      return new CoordinateScaler(originalPageSize, renderedImageSize);
    }
    return null;
  }, [originalPageSize, renderedImageSize]);

  const renderBlockPlayButtons = () => {
    if (!coordinateScaler) return null;

    return blocks.map((block) => {
      // Skip blocks without bounding boxes
      if (!block.bounding_boxes || !block.bounding_boxes.length) {
        return null;
      }

      // Calculate overall block bounds from original coordinates
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      block.bounding_boxes.forEach(wordBox => {
        if (wordBox) {
          let topLeft: number[], bottomRight: number[];
          
          // Handle different bounding box formats
          if (Array.isArray(wordBox[0])) {
            // Format: [[x1, y1], [x2, y2]]
            [topLeft, bottomRight] = wordBox as number[][];
          } else {
            // Format: [x1, y1, x2, y2]
            const coords = wordBox as number[];
            topLeft = [coords[0], coords[1]];
            bottomRight = [coords[2], coords[3]];
          }
          
          if (topLeft && bottomRight && topLeft.length >= 2 && bottomRight.length >= 2) {
            minX = Math.min(minX, topLeft[0]);
            minY = Math.min(minY, topLeft[1]);
            maxX = Math.max(maxX, bottomRight[0]);
            maxY = Math.max(maxY, bottomRight[1]);
          }
        }
      });

      if (minX === Infinity) return null;

      // Scale the overall block bounds
      const scaledTopLeft = coordinateScaler.scalePoint(minX, minY);
      const scaledBottomRight = coordinateScaler.scalePoint(maxX, maxY);
      
      const position = {
        left: scaledTopLeft[0] + imageOffset.x,
        top: scaledTopLeft[1] + imageOffset.y,
        width: scaledBottomRight[0] - scaledTopLeft[0],
        height: scaledBottomRight[1] - scaledTopLeft[1],
      };

      return (
        <BlockPlayButton
          key={`block-play-${block.id}`}
          blockId={block.id}
          blockText={block.text}
          position={position}
          isPlaying={currentlyPlayingBlockId === block.id}
          onPlay={onBlockPlay}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {renderBlockPlayButtons()}
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
    pointerEvents: 'box-none', // Allow touches to pass through the container but not the buttons
    zIndex: 1500, // Ensure overlay is above other components
  },
});