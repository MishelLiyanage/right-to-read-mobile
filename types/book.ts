export interface Book {
  id: number;
  title: string;
  author: string;
  backgroundColor: string;
  pages?: BookPage[];
  hasData?: boolean;
  tableOfContents?: TableOfContentsSection[];
}

export interface TableOfContentsSection {
  id: string;
  title: string;
  pageNumber: number;
  navigationPageNumber?: number; // The actual page to navigate to (if different from displayed pageNumber)
  description?: string;
}

export interface BookPage {
  pageNumber: number;
  image: any; // require() result
  blocks?: TextBlock[];
  blocksData?: any; // The full blocks JSON data
  trimmedBlocksData?: any; // The trimmed blocks JSON data
}

export interface TextBlock {
  id: number;
  text: string;
  audio: any; // require() result or audio path string for dynamic loading
  pageNumber?: number; // For dynamic audio loading
  blockId?: number; // For dynamic audio loading
  speechMarks?: SpeechMark[];
  words?: string[];
  boundingBoxes?: number[][][]; // Array of bounding boxes for each word
  ssml?: string;
  dialog?: string;
  personType?: string;
  timing?: WordTiming[];
}

export interface WordTiming {
  time: number;
  type: string;
  start: number;
  end: number;
  value: string;
}

export interface SpeechMark {
  time: number;
  type: string;
  start: number;
  end: number;
  value: string;
}

export interface WordDefinition {
  word: string;
  phonetic?: string;
  meanings: WordMeaning[];
  imageUrl?: string;
}

export interface WordMeaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
    sinhala_translation?: string;
    tamil_translation?: string;
  }[];
}

export interface DictionaryEntry {
  word: string;
  definitions: WordDefinition[];
  isLoading?: boolean;
  error?: string;
}
