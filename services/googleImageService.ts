export interface GoogleImageResult {
  url: string;
  width: number;
  height: number;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export class GoogleImageService {
  private static instance: GoogleImageService;
  private cache: Map<string, string> = new Map();
  
  // Note: In a production app, you would need to:
  // 1. Get a Google Custom Search API key from Google Cloud Console
  // 2. Create a Custom Search Engine ID
  // 3. Store these securely (not in the code)
  // For now, using a placeholder that would need to be replaced with actual credentials
  private readonly API_KEY = 'AIzaSyC6jx0h3inM3BLHuK1-WMSHLwv7RbIcL1w'; // Replace with actual API key
  private readonly SEARCH_ENGINE_ID = 'b55cd7b0c6fb748bc'; // Replace with actual CSE ID
  private readonly BASE_URL = 'https://www.googleapis.com/customsearch/v1';

  static getInstance(): GoogleImageService {
    if (!GoogleImageService.instance) {
      GoogleImageService.instance = new GoogleImageService();
    }
    return GoogleImageService.instance;
  }

  async searchImage(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(normalizedWord)) {
      console.log(`Image cache hit for: ${normalizedWord}`);
      return this.cache.get(normalizedWord)!;
    }

    try {
      console.log(`Searching image for: ${normalizedWord}`);
      
      // Create search query optimized for educational content
      const searchQuery = `${normalizedWord} simple illustration PNG`;
      const url = `${this.BASE_URL}?key=${this.API_KEY}&cx=${this.SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&imgSize=medium&imgType=photo&safe=active&num=5&fileType=png,jpg`;
      
      console.log(`Making Google Image API request for: ${normalizedWord}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Google Image API error: ${response.status} ${response.statusText}`);
        // Fallback to placeholder on API error
        const randomSeed = Math.abs(normalizedWord.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
        const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/80/80`;
        this.cache.set(normalizedWord, fallbackUrl);
        return fallbackUrl;
      }

      const data = await response.json();
      console.log(`Google API response for "${normalizedWord}":`, data);
      
      if (data.items && data.items.length > 0) {
        // Filter and select the best image from results
        const validImages = data.items.filter((item: any) => {
          if (!item.link || !item.mime) return false;
          
          // Only accept common image formats
          const acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
          if (!acceptedFormats.includes(item.mime.toLowerCase())) return false;
          
          // Avoid problematic domains that might have loading issues
          const problematicDomains = ['shutterstock.com', 'gettyimages.com', 'istockphoto.com'];
          const domain = new URL(item.link).hostname.toLowerCase();
          if (problematicDomains.some(pd => domain.includes(pd))) return false;
          
          // Prefer direct image URLs (ending with image extensions)
          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
          const hasImageExtension = imageExtensions.some(ext => item.link.toLowerCase().includes(ext));
          
          return hasImageExtension;
        });
        
        if (validImages.length > 0) {
          // Select best image based on aspect ratio
          let selectedImage = validImages[0];
          
          for (const item of validImages as any[]) {
            if (item.image && item.image.width && item.image.height) {
              const aspectRatio = item.image.width / item.image.height;
              if (aspectRatio >= 0.75 && aspectRatio <= 1.5) {
                selectedImage = item;
                break;
              }
            }
          }
          
          const imageUrl = selectedImage.link;
          console.log(`Selected valid image for "${normalizedWord}": ${imageUrl}`);
          this.cache.set(normalizedWord, imageUrl);
          return imageUrl;
        } else {
          console.log(`No valid images found for "${normalizedWord}", using fallback`);
          // Fallback to placeholder if no valid images
          const randomSeed = Math.abs(normalizedWord.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
          const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/80/80`;
          this.cache.set(normalizedWord, fallbackUrl);
          return fallbackUrl;
        }
      } else {
        console.log(`No images found for "${normalizedWord}"`);
        // Fallback to placeholder if no results
        const randomSeed = Math.abs(normalizedWord.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
        const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/80/80`;
        this.cache.set(normalizedWord, fallbackUrl);
        return fallbackUrl;
      }

    } catch (error) {
      console.error(`Image search failed for "${word}":`, error);
      // Fallback to placeholder on any error
      const randomSeed = Math.abs(normalizedWord.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
      const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/80/80`;
      this.cache.set(normalizedWord, fallbackUrl);
      return fallbackUrl;
    }
  }

  private async isImageUrlValid(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok && (response.headers.get('content-type')?.startsWith('image/') || false);
    } catch (error) {
      return false;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}