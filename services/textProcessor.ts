import { TextBlock } from '@/types/book';

export class TextProcessor {
  private static commonWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'we', 'you', 'your', 'i', 'me', 'my',
    'they', 'them', 'their', 'she', 'her', 'him', 'his', 'this', 'these',
    'those', 'that', 'what', 'where', 'when', 'why', 'how', 'but', 'or',
    'if', 'so', 'can', 'could', 'would', 'should', 'may', 'might', 'must',
    'shall', 'do', 'did', 'does', 'have', 'had', 'having', 'been', 'being',
    'there', 'here', 'then', 'than', 'now', 'up', 'down', 'out', 'off',
    'over', 'under', 'into', 'onto', 'upon'
  ]);

  static extractWordsFromBlocks(blocks: TextBlock[], includeCommonWords: boolean = false): string[] {
    const allWords = new Set<string>();
    
    blocks.forEach(block => {
      if (block.text) {
        const words = this.extractWordsFromText(block.text, includeCommonWords);
        words.forEach(word => allWords.add(word));
      }
    });

    // Convert to array and sort by likelihood of being nouns
    const wordsArray = Array.from(allWords);
    
    // Sort words prioritizing potential nouns:
    // 1. Capitalized words (proper nouns)
    // 2. Longer words (more likely to be nouns)
    // 3. Alphabetically
    return wordsArray.sort((a, b) => {
      const aCapitalized = /^[A-Z]/.test(a);
      const bCapitalized = /^[A-Z]/.test(b);
      
      // Prioritize capitalized words
      if (aCapitalized && !bCapitalized) return -1;
      if (!aCapitalized && bCapitalized) return 1;
      
      // Then by length (longer words more likely to be nouns)
      if (a.length !== b.length) return b.length - a.length;
      
      // Finally alphabetically
      return a.localeCompare(b, undefined, { sensitivity: 'base' });
    });
  }

  static extractWordsFromText(text: string, includeCommonWords: boolean = false): string[] {
    if (!text) return [];

    // Remove punctuation and split into words
    const words = text
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ') // Keep apostrophes for contractions
      .split(/\s+/)
      .filter(word => word.length > 1) // Filter out single characters
      .map(word => word.trim())
      .filter(word => word.length > 0);

    if (includeCommonWords) {
      return [...new Set(words)]; // Remove duplicates
    }

    // Filter out common words
    return [...new Set(words.filter(word => !this.commonWords.has(word)))];
  }

  static isWordInBlocks(word: string, blocks: TextBlock[]): boolean {
    const normalizedWord = word.toLowerCase().replace(/[^\w]/g, '');
    
    return blocks.some(block => {
      if (!block.text) return false;
      
      const blockWords = this.extractWordsFromText(block.text, true);
      return blockWords.some(blockWord => 
        blockWord.replace(/[^\w]/g, '') === normalizedWord
      );
    });
  }

  static getWordFrequency(blocks: TextBlock[]): Map<string, number> {
    const frequency = new Map<string, number>();
    
    blocks.forEach(block => {
      if (block.text) {
        const words = this.extractWordsFromText(block.text, true);
        words.forEach(word => {
          frequency.set(word, (frequency.get(word) || 0) + 1);
        });
      }
    });

    return frequency;
  }

  static filterWordsByLength(words: string[], minLength: number = 3, maxLength: number = 20): string[] {
    return words.filter(word => word.length >= minLength && word.length <= maxLength);
  }

  static limitWordCount(words: string[], maxWords: number = 50): string[] {
    if (words.length <= maxWords) {
      return words;
    }

    // If there are too many words, prioritize potential nouns
    return words
      .sort((a, b) => {
        // Prioritize capitalized words (proper nouns)
        const aCapitalized = /^[A-Z]/.test(a);
        const bCapitalized = /^[A-Z]/.test(b);
        if (aCapitalized && !bCapitalized) return -1;
        if (!aCapitalized && bCapitalized) return 1;
        
        // Prioritize longer words (more likely to be nouns)
        if (a.length !== b.length) return b.length - a.length;
        
        // Alphabetically
        return a.localeCompare(b);
      })
      .slice(0, maxWords);
  }

  static getPotentialNouns(words: string[]): string[] {
    // Filter for words that are more likely to be nouns
    return words.filter(word => {
      // Skip very short words (less likely to be meaningful nouns)
      if (word.length < 3) return false;
      
      // Include capitalized words (proper nouns)
      if (/^[A-Z]/.test(word)) return true;
      
      // Include longer words (4+ characters, more likely to be nouns)
      if (word.length >= 4) return true;
      
      // Common noun patterns (ending in -ing, -tion, -ness, etc. might be filtered later by API)
      return true;
    });
  }
}