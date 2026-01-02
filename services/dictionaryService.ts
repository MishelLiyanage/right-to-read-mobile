import { WordDefinition } from '@/types/book';
import { ImagePreloadService } from './imagePreloadService';

interface LocalDictionaryEntry {
  word: string;
  type: string;
  sinhala_translation: string;
  tamil_translation: string;
  simple_definition: string;
  contexts: string[];
}

interface LocalDictionary {
  book_name: string;
  generated_timestamp: string;
  total_words: number;
  dictionary: LocalDictionaryEntry[];
}

export class DictionaryService {
  private static instance: DictionaryService;
  private cache: Map<string, WordDefinition[]> = new Map();
  private dictionaryCache: Map<string, LocalDictionary> = new Map();
  // Commented out API code - now using local dictionary files
  // private baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';
  private imagePreloadService = ImagePreloadService.getInstance();

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  async lookupWord(word: string, pageNumber?: number, bookTitle?: string): Promise<WordDefinition[]> {
    const normalizedWord = word.toLowerCase().trim();
    const cacheKey = `${bookTitle || 'default'}_${normalizedWord}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      console.log(`Dictionary cache hit for: ${normalizedWord}`);
      return this.cache.get(cacheKey)!;
    }

    try {
      console.log(`Looking up definition for: ${normalizedWord} in book: ${bookTitle}`);
      
      // Load the appropriate dictionary file
      const dictionary = await this.loadDictionaryForBook(bookTitle);
      
      // Find the word in the local dictionary
      const localEntry = dictionary.dictionary.find(entry => 
        entry.word.toLowerCase() === normalizedWord
      );
      
      if (!localEntry) {
        throw new Error(`"${word}" not found in the dictionary for this book`);
      }
      
      // Convert local dictionary entry to WordDefinition format
      const definitions = this.parseLocalEntry(localEntry);
      
      // Add preloaded image if available
      if (pageNumber !== undefined) {
        const cachedImageUrl = this.imagePreloadService.getCachedImage(pageNumber, normalizedWord);
        if (cachedImageUrl) {
          definitions.forEach(definition => {
            definition.imageUrl = cachedImageUrl;
          });
        }
      }
      
      // Cache the result
      this.cache.set(cacheKey, definitions);
      
      return definitions;
    } catch (error) {
      console.error(`Dictionary lookup failed for "${word}":`, error);
      throw error;
    }
  }

  private async loadDictionaryForBook(bookTitle?: string): Promise<LocalDictionary> {
    // Default to Grade 3 English Book if no book title provided
    const bookName = this.getBookFolderName(bookTitle);
    
    // Check dictionary cache first
    if (this.dictionaryCache.has(bookName)) {
      return this.dictionaryCache.get(bookName)!;
    }

    try {
      // Load the dictionary file using static imports
      let dictionary: LocalDictionary;
      
      switch (bookName) {
        case 'demo_book':
          // For demo book, use grade 3 dictionary as fallback
          dictionary = require('@/data/grade_3_english_book/grade_3_english_book_dictionary.json');
          break;
        case 'grade_3_english_book':
          dictionary = require('@/data/grade_3_english_book/grade_3_english_book_dictionary.json');
          break;
        case 'grade_4_english_book':
          dictionary = require('@/data/grade_4_english_book/grade_4_english_book_dictionary.json');
          break;
        case 'grade_5_english_book':
          dictionary = require('@/data/grade_5_english_book/grade_5_english_book_dictionary.json');
          break;
        default:
          dictionary = require('@/data/grade_3_english_book/grade_3_english_book_dictionary.json');
          break;
      }
      
      // Cache the dictionary
      this.dictionaryCache.set(bookName, dictionary);
      
      return dictionary;
    } catch (error) {
      console.error(`Failed to load dictionary for ${bookName}:`, error);
      throw new Error(`Dictionary file not found for "${bookTitle}"`);
    }
  }

  private getBookFolderName(bookTitle?: string): string {
    if (!bookTitle) return 'grade_3_english_book';
    
    // Map book titles to folder names
    if (bookTitle.toLowerCase().includes('demo') || bookTitle.toLowerCase().replace(/\s+/g, '_').includes('demo_book')) {
      return 'demo_book';
    }
    if (bookTitle.toLowerCase().includes('grade 3') || bookTitle.toLowerCase().includes('grade_3')) {
      return 'grade_3_english_book';
    }
    if (bookTitle.toLowerCase().includes('grade 4') || bookTitle.toLowerCase().includes('grade_4')) {
      return 'grade_4_english_book';
    }
    if (bookTitle.toLowerCase().includes('grade 5') || bookTitle.toLowerCase().includes('grade_5')) {
      return 'grade_5_english_book';
    }
    if (bookTitle.toLowerCase().includes('grade 6') || bookTitle.toLowerCase().includes('grade_6')) {
      return 'grade_6_english_book';
    }
    if (bookTitle.toLowerCase().includes('grade 7') || bookTitle.toLowerCase().includes('grade_7')) {
      return 'grade_7_english_book_unit_1';
    }
    
    // Default to grade 3
    return 'grade_3_english_book';
  }

  private parseLocalEntry(entry: LocalDictionaryEntry): WordDefinition[] {
    return [{
      word: entry.word,
      meanings: [{
        partOfSpeech: entry.type,
        definitions: [{
          definition: entry.simple_definition,
          example: entry.contexts && entry.contexts.length > 0 ? entry.contexts[0] : undefined,
          // Add custom fields for translations
          sinhala_translation: entry.sinhala_translation,
          tamil_translation: entry.tamil_translation
        }]
      }]
    }];
  }

  // Commented out - API response parser no longer needed
  // private parseApiResponse(data: any[]): WordDefinition[] {
  //   return data.map(entry => ({
  //     word: entry.word,
  //     phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
  //     meanings: entry.meanings.map((meaning: any) => ({
  //       partOfSpeech: meaning.partOfSpeech,
  //       definitions: meaning.definitions.map((def: any) => ({
  //         definition: def.definition,
  //         example: def.example
  //       }))
  //     }))
  //   }));
  // }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}