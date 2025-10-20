import { TrimmedBlocksDataService } from '@/services/trimmedBlocksDataService';
import { Book } from '@/types/book';

// Static imports for Grade 3 English Book pages (pages 10-137)
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
  137: require('@/data/grade_3_english_book/grade_3_english_book_page_137/grade_3_english_book.pdf_page_137.png'),
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
const generateBlocksForPage = (pageNumber: number, bookTitle: string) => {
  try {
    const trimmedBlocksService = TrimmedBlocksDataService.getInstance();
    const pageData = trimmedBlocksService.getTrimmedBlocksForPage(pageNumber, bookTitle);
    
    if (!pageData) {
      console.warn(`No trimmed block data found for page ${pageNumber} in ${bookTitle}`);
      return [];
    }

    // Convert the block data to the format expected by the app
    const blocks = [];
    for (const [blockId, blockInfo] of Object.entries(pageData)) {
      if (blockInfo && (blockInfo as any).text && (blockInfo as any).text.trim()) {
        // Store page and block info so TTS service can dynamically load audio using AudioResolver
        blocks.push({
          id: parseInt(blockId),
          text: (blockInfo as any).text,
          audio: null, // Audio resolved dynamically by AudioResolver
          pageNumber: pageNumber,
          blockId: parseInt(blockId)
        });
      }
    }
    
    return blocks;
  } catch (error) {
    console.warn(`Error generating blocks for page ${pageNumber} in ${bookTitle}:`, error);
    return [];
  }
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
      pages: generateGrade4Pages()
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
