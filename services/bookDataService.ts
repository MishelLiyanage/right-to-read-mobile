// Import all your blocks data statically

import page19BlocksData from '@/data/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19_blocks.json';
import page21BlocksData from '@/data/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21_blocks.json';
import page22BlocksData from '@/data/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22_blocks.json';
import page23BlocksData from '@/data/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23_blocks.json';
import page26BlocksData from '@/data/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26_blocks.json';
import page27BlocksData from '@/data/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27_blocks.json';
import page29BlocksData from '@/data/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29_blocks.json';
import page30BlocksData from '@/data/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30_blocks.json';
import page31BlocksData from '@/data/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31_blocks.json';
import page32BlocksData from '@/data/grade_3_english_book_page_32/grade_3_english_book.pdf_page_32_blocks.json';
import page44BlocksData from '@/data/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44_blocks.json';

export interface BlockData {
  [blockId: string]: {
    text: string;
    words: string[];
    bounding_boxes: number[][] | number[][][]; // Can be either format
  };
}

export class BookDataService {
  private static instance: BookDataService;
  private dataMap: Map<number, BlockData> = new Map();

  static getInstance(): BookDataService {
    if (!BookDataService.instance) {
      BookDataService.instance = new BookDataService();
    }
    return BookDataService.instance;
  }

  constructor() {
    // Map all your blocks data by page number
    this.dataMap.set(19, page19BlocksData as any);
    this.dataMap.set(21, page21BlocksData as any);
    this.dataMap.set(22, page22BlocksData as any);
    this.dataMap.set(23, page23BlocksData as any);
    this.dataMap.set(26, page26BlocksData as any);
    this.dataMap.set(27, page27BlocksData as any);
    this.dataMap.set(29, page29BlocksData as any);
    this.dataMap.set(30, page30BlocksData as any);
    this.dataMap.set(31, page31BlocksData as any);
    this.dataMap.set(32, page32BlocksData as any);
    this.dataMap.set(44, page44BlocksData as any);


  }

  getBlocksForPage(pageNumber: number): BlockData | null {
    const data = this.dataMap.get(pageNumber);
    if (data) {

      return data;
    } else {
      console.warn(`BookDataService: No blocks data found for page ${pageNumber}`);
      return null;
    }
  }

  getAllAvailablePages(): number[] {
    return Array.from(this.dataMap.keys()).sort((a, b) => a - b);
  }
}
