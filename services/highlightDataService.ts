
export interface SpeechMark {
  time: number;
  type: string;
  start: number;
  end: number;
  value: string;
}

export interface BlockHighlightData {
  blockId: number;
  text: string;
  words: string[];
  bounding_boxes: number[][][];
  speechMarks: SpeechMark[];
}

class HighlightDataService {
  private speechMarksCache: Map<number, SpeechMark[]> = new Map();
  private blockDataCache: Map<number, any> = new Map();

  async loadSpeechMarks(blockId: number, pageNumber: number): Promise<SpeechMark[]> {
    const cacheKey = pageNumber * 1000 + blockId; // Create unique cache key combining page and block
    if (this.speechMarksCache.has(cacheKey)) {
      return this.speechMarksCache.get(cacheKey)!;
    }

    try {
      // Try to load speech marks from the trimmed blocks data
      const trimmedBlocksDataService = require('./trimmedBlocksDataService').TrimmedBlocksDataService.getInstance();
      const trimmedData = trimmedBlocksDataService.getTrimmedBlocksForPage(pageNumber);
      
      if (trimmedData && trimmedData[blockId] && trimmedData[blockId].timing) {
        const speechMarksData: SpeechMark[] = trimmedData[blockId].timing.map((timing: any) => ({
          time: timing.time,
          type: timing.type,
          start: timing.start,
          end: timing.end,
          value: timing.value
        }));
        
        this.speechMarksCache.set(cacheKey, speechMarksData);
        return speechMarksData;
      }

      // Fallback to empty array if no data found
      console.warn(`No speech marks data found for block ${blockId} on page ${pageNumber}`);
      const emptyData: SpeechMark[] = [];
      this.speechMarksCache.set(cacheKey, emptyData);
      return emptyData;
    } catch (error) {
      console.error(`Failed to load speech marks for block ${blockId} on page ${pageNumber}:`, error);
      return [];
    }
  }

  async loadBlockData(pageNumber: number): Promise<any> {
    const cacheKey = pageNumber;
    if (this.blockDataCache.has(cacheKey)) {
      return this.blockDataCache.get(cacheKey)!;
    }

    try {
      // Load block data from the BookDataService
      const bookDataService = require('./bookDataService').BookDataService.getInstance();
      const blockData = bookDataService.getBlocksForPage(pageNumber) || {};
      
      console.log(`Loaded block data for page ${pageNumber} with keys:`, Object.keys(blockData));
      this.blockDataCache.set(cacheKey, blockData);
      return blockData;
    } catch (error) {
      console.error(`Failed to load block data for page ${pageNumber}:`, error);
      return {};
    }
  }

  async getBlockHighlightData(blockId: number, pageNumber: number): Promise<BlockHighlightData | null> {
    try {
      console.log(`Loading highlight data for block ${blockId} on page ${pageNumber}`);
      
      const [speechMarks, allBlockData] = await Promise.all([
        this.loadSpeechMarks(blockId, pageNumber),
        this.loadBlockData(pageNumber)
      ]);

      console.log(`Speech marks loaded: ${speechMarks.length} items`);
      console.log(`Block data keys:`, Object.keys(allBlockData));
      
      const blockData = allBlockData[blockId.toString()];
      console.log(`Block data for ${blockId}:`, blockData);
      
      if (!blockData) {
        console.warn(`No block data found for block ${blockId}`);
        return null;
      }

      return {
        blockId,
        text: blockData.text,
        words: blockData.words,
        bounding_boxes: blockData.bounding_boxes,
        speechMarks
      };
    } catch (error) {
      console.error(`Failed to get highlight data for block ${blockId}:`, error);
      return null;
    }
  }

  clearCache() {
    this.speechMarksCache.clear();
    this.blockDataCache.clear();
  }
}

export const highlightDataService = new HighlightDataService();
