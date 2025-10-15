import { TrimmedBlocksDataService } from '@/services/trimmedBlocksDataService';
import { Book } from '@/types/book';

// Static imports for Grade 3 English Book pages (pages 10-39, 41-137)
const grade3PageImages = {
  10: require('@/data/grade_3_english_book/grade_3_english_book_page_10/grade_3_english_book.pdf_page_10.png'),
  11: require('@/data/grade_3_english_book/grade_3_english_book_page_11/grade_3_english_book.pdf_page_11.png'),
  12: require('@/data/grade_3_english_book/grade_3_english_book_page_12/grade_3_english_book.pdf_page_12.png'),
  13: require('@/data/grade_3_english_book/grade_3_english_book_page_13/grade_3_english_book.pdf_page_13.png'),
  14: require('@/data/grade_3_english_book/grade_3_english_book_page_14/grade_3_english_book.pdf_page_14.png'),
  15: require('@/data/grade_3_english_book/grade_3_english_book_page_15/grade_3_english_book.pdf_page_15.png'),
  16: require('@/data/grade_3_english_book/grade_3_english_book_page_16/grade_3_english_book.pdf_page_16.png'),
  17: require('@/data/grade_3_english_book/grade_3_english_book_page_17/grade_3_english_book.pdf_page_17.png'),
  18: require('@/data/grade_3_english_book/grade_3_english_book_page_18/grade_3_english_book.pdf_page_18.png'),
  19: require('@/data/grade_3_english_book/grade_3_english_book_page_19/grade_3_english_book.pdf_page_19.png'),
  20: require('@/data/grade_3_english_book/grade_3_english_book_page_20/grade_3_english_book.pdf_page_20.png'),
  21: require('@/data/grade_3_english_book/grade_3_english_book_page_21/grade_3_english_book.pdf_page_21.png'),
  22: require('@/data/grade_3_english_book/grade_3_english_book_page_22/grade_3_english_book.pdf_page_22.png'),
  23: require('@/data/grade_3_english_book/grade_3_english_book_page_23/grade_3_english_book.pdf_page_23.png'),
  24: require('@/data/grade_3_english_book/grade_3_english_book_page_24/grade_3_english_book.pdf_page_24.png'),
  25: require('@/data/grade_3_english_book/grade_3_english_book_page_25/grade_3_english_book.pdf_page_25.png'),
  26: require('@/data/grade_3_english_book/grade_3_english_book_page_26/grade_3_english_book.pdf_page_26.png'),
  27: require('@/data/grade_3_english_book/grade_3_english_book_page_27/grade_3_english_book.pdf_page_27.png'),
  28: require('@/data/grade_3_english_book/grade_3_english_book_page_28/grade_3_english_book.pdf_page_28.png'),
  29: require('@/data/grade_3_english_book/grade_3_english_book_page_29/grade_3_english_book.pdf_page_29.png'),
  30: require('@/data/grade_3_english_book/grade_3_english_book_page_30/grade_3_english_book.pdf_page_30.png'),
  31: require('@/data/grade_3_english_book/grade_3_english_book_page_31/grade_3_english_book.pdf_page_31.png'),
  32: require('@/data/grade_3_english_book/grade_3_english_book_page_32/grade_3_english_book.pdf_page_32.png'),
  33: require('@/data/grade_3_english_book/grade_3_english_book_page_33/grade_3_english_book.pdf_page_33.png'),
  34: require('@/data/grade_3_english_book/grade_3_english_book_page_34/grade_3_english_book.pdf_page_34.png'),
  35: require('@/data/grade_3_english_book/grade_3_english_book_page_35/grade_3_english_book.pdf_page_35.png'),
  36: require('@/data/grade_3_english_book/grade_3_english_book_page_36/grade_3_english_book.pdf_page_36.png'),
  37: require('@/data/grade_3_english_book/grade_3_english_book_page_37/grade_3_english_book.pdf_page_37.png'),
  38: require('@/data/grade_3_english_book/grade_3_english_book_page_38/grade_3_english_book.pdf_page_38.png'),
  39: require('@/data/grade_3_english_book/grade_3_english_book_page_39/grade_3_english_book.pdf_page_39.png'),
  41: require('@/data/grade_3_english_book/grade_3_english_book_page_41/grade_3_english_book.pdf_page_41.png'),
  42: require('@/data/grade_3_english_book/grade_3_english_book_page_42/grade_3_english_book.pdf_page_42.png'),
  43: require('@/data/grade_3_english_book/grade_3_english_book_page_43/grade_3_english_book.pdf_page_43.png'),
  44: require('@/data/grade_3_english_book/grade_3_english_book_page_44/grade_3_english_book.pdf_page_44.png'),
  45: require('@/data/grade_3_english_book/grade_3_english_book_page_45/grade_3_english_book.pdf_page_45.png'),
  46: require('@/data/grade_3_english_book/grade_3_english_book_page_46/grade_3_english_book.pdf_page_46.png'),
  47: require('@/data/grade_3_english_book/grade_3_english_book_page_47/grade_3_english_book.pdf_page_47.png'),
  48: require('@/data/grade_3_english_book/grade_3_english_book_page_48/grade_3_english_book.pdf_page_48.png'),
  49: require('@/data/grade_3_english_book/grade_3_english_book_page_49/grade_3_english_book.pdf_page_49.png'),
  50: require('@/data/grade_3_english_book/grade_3_english_book_page_50/grade_3_english_book.pdf_page_50.png'),
  51: require('@/data/grade_3_english_book/grade_3_english_book_page_51/grade_3_english_book.pdf_page_51.png'),
  52: require('@/data/grade_3_english_book/grade_3_english_book_page_52/grade_3_english_book.pdf_page_52.png'),
  53: require('@/data/grade_3_english_book/grade_3_english_book_page_53/grade_3_english_book.pdf_page_53.png'),
  54: require('@/data/grade_3_english_book/grade_3_english_book_page_54/grade_3_english_book.pdf_page_54.png'),
  55: require('@/data/grade_3_english_book/grade_3_english_book_page_55/grade_3_english_book.pdf_page_55.png'),
  56: require('@/data/grade_3_english_book/grade_3_english_book_page_56/grade_3_english_book.pdf_page_56.png'),
  57: require('@/data/grade_3_english_book/grade_3_english_book_page_57/grade_3_english_book.pdf_page_57.png'),
  58: require('@/data/grade_3_english_book/grade_3_english_book_page_58/grade_3_english_book.pdf_page_58.png'),
  59: require('@/data/grade_3_english_book/grade_3_english_book_page_59/grade_3_english_book.pdf_page_59.png'),
  60: require('@/data/grade_3_english_book/grade_3_english_book_page_60/grade_3_english_book.pdf_page_60.png'),
  61: require('@/data/grade_3_english_book/grade_3_english_book_page_61/grade_3_english_book.pdf_page_61.png'),
  62: require('@/data/grade_3_english_book/grade_3_english_book_page_62/grade_3_english_book.pdf_page_62.png'),
  63: require('@/data/grade_3_english_book/grade_3_english_book_page_63/grade_3_english_book.pdf_page_63.png'),
  64: require('@/data/grade_3_english_book/grade_3_english_book_page_64/grade_3_english_book.pdf_page_64.png'),
  65: require('@/data/grade_3_english_book/grade_3_english_book_page_65/grade_3_english_book.pdf_page_65.png'),
  66: require('@/data/grade_3_english_book/grade_3_english_book_page_66/grade_3_english_book.pdf_page_66.png'),
  67: require('@/data/grade_3_english_book/grade_3_english_book_page_67/grade_3_english_book.pdf_page_67.png'),
  68: require('@/data/grade_3_english_book/grade_3_english_book_page_68/grade_3_english_book.pdf_page_68.png'),
  69: require('@/data/grade_3_english_book/grade_3_english_book_page_69/grade_3_english_book.pdf_page_69.png'),
  70: require('@/data/grade_3_english_book/grade_3_english_book_page_70/grade_3_english_book.pdf_page_70.png'),
  71: require('@/data/grade_3_english_book/grade_3_english_book_page_71/grade_3_english_book.pdf_page_71.png'),
  72: require('@/data/grade_3_english_book/grade_3_english_book_page_72/grade_3_english_book.pdf_page_72.png'),
  73: require('@/data/grade_3_english_book/grade_3_english_book_page_73/grade_3_english_book.pdf_page_73.png'),
  74: require('@/data/grade_3_english_book/grade_3_english_book_page_74/grade_3_english_book.pdf_page_74.png'),
  75: require('@/data/grade_3_english_book/grade_3_english_book_page_75/grade_3_english_book.pdf_page_75.png'),
  76: require('@/data/grade_3_english_book/grade_3_english_book_page_76/grade_3_english_book.pdf_page_76.png'),
  77: require('@/data/grade_3_english_book/grade_3_english_book_page_77/grade_3_english_book.pdf_page_77.png'),
  78: require('@/data/grade_3_english_book/grade_3_english_book_page_78/grade_3_english_book.pdf_page_78.png'),
  79: require('@/data/grade_3_english_book/grade_3_english_book_page_79/grade_3_english_book.pdf_page_79.png'),
  80: require('@/data/grade_3_english_book/grade_3_english_book_page_80/grade_3_english_book.pdf_page_80.png'),
  81: require('@/data/grade_3_english_book/grade_3_english_book_page_81/grade_3_english_book.pdf_page_81.png'),
  82: require('@/data/grade_3_english_book/grade_3_english_book_page_82/grade_3_english_book.pdf_page_82.png'),
  83: require('@/data/grade_3_english_book/grade_3_english_book_page_83/grade_3_english_book.pdf_page_83.png'),
  84: require('@/data/grade_3_english_book/grade_3_english_book_page_84/grade_3_english_book.pdf_page_84.png'),
  85: require('@/data/grade_3_english_book/grade_3_english_book_page_85/grade_3_english_book.pdf_page_85.png'),
  86: require('@/data/grade_3_english_book/grade_3_english_book_page_86/grade_3_english_book.pdf_page_86.png'),
  87: require('@/data/grade_3_english_book/grade_3_english_book_page_87/grade_3_english_book.pdf_page_87.png'),
  88: require('@/data/grade_3_english_book/grade_3_english_book_page_88/grade_3_english_book.pdf_page_88.png'),
  89: require('@/data/grade_3_english_book/grade_3_english_book_page_89/grade_3_english_book.pdf_page_89.png'),
  90: require('@/data/grade_3_english_book/grade_3_english_book_page_90/grade_3_english_book.pdf_page_90.png'),
  91: require('@/data/grade_3_english_book/grade_3_english_book_page_91/grade_3_english_book.pdf_page_91.png'),
  92: require('@/data/grade_3_english_book/grade_3_english_book_page_92/grade_3_english_book.pdf_page_92.png'),
  93: require('@/data/grade_3_english_book/grade_3_english_book_page_93/grade_3_english_book.pdf_page_93.png'),
  94: require('@/data/grade_3_english_book/grade_3_english_book_page_94/grade_3_english_book.pdf_page_94.png'),
  95: require('@/data/grade_3_english_book/grade_3_english_book_page_95/grade_3_english_book.pdf_page_95.png'),
  96: require('@/data/grade_3_english_book/grade_3_english_book_page_96/grade_3_english_book.pdf_page_96.png'),
  97: require('@/data/grade_3_english_book/grade_3_english_book_page_97/grade_3_english_book.pdf_page_97.png'),
  98: require('@/data/grade_3_english_book/grade_3_english_book_page_98/grade_3_english_book.pdf_page_98.png'),
  99: require('@/data/grade_3_english_book/grade_3_english_book_page_99/grade_3_english_book.pdf_page_99.png'),
  100: require('@/data/grade_3_english_book/grade_3_english_book_page_100/grade_3_english_book.pdf_page_100.png'),
  101: require('@/data/grade_3_english_book/grade_3_english_book_page_101/grade_3_english_book.pdf_page_101.png'),
  102: require('@/data/grade_3_english_book/grade_3_english_book_page_102/grade_3_english_book.pdf_page_102.png'),
  103: require('@/data/grade_3_english_book/grade_3_english_book_page_103/grade_3_english_book.pdf_page_103.png'),
  104: require('@/data/grade_3_english_book/grade_3_english_book_page_104/grade_3_english_book.pdf_page_104.png'),
  105: require('@/data/grade_3_english_book/grade_3_english_book_page_105/grade_3_english_book.pdf_page_105.png'),
  106: require('@/data/grade_3_english_book/grade_3_english_book_page_106/grade_3_english_book.pdf_page_106.png'),
  107: require('@/data/grade_3_english_book/grade_3_english_book_page_107/grade_3_english_book.pdf_page_107.png'),
  108: require('@/data/grade_3_english_book/grade_3_english_book_page_108/grade_3_english_book.pdf_page_108.png'),
  109: require('@/data/grade_3_english_book/grade_3_english_book_page_109/grade_3_english_book.pdf_page_109.png'),
  110: require('@/data/grade_3_english_book/grade_3_english_book_page_110/grade_3_english_book.pdf_page_110.png'),
  111: require('@/data/grade_3_english_book/grade_3_english_book_page_111/grade_3_english_book.pdf_page_111.png'),
  112: require('@/data/grade_3_english_book/grade_3_english_book_page_112/grade_3_english_book.pdf_page_112.png'),
  113: require('@/data/grade_3_english_book/grade_3_english_book_page_113/grade_3_english_book.pdf_page_113.png'),
  114: require('@/data/grade_3_english_book/grade_3_english_book_page_114/grade_3_english_book.pdf_page_114.png'),
  115: require('@/data/grade_3_english_book/grade_3_english_book_page_115/grade_3_english_book.pdf_page_115.png'),
  116: require('@/data/grade_3_english_book/grade_3_english_book_page_116/grade_3_english_book.pdf_page_116.png'),
  117: require('@/data/grade_3_english_book/grade_3_english_book_page_117/grade_3_english_book.pdf_page_117.png'),
  118: require('@/data/grade_3_english_book/grade_3_english_book_page_118/grade_3_english_book.pdf_page_118.png'),
  119: require('@/data/grade_3_english_book/grade_3_english_book_page_119/grade_3_english_book.pdf_page_119.png'),
  120: require('@/data/grade_3_english_book/grade_3_english_book_page_120/grade_3_english_book.pdf_page_120.png'),
  121: require('@/data/grade_3_english_book/grade_3_english_book_page_121/grade_3_english_book.pdf_page_121.png'),
  122: require('@/data/grade_3_english_book/grade_3_english_book_page_122/grade_3_english_book.pdf_page_122.png'),
  123: require('@/data/grade_3_english_book/grade_3_english_book_page_123/grade_3_english_book.pdf_page_123.png'),
  124: require('@/data/grade_3_english_book/grade_3_english_book_page_124/grade_3_english_book.pdf_page_124.png'),
  125: require('@/data/grade_3_english_book/grade_3_english_book_page_125/grade_3_english_book.pdf_page_125.png'),
  126: require('@/data/grade_3_english_book/grade_3_english_book_page_126/grade_3_english_book.pdf_page_126.png'),
  127: require('@/data/grade_3_english_book/grade_3_english_book_page_127/grade_3_english_book.pdf_page_127.png'),
  128: require('@/data/grade_3_english_book/grade_3_english_book_page_128/grade_3_english_book.pdf_page_128.png'),
  129: require('@/data/grade_3_english_book/grade_3_english_book_page_129/grade_3_english_book.pdf_page_129.png'),
  130: require('@/data/grade_3_english_book/grade_3_english_book_page_130/grade_3_english_book.pdf_page_130.png'),
  131: require('@/data/grade_3_english_book/grade_3_english_book_page_131/grade_3_english_book.pdf_page_131.png'),
  132: require('@/data/grade_3_english_book/grade_3_english_book_page_132/grade_3_english_book.pdf_page_132.png'),
  133: require('@/data/grade_3_english_book/grade_3_english_book_page_133/grade_3_english_book.pdf_page_133.png'),
  134: require('@/data/grade_3_english_book/grade_3_english_book_page_134/grade_3_english_book.pdf_page_134.png'),
  135: require('@/data/grade_3_english_book/grade_3_english_book_page_135/grade_3_english_book.pdf_page_135.png'),
  136: require('@/data/grade_3_english_book/grade_3_english_book_page_136/grade_3_english_book.pdf_page_136.png'),
  137: require('@/data/grade_3_english_book/grade_3_english_book_page_137/grade_3_english_book.pdf_page_137.png'),
};

