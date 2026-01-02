import { TrimmedBlocksDataService } from '@/services/trimmedBlocksDataService';
import { Book } from '@/types/book';

// Static imports for Demo Book pages (pages 0-2)
const demoPageImages = {
  0: require('@/data/demo_book/demo_book_page_0/demo_book.pdf_page_0.png'),
  1: require('@/data/demo_book/demo_book_page_1/demo_book.pdf_page_1.png'),
  2: require('@/data/demo_book/demo_book_page_2/demo_book.pdf_page_2.png'),
};

// Static imports for Grade 3 English Book pages (pages 10-136)
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
  40: require('@/data/grade_3_english_book/grade_3_english_book_page_40/grade_3_english_book.pdf_page_40.png'),
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
};

// Static imports for Grade 4 English Book pages (pages 10-119)
const grade4PageImages = {
  10: require('@/data/grade_4_english_book/grade_4_english_book_page_10/grade_4_english_book.pdf_page_10.png'),
  11: require('@/data/grade_4_english_book/grade_4_english_book_page_11/grade_4_english_book.pdf_page_11.png'),
  12: require('@/data/grade_4_english_book/grade_4_english_book_page_12/grade_4_english_book.pdf_page_12.png'),
  13: require('@/data/grade_4_english_book/grade_4_english_book_page_13/grade_4_english_book.pdf_page_13.png'),
  14: require('@/data/grade_4_english_book/grade_4_english_book_page_14/grade_4_english_book.pdf_page_14.png'),
  15: require('@/data/grade_4_english_book/grade_4_english_book_page_15/grade_4_english_book.pdf_page_15.png'),
  16: require('@/data/grade_4_english_book/grade_4_english_book_page_16/grade_4_english_book.pdf_page_16.png'),
  17: require('@/data/grade_4_english_book/grade_4_english_book_page_17/grade_4_english_book.pdf_page_17.png'),
  18: require('@/data/grade_4_english_book/grade_4_english_book_page_18/grade_4_english_book.pdf_page_18.png'),
  19: require('@/data/grade_4_english_book/grade_4_english_book_page_19/grade_4_english_book.pdf_page_19.png'),
  20: require('@/data/grade_4_english_book/grade_4_english_book_page_20/grade_4_english_book.pdf_page_20.png'),
  21: require('@/data/grade_4_english_book/grade_4_english_book_page_21/grade_4_english_book.pdf_page_21.png'),
  22: require('@/data/grade_4_english_book/grade_4_english_book_page_22/grade_4_english_book.pdf_page_22.png'),
  23: require('@/data/grade_4_english_book/grade_4_english_book_page_23/grade_4_english_book.pdf_page_23.png'),
  24: require('@/data/grade_4_english_book/grade_4_english_book_page_24/grade_4_english_book.pdf_page_24.png'),
  25: require('@/data/grade_4_english_book/grade_4_english_book_page_25/grade_4_english_book.pdf_page_25.png'),
  26: require('@/data/grade_4_english_book/grade_4_english_book_page_26/grade_4_english_book.pdf_page_26.png'),
  27: require('@/data/grade_4_english_book/grade_4_english_book_page_27/grade_4_english_book.pdf_page_27.png'),
  28: require('@/data/grade_4_english_book/grade_4_english_book_page_28/grade_4_english_book.pdf_page_28.png'),
  29: require('@/data/grade_4_english_book/grade_4_english_book_page_29/grade_4_english_book.pdf_page_29.png'),
  30: require('@/data/grade_4_english_book/grade_4_english_book_page_30/grade_4_english_book.pdf_page_30.png'),
  31: require('@/data/grade_4_english_book/grade_4_english_book_page_31/grade_4_english_book.pdf_page_31.png'),
  32: require('@/data/grade_4_english_book/grade_4_english_book_page_32/grade_4_english_book.pdf_page_32.png'),
  33: require('@/data/grade_4_english_book/grade_4_english_book_page_33/grade_4_english_book.pdf_page_33.png'),
  34: require('@/data/grade_4_english_book/grade_4_english_book_page_34/grade_4_english_book.pdf_page_34.png'),
  35: require('@/data/grade_4_english_book/grade_4_english_book_page_35/grade_4_english_book.pdf_page_35.png'),
  36: require('@/data/grade_4_english_book/grade_4_english_book_page_36/grade_4_english_book.pdf_page_36.png'),
  37: require('@/data/grade_4_english_book/grade_4_english_book_page_37/grade_4_english_book.pdf_page_37.png'),
  38: require('@/data/grade_4_english_book/grade_4_english_book_page_38/grade_4_english_book.pdf_page_38.png'),
  39: require('@/data/grade_4_english_book/grade_4_english_book_page_39/grade_4_english_book.pdf_page_39.png'),
  40: require('@/data/grade_4_english_book/grade_4_english_book_page_40/grade_4_english_book.pdf_page_40.png'),
  41: require('@/data/grade_4_english_book/grade_4_english_book_page_41/grade_4_english_book.pdf_page_41.png'),
  42: require('@/data/grade_4_english_book/grade_4_english_book_page_42/grade_4_english_book.pdf_page_42.png'),
  43: require('@/data/grade_4_english_book/grade_4_english_book_page_43/grade_4_english_book.pdf_page_43.png'),
  44: require('@/data/grade_4_english_book/grade_4_english_book_page_44/grade_4_english_book.pdf_page_44.png'),
  45: require('@/data/grade_4_english_book/grade_4_english_book_page_45/grade_4_english_book.pdf_page_45.png'),
  46: require('@/data/grade_4_english_book/grade_4_english_book_page_46/grade_4_english_book.pdf_page_46.png'),
  47: require('@/data/grade_4_english_book/grade_4_english_book_page_47/grade_4_english_book.pdf_page_47.png'),
  48: require('@/data/grade_4_english_book/grade_4_english_book_page_48/grade_4_english_book.pdf_page_48.png'),
  49: require('@/data/grade_4_english_book/grade_4_english_book_page_49/grade_4_english_book.pdf_page_49.png'),
  50: require('@/data/grade_4_english_book/grade_4_english_book_page_50/grade_4_english_book.pdf_page_50.png'),
  51: require('@/data/grade_4_english_book/grade_4_english_book_page_51/grade_4_english_book.pdf_page_51.png'),
  52: require('@/data/grade_4_english_book/grade_4_english_book_page_52/grade_4_english_book.pdf_page_52.png'),
  53: require('@/data/grade_4_english_book/grade_4_english_book_page_53/grade_4_english_book.pdf_page_53.png'),
  54: require('@/data/grade_4_english_book/grade_4_english_book_page_54/grade_4_english_book.pdf_page_54.png'),
  55: require('@/data/grade_4_english_book/grade_4_english_book_page_55/grade_4_english_book.pdf_page_55.png'),
  56: require('@/data/grade_4_english_book/grade_4_english_book_page_56/grade_4_english_book.pdf_page_56.png'),
  57: require('@/data/grade_4_english_book/grade_4_english_book_page_57/grade_4_english_book.pdf_page_57.png'),
  58: require('@/data/grade_4_english_book/grade_4_english_book_page_58/grade_4_english_book.pdf_page_58.png'),
  59: require('@/data/grade_4_english_book/grade_4_english_book_page_59/grade_4_english_book.pdf_page_59.png'),
  60: require('@/data/grade_4_english_book/grade_4_english_book_page_60/grade_4_english_book.pdf_page_60.png'),
  61: require('@/data/grade_4_english_book/grade_4_english_book_page_61/grade_4_english_book.pdf_page_61.png'),
  62: require('@/data/grade_4_english_book/grade_4_english_book_page_62/grade_4_english_book.pdf_page_62.png'),
  63: require('@/data/grade_4_english_book/grade_4_english_book_page_63/grade_4_english_book.pdf_page_63.png'),
  64: require('@/data/grade_4_english_book/grade_4_english_book_page_64/grade_4_english_book.pdf_page_64.png'),
  65: require('@/data/grade_4_english_book/grade_4_english_book_page_65/grade_4_english_book.pdf_page_65.png'),
  66: require('@/data/grade_4_english_book/grade_4_english_book_page_66/grade_4_english_book.pdf_page_66.png'),
  67: require('@/data/grade_4_english_book/grade_4_english_book_page_67/grade_4_english_book.pdf_page_67.png'),
  68: require('@/data/grade_4_english_book/grade_4_english_book_page_68/grade_4_english_book.pdf_page_68.png'),
  69: require('@/data/grade_4_english_book/grade_4_english_book_page_69/grade_4_english_book.pdf_page_69.png'),
  70: require('@/data/grade_4_english_book/grade_4_english_book_page_70/grade_4_english_book.pdf_page_70.png'),
  71: require('@/data/grade_4_english_book/grade_4_english_book_page_71/grade_4_english_book.pdf_page_71.png'),
  72: require('@/data/grade_4_english_book/grade_4_english_book_page_72/grade_4_english_book.pdf_page_72.png'),
  73: require('@/data/grade_4_english_book/grade_4_english_book_page_73/grade_4_english_book.pdf_page_73.png'),
  74: require('@/data/grade_4_english_book/grade_4_english_book_page_74/grade_4_english_book.pdf_page_74.png'),
  75: require('@/data/grade_4_english_book/grade_4_english_book_page_75/grade_4_english_book.pdf_page_75.png'),
  76: require('@/data/grade_4_english_book/grade_4_english_book_page_76/grade_4_english_book.pdf_page_76.png'),
  77: require('@/data/grade_4_english_book/grade_4_english_book_page_77/grade_4_english_book.pdf_page_77.png'),
  78: require('@/data/grade_4_english_book/grade_4_english_book_page_78/grade_4_english_book.pdf_page_78.png'),
  79: require('@/data/grade_4_english_book/grade_4_english_book_page_79/grade_4_english_book.pdf_page_79.png'),
  80: require('@/data/grade_4_english_book/grade_4_english_book_page_80/grade_4_english_book.pdf_page_80.png'),
  81: require('@/data/grade_4_english_book/grade_4_english_book_page_81/grade_4_english_book.pdf_page_81.png'),
  82: require('@/data/grade_4_english_book/grade_4_english_book_page_82/grade_4_english_book.pdf_page_82.png'),
  83: require('@/data/grade_4_english_book/grade_4_english_book_page_83/grade_4_english_book.pdf_page_83.png'),
  84: require('@/data/grade_4_english_book/grade_4_english_book_page_84/grade_4_english_book.pdf_page_84.png'),
  85: require('@/data/grade_4_english_book/grade_4_english_book_page_85/grade_4_english_book.pdf_page_85.png'),
  86: require('@/data/grade_4_english_book/grade_4_english_book_page_86/grade_4_english_book.pdf_page_86.png'),
  87: require('@/data/grade_4_english_book/grade_4_english_book_page_87/grade_4_english_book.pdf_page_87.png'),
  88: require('@/data/grade_4_english_book/grade_4_english_book_page_88/grade_4_english_book.pdf_page_88.png'),
  89: require('@/data/grade_4_english_book/grade_4_english_book_page_89/grade_4_english_book.pdf_page_89.png'),
  90: require('@/data/grade_4_english_book/grade_4_english_book_page_90/grade_4_english_book.pdf_page_90.png'),
  91: require('@/data/grade_4_english_book/grade_4_english_book_page_91/grade_4_english_book.pdf_page_91.png'),
  92: require('@/data/grade_4_english_book/grade_4_english_book_page_92/grade_4_english_book.pdf_page_92.png'),
  93: require('@/data/grade_4_english_book/grade_4_english_book_page_93/grade_4_english_book.pdf_page_93.png'),
  94: require('@/data/grade_4_english_book/grade_4_english_book_page_94/grade_4_english_book.pdf_page_94.png'),
  95: require('@/data/grade_4_english_book/grade_4_english_book_page_95/grade_4_english_book.pdf_page_95.png'),
  96: require('@/data/grade_4_english_book/grade_4_english_book_page_96/grade_4_english_book.pdf_page_96.png'),
  97: require('@/data/grade_4_english_book/grade_4_english_book_page_97/grade_4_english_book.pdf_page_97.png'),
  98: require('@/data/grade_4_english_book/grade_4_english_book_page_98/grade_4_english_book.pdf_page_98.png'),
  99: require('@/data/grade_4_english_book/grade_4_english_book_page_99/grade_4_english_book.pdf_page_99.png'),
  100: require('@/data/grade_4_english_book/grade_4_english_book_page_100/grade_4_english_book.pdf_page_100.png'),
  101: require('@/data/grade_4_english_book/grade_4_english_book_page_101/grade_4_english_book.pdf_page_101.png'),
  102: require('@/data/grade_4_english_book/grade_4_english_book_page_102/grade_4_english_book.pdf_page_102.png'),
  103: require('@/data/grade_4_english_book/grade_4_english_book_page_103/grade_4_english_book.pdf_page_103.png'),
  104: require('@/data/grade_4_english_book/grade_4_english_book_page_104/grade_4_english_book.pdf_page_104.png'),
  105: require('@/data/grade_4_english_book/grade_4_english_book_page_105/grade_4_english_book.pdf_page_105.png'),
  106: require('@/data/grade_4_english_book/grade_4_english_book_page_106/grade_4_english_book.pdf_page_106.png'),
  107: require('@/data/grade_4_english_book/grade_4_english_book_page_107/grade_4_english_book.pdf_page_107.png'),
  108: require('@/data/grade_4_english_book/grade_4_english_book_page_108/grade_4_english_book.pdf_page_108.png'),
  109: require('@/data/grade_4_english_book/grade_4_english_book_page_109/grade_4_english_book.pdf_page_109.png'),
  110: require('@/data/grade_4_english_book/grade_4_english_book_page_110/grade_4_english_book.pdf_page_110.png'),
  111: require('@/data/grade_4_english_book/grade_4_english_book_page_111/grade_4_english_book.pdf_page_111.png'),
  112: require('@/data/grade_4_english_book/grade_4_english_book_page_112/grade_4_english_book.pdf_page_112.png'),
  113: require('@/data/grade_4_english_book/grade_4_english_book_page_113/grade_4_english_book.pdf_page_113.png'),
  114: require('@/data/grade_4_english_book/grade_4_english_book_page_114/grade_4_english_book.pdf_page_114.png'),
  115: require('@/data/grade_4_english_book/grade_4_english_book_page_115/grade_4_english_book.pdf_page_115.png'),
  116: require('@/data/grade_4_english_book/grade_4_english_book_page_116/grade_4_english_book.pdf_page_116.png'),
  117: require('@/data/grade_4_english_book/grade_4_english_book_page_117/grade_4_english_book.pdf_page_117.png'),
  118: require('@/data/grade_4_english_book/grade_4_english_book_page_118/grade_4_english_book.pdf_page_118.png'),
  119: require('@/data/grade_4_english_book/grade_4_english_book_page_119/grade_4_english_book.pdf_page_119.png'),
};

