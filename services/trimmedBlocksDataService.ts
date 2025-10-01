// Import all your trimmed blocks data statically

// Grade 3 English Book
import page19TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19_trimmed_blocks.json';
import page21TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21_trimmed_blocks.json';
import page22TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22_trimmed_blocks.json';
import page23TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23_trimmed_blocks.json';
import page26TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26_trimmed_blocks.json';
import page27TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27_trimmed_blocks.json';
import page29TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29_trimmed_blocks.json';
import page30TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30_trimmed_blocks.json';
import page31TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31_trimmed_blocks.json';
import page44TrimmedBlocks from '@/data/grade_3_english_book/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44_trimmed_blocks.json';

// Grade 4 English Book
import page100TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_100/english PB G-4.pdf_page_100_trimmed_blocks.json';
import page101TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_101/english PB G-4.pdf_page_101_trimmed_blocks.json';
import page102TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_102/english PB G-4.pdf_page_102_trimmed_blocks.json';
import page103TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_103/english PB G-4.pdf_page_103_trimmed_blocks.json';
import page104TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_104/english PB G-4.pdf_page_104_trimmed_blocks.json';
import page105TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_105/english PB G-4.pdf_page_105_trimmed_blocks.json';
import page106TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_106/english PB G-4.pdf_page_106_trimmed_blocks.json';
import page107TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_107/english PB G-4.pdf_page_107_trimmed_blocks.json';
import page108TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_108/english PB G-4.pdf_page_108_trimmed_blocks.json';
import page109TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_109/english PB G-4.pdf_page_109_trimmed_blocks.json';
import page98TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_98/english PB G-4.pdf_page_98_trimmed_blocks.json';
import page99TrimmedBlocks from '@/data/grade_4_english_book/grade_4_english_book_page_99/english PB G-4.pdf_page_99_trimmed_blocks.json';

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
    
    // Grade 3 English Book pages
    this.dataMap.set(19, page19TrimmedBlocks as any);
    this.dataMap.set(21, page21TrimmedBlocks as any);
    this.dataMap.set(22, page22TrimmedBlocks as any);
    this.dataMap.set(23, page23TrimmedBlocks as any);
    this.dataMap.set(26, page26TrimmedBlocks as any);
    this.dataMap.set(27, page27TrimmedBlocks as any);
    this.dataMap.set(29, page29TrimmedBlocks as any);
    this.dataMap.set(30, page30TrimmedBlocks as any);
    this.dataMap.set(31, page31TrimmedBlocks as any);
    this.dataMap.set(44, page44TrimmedBlocks as any);

    // Grade 4 English Book pages
    this.dataMap.set(98, page98TrimmedBlocks as any);
    this.dataMap.set(99, page99TrimmedBlocks as any);
    this.dataMap.set(100, page100TrimmedBlocks as any);
    this.dataMap.set(101, page101TrimmedBlocks as any);
    this.dataMap.set(102, page102TrimmedBlocks as any);
    this.dataMap.set(103, page103TrimmedBlocks as any);
    this.dataMap.set(104, page104TrimmedBlocks as any);
    this.dataMap.set(105, page105TrimmedBlocks as any);
    this.dataMap.set(106, page106TrimmedBlocks as any);
    this.dataMap.set(107, page107TrimmedBlocks as any);
    this.dataMap.set(108, page108TrimmedBlocks as any);
    this.dataMap.set(109, page109TrimmedBlocks as any);

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