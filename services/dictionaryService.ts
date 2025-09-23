import { WordDefinition } from '@/types/book';

export class DictionaryService {
  private static instance: DictionaryService;
  private cache: Map<string, WordDefinition[]> = new Map();
  private baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  async lookupWord(word: string): Promise<WordDefinition[]> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(normalizedWord)) {
      console.log(`Dictionary cache hit for: ${normalizedWord}`);
      return this.cache.get(normalizedWord)!;
    }

    try {
      console.log(`Fetching definition for: ${normalizedWord}`);
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(normalizedWord)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No definition found for "${word}"`);
        }
        throw new Error(`Dictionary API error: ${response.status}`);
      }

      const data = await response.json();
      const definitions = this.parseApiResponse(data);
      
      // Cache the result
      this.cache.set(normalizedWord, definitions);
      
      return definitions;
    } catch (error) {
      console.error(`Dictionary lookup failed for "${word}":`, error);
      throw error;
    }
  }

  private parseApiResponse(data: any[]): WordDefinition[] {
    return data.map(entry => ({
      word: entry.word,
      phonetic: entry.phonetic || entry.phonetics?.[0]?.text,
      meanings: entry.meanings.map((meaning: any) => ({
        partOfSpeech: meaning.partOfSpeech,
        definitions: meaning.definitions.map((def: any) => ({
          definition: def.definition,
          example: def.example
        }))
      }))
    }));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}