// Unified helper function to generate blocks dynamically from TrimmedBlocksDataService data

// Static imports for Grade 5 English Book pages (pages 10-150)
const grade5PageImages = {
  10: require('@/data/grade_5_english_book/grade_5_english_book_page_10/grade_5_english_book.pdf_page_10.png'),
  11: require('@/data/grade_5_english_book/grade_5_english_book_page_11/grade_5_english_book.pdf_page_11.png'),
  12: require('@/data/grade_5_english_book/grade_5_english_book_page_12/grade_5_english_book.pdf_page_12.png'),
  13: require('@/data/grade_5_english_book/grade_5_english_book_page_13/grade_5_english_book.pdf_page_13.png'),
  14: require('@/data/grade_5_english_book/grade_5_english_book_page_14/grade_5_english_book.pdf_page_14.png'),
  15: require('@/data/grade_5_english_book/grade_5_english_book_page_15/grade_5_english_book.pdf_page_15.png'),
  16: require('@/data/grade_5_english_book/grade_5_english_book_page_16/grade_5_english_book.pdf_page_16.png'),
  17: require('@/data/grade_5_english_book/grade_5_english_book_page_17/grade_5_english_book.pdf_page_17.png'),
  18: require('@/data/grade_5_english_book/grade_5_english_book_page_18/grade_5_english_book.pdf_page_18.png'),
  19: require('@/data/grade_5_english_book/grade_5_english_book_page_19/grade_5_english_book.pdf_page_19.png'),
  20: require('@/data/grade_5_english_book/grade_5_english_book_page_20/grade_5_english_book.pdf_page_20.png'),
  21: require('@/data/grade_5_english_book/grade_5_english_book_page_21/grade_5_english_book.pdf_page_21.png'),
  22: require('@/data/grade_5_english_book/grade_5_english_book_page_22/grade_5_english_book.pdf_page_22.png'),
  23: require('@/data/grade_5_english_book/grade_5_english_book_page_23/grade_5_english_book.pdf_page_23.png'),
  24: require('@/data/grade_5_english_book/grade_5_english_book_page_24/grade_5_english_book.pdf_page_24.png'),
  25: require('@/data/grade_5_english_book/grade_5_english_book_page_25/grade_5_english_book.pdf_page_25.png'),
  26: require('@/data/grade_5_english_book/grade_5_english_book_page_26/grade_5_english_book.pdf_page_26.png'),
  27: require('@/data/grade_5_english_book/grade_5_english_book_page_27/grade_5_english_book.pdf_page_27.png'),
  28: require('@/data/grade_5_english_book/grade_5_english_book_page_28/grade_5_english_book.pdf_page_28.png'),
  29: require('@/data/grade_5_english_book/grade_5_english_book_page_29/grade_5_english_book.pdf_page_29.png'),
  30: require('@/data/grade_5_english_book/grade_5_english_book_page_30/grade_5_english_book.pdf_page_30.png'),
  31: require('@/data/grade_5_english_book/grade_5_english_book_page_31/grade_5_english_book.pdf_page_31.png'),
  32: require('@/data/grade_5_english_book/grade_5_english_book_page_32/grade_5_english_book.pdf_page_32.png'),
  33: require('@/data/grade_5_english_book/grade_5_english_book_page_33/grade_5_english_book.pdf_page_33.png'),
  34: require('@/data/grade_5_english_book/grade_5_english_book_page_34/grade_5_english_book.pdf_page_34.png'),
  35: require('@/data/grade_5_english_book/grade_5_english_book_page_35/grade_5_english_book.pdf_page_35.png'),
  36: require('@/data/grade_5_english_book/grade_5_english_book_page_36/grade_5_english_book.pdf_page_36.png'),
  37: require('@/data/grade_5_english_book/grade_5_english_book_page_37/grade_5_english_book.pdf_page_37.png'),
  38: require('@/data/grade_5_english_book/grade_5_english_book_page_38/grade_5_english_book.pdf_page_38.png'),
  39: require('@/data/grade_5_english_book/grade_5_english_book_page_39/grade_5_english_book.pdf_page_39.png'),
  40: require('@/data/grade_5_english_book/grade_5_english_book_page_40/grade_5_english_book.pdf_page_40.png'),
  41: require('@/data/grade_5_english_book/grade_5_english_book_page_41/grade_5_english_book.pdf_page_41.png'),
  42: require('@/data/grade_5_english_book/grade_5_english_book_page_42/grade_5_english_book.pdf_page_42.png'),
  43: require('@/data/grade_5_english_book/grade_5_english_book_page_43/grade_5_english_book.pdf_page_43.png'),
  44: require('@/data/grade_5_english_book/grade_5_english_book_page_44/grade_5_english_book.pdf_page_44.png'),
  45: require('@/data/grade_5_english_book/grade_5_english_book_page_45/grade_5_english_book.pdf_page_45.png'),
  46: require('@/data/grade_5_english_book/grade_5_english_book_page_46/grade_5_english_book.pdf_page_46.png'),
  47: require('@/data/grade_5_english_book/grade_5_english_book_page_47/grade_5_english_book.pdf_page_47.png'),
  48: require('@/data/grade_5_english_book/grade_5_english_book_page_48/grade_5_english_book.pdf_page_48.png'),
  49: require('@/data/grade_5_english_book/grade_5_english_book_page_49/grade_5_english_book.pdf_page_49.png'),
  50: require('@/data/grade_5_english_book/grade_5_english_book_page_50/grade_5_english_book.pdf_page_50.png'),
  51: require('@/data/grade_5_english_book/grade_5_english_book_page_51/grade_5_english_book.pdf_page_51.png'),
  52: require('@/data/grade_5_english_book/grade_5_english_book_page_52/grade_5_english_book.pdf_page_52.png'),
  53: require('@/data/grade_5_english_book/grade_5_english_book_page_53/grade_5_english_book.pdf_page_53.png'),
  54: require('@/data/grade_5_english_book/grade_5_english_book_page_54/grade_5_english_book.pdf_page_54.png'),
  55: require('@/data/grade_5_english_book/grade_5_english_book_page_55/grade_5_english_book.pdf_page_55.png'),
  56: require('@/data/grade_5_english_book/grade_5_english_book_page_56/grade_5_english_book.pdf_page_56.png'),
  57: require('@/data/grade_5_english_book/grade_5_english_book_page_57/grade_5_english_book.pdf_page_57.png'),
  58: require('@/data/grade_5_english_book/grade_5_english_book_page_58/grade_5_english_book.pdf_page_58.png'),
  59: require('@/data/grade_5_english_book/grade_5_english_book_page_59/grade_5_english_book.pdf_page_59.png'),
  60: require('@/data/grade_5_english_book/grade_5_english_book_page_60/grade_5_english_book.pdf_page_60.png'),
  61: require('@/data/grade_5_english_book/grade_5_english_book_page_61/grade_5_english_book.pdf_page_61.png'),
  62: require('@/data/grade_5_english_book/grade_5_english_book_page_62/grade_5_english_book.pdf_page_62.png'),
  63: require('@/data/grade_5_english_book/grade_5_english_book_page_63/grade_5_english_book.pdf_page_63.png'),
  64: require('@/data/grade_5_english_book/grade_5_english_book_page_64/grade_5_english_book.pdf_page_64.png'),
  65: require('@/data/grade_5_english_book/grade_5_english_book_page_65/grade_5_english_book.pdf_page_65.png'),
  66: require('@/data/grade_5_english_book/grade_5_english_book_page_66/grade_5_english_book.pdf_page_66.png'),
  67: require('@/data/grade_5_english_book/grade_5_english_book_page_67/grade_5_english_book.pdf_page_67.png'),
  68: require('@/data/grade_5_english_book/grade_5_english_book_page_68/grade_5_english_book.pdf_page_68.png'),
  69: require('@/data/grade_5_english_book/grade_5_english_book_page_69/grade_5_english_book.pdf_page_69.png'),
  70: require('@/data/grade_5_english_book/grade_5_english_book_page_70/grade_5_english_book.pdf_page_70.png'),
  71: require('@/data/grade_5_english_book/grade_5_english_book_page_71/grade_5_english_book.pdf_page_71.png'),
  72: require('@/data/grade_5_english_book/grade_5_english_book_page_72/grade_5_english_book.pdf_page_72.png'),
  73: require('@/data/grade_5_english_book/grade_5_english_book_page_73/grade_5_english_book.pdf_page_73.png'),
  74: require('@/data/grade_5_english_book/grade_5_english_book_page_74/grade_5_english_book.pdf_page_74.png'),
  75: require('@/data/grade_5_english_book/grade_5_english_book_page_75/grade_5_english_book.pdf_page_75.png'),
  76: require('@/data/grade_5_english_book/grade_5_english_book_page_76/grade_5_english_book.pdf_page_76.png'),
  77: require('@/data/grade_5_english_book/grade_5_english_book_page_77/grade_5_english_book.pdf_page_77.png'),
  78: require('@/data/grade_5_english_book/grade_5_english_book_page_78/grade_5_english_book.pdf_page_78.png'),
  79: require('@/data/grade_5_english_book/grade_5_english_book_page_79/grade_5_english_book.pdf_page_79.png'),
  80: require('@/data/grade_5_english_book/grade_5_english_book_page_80/grade_5_english_book.pdf_page_80.png'),
  81: require('@/data/grade_5_english_book/grade_5_english_book_page_81/grade_5_english_book.pdf_page_81.png'),
  82: require('@/data/grade_5_english_book/grade_5_english_book_page_82/grade_5_english_book.pdf_page_82.png'),
  83: require('@/data/grade_5_english_book/grade_5_english_book_page_83/grade_5_english_book.pdf_page_83.png'),
  84: require('@/data/grade_5_english_book/grade_5_english_book_page_84/grade_5_english_book.pdf_page_84.png'),
  85: require('@/data/grade_5_english_book/grade_5_english_book_page_85/grade_5_english_book.pdf_page_85.png'),
  86: require('@/data/grade_5_english_book/grade_5_english_book_page_86/grade_5_english_book.pdf_page_86.png'),
  87: require('@/data/grade_5_english_book/grade_5_english_book_page_87/grade_5_english_book.pdf_page_87.png'),
  88: require('@/data/grade_5_english_book/grade_5_english_book_page_88/grade_5_english_book.pdf_page_88.png'),
  89: require('@/data/grade_5_english_book/grade_5_english_book_page_89/grade_5_english_book.pdf_page_89.png'),
  90: require('@/data/grade_5_english_book/grade_5_english_book_page_90/grade_5_english_book.pdf_page_90.png'),
  91: require('@/data/grade_5_english_book/grade_5_english_book_page_91/grade_5_english_book.pdf_page_91.png'),
  92: require('@/data/grade_5_english_book/grade_5_english_book_page_92/grade_5_english_book.pdf_page_92.png'),
  93: require('@/data/grade_5_english_book/grade_5_english_book_page_93/grade_5_english_book.pdf_page_93.png'),
  94: require('@/data/grade_5_english_book/grade_5_english_book_page_94/grade_5_english_book.pdf_page_94.png'),
  95: require('@/data/grade_5_english_book/grade_5_english_book_page_95/grade_5_english_book.pdf_page_95.png'),
  96: require('@/data/grade_5_english_book/grade_5_english_book_page_96/grade_5_english_book.pdf_page_96.png'),
  97: require('@/data/grade_5_english_book/grade_5_english_book_page_97/grade_5_english_book.pdf_page_97.png'),
  98: require('@/data/grade_5_english_book/grade_5_english_book_page_98/grade_5_english_book.pdf_page_98.png'),
  99: require('@/data/grade_5_english_book/grade_5_english_book_page_99/grade_5_english_book.pdf_page_99.png'),
  100: require('@/data/grade_5_english_book/grade_5_english_book_page_100/grade_5_english_book.pdf_page_100.png'),
  101: require('@/data/grade_5_english_book/grade_5_english_book_page_101/grade_5_english_book.pdf_page_101.png'),
  102: require('@/data/grade_5_english_book/grade_5_english_book_page_102/grade_5_english_book.pdf_page_102.png'),
  103: require('@/data/grade_5_english_book/grade_5_english_book_page_103/grade_5_english_book.pdf_page_103.png'),
  104: require('@/data/grade_5_english_book/grade_5_english_book_page_104/grade_5_english_book.pdf_page_104.png'),
  105: require('@/data/grade_5_english_book/grade_5_english_book_page_105/grade_5_english_book.pdf_page_105.png'),
  106: require('@/data/grade_5_english_book/grade_5_english_book_page_106/grade_5_english_book.pdf_page_106.png'),
  107: require('@/data/grade_5_english_book/grade_5_english_book_page_107/grade_5_english_book.pdf_page_107.png'),
  108: require('@/data/grade_5_english_book/grade_5_english_book_page_108/grade_5_english_book.pdf_page_108.png'),
  109: require('@/data/grade_5_english_book/grade_5_english_book_page_109/grade_5_english_book.pdf_page_109.png'),
  110: require('@/data/grade_5_english_book/grade_5_english_book_page_110/grade_5_english_book.pdf_page_110.png'),
  111: require('@/data/grade_5_english_book/grade_5_english_book_page_111/grade_5_english_book.pdf_page_111.png'),
  112: require('@/data/grade_5_english_book/grade_5_english_book_page_112/grade_5_english_book.pdf_page_112.png'),
  113: require('@/data/grade_5_english_book/grade_5_english_book_page_113/grade_5_english_book.pdf_page_113.png'),
  114: require('@/data/grade_5_english_book/grade_5_english_book_page_114/grade_5_english_book.pdf_page_114.png'),
  115: require('@/data/grade_5_english_book/grade_5_english_book_page_115/grade_5_english_book.pdf_page_115.png'),
  116: require('@/data/grade_5_english_book/grade_5_english_book_page_116/grade_5_english_book.pdf_page_116.png'),
  117: require('@/data/grade_5_english_book/grade_5_english_book_page_117/grade_5_english_book.pdf_page_117.png'),
  118: require('@/data/grade_5_english_book/grade_5_english_book_page_118/grade_5_english_book.pdf_page_118.png'),
  119: require('@/data/grade_5_english_book/grade_5_english_book_page_119/grade_5_english_book.pdf_page_119.png'),
  120: require('@/data/grade_5_english_book/grade_5_english_book_page_120/grade_5_english_book.pdf_page_120.png'),
  121: require('@/data/grade_5_english_book/grade_5_english_book_page_121/grade_5_english_book.pdf_page_121.png'),
  122: require('@/data/grade_5_english_book/grade_5_english_book_page_122/grade_5_english_book.pdf_page_122.png'),
  123: require('@/data/grade_5_english_book/grade_5_english_book_page_123/grade_5_english_book.pdf_page_123.png'),
  124: require('@/data/grade_5_english_book/grade_5_english_book_page_124/grade_5_english_book.pdf_page_124.png'),
  125: require('@/data/grade_5_english_book/grade_5_english_book_page_125/grade_5_english_book.pdf_page_125.png'),
  126: require('@/data/grade_5_english_book/grade_5_english_book_page_126/grade_5_english_book.pdf_page_126.png'),
  127: require('@/data/grade_5_english_book/grade_5_english_book_page_127/grade_5_english_book.pdf_page_127.png'),
  128: require('@/data/grade_5_english_book/grade_5_english_book_page_128/grade_5_english_book.pdf_page_128.png'),
  129: require('@/data/grade_5_english_book/grade_5_english_book_page_129/grade_5_english_book.pdf_page_129.png'),
  130: require('@/data/grade_5_english_book/grade_5_english_book_page_130/grade_5_english_book.pdf_page_130.png'),
  131: require('@/data/grade_5_english_book/grade_5_english_book_page_131/grade_5_english_book.pdf_page_131.png'),
  132: require('@/data/grade_5_english_book/grade_5_english_book_page_132/grade_5_english_book.pdf_page_132.png'),
  133: require('@/data/grade_5_english_book/grade_5_english_book_page_133/grade_5_english_book.pdf_page_133.png'),
  134: require('@/data/grade_5_english_book/grade_5_english_book_page_134/grade_5_english_book.pdf_page_134.png'),
  135: require('@/data/grade_5_english_book/grade_5_english_book_page_135/grade_5_english_book.pdf_page_135.png'),
  136: require('@/data/grade_5_english_book/grade_5_english_book_page_136/grade_5_english_book.pdf_page_136.png'),
  137: require('@/data/grade_5_english_book/grade_5_english_book_page_137/grade_5_english_book.pdf_page_137.png'),
  138: require('@/data/grade_5_english_book/grade_5_english_book_page_138/grade_5_english_book.pdf_page_138.png'),
  139: require('@/data/grade_5_english_book/grade_5_english_book_page_139/grade_5_english_book.pdf_page_139.png'),
  140: require('@/data/grade_5_english_book/grade_5_english_book_page_140/grade_5_english_book.pdf_page_140.png'),
  141: require('@/data/grade_5_english_book/grade_5_english_book_page_141/grade_5_english_book.pdf_page_141.png'),
  142: require('@/data/grade_5_english_book/grade_5_english_book_page_142/grade_5_english_book.pdf_page_142.png'),
  143: require('@/data/grade_5_english_book/grade_5_english_book_page_143/grade_5_english_book.pdf_page_143.png'),
  144: require('@/data/grade_5_english_book/grade_5_english_book_page_144/grade_5_english_book.pdf_page_144.png'),
  145: require('@/data/grade_5_english_book/grade_5_english_book_page_145/grade_5_english_book.pdf_page_145.png'),
  146: require('@/data/grade_5_english_book/grade_5_english_book_page_146/grade_5_english_book.pdf_page_146.png'),
  147: require('@/data/grade_5_english_book/grade_5_english_book_page_147/grade_5_english_book.pdf_page_147.png'),
  148: require('@/data/grade_5_english_book/grade_5_english_book_page_148/grade_5_english_book.pdf_page_148.png'),
  149: require('@/data/grade_5_english_book/grade_5_english_book_page_149/grade_5_english_book.pdf_page_149.png'),
  150: require('@/data/grade_5_english_book/grade_5_english_book_page_150/grade_5_english_book.pdf_page_150.png'),
};

