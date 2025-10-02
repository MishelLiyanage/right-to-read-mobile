// Import all your blocks data statically

// Grade 3 English Book
import page19BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19_blocks.json';
import page21BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21_blocks.json';
import page22BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22_blocks.json';
import page23BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23_blocks.json';
import page26BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26_blocks.json';
import page27BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27_blocks.json';
import page29BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29_blocks.json';
import page30BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30_blocks.json';
import page31BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31_blocks.json';
import page44BlocksData from '@/data/grade_3_english_book/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44_blocks.json';

// Grade 4 English Book
import page100BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_100/english PB G-4.pdf_page_100_blocks.json';
import page101BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_101/english PB G-4.pdf_page_101_blocks.json';
import page102BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_102/english PB G-4.pdf_page_102_blocks.json';
import page103BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_103/english PB G-4.pdf_page_103_blocks.json';
import page104BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_104/english PB G-4.pdf_page_104_blocks.json';
import page105BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_105/english PB G-4.pdf_page_105_blocks.json';
import page106BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_106/english PB G-4.pdf_page_106_blocks.json';
import page107BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_107/english PB G-4.pdf_page_107_blocks.json';
import page108BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_108/english PB G-4.pdf_page_108_blocks.json';
import page109BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_109/english PB G-4.pdf_page_109_blocks.json';
import page110BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_110/english PB G-4.pdf_page_110_blocks.json';
import page111BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_111/english PB G-4.pdf_page_111_blocks.json';
import page112BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_112/english PB G-4.pdf_page_112_blocks.json';
import page113BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_113/english PB G-4.pdf_page_113_blocks.json';
import page114BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_114/english PB G-4.pdf_page_114_blocks.json';
import page115BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_115/english PB G-4.pdf_page_115_blocks.json';
import page116BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_116/english PB G-4.pdf_page_116_blocks.json';
import page117BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_117/english PB G-4.pdf_page_117_blocks.json';
import page118BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_118/english PB G-4.pdf_page_118_blocks.json';
import page119BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_119/english PB G-4.pdf_page_119_blocks.json';
import page98BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_98/english PB G-4.pdf_page_98_blocks.json';
import page99BlocksData from '@/data/grade_4_english_book/grade_4_english_book_page_99/english PB G-4.pdf_page_99_blocks.json';

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
    
    // Grade 3 English Book pages
    this.dataMap.set(19, page19BlocksData as any);
    this.dataMap.set(21, page21BlocksData as any);
    this.dataMap.set(22, page22BlocksData as any);
    this.dataMap.set(23, page23BlocksData as any);
    this.dataMap.set(26, page26BlocksData as any);
    this.dataMap.set(27, page27BlocksData as any);
    this.dataMap.set(29, page29BlocksData as any);
    this.dataMap.set(30, page30BlocksData as any);
    this.dataMap.set(31, page31BlocksData as any);
    this.dataMap.set(44, page44BlocksData as any);

    // Grade 4 English Book pages
    this.dataMap.set(98, page98BlocksData as any);
    this.dataMap.set(99, page99BlocksData as any);
    this.dataMap.set(100, page100BlocksData as any);
    this.dataMap.set(101, page101BlocksData as any);
    this.dataMap.set(102, page102BlocksData as any);
    this.dataMap.set(103, page103BlocksData as any);
    this.dataMap.set(104, page104BlocksData as any);
    this.dataMap.set(105, page105BlocksData as any);
    this.dataMap.set(106, page106BlocksData as any);
    this.dataMap.set(107, page107BlocksData as any);
    this.dataMap.set(108, page108BlocksData as any);
    this.dataMap.set(109, page109BlocksData as any);
    this.dataMap.set(110, page110BlocksData as any);
    this.dataMap.set(111, page111BlocksData as any);
    this.dataMap.set(112, page112BlocksData as any);
    this.dataMap.set(113, page113BlocksData as any);
    this.dataMap.set(114, page114BlocksData as any);
    this.dataMap.set(115, page115BlocksData as any);
    this.dataMap.set(116, page116BlocksData as any);
    this.dataMap.set(117, page117BlocksData as any);
    this.dataMap.set(118, page118BlocksData as any);
    this.dataMap.set(119, page119BlocksData as any);
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
