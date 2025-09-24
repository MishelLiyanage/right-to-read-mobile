import { SpeechMark, TextBlock } from '@/types/book';
import { BoundingBox, CoordinateScaler, PageSize } from './coordinateScaler';
import { TrimmedBlockData, TrimmedBlocksDataService } from './trimmedBlocksDataService';

export interface WordPosition {
  word: string;
  blockId: number;
  wordIndex: number;
  position: BoundingBox;
  originalPosition: BoundingBox;
}

export interface WordLayoutData {
  words: WordPosition[];
  totalWords: number;
}

export class WordPositionService {
  private static instance: WordPositionService;
  private cache: Map<string, WordLayoutData> = new Map();
  private trimmedBlocksDataService: TrimmedBlocksDataService;

  static getInstance(): WordPositionService {
    if (!WordPositionService.instance) {
      WordPositionService.instance = new WordPositionService();
    }
    return WordPositionService.instance;
  }

  constructor() {
    this.trimmedBlocksDataService = TrimmedBlocksDataService.getInstance();
  }

  /**
   * Get trimmed blocks data from the data service
   */
  getTrimmedBlocksData(pageNumber: number): TrimmedBlockData | null {
    return this.trimmedBlocksDataService.getTrimmedBlocksForPage(pageNumber);
  }