// Static imports for Grade 6 English Book pages (pages 14-135)
const grade6PageImages = {
  14: require('@/data/grade_6_english_book/grade_6_english_book_page_14/grade_6_english_book.pdf_page_14.png'),
  15: require('@/data/grade_6_english_book/grade_6_english_book_page_15/grade_6_english_book.pdf_page_15.png'),
  16: require('@/data/grade_6_english_book/grade_6_english_book_page_16/grade_6_english_book.pdf_page_16.png'),
  17: require('@/data/grade_6_english_book/grade_6_english_book_page_17/grade_6_english_book.pdf_page_17.png'),
  18: require('@/data/grade_6_english_book/grade_6_english_book_page_18/grade_6_english_book.pdf_page_18.png'),
  19: require('@/data/grade_6_english_book/grade_6_english_book_page_19/grade_6_english_book.pdf_page_19.png'),
  20: require('@/data/grade_6_english_book/grade_6_english_book_page_20/grade_6_english_book.pdf_page_20.png'),
  21: require('@/data/grade_6_english_book/grade_6_english_book_page_21/grade_6_english_book.pdf_page_21.png'),
  22: require('@/data/grade_6_english_book/grade_6_english_book_page_22/grade_6_english_book.pdf_page_22.png'),
  23: require('@/data/grade_6_english_book/grade_6_english_book_page_23/grade_6_english_book.pdf_page_23.png'),
  24: require('@/data/grade_6_english_book/grade_6_english_book_page_24/grade_6_english_book.pdf_page_24.png'),
  25: require('@/data/grade_6_english_book/grade_6_english_book_page_25/grade_6_english_book.pdf_page_25.png'),
  26: require('@/data/grade_6_english_book/grade_6_english_book_page_26/grade_6_english_book.pdf_page_26.png'),
  27: require('@/data/grade_6_english_book/grade_6_english_book_page_27/grade_6_english_book.pdf_page_27.png'),
  28: require('@/data/grade_6_english_book/grade_6_english_book_page_28/grade_6_english_book.pdf_page_28.png'),
  29: require('@/data/grade_6_english_book/grade_6_english_book_page_29/grade_6_english_book.pdf_page_29.png'),
  30: require('@/data/grade_6_english_book/grade_6_english_book_page_30/grade_6_english_book.pdf_page_30.png'),
  31: require('@/data/grade_6_english_book/grade_6_english_book_page_31/grade_6_english_book.pdf_page_31.png'),
  32: require('@/data/grade_6_english_book/grade_6_english_book_page_32/grade_6_english_book.pdf_page_32.png'),
  33: require('@/data/grade_6_english_book/grade_6_english_book_page_33/grade_6_english_book.pdf_page_33.png'),
  34: require('@/data/grade_6_english_book/grade_6_english_book_page_34/grade_6_english_book.pdf_page_34.png'),
  35: require('@/data/grade_6_english_book/grade_6_english_book_page_35/grade_6_english_book.pdf_page_35.png'),
  36: require('@/data/grade_6_english_book/grade_6_english_book_page_36/grade_6_english_book.pdf_page_36.png'),
  37: require('@/data/grade_6_english_book/grade_6_english_book_page_37/grade_6_english_book.pdf_page_37.png'),
  38: require('@/data/grade_6_english_book/grade_6_english_book_page_38/grade_6_english_book.pdf_page_38.png'),
  39: require('@/data/grade_6_english_book/grade_6_english_book_page_39/grade_6_english_book.pdf_page_39.png'),
  40: require('@/data/grade_6_english_book/grade_6_english_book_page_40/grade_6_english_book.pdf_page_40.png'),
  41: require('@/data/grade_6_english_book/grade_6_english_book_page_41/grade_6_english_book.pdf_page_41.png'),
  42: require('@/data/grade_6_english_book/grade_6_english_book_page_42/grade_6_english_book.pdf_page_42.png'),
  43: require('@/data/grade_6_english_book/grade_6_english_book_page_43/grade_6_english_book.pdf_page_43.png'),
  44: require('@/data/grade_6_english_book/grade_6_english_book_page_44/grade_6_english_book.pdf_page_44.png'),
  45: require('@/data/grade_6_english_book/grade_6_english_book_page_45/grade_6_english_book.pdf_page_45.png'),
  46: require('@/data/grade_6_english_book/grade_6_english_book_page_46/grade_6_english_book.pdf_page_46.png'),
  47: require('@/data/grade_6_english_book/grade_6_english_book_page_47/grade_6_english_book.pdf_page_47.png'),
  48: require('@/data/grade_6_english_book/grade_6_english_book_page_48/grade_6_english_book.pdf_page_48.png'),
  49: require('@/data/grade_6_english_book/grade_6_english_book_page_49/grade_6_english_book.pdf_page_49.png'),
  50: require('@/data/grade_6_english_book/grade_6_english_book_page_50/grade_6_english_book.pdf_page_50.png'),
  51: require('@/data/grade_6_english_book/grade_6_english_book_page_51/grade_6_english_book.pdf_page_51.png'),
  52: require('@/data/grade_6_english_book/grade_6_english_book_page_52/grade_6_english_book.pdf_page_52.png'),
  53: require('@/data/grade_6_english_book/grade_6_english_book_page_53/grade_6_english_book.pdf_page_53.png'),
  54: require('@/data/grade_6_english_book/grade_6_english_book_page_54/grade_6_english_book.pdf_page_54.png'),
  55: require('@/data/grade_6_english_book/grade_6_english_book_page_55/grade_6_english_book.pdf_page_55.png'),
  56: require('@/data/grade_6_english_book/grade_6_english_book_page_56/grade_6_english_book.pdf_page_56.png'),
  57: require('@/data/grade_6_english_book/grade_6_english_book_page_57/grade_6_english_book.pdf_page_57.png'),
  58: require('@/data/grade_6_english_book/grade_6_english_book_page_58/grade_6_english_book.pdf_page_58.png'),
  59: require('@/data/grade_6_english_book/grade_6_english_book_page_59/grade_6_english_book.pdf_page_59.png'),
  60: require('@/data/grade_6_english_book/grade_6_english_book_page_60/grade_6_english_book.pdf_page_60.png'),
  61: require('@/data/grade_6_english_book/grade_6_english_book_page_61/grade_6_english_book.pdf_page_61.png'),
  62: require('@/data/grade_6_english_book/grade_6_english_book_page_62/grade_6_english_book.pdf_page_62.png'),
  63: require('@/data/grade_6_english_book/grade_6_english_book_page_63/grade_6_english_book.pdf_page_63.png'),
  64: require('@/data/grade_6_english_book/grade_6_english_book_page_64/grade_6_english_book.pdf_page_64.png'),
  65: require('@/data/grade_6_english_book/grade_6_english_book_page_65/grade_6_english_book.pdf_page_65.png'),
  66: require('@/data/grade_6_english_book/grade_6_english_book_page_66/grade_6_english_book.pdf_page_66.png'),
  67: require('@/data/grade_6_english_book/grade_6_english_book_page_67/grade_6_english_book.pdf_page_67.png'),
  68: require('@/data/grade_6_english_book/grade_6_english_book_page_68/grade_6_english_book.pdf_page_68.png'),
  69: require('@/data/grade_6_english_book/grade_6_english_book_page_69/grade_6_english_book.pdf_page_69.png'),
  70: require('@/data/grade_6_english_book/grade_6_english_book_page_70/grade_6_english_book.pdf_page_70.png'),
  71: require('@/data/grade_6_english_book/grade_6_english_book_page_71/grade_6_english_book.pdf_page_71.png'),
  72: require('@/data/grade_6_english_book/grade_6_english_book_page_72/grade_6_english_book.pdf_page_72.png'),
  73: require('@/data/grade_6_english_book/grade_6_english_book_page_73/grade_6_english_book.pdf_page_73.png'),
  74: require('@/data/grade_6_english_book/grade_6_english_book_page_74/grade_6_english_book.pdf_page_74.png'),
  75: require('@/data/grade_6_english_book/grade_6_english_book_page_75/grade_6_english_book.pdf_page_75.png'),
  76: require('@/data/grade_6_english_book/grade_6_english_book_page_76/grade_6_english_book.pdf_page_76.png'),
  77: require('@/data/grade_6_english_book/grade_6_english_book_page_77/grade_6_english_book.pdf_page_77.png'),
  78: require('@/data/grade_6_english_book/grade_6_english_book_page_78/grade_6_english_book.pdf_page_78.png'),
  79: require('@/data/grade_6_english_book/grade_6_english_book_page_79/grade_6_english_book.pdf_page_79.png'),
  80: require('@/data/grade_6_english_book/grade_6_english_book_page_80/grade_6_english_book.pdf_page_80.png'),
  81: require('@/data/grade_6_english_book/grade_6_english_book_page_81/grade_6_english_book.pdf_page_81.png'),
  82: require('@/data/grade_6_english_book/grade_6_english_book_page_82/grade_6_english_book.pdf_page_82.png'),
  83: require('@/data/grade_6_english_book/grade_6_english_book_page_83/grade_6_english_book.pdf_page_83.png'),
  84: require('@/data/grade_6_english_book/grade_6_english_book_page_84/grade_6_english_book.pdf_page_84.png'),
  85: require('@/data/grade_6_english_book/grade_6_english_book_page_85/grade_6_english_book.pdf_page_85.png'),
  86: require('@/data/grade_6_english_book/grade_6_english_book_page_86/grade_6_english_book.pdf_page_86.png'),
  87: require('@/data/grade_6_english_book/grade_6_english_book_page_87/grade_6_english_book.pdf_page_87.png'),
  88: require('@/data/grade_6_english_book/grade_6_english_book_page_88/grade_6_english_book.pdf_page_88.png'),
  89: require('@/data/grade_6_english_book/grade_6_english_book_page_89/grade_6_english_book.pdf_page_89.png'),
  90: require('@/data/grade_6_english_book/grade_6_english_book_page_90/grade_6_english_book.pdf_page_90.png'),
  91: require('@/data/grade_6_english_book/grade_6_english_book_page_91/grade_6_english_book.pdf_page_91.png'),
  92: require('@/data/grade_6_english_book/grade_6_english_book_page_92/grade_6_english_book.pdf_page_92.png'),
  93: require('@/data/grade_6_english_book/grade_6_english_book_page_93/grade_6_english_book.pdf_page_93.png'),
  94: require('@/data/grade_6_english_book/grade_6_english_book_page_94/grade_6_english_book.pdf_page_94.png'),
  95: require('@/data/grade_6_english_book/grade_6_english_book_page_95/grade_6_english_book.pdf_page_95.png'),
  96: require('@/data/grade_6_english_book/grade_6_english_book_page_96/grade_6_english_book.pdf_page_96.png'),
  97: require('@/data/grade_6_english_book/grade_6_english_book_page_97/grade_6_english_book.pdf_page_97.png'),
  98: require('@/data/grade_6_english_book/grade_6_english_book_page_98/grade_6_english_book.pdf_page_98.png'),
  99: require('@/data/grade_6_english_book/grade_6_english_book_page_99/grade_6_english_book.pdf_page_99.png'),
  100: require('@/data/grade_6_english_book/grade_6_english_book_page_100/grade_6_english_book.pdf_page_100.png'),
  101: require('@/data/grade_6_english_book/grade_6_english_book_page_101/grade_6_english_book.pdf_page_101.png'),
  102: require('@/data/grade_6_english_book/grade_6_english_book_page_102/grade_6_english_book.pdf_page_102.png'),
  103: require('@/data/grade_6_english_book/grade_6_english_book_page_103/grade_6_english_book.pdf_page_103.png'),
  104: require('@/data/grade_6_english_book/grade_6_english_book_page_104/grade_6_english_book.pdf_page_104.png'),
  105: require('@/data/grade_6_english_book/grade_6_english_book_page_105/grade_6_english_book.pdf_page_105.png'),
  106: require('@/data/grade_6_english_book/grade_6_english_book_page_106/grade_6_english_book.pdf_page_106.png'),
  107: require('@/data/grade_6_english_book/grade_6_english_book_page_107/grade_6_english_book.pdf_page_107.png'),
  108: require('@/data/grade_6_english_book/grade_6_english_book_page_108/grade_6_english_book.pdf_page_108.png'),
  109: require('@/data/grade_6_english_book/grade_6_english_book_page_109/grade_6_english_book.pdf_page_109.png'),
  110: require('@/data/grade_6_english_book/grade_6_english_book_page_110/grade_6_english_book.pdf_page_110.png'),
  111: require('@/data/grade_6_english_book/grade_6_english_book_page_111/grade_6_english_book.pdf_page_111.png'),
  112: require('@/data/grade_6_english_book/grade_6_english_book_page_112/grade_6_english_book.pdf_page_112.png'),
  113: require('@/data/grade_6_english_book/grade_6_english_book_page_113/grade_6_english_book.pdf_page_113.png'),
  114: require('@/data/grade_6_english_book/grade_6_english_book_page_114/grade_6_english_book.pdf_page_114.png'),
  115: require('@/data/grade_6_english_book/grade_6_english_book_page_115/grade_6_english_book.pdf_page_115.png'),
  116: require('@/data/grade_6_english_book/grade_6_english_book_page_116/grade_6_english_book.pdf_page_116.png'),
  117: require('@/data/grade_6_english_book/grade_6_english_book_page_117/grade_6_english_book.pdf_page_117.png'),
  118: require('@/data/grade_6_english_book/grade_6_english_book_page_118/grade_6_english_book.pdf_page_118.png'),
  119: require('@/data/grade_6_english_book/grade_6_english_book_page_119/grade_6_english_book.pdf_page_119.png'),
  120: require('@/data/grade_6_english_book/grade_6_english_book_page_120/grade_6_english_book.pdf_page_120.png'),
  121: require('@/data/grade_6_english_book/grade_6_english_book_page_121/grade_6_english_book.pdf_page_121.png'),
  122: require('@/data/grade_6_english_book/grade_6_english_book_page_122/grade_6_english_book.pdf_page_122.png'),
  123: require('@/data/grade_6_english_book/grade_6_english_book_page_123/grade_6_english_book.pdf_page_123.png'),
  124: require('@/data/grade_6_english_book/grade_6_english_book_page_124/grade_6_english_book.pdf_page_124.png'),
  125: require('@/data/grade_6_english_book/grade_6_english_book_page_125/grade_6_english_book.pdf_page_125.png'),
  126: require('@/data/grade_6_english_book/grade_6_english_book_page_126/grade_6_english_book.pdf_page_126.png'),
  127: require('@/data/grade_6_english_book/grade_6_english_book_page_127/grade_6_english_book.pdf_page_127.png'),
  128: require('@/data/grade_6_english_book/grade_6_english_book_page_128/grade_6_english_book.pdf_page_128.png'),
  129: require('@/data/grade_6_english_book/grade_6_english_book_page_129/grade_6_english_book.pdf_page_129.png'),
  130: require('@/data/grade_6_english_book/grade_6_english_book_page_130/grade_6_english_book.pdf_page_130.png'),
  131: require('@/data/grade_6_english_book/grade_6_english_book_page_131/grade_6_english_book.pdf_page_131.png'),
  132: require('@/data/grade_6_english_book/grade_6_english_book_page_132/grade_6_english_book.pdf_page_132.png'),
  133: require('@/data/grade_6_english_book/grade_6_english_book_page_133/grade_6_english_book.pdf_page_133.png'),
  134: require('@/data/grade_6_english_book/grade_6_english_book_page_134/grade_6_english_book.pdf_page_134.png'),
  135: require('@/data/grade_6_english_book/grade_6_english_book_page_135/grade_6_english_book.pdf_page_135.png'),
};

