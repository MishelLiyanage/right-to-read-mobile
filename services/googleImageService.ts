export interface GoogleImageResult {
  url: string;
  width?: number;
  height?: number;
  thumbnailUrl?: string;
}

/**
 * A simple service to search Google Images (vector/clipart) using Custom Search API
 */
export class GoogleImageService {
  private static instance: GoogleImageService;
  private cache = new Map<string, string>();

  // 🔑 Replace these with your actual credentials
  private readonly API_KEY = "AIzaSyC6jx0h3inM3BLHuK1-WMSHLwv7RbIcL1w";
  private readonly SEARCH_ENGINE_ID = "b55cd7b0c6fb748bc";
  private readonly BASE_URL = "https://www.googleapis.com/customsearch/v1";

  static getInstance(): GoogleImageService {
    if (!GoogleImageService.instance) {
      GoogleImageService.instance = new GoogleImageService();
    }
    return GoogleImageService.instance;
  }

  /**
   * Builds the search URL for Google Custom Search API
   */
  private buildSearchUrl(word: string): string {
    const query = `${word} vector`;
    const params = new URLSearchParams({
      q: query,
      searchType: "image",
      fileType: "svg",
      imgType: "clipart",
      key: this.API_KEY,
      cx: this.SEARCH_ENGINE_ID,
      safe: "active",
      num: "3", // you can adjust number of results if needed
    });
    return `${this.BASE_URL}?${params.toString()}`;
  }

  /**
   * Fetches image URL for the given word
   */
  async searchImage(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase().trim();

    // ✅ Return from cache if available
    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord)!;
    }

    try {
      const url = this.buildSearchUrl(normalizedWord);
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Google Image Search failed for "${word}"`);
        return null;
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const firstItem = data.items[0];
        const imageUrl = firstItem.link;

        // ✅ Cache it for next time
        this.cache.set(normalizedWord, imageUrl);

        return imageUrl;
      } else {
        console.warn(`No images found for "${word}"`);
        return null;
      }
    } catch (error) {
      console.error(`Error searching image for "${word}":`, error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