  /**
   * Calculate word positions using your actual coordinate data
   */
  calculateWordPositionsFromData(
    pageNumber: number,
    originalPageSize: PageSize,
    currentPageSize: PageSize,
    imageOffset: { x: number; y: number } = { x: 0, y: 0 }
  ): WordLayoutData {
    const cacheKey = `page_${pageNumber}_${currentPageSize.width}x${currentPageSize.height}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('WordPositionService: Cache hit for word positions');
      return this.cache.get(cacheKey)!;
    }

    try {
      const trimmedData = this.getTrimmedBlocksData(pageNumber);
      if (!trimmedData) {
        console.warn(`No trimmed blocks data found for page ${pageNumber}`);
        return { words: [], totalWords: 0 };
      }

      console.log(`WordPositionService: Calculating word positions for page ${pageNumber}`);
      
      const coordinateScaler = new CoordinateScaler(originalPageSize, currentPageSize);
      const words: WordPosition[] = [];

      // Process each block
      Object.entries(trimmedData).forEach(([blockIdStr, blockData]) => {
        const blockId = parseInt(blockIdStr);
        
        if (!blockData.words || !blockData.bounding_boxes) {
          console.warn(`Block ${blockId} missing words or bounding_boxes`);
          return;
        }

        // Map each word to its bounding box
        blockData.words.forEach((word: string, wordIndex: number) => {
          if (wordIndex < blockData.bounding_boxes.length) {
            const boundingBox = blockData.bounding_boxes[wordIndex];
            
            // Handle different bounding box formats
            let coordinatePairs: number[][];
            if (Array.isArray(boundingBox[0])) {
              // Format: [[[x1, y1], [x2, y2]]]
              coordinatePairs = boundingBox as number[][];
            } else {
              // Format: [x1, y1, x2, y2]
              const coords = boundingBox as number[];
              coordinatePairs = [[coords[0], coords[1]], [coords[2], coords[3]]];
            }
            
            // Convert your coordinate format to our BoundingBox format
            const originalBounds = coordinateScaler.scaleCoordinates(coordinatePairs);
            
            // Apply image offset
            const finalPosition: BoundingBox = {
              topLeft: [
                Math.max(0, originalBounds.topLeft[0] + imageOffset.x),
                Math.max(0, originalBounds.topLeft[1] + imageOffset.y)
              ],
              bottomRight: [
                originalBounds.bottomRight[0] + imageOffset.x,
                originalBounds.bottomRight[1] + imageOffset.y
              ]
            };

            words.push({
              word: word.replace(/[.,!?;:]$/, ''), // Clean punctuation
              blockId,
              wordIndex,
              position: finalPosition,
              originalPosition: originalBounds
            });
          }
        });
      });

      const layoutData: WordLayoutData = {
        words: words.slice(0, 500), // Limit for performance
        totalWords: words.length
      };

      // Cache with memory management
      if (this.cache.size >= 10) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
      }
      
      this.cache.set(cacheKey, layoutData);
      console.log(`WordPositionService: Calculated positions for ${words.length} words (displaying ${layoutData.words.length})`);

      return layoutData;
    } catch (error) {
      console.error(`Failed to calculate word positions for page ${pageNumber}:`, error);
      return { words: [], totalWords: 0 };
    }
  }

  /**
   * Calculate word positions for a page based on text blocks and speech marks (legacy method)
   */
  calculateWordPositions(
    blocks: TextBlock[],
    originalPageSize: PageSize,
    currentPageSize: PageSize,
    imageOffset: { x: number; y: number } = { x: 0, y: 0 }
  ): WordLayoutData {
    const cacheKey = this.generateCacheKey(blocks, currentPageSize);
    
    if (this.cache.has(cacheKey)) {
      console.log('WordPositionService: Cache hit for word positions');
      return this.cache.get(cacheKey)!;
    }

    console.log('WordPositionService: Calculating word positions for', blocks.length, 'blocks');
    
    const coordinateScaler = new CoordinateScaler(originalPageSize, currentPageSize);
    const words: WordPosition[] = [];
    let totalWords = 0;

    // Process blocks in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const batch = blocks.slice(i, Math.min(i + batchSize, blocks.length));
      
      batch.forEach((block, blockIndex) => {
        const actualBlockIndex = i + blockIndex;
        if (!block.text || !block.speechMarks) {
          console.warn(`Block ${block.id} missing text or speech marks`);
          return;
        }

        const blockWords = this.extractWordsFromBlock(block, actualBlockIndex, coordinateScaler, imageOffset);
        words.push(...blockWords);
        totalWords += blockWords.length;
      });
    }

    const layoutData: WordLayoutData = {
      words: words.slice(0, 500), // Limit to 500 words for performance
      totalWords
    };

    // Cache the result with memory management
    if (this.cache.size >= 10) {
      // Remove oldest entries to prevent memory bloat
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(cacheKey, layoutData);
    console.log(`WordPositionService: Calculated positions for ${words.length} words (limited to ${layoutData.words.length})`);

    return layoutData;
  }

  /**
   * Extract individual words from a text block and calculate their positions
   */
  private extractWordsFromBlock(
    block: TextBlock,
    blockIndex: number,
    coordinateScaler: CoordinateScaler,
    imageOffset: { x: number; y: number }
  ): WordPosition[] {
    const words: WordPosition[] = [];
    const text = block.text;
    const speechMarks = block.speechMarks || [];

    // Filter for word speech marks only
    const wordMarks = speechMarks.filter(mark => mark.type === 'word');

    wordMarks.forEach((mark, wordIndex) => {
      const word = text.substring(mark.start, mark.end);
      
      // Skip empty or whitespace-only words
      if (!word.trim()) return;

      // Estimate word position based on text flow
      // This is a simplified approach - in a real implementation you might need
      // more sophisticated text layout calculation
      const estimatedPosition = this.estimateWordPosition(
        mark,
        text,
        blockIndex,
        coordinateScaler,
        imageOffset
      );

      words.push({
        word: word.trim(),
        blockId: block.id,
        wordIndex,
        position: estimatedPosition,
        originalPosition: estimatedPosition // For now, same as position
      });
    });

    return words;
  }

  /**
   * Estimate word position based on speech mark data and text flow
   * This is a simplified implementation - you may need to enhance this
   * based on your actual layout requirements
   */
  private estimateWordPosition(
    speechMark: SpeechMark,
    fullText: string,
    blockIndex: number,
    coordinateScaler: CoordinateScaler,
    imageOffset: { x: number; y: number }
  ): BoundingBox {
    try {
      // This is a placeholder implementation
      // You'll need to replace this with actual position calculation
      // based on your page layout and text positioning data
      
      // For now, create a basic estimated position
      // You should replace this with actual coordinate data from your system
      const estimatedX = 50 + (speechMark.start * 8); // Rough character width
      const estimatedY = 100 + (blockIndex * 50); // Rough line height
      const wordWidth = Math.max((speechMark.end - speechMark.start) * 8, 20); // Minimum width
      const wordHeight = 20; // Rough line height

      const originalBounds: number[][] = [
        [estimatedX, estimatedY],
        [estimatedX + wordWidth, estimatedY + wordHeight]
      ];

      const scaledBounds = coordinateScaler.scaleCoordinates(originalBounds);

      // Apply image offset with bounds checking
      const finalBounds: BoundingBox = {
        topLeft: [
          Math.max(0, scaledBounds.topLeft[0] + imageOffset.x),
          Math.max(0, scaledBounds.topLeft[1] + imageOffset.y)
        ],
        bottomRight: [
          scaledBounds.bottomRight[0] + imageOffset.x,
          scaledBounds.bottomRight[1] + imageOffset.y
        ]
      };

      return finalBounds;
    } catch (error) {
      console.error('Error estimating word position:', error);
      // Return a default safe position
      return {
        topLeft: [imageOffset.x, imageOffset.y],
        bottomRight: [imageOffset.x + 50, imageOffset.y + 20]
      };
    }
  }

  /**
   * Find a word by its position (for hit testing)
   */
  findWordAtPosition(
    layoutData: WordLayoutData,
    x: number,
    y: number,
    tolerance: number = 5
  ): WordPosition | null {
    return layoutData.words.find(wordPos => {
      const { topLeft, bottomRight } = wordPos.position;
      return (
        x >= topLeft[0] - tolerance &&
        x <= bottomRight[0] + tolerance &&
        y >= topLeft[1] - tolerance &&
        y <= bottomRight[1] + tolerance
      );
    }) || null;
  }

  /**
   * Clear cache (useful for memory management)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('WordPositionService: Cache cleared');
  }

  /**
   * Generate cache key for word position data
   */
  private generateCacheKey(blocks: TextBlock[], pageSize: PageSize): string {
    const blockIds = blocks.map(b => b.id).join(',');
    return `${blockIds}_${pageSize.width}x${pageSize.height}`;
  }
}