// Static imports for Grade 7 English Book Unit 1 pages (pages 0-12)
const grade7PageImages = {
  0: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_0/grade_7_english_book_unit_1.pdf_page_0.png'),
  1: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_1/grade_7_english_book_unit_1.pdf_page_1.png'),
  2: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_2/grade_7_english_book_unit_1.pdf_page_2.png'),
  3: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_3/grade_7_english_book_unit_1.pdf_page_3.png'),
  4: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_4/grade_7_english_book_unit_1.pdf_page_4.png'),
  5: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_5/grade_7_english_book_unit_1.pdf_page_5.png'),
  6: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_6/grade_7_english_book_unit_1.pdf_page_6.png'),
  7: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_7/grade_7_english_book_unit_1.pdf_page_7.png'),
  8: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_8/grade_7_english_book_unit_1.pdf_page_8.png'),
  9: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_9/grade_7_english_book_unit_1.pdf_page_9.png'),
  10: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_10/grade_7_english_book_unit_1.pdf_page_10.png'),
  11: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_11/grade_7_english_book_unit_1.pdf_page_11.png'),
  12: require('@/data/grade_7_english_book_unit_1/grade_7_english_book_unit_1_page_12/grade_7_english_book_unit_1.pdf_page_12.png'),
};

// Generate pages for Grade 5 English Book using static imports with dynamic blocks
const generateGrade5Pages = () => {
  const availablePages = Object.keys(grade5PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade5PageImages[pageNumber as keyof typeof grade5PageImages],
    blocks: generateBlocksForPage(pageNumber, 'Grade 5 English Book')
  }));
};

