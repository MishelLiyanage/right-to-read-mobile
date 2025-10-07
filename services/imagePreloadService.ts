import { GoogleImageService } from './googleImageService';

export interface WordImageCache {
  [word: string]: string | null;
}

export class ImagePreloadService {
  private static instance: ImagePreloadService;
  private googleImageService = GoogleImageService.getInstance();
  private pageImageCache: Map<number, WordImageCache> = new Map();
  private preloadingPromises: Map<number, Promise<void>> = new Map();
  private isRateLimited = false;

  static getInstance(): ImagePreloadService {
    if (!ImagePreloadService.instance) {
      ImagePreloadService.instance = new ImagePreloadService();
    }
    return ImagePreloadService.instance;
  }

  /**
   * Preload images for all words on a specific page
   */
  async preloadImagesForPage(pageNumber: number, words: string[]): Promise<void> {
    // Skip preloading if we've hit rate limits
    if (this.isRateLimited) {
      console.log(`Skipping image preload for page ${pageNumber} due to rate limits`);
      return;
    }
    
    // If already preloading this page, return the existing promise
    if (this.preloadingPromises.has(pageNumber)) {
      return this.preloadingPromises.get(pageNumber);
    }

    // If already cached, return immediately
    if (this.pageImageCache.has(pageNumber)) {
      console.log(`Image cache hit for page ${pageNumber}`);
      return;
    }

    const preloadPromise = this.performPreload(pageNumber, words);
    this.preloadingPromises.set(pageNumber, preloadPromise);

    try {
      await preloadPromise;
    } finally {
      this.preloadingPromises.delete(pageNumber);
    }
  }

  private async performPreload(pageNumber: number, words: string[]): Promise<void> {
    const imageCache: WordImageCache = {};
    const uniqueWords = [...new Set(words.map(word => word.toLowerCase().trim()))];
    


    // Preload images in batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < uniqueWords.length; i += batchSize) {
      const batch = uniqueWords.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (word) => {
        try {
          const imageUrl = await this.googleImageService.searchImage(word);
          imageCache[word] = imageUrl;
          console.log(`Preloaded image for "${word}": ${imageUrl ? 'success' : 'no image found'}`);
        } catch (error) {
          if (error instanceof Error && error.message.includes('429')) {
            console.warn('Rate limit hit during preloading. Disabling further preloading.');
            this.isRateLimited = true;
          }
          console.error(`Failed to preload image for "${word}":`, error);
          imageCache[word] = null;
        }
      });

      await Promise.all(batchPromises);
      
      // Small delay between batches to be respectful to the API
      if (i + batchSize < uniqueWords.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.pageImageCache.set(pageNumber, imageCache);

  }

  /**
   * Get a cached image URL for a word on a specific page
   */
  getCachedImage(pageNumber: number, word: string): string | null {
    const normalizedWord = word.toLowerCase().trim();
    const pageCache = this.pageImageCache.get(pageNumber);
    
    if (pageCache && pageCache.hasOwnProperty(normalizedWord)) {
      return pageCache[normalizedWord];
    }
    
    return null;
  }

  /**
   * Check if images are preloaded for a specific page
   */
  isPagePreloaded(pageNumber: number): boolean {
    return this.pageImageCache.has(pageNumber);
  }

  /**
   * Check if currently preloading a specific page
   */
  isPreloadingPage(pageNumber: number): boolean {
    return this.preloadingPromises.has(pageNumber);
  }

  /**
   * Clear cache for a specific page
   */
  clearPageCache(pageNumber: number): void {
    this.pageImageCache.delete(pageNumber);
    this.preloadingPromises.delete(pageNumber);
  }

  /**
   * Clear all cached images
   */
  clearAllCache(): void {
    this.pageImageCache.clear();
    this.preloadingPromises.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalPages: number; totalWords: number } {
    let totalWords = 0;
    for (const pageCache of this.pageImageCache.values()) {
      totalWords += Object.keys(pageCache).length;
    }
    
    return {
      totalPages: this.pageImageCache.size,
      totalWords
    };
  }

  /**
   * Reset rate limiting state (call this after some time has passed)
   */
  resetRateLimit(): void {
    this.isRateLimited = false;
    console.log('Rate limit state reset. Image preloading re-enabled.');
  }

  /**
   * Check if currently rate limited
   */
  isCurrentlyRateLimited(): boolean {
    return this.isRateLimited;
  }
}