// Helper function to generate blocks dynamically from TrimmedBlocksDataService data
const generateBlocksForPage = (pageNumber: number) => {
  try {
    const trimmedBlocksService = TrimmedBlocksDataService.getInstance();
    const pageData = trimmedBlocksService.getTrimmedBlocksForPage(pageNumber);
    
    if (!pageData) {
      console.warn(`No trimmed block data found for page ${pageNumber}`);
      return [];
    }

    // Convert the block data to the format expected by the app
    const blocks = [];
    for (const [blockId, blockInfo] of Object.entries(pageData)) {
      if (blockInfo && (blockInfo as any).text && (blockInfo as any).text.trim()) {
        // Store page and block info so TTS service can dynamically load audio
        blocks.push({
          id: parseInt(blockId),
          text: (blockInfo as any).text,
          audio: `grade_3_english_book_page_${pageNumber}/block_${pageNumber}_${blockId}_audio.mp3`,
          pageNumber: pageNumber,
          blockId: parseInt(blockId)
        });
      }
    }
    
    return blocks;
  } catch (error) {
    console.warn(`Error generating blocks for page ${pageNumber}:`, error);
    return [];
  }
};

// Generate pages for Grade 3 English Book using static imports with dynamic blocks
const generateGrade3Pages = () => {
  const availablePages = Object.keys(grade3PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade3PageImages[pageNumber as keyof typeof grade3PageImages],
    blocks: generateBlocksForPage(pageNumber)
  }));
};

