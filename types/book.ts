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
  description?: string;
}

export interface BookPage {
  pageNumber: number;
  image: any; // require() result
  blocks?: TextBlock[];
}

export interface TextBlock {
  id: number;
  text: string;
  audio: any; // require() result
  speechMarks?: SpeechMark[];
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
}

export interface WordMeaning {
  partOfSpeech: string;
  definitions: {
    definition: string;
    example?: string;
  }[];
}

export interface DictionaryEntry {
  word: string;
  definitions: WordDefinition[];
  isLoading?: boolean;
  error?: string;
}