// Generate pages for Grade 6 English Book using static imports with dynamic blocks
const generateGrade6Pages = () => {
  const availablePages = Object.keys(grade6PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade6PageImages[pageNumber as keyof typeof grade6PageImages],
    blocks: generateBlocksForPage(pageNumber, 'Grade 6 English Book')
  }));
};

// Generate pages for Grade 7 English Book Unit 1 using static imports with dynamic blocks
const generateGrade7Pages = () => {
  const availablePages = Object.keys(grade7PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade7PageImages[pageNumber as keyof typeof grade7PageImages],
    blocks: generateBlocksForPage(pageNumber, 'Grade 7 English Book Unit 1')
  }));
};

const generateBlocksForPage = (pageNumber: number, bookTitle: string) => {
  try {
    const trimmedBlocksService = TrimmedBlocksDataService.getInstance();
    const pageData = trimmedBlocksService.getTrimmedBlocksForPage(pageNumber, bookTitle);
    
    if (!pageData) {
      console.warn(`[generateBlocksForPage] No trimmed block data found for page ${pageNumber} in ${bookTitle}`);
      return [];
    }

    // Convert the block data to the format expected by the app
    const blocks = [];
    for (const [blockId, blockInfo] of Object.entries(pageData)) {
      if (blockInfo && (blockInfo as any).text && (blockInfo as any).text.trim()) {
        // Store page and block info so TTS service can dynamically load audio using AudioResolver
        const block = {
          id: parseInt(blockId),
          text: (blockInfo as any).text,
          audio: null, // Audio resolved dynamically by AudioResolver
          pageNumber: pageNumber,
          blockId: parseInt(blockId)
        };
        blocks.push(block);
      }
    }
    
    return blocks;
  } catch (error) {
    console.warn(`[generateBlocksForPage] Error generating blocks for page ${pageNumber} in ${bookTitle}:`, error);
    return [];
  }
};

