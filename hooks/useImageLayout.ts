import { ImageLoadEventData } from 'expo-image';
import { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export interface ImageDimensions {
  width: number;
  height: number;
}

export function useImageLayout() {
  const [sourceImageDimensions, setSourceImageDimensions] = useState<ImageDimensions | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<ImageDimensions | null>(null);

  const onImageLoad = useCallback((event: ImageLoadEventData) => {
    const { width, height } = event.source;
    const dimensions = { width, height };
    setSourceImageDimensions(dimensions);
    
    // console.log('[ImageLayout] Image loaded:', dimensions);
  }, []);

  const onImageLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    const dimensions = { width, height };
    setContainerDimensions(dimensions);
    
    // console.log('[ImageLayout] Container layout:', dimensions);
  }, []);

  // Calculate the actual rendered image size with contentFit="contain"
  const getRenderedImageSize = useCallback((): ImageDimensions | null => {
    if (!sourceImageDimensions || !containerDimensions) {
      return null;
    }

    const sourceAspectRatio = sourceImageDimensions.width / sourceImageDimensions.height;
    const containerAspectRatio = containerDimensions.width / containerDimensions.height;

    let renderedWidth: number;
    let renderedHeight: number;

    if (sourceAspectRatio > containerAspectRatio) {
      // Image is wider relative to container, so width is constrained
      renderedWidth = containerDimensions.width;
      renderedHeight = containerDimensions.width / sourceAspectRatio;
    } else {
      // Image is taller relative to container, so height is constrained
      renderedHeight = containerDimensions.height;
      renderedWidth = containerDimensions.height * sourceAspectRatio;
    }

    // Ensure pixel-perfect calculations for production consistency
    const result = { 
      width: Math.round(renderedWidth), 
      height: Math.round(renderedHeight) 
    };
    
    // console.log('[ImageLayout] Calculated rendered size:', {
    //   sourceAspectRatio,
    //   containerAspectRatio,
    //   sourceImageDimensions,
    //   containerDimensions,
    //   rawResult: { width: renderedWidth, height: renderedHeight },
    //   roundedResult: result
    // });

    return result;
  }, [sourceImageDimensions, containerDimensions]);

  // Calculate the offset for center-aligned image
  const getImageOffset = useCallback(() => {
    if (!sourceImageDimensions || !containerDimensions) {
      return { x: 0, y: 0 };
    }

    const renderedSize = getRenderedImageSize();
    if (!renderedSize) {
      return { x: 0, y: 0 };
    }

    // Calculate how much space is left on each side - ensure pixel-perfect positioning
    const offsetX = Math.round((containerDimensions.width - renderedSize.width) / 2);
    const offsetY = Math.round((containerDimensions.height - renderedSize.height) / 2);

    const result = { x: offsetX, y: offsetY };
    // console.log('[ImageLayout] Calculated image offset:', {
    //   containerDimensions,
    //   renderedSize,
    //   rawOffset: { 
    //     x: (containerDimensions.width - renderedSize.width) / 2, 
    //     y: (containerDimensions.height - renderedSize.height) / 2 
    //   },
    //   roundedOffset: result
    // });

    return result;
  }, [sourceImageDimensions, containerDimensions, getRenderedImageSize]);

  return {
    sourceImageDimensions,
    containerDimensions,
    getRenderedImageSize,
    getImageOffset,
    onImageLoad,
    onImageLayout
  };
}
