// Import all your trimmed blocks data statically
// You'll need to add more imports as you have more pages

import page19TrimmedBlocks from '@/data/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19_trimmed_blocks.json';
import page21TrimmedBlocks from '@/data/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21_trimmed_blocks.json';
import page22TrimmedBlocks from '@/data/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22_trimmed_blocks.json';
import page44TrimmedBlocks from '@/data/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44_trimmed_blocks.json';

export interface TrimmedBlockData {
  [blockId: string]: {
    text: string;
    words: string[];
    bounding_boxes: number[][] | number[][][]; // Can be either format
    ssml: string;
    dialog?: string;
    person_type?: string;
    voice_id?: string;
    timing?: Array<{
      time: number;
      type: string;
      start: number;
      end: number;
      value: string;
    }>;
  };
}

export class TrimmedBlocksDataService {
  private static instance: TrimmedBlocksDataService;
  private dataMap: Map<number, TrimmedBlockData> = new Map();

  static getInstance(): TrimmedBlocksDataService {
    if (!TrimmedBlocksDataService.instance) {
      TrimmedBlocksDataService.instance = new TrimmedBlocksDataService();
    }
    return TrimmedBlocksDataService.instance;
  }

  constructor() {
    // Map all your trimmed blocks data by page number
    this.dataMap.set(19, page19TrimmedBlocks as any);
    this.dataMap.set(21, page21TrimmedBlocks as any);
    this.dataMap.set(22, page22TrimmedBlocks as any);
    this.dataMap.set(44, page44TrimmedBlocks as any);

    console.log('TrimmedBlocksDataService initialized with pages:', Array.from(this.dataMap.keys()));
  }

  getTrimmedBlocksForPage(pageNumber: number): TrimmedBlockData | null {
    const data = this.dataMap.get(pageNumber);
    if (data) {
      console.log(`Found trimmed blocks data for page ${pageNumber}:`, Object.keys(data).length, 'blocks');
      return data;
    } else {
      console.warn(`No trimmed blocks data found for page ${pageNumber}`);
      return null;
    }
  }

  hasDataForPage(pageNumber: number): boolean {
    return this.dataMap.has(pageNumber);
  }

  getAvailablePages(): number[] {
    return Array.from(this.dataMap.keys());
  }
}