// Generate pages for Demo Book using static imports with dynamic blocks
const generateDemoPages = () => {
  const availablePages = Object.keys(demoPageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: demoPageImages[pageNumber as keyof typeof demoPageImages],
    blocks: generateBlocksForPage(pageNumber, 'Demo Book')
  }));
};

// Generate pages for Grade 3 English Book using static imports with dynamic blocks
const generateGrade3Pages = () => {
  const availablePages = Object.keys(grade3PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade3PageImages[pageNumber as keyof typeof grade3PageImages],
    blocks: generateBlocksForPage(pageNumber, 'Grade 3 English Book')
  }));
};



// Generate pages for Grade 4 English Book using static imports with dynamic blocks
const generateGrade4Pages = () => {
  const availablePages = Object.keys(grade4PageImages).map(Number).sort((a, b) => a - b);
  return availablePages.map(pageNumber => ({
    pageNumber,
    image: grade4PageImages[pageNumber as keyof typeof grade4PageImages],
    blocks: generateBlocksForPage(pageNumber, 'Grade 4 English Book')
  }));
};

export const getAllBooks = (): Book[] => {
  return [
    {
      id: 0,
      title: 'Demo Book',
      author: 'Right to Read',
      backgroundColor: '#FF6B6B',
      hasData: true,
      tableOfContents: [
        {
          id: 'demo-page-0',
          title: 'Page 0',
          pageNumber: 0,
          navigationPageNumber: 0
        },
        {
          id: 'demo-page-1',
          title: 'Page 1',
          pageNumber: 1,
          navigationPageNumber: 1
        },
        {
          id: 'demo-page-2',
          title: 'Page 2',
          pageNumber: 2,
          navigationPageNumber: 2
        }
      ],
      pages: generateDemoPages()
    },
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
          id: 'my-family-and-friends',
          title: 'My family and friends',
          pageNumber: 1,
          navigationPageNumber: 10
        },
        {
          id: 'our-beautiful-garden',
          title: 'Our beautiful garden',
          pageNumber: 11,
          navigationPageNumber: 20
        },
        {
          id: 'places-around-me',
          title: 'Places around me',
          pageNumber: 23,
          navigationPageNumber: 32
        },
        {
          id: 'joy-of-work',
          title: 'Joy of work',
          pageNumber: 34,
          navigationPageNumber: 43
        },
        {
          id: 'our-festivals',
          title: 'Our festivals',
          pageNumber: 42,
          navigationPageNumber: 51
        },
        {
          id: 'lets-go-shopping',
          title: 'Let\'s go shopping',
          pageNumber: 53,
          navigationPageNumber: 62
        },
        {
          id: 'my-calendar',
          title: 'My calendar',
          pageNumber: 67,
          navigationPageNumber: 76
        },
        {
          id: 'playing-games',
          title: 'Playing games',
          pageNumber: 79,
          navigationPageNumber: 88
        },
        {
          id: 'good-practices',
          title: 'Good practices',
          pageNumber: 89,
          navigationPageNumber: 98
        },
        {
          id: 'happy-days',
          title: 'Happy days',
          pageNumber: 102,
          navigationPageNumber: 111
        }
      ],
      pages: generateGrade4Pages()
    },
    {
      id: 3,
      title: 'Grade 5 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#9013FE',
      hasData: true,
      tableOfContents: [
        {
          id: 'unit-1',
          title: 'Unit 1',
          pageNumber: 1,
          navigationPageNumber: 10
        },
        {
          id: 'unit-2',
          title: 'Unit 2',
          pageNumber: 21,
          navigationPageNumber: 30
        },
        {
          id: 'unit-3',
          title: 'Unit 3',
          pageNumber: 41,
          navigationPageNumber: 50
        },
        {
          id: 'unit-4',
          title: 'Unit 4',
          pageNumber: 61,
          navigationPageNumber: 70
        },
        {
          id: 'unit-5',
          title: 'Unit 5',
          pageNumber: 81,
          navigationPageNumber: 90
        },
        {
          id: 'unit-6',
          title: 'Unit 6',
          pageNumber: 101,
          navigationPageNumber: 110
        },
        {
          id: 'unit-7',
          title: 'Unit 7',
          pageNumber: 121,
          navigationPageNumber: 130
        },
        {
          id: 'unit-8',
          title: 'Unit 8',
          pageNumber: 141,
          navigationPageNumber: 150
        }
      ],
      pages: generateGrade5Pages()
    },
    {
      id: 4,
      title: 'Grade 6 English Book',
      author: 'Ministry of Education',
      backgroundColor: '#F5A623',
      hasData: true,
      tableOfContents: [
        {
          id: 'unit-1',
          title: 'Unit 1',
          pageNumber: 5,
          navigationPageNumber: 14
        },
        {
          id: 'unit-2',
          title: 'Unit 2',
          pageNumber: 21,
          navigationPageNumber: 30
        },
        {
          id: 'unit-3',
          title: 'Unit 3',
          pageNumber: 37,
          navigationPageNumber: 46
        },
        {
          id: 'unit-4',
          title: 'Unit 4',
          pageNumber: 53,
          navigationPageNumber: 62
        },
        {
          id: 'unit-5',
          title: 'Unit 5',
          pageNumber: 69,
          navigationPageNumber: 78
        },
        {
          id: 'unit-6',
          title: 'Unit 6',
          pageNumber: 85,
          navigationPageNumber: 94
        },
        {
          id: 'unit-7',
          title: 'Unit 7',
          pageNumber: 101,
          navigationPageNumber: 110
        },
        {
          id: 'unit-8',
          title: 'Unit 8',
          pageNumber: 117,
          navigationPageNumber: 126
        }
      ],
      pages: generateGrade6Pages()
    },
    {
      id: 5,
      title: 'Grade 7 English Book Unit 1',
      author: 'Ministry of Education',
      backgroundColor: '#50C878',
      hasData: true,
      tableOfContents: [
        {
          id: 'unit-1',
          title: 'Unit 1',
          pageNumber: 0,
          navigationPageNumber: 0
        }
      ],
      pages: generateGrade7Pages()
    },
  ];
};