export const getAllBooks = (): Book[] => {
  return [
    {
      id: 1,
      title: 'Grade 3 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#4A90E2',
      hasData: true,
      tableOfContents: [
        {
          id: 'myself',
          title: 'Myself',
          pageNumber: 1,
          navigationPageNumber: 10
        },
        {
          id: 'my-home',
          title: 'My home',
          pageNumber: 19,
          navigationPageNumber: 28
        },
        {
          id: 'our-school',
          title: 'Our school',
          pageNumber: 34,
          navigationPageNumber: 44
        },
        {
          id: 'my-food-bag',
          title: 'My food bag',
          pageNumber: 51,
          navigationPageNumber: 60
        },
        {
          id: 'animal-friends',
          title: 'Animal friends',
          pageNumber: 67,
          navigationPageNumber: 76
        },
        {
          id: 'clothes-we-wear',
          title: 'Clothes we wear',
          pageNumber: 85,
          navigationPageNumber: 94
        },
        {
          id: 'playing-is-fun',
          title: 'Playing is fun',
          pageNumber: 94,
          navigationPageNumber: 103
        },
        {
          id: 'world-around-me',
          title: 'World around me',
          pageNumber: 111,
          navigationPageNumber: 120
        }
      ],
      pages: generateGrade3Pages()
    },
    {
      id: 2,
      title: 'Grade 4 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#7ED321',
      hasData: true,
      tableOfContents: [
        {
          id: 'good-practices',
          title: 'Good practices',
          pageNumber: 98
        },
        {
          id: 'environment',
          title: 'Environment',
          pageNumber: 100
        },
        {
          id: 'activities',
          title: 'Activities',
          pageNumber: 105
        }
      ],
      pages: [
        {
          pageNumber: 98,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_98/english PB G-4.pdf_page_98.png'),
          blocks: [
            {
              id: 1,
              text: "For free distribution 89",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_1_audio.mp3'),
            },
            {
              id: 2,
              text: "9 Good practices",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_2_audio.mp3'),
            },
            {
              id: 4,
              text: "Listen and say.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Do not throw litter on the ground.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Do not pluck leaves.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Do not waste water.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_98/block_98_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 99,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_99/english PB G-4.pdf_page_99.png'),
          blocks: [
            {
              id: 1,
              text: "Excuse me May I... Please Thank you You're welcome",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Lesson 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Act out.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Rasini : Excuse me teacher, may I come in? Teacher : Yes, you may.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Waruni : Please give me your pen. Meena : Here you are. Waruni : Thank you. Meena : You're welcome.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_99/block_99_5_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 100,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_100/english PB G-4.pdf_page_100.png'),
          blocks: [
            {
              id: 1,
              text: "How are you? I'm fine. I'm very well. I'm great.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Sonia : How are you, Kumar? Kumar : I'm fine. Thank you. How about you? Sonia : I'm very well. Thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Teacher : How are you all today? Children: We're fine. Thank you. How are you teacher? Teacher : I'm great. Thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_100/block_100_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 101,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_101/english PB G-4.pdf_page_101.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read and match.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_2_audio.mp3'),
            },
            {
              id: 3,
              text: "This is our school bus. Let's protect it.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_4_audio.mp3'),
            },
            {
              id: 5,
              text: "This is our school wall. Let's keep it clean.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We dump garbage into the bin.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_6_audio.mp3'),
            },
            {
              id: 7,
              text: "The road is busy. Let's follow the road rules.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_7_audio.mp3'),
            },
            {
              id: 8,
              text: "They help us. Let's say thank you.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Let's wait for our turn.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_101/block_101_9_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 102,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_102/english PB G-4.pdf_page_102.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read the good practices.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_2_audio.mp3'),
            },
            {
              id: 3,
              text: "How many do you practise?",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_3_audio.mp3'),
            },
            {
              id: 4,
              text: "We have a good sleep.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_4_audio.mp3'),
            },
            {
              id: 5,
              text: "We brush our teeth everyday. We get up early.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We take dinner together. We eat healthy food. We wash our hands before meals.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_6_audio.mp3'),
            },
            {
              id: 7,
              text: "We drink boiled water. We are kind to animals.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_102/block_102_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 103,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_103/english PB G-4.pdf_page_103.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Let's sing.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_2_audio.mp3'),
            },
            {
              id: 5,
              text: "Brush your teeth up and down. Brush your teeth round and round. Brush your teeth from left to right. Brush your teeth in the morning and night. Brush, brush, brush, brush, brush, brush, Brush your teeth in the morning and night.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_5_audio.mp3'),
            },
            {
              id: 7,
              text: "Brush your teeth to keep them white. Brush your teeth so that your smile is bright. Brush your teeth it's so much fun. Brush your teeth when you start the day. Brush, brush, brush, brush, brush, brush, Brush your teeth when you start the day.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_103/block_103_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 104,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_104/english PB G-4.pdf_page_104.png'),
          blocks: [
            {
              id: 3,
              text: "Brush your teeth just open and wide. Brush your teeth from side to side. Brush your teeth you sleepyhead. Brush your teeth before you go to bed. Brush, brush, brush, brush, brush, brush, Brush your teeth before you go to bed.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_104/block_104_3_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 105,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_105/english PB G-4.pdf_page_105.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_2_audio.mp3'),
            },
            {
              id: 4,
              text: "fresh fruits",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_4_audio.mp3'),
            },
            {
              id: 5,
              text: "green leaves",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_5_audio.mp3'),
            },
            {
              id: 6,
              text: "fresh vegetables",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_6_audio.mp3'),
            },
            {
              id: 7,
              text: "cereal",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Let's eat …",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_105/block_105_8_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 106,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_106/english PB G-4.pdf_page_106.png'),
          blocks: [
            {
              id: 1,
              text: "What are the types of food you eat?",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_106/block_106_1_audio.mp3'),
            },
            {
              id: 2,
              text: "I eat ...................... I don't eat ..................",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_106/block_106_2_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 107,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_107/english PB G-4.pdf_page_107.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_2_audio.mp3'),
            },
            {
              id: 4,
              text: "Trees give us vegetables.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_4_audio.mp3'),
            },
            {
              id: 6,
              text: "Trees give us medicine.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_6_audio.mp3'),
            },
            {
              id: 8,
              text: "Trees give us shade.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Trees give us cool air.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_9_audio.mp3'),
            },
            {
              id: 12,
              text: "Trees give us beautiful flowers.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_12_audio.mp3'),
            },
            {
              id: 14,
              text: "Trees give us fruits.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_107/block_107_14_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 108,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_108/english PB G-4.pdf_page_108.png'),
          blocks: [
            {
              id: 1,
              text: "Read aloud.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_1_audio.mp3'),
            },
            {
              id: 2,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_2_audio.mp3'),
            },
            {
              id: 3,
              text: "We love nature too.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_3_audio.mp3'),
            },
            {
              id: 4,
              text: "We love trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_7_audio.mp3'),
            },
            {
              id: 8,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_11_audio.mp3'),
            },
            {
              id: 12,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_12_audio.mp3'),
            },
            {
              id: 13,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_13_audio.mp3'),
            },
            {
              id: 14,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_14_audio.mp3'),
            },
            {
              id: 15,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_15_audio.mp3'),
            },
            {
              id: 16,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_16_audio.mp3'),
            },
            {
              id: 17,
              text: "Let's protect trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_17_audio.mp3'),
            },
            {
              id: 18,
              text: "Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_18_audio.mp3'),
            },
            {
              id: 19,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_108/block_108_19_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 109,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_109/english PB G-4.pdf_page_109.png'),
          blocks: [
            {
              id: 1,
              text: "Lesson 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Let's play hopscotch.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_2_audio.mp3'),
            },
            {
              id: 3,
              text: "We need trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Let's protect trees. Let's plant trees.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_4_audio.mp3'),
            },
            {
              id: 5,
              text: "We love nature.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_5_audio.mp3'),
            },
            {
              id: 6,
              text: "We love nature.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Trees are useful.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Trees are beautiful. Trees are our friends.",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_109/block_109_8_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 110,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_110/english PB G-4.pdf_page_110.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_110/block_110_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_110/block_110_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_110/block_110_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_110/block_110_4_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 111,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_111/english PB G-4.pdf_page_111.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_3_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Block 10",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_11_audio.mp3'),
            },
            {
              id: 12,
              text: "Block 12",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_12_audio.mp3'),
            },
            {
              id: 13,
              text: "Block 13",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_13_audio.mp3'),
            },
            {
              id: 14,
              text: "Block 14",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_111/block_111_14_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 112,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_112/english PB G-4.pdf_page_112.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Block 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Block 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Block 10",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_112/block_112_11_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 113,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_113/english PB G-4.pdf_page_113.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_2_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Block 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_113/block_113_7_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 114,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_114/english PB G-4.pdf_page_114.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_114/block_114_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_114/block_114_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_114/block_114_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_114/block_114_4_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 115,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_115/english PB G-4.pdf_page_115.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Block 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Block 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Block 10",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_11_audio.mp3'),
            },
            {
              id: 12,
              text: "Block 12",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_115/block_115_12_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 116,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_116/english PB G-4.pdf_page_116.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_3_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_5_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_7_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_9_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_11_audio.mp3'),
            },
            {
              id: 14,
              text: "Block 14",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_14_audio.mp3'),
            },
            {
              id: 15,
              text: "Block 15",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_116/block_116_15_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 117,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_117/english PB G-4.pdf_page_117.png'),
          blocks: [
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_117/block_117_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_117/block_117_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_117/block_117_4_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 118,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_118/english PB G-4.pdf_page_118.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Block 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Block 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Block 10",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_11_audio.mp3'),
            },
            {
              id: 12,
              text: "Block 12",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_12_audio.mp3'),
            },
            {
              id: 13,
              text: "Block 13",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_118/block_118_13_audio.mp3'),
            },
          ]
        },
        {
          pageNumber: 119,
          image: require('@/data/grade_4_english_book/grade_4_english_book_page_119/english PB G-4.pdf_page_119.png'),
          blocks: [
            {
              id: 1,
              text: "Block 1",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_1_audio.mp3'),
            },
            {
              id: 2,
              text: "Block 2",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_2_audio.mp3'),
            },
            {
              id: 3,
              text: "Block 3",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_3_audio.mp3'),
            },
            {
              id: 4,
              text: "Block 4",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_4_audio.mp3'),
            },
            {
              id: 5,
              text: "Block 5",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_5_audio.mp3'),
            },
            {
              id: 6,
              text: "Block 6",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_6_audio.mp3'),
            },
            {
              id: 7,
              text: "Block 7",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_7_audio.mp3'),
            },
            {
              id: 8,
              text: "Block 8",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_8_audio.mp3'),
            },
            {
              id: 9,
              text: "Block 9",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_9_audio.mp3'),
            },
            {
              id: 10,
              text: "Block 10",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_10_audio.mp3'),
            },
            {
              id: 11,
              text: "Block 11",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_11_audio.mp3'),
            },
            {
              id: 12,
              text: "Block 12",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_12_audio.mp3'),
            },
            {
              id: 13,
              text: "Block 13",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_13_audio.mp3'),
            },
            {
              id: 14,
              text: "Block 14",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_14_audio.mp3'),
            },
            {
              id: 15,
              text: "Block 15",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_15_audio.mp3'),
            },
            {
              id: 16,
              text: "Block 16",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_16_audio.mp3'),
            },
            {
              id: 17,
              text: "Block 17",
              audio: require('@/data/grade_4_english_book/grade_4_english_book_page_119/block_119_17_audio.mp3'),
            },
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Rainbow Friends',
      author: 'Fun Learning',
      backgroundColor: '#F5A623',
      hasData: false,
    },
    {
      id: 4,
      title: 'The Brave Little Mouse',
      author: 'Animal Tales',
      backgroundColor: '#D0021B',
      hasData: false,
    },
  ];
};
