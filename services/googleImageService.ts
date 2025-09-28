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
  
  // Curated educational images for common words as fallback
  private curatedImages: Map<string, string> = new Map([
    ['friend', 'https://cdn.pixabay.com/photo/2017/01/31/14/32/friendship-2025003_960_720.png'],
    ['happy', 'https://cdn.pixabay.com/photo/2016/12/13/16/03/happy-1904098_960_720.png'],
    ['sad', 'https://cdn.pixabay.com/photo/2017/02/12/12/42/sad-2060050_960_720.png'],
    ['house', 'https://cdn.pixabay.com/photo/2013/07/13/10/07/home-156685_960_720.png'],
    ['dog', 'https://cdn.pixabay.com/photo/2013/07/13/10/44/dog-157793_960_720.png'],
    ['cat', 'https://cdn.pixabay.com/photo/2013/07/13/10/44/cat-157793_960_720.png'],
    ['book', 'https://cdn.pixabay.com/photo/2013/07/13/12/07/book-159880_960_720.png'],
    ['tree', 'https://cdn.pixabay.com/photo/2013/07/13/11/29/tree-158519_960_720.png'],
    ['car', 'https://cdn.pixabay.com/photo/2013/07/13/12/31/car-160117_960_720.png'],
    ['sun', 'https://cdn.pixabay.com/photo/2013/07/13/11/45/sun-158722_960_720.png']
  ]);
  
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

  private buildEducationalSearchQuery(word: string, strategyIndex: number = 0): string {
    // Create very specific search strategies for vocabulary/dictionary images
    const strategies = [
      `${word} vocabulary flashcard illustration children`,
      `${word} dictionary picture kids learning`,
      `${word} ESL vocabulary card simple drawing`,
      `${word} word meaning illustration elementary`,
      `${word} educational vocabulary image teacher`,
      `${word} kids dictionary picture book illustration`,
      `${word} language learning flashcard clipart`
    ];
    
    return strategies[strategyIndex] || strategies[0];
  }

  private async tryMultipleSearchStrategies(word: string): Promise<any[]> {
    const maxStrategies = 3; // Try up to 3 different search strategies
    let allResults: any[] = [];
    
    for (let i = 0; i < maxStrategies; i++) {
      try {
        const searchQuery = this.buildEducationalSearchQuery(word, i);
        const url = `${this.BASE_URL}?key=${this.API_KEY}&cx=${this.SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&searchType=image&imgSize=medium&imgType=clipart&safe=active&num=5&fileType=png,jpg`;
        
        console.log(`Strategy ${i + 1} for "${word}": ${searchQuery}`);
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            // Filter valid images for this strategy
            const validImages = this.filterValidImages(data.items);
            allResults = allResults.concat(validImages);
            
            // If we have enough good results, break early
            if (allResults.length >= 5) break;
          }
        }
        
        // Brief delay between strategies to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.warn(`Strategy ${i + 1} failed for "${word}":`, error);
        continue;
      }
    }
    
    return allResults;
  }

  private filterValidImages(items: any[]): any[] {
    return items.filter((item: any) => {
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
  }

  private scoreImageForEducationalValue(item: any, word: string): number {
    let score = 0;
    
    // Check title and snippet for educational keywords
    const title = (item.title || '').toLowerCase();
    const snippet = (item.snippet || '').toLowerCase();
    const context = (item.displayLink || '').toLowerCase();
    const combinedText = `${title} ${snippet} ${context}`;
    
    // First, check for completely irrelevant content and immediately disqualify
    const irrelevantTerms = [
      'building', 'architecture', 'skyscraper', 'tower', 'construction',
      'real estate', 'property', 'apartment', 'office', 'commercial',
      'city', 'urban', 'downtown', 'skyline', 'structure'
    ];
    
    // For the word "friend", reject building-related images completely
    if (word.toLowerCase() === 'friend') {
      for (const term of irrelevantTerms) {
        if (combinedText.includes(term)) {
          return -100; // Completely disqualify
        }
      }
    }
    
    // Apply similar logic for other words - reject obviously unrelated content
    const wordSpecificRejects: { [key: string]: string[] } = {
      'friend': ['building', 'architecture', 'tower', 'construction', 'property'],
      'happy': ['building', 'architecture', 'construction', 'property', 'technology'],
      'house': ['person', 'people', 'human', 'animal', 'food'],
      'dog': ['building', 'car', 'technology', 'furniture', 'plant'],
      'book': ['building', 'person', 'animal', 'vehicle', 'food']
    };
    
    const rejectTerms = wordSpecificRejects[word.toLowerCase()] || [];
    for (const term of rejectTerms) {
      if (combinedText.includes(term)) {
        score -= 50; // Heavy penalty for irrelevant content
      }
    }
    
    // Positive scoring for educational terms
    const educationalTerms = [
      'flashcard', 'vocabulary', 'dictionary', 'learning', 'kids',
      'children', 'elementary', 'esl', 'teacher', 'education',
      'clipart', 'illustration', 'simple', 'drawing', 'meaning'
    ];
    
    educationalTerms.forEach(term => {
      if (combinedText.includes(term)) {
        score += 20; // Increased weight for educational terms
      }
    });
    
    // Major bonus for having the word in title with educational context
    if (title.includes(word.toLowerCase()) && 
        (title.includes('vocabulary') || title.includes('dictionary') || 
         title.includes('flashcard') || title.includes('learning'))) {
      score += 30;
    }
    
    // Heavy negative scoring for stock photos and commercial content
    const commercialTerms = [
      'stock', 'getty', 'shutterstock', 'depositphotos', 'unsplash', 
      'premium', 'professional', 'photography', 'photographer',
      'commercial', 'business', 'corporate', 'marketing'
    ];
    
    commercialTerms.forEach(term => {
      if (combinedText.includes(term)) {
        score -= 30; // Heavy penalty for commercial content
      }
    });
    
    // Prefer educational domains heavily
    const educationalDomains = [
      'education', 'esl', 'vocabulary', 'dictionary', 'flashcard',
      'kids', 'children', 'teacher', 'classroom', 'learning'
    ];
    
    educationalDomains.forEach(domain => {
      if (context.includes(domain)) {
        score += 25; // High bonus for educational domains
      }
    });
    
    // Bonus for appropriate aspect ratios
    if (item.image && item.image.width && item.image.height) {
      const aspectRatio = item.image.width / item.image.height;
      if (aspectRatio >= 0.5 && aspectRatio <= 2.0) {
        score += 5;
      }
    }
    
    return score; // Allow negative scores to filter out bad content
  }

  private getFallbackImage(word: string): string {
    // First try curated educational images
    if (this.curatedImages.has(word.toLowerCase())) {
      const curatedUrl = this.curatedImages.get(word.toLowerCase())!;
      console.log(`Using curated educational image for "${word}": ${curatedUrl}`);
      this.cache.set(word, curatedUrl);
      return curatedUrl;
    }
    
    // Fall back to placeholder if no curated image available
    const randomSeed = Math.abs(word.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
    const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/80/80`;
    console.log(`Using placeholder image for "${word}": ${fallbackUrl}`);
    this.cache.set(word, fallbackUrl);
    return fallbackUrl;
  }

  async searchImage(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase().trim();
    
    // Check cache first
    if (this.cache.has(normalizedWord)) {
      console.log(`Image cache hit for: ${normalizedWord}`);
      return this.cache.get(normalizedWord)!;
    }

    try {
      console.log(`Searching educational images for: ${normalizedWord}`);
      
      // Try multiple search strategies to find the best educational images
      const allValidImages = await this.tryMultipleSearchStrategies(normalizedWord);
        
      if (allValidImages.length > 0) {
        console.log(`Found ${allValidImages.length} valid images for "${normalizedWord}"`);
        
        // Score and select the best educational image
        const scoredImages = allValidImages.map((item: any) => {
          const score = this.scoreImageForEducationalValue(item, normalizedWord);
          console.log(`Image scoring for "${normalizedWord}":`, {
            title: item.title,
            snippet: item.snippet,
            domain: item.displayLink,
            score: score,
            url: item.link
          });
          return {
            ...item,
            score: score
          };
        });
        
        // Filter out negative scores (irrelevant content)
        const positiveScoreImages = scoredImages.filter(img => img.score > 0);
        console.log(`${positiveScoreImages.length} images with positive scores for "${normalizedWord}"`);
        
        if (positiveScoreImages.length === 0) {
          console.log(`No relevant educational images found for "${normalizedWord}" - all images had negative scores`);
          return this.getFallbackImage(normalizedWord);
        }
        
        // Sort by score (highest first)
        positiveScoreImages.sort((a: any, b: any) => b.score - a.score);
        
        // Find the best valid image from scored results
        let selectedImageUrl: string | null = null;
        
        for (const scoredImage of positiveScoreImages) {
          const imageUrl = scoredImage.link;
          console.log(`Attempting to validate image for "${normalizedWord}" (score: ${scoredImage.score}): ${imageUrl}`);
          const isValidForEducation = await this.validateImageForEducationalUse(imageUrl, normalizedWord);
          
          if (isValidForEducation) {
            selectedImageUrl = imageUrl;
            console.log(`✅ Selected validated educational image for "${normalizedWord}" (score: ${scoredImage.score}): ${imageUrl}`);
            break;
          } else {
            console.log(`❌ Image validation failed for "${normalizedWord}": ${imageUrl}`);
          }
        }
        
        if (selectedImageUrl) {
          this.cache.set(normalizedWord, selectedImageUrl);
          return selectedImageUrl;
        } else {
          console.log(`No valid educational images passed validation for "${normalizedWord}", using fallback`);
          return this.getFallbackImage(normalizedWord);
        }
      } else {
        console.log(`No valid educational images found for "${normalizedWord}", using fallback`);
        return this.getFallbackImage(normalizedWord);
      }

    } catch (error: any) {
      console.error(`Image search failed for "${word}":`, error);
      return this.getFallbackImage(normalizedWord);
    }
  }

  private async isImageUrlValid(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const isValidResponse = response.ok && (response.headers.get('content-type')?.startsWith('image/') || false);
      
      if (!isValidResponse) return false;
      
      // Additional validation for image size (avoid too small or too large images)
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeInBytes = parseInt(contentLength);
        // Reject images smaller than 1KB or larger than 5MB
        if (sizeInBytes < 1024 || sizeInBytes > 5 * 1024 * 1024) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      return false;
    }
  }

  private async validateImageForEducationalUse(imageUrl: string, word: string): Promise<boolean> {
    try {
      // First check if the URL is valid and accessible
      const isValid = await this.isImageUrlValid(imageUrl);
      if (!isValid) return false;
      
      // Additional checks could be added here:
      // - Image content analysis
      // - Domain reputation checking
      // - Image similarity to educational content
      
      return true;
    } catch (error) {
      console.warn(`Image validation failed for ${imageUrl}:`, error);
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