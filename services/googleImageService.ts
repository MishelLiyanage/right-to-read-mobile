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
  private cache = new Map<string, string | null>();
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

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
   * Add request to queue to respect rate limits
   */
  private async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;

      if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, this.MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }

      const request = this.requestQueue.shift();
      if (request) {
        this.lastRequestTime = Date.now();
        await request();
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Fetches image URL for the given word with rate limiting
   */
  async searchImage(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase().trim();

    // ✅ Return from cache if available
    if (this.cache.has(normalizedWord)) {
      console.log(`Image cache hit for: ${normalizedWord}`);
      return this.cache.get(normalizedWord)!;
    }

    return new Promise((resolve) => {
      const request = async () => {
        try {
          console.log(`Searching image for: ${normalizedWord}`);
          const url = this.buildSearchUrl(normalizedWord);
          const response = await fetch(url);

          if (!response.ok) {
            if (response.status === 429) {
              console.warn(`Rate limit exceeded for Google Image Search. Try again later.`);
              resolve(null);
              return;
            }
            console.error(`Google Image Search failed for "${word}" (${response.status})`);
            resolve(null);
            return;
          }

          const data = await response.json();

          if (data.error) {
            console.error(`Google API Error:`, data.error);
            resolve(null);
            return;
          }

          if (data.items && data.items.length > 0) {
            const firstItem = data.items[0];
            const imageUrl = firstItem.link;

            // ✅ Cache it for next time
            this.cache.set(normalizedWord, imageUrl);
            console.log(`Image found for "${normalizedWord}": ${imageUrl}`);

            resolve(imageUrl);
          } else {
            console.warn(`No images found for "${word}"`);
            this.cache.set(normalizedWord, null); // Cache negative results
            resolve(null);
          }
        } catch (error) {
          console.error(`Error searching image for "${word}":`, error);
          resolve(null);
        }
      };

      this.requestQueue.push(request);
      this.processRequestQueue();
    });
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}
