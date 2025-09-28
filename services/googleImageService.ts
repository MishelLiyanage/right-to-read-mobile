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
  
  // Curated educational images for common nouns
  private curatedImages: Map<string, string> = new Map([
    // Actions and verbs
    ['listen', 'https://static.vecteezy.com/system/resources/previews/057/106/530/non_2x/a-young-man-in-a-red-sweater-listening-intently-with-a-curious-expression-in-a-flat-illustration-style-showcasing-engagement-and-focus-in-communication-art-vector.jpg'],
    ['say', 'https://static.vecteezy.com/system/resources/previews/047/417/239/non_2x/color-icon-for-speak-vector.jpg'],
    
    // Animals
    ['dog', 'https://img.freepik.com/free-vector/cute-pug-dog-bite-bone-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium_138676-7370.jpg?semt=ais_hybrid&w=740&q=80'],
    ['cat', 'https://img.freepik.com/premium-vector/realistic-cat-vector-illustration_1253202-10679.jpg?semt=ais_hybrid&w=740&q=80'],
    ['bird', 'https://img.freepik.com/premium-vector/colorful-flying-bird-vector-art-illustration_1208043-1267.jpg'],
    ['fish', 'https://www.shutterstock.com/image-vector/cute-fish-on-white-background-260nw-2506013247.jpg'],
    ['horse', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU8wPM_g37OyQcZJTzM7Hfry5G9Bsn-FXGPsU2b5F7IPR6LClOnO7GCmeD5o_WFzaGVho&usqp=CAU'],
    ['cow', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTejeHswTKrDijr7lWIW_I63te7pZiYHgmsKQ&s'],
    ['rabbit', 'https://img.freepik.com/premium-vector/cute-rabbit-vector-cartoon-illustration_1025757-20654.jpg'],
    ['parrot', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeD2tSV1nD8HpjvenCIsMPzmaeyEl48a7brA&s'],
    ['pet', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJrlAWN4RZysFxxTgFc4jJYDRqDxUTxcopmA&s'],
    
    // Home and household
    ['house', 'https://img.freepik.com/free-vector/beautiful-home_24877-50819.jpg?semt=ais_hybrid&w=740&q=80'],
    ['family', 'https://static.vecteezy.com/system/resources/previews/049/590/642/non_2x/parents-and-children-clipart-happy-family-cartoon-illustration-vector.jpg'],
    ['home', 'https://img.freepik.com/premium-vector/cute-vector-illustration-house-kids_925324-11057.jpg?semt=ais_hybrid&w=740&q=80'],
    ['door', 'https://www.shutterstock.com/image-vector/open-door-silhouette-clipart-opening-260nw-2487461439.jpg'],
    ['window', 'https://static.vecteezy.com/system/resources/previews/021/608/796/non_2x/cute-cartoon-window-illustration-free-vector.jpg'],
    ['bed', 'https://static.vecteezy.com/system/resources/previews/021/608/786/non_2x/cute-cartoon-bed-illustration-free-vector.jpg'],
    ['chair', 'https://static.vecteezy.com/system/resources/previews/021/608/787/non_2x/cute-cartoon-chair-illustration-free-vector.jpg'],
    ['table', 'https://static.vecteezy.com/system/resources/previews/021/608/795/non_2x/cute-cartoon-table-illustration-free-vector.jpg'],
    
    // Food
    ['apple', 'https://static.vecteezy.com/system/resources/previews/021/608/784/non_2x/cute-cartoon-apple-illustration-free-vector.jpg'],
    ['banana', 'https://static.vecteezy.com/system/resources/previews/021/608/785/non_2x/cute-cartoon-banana-illustration-free-vector.jpg'],
    ['bread', 'https://static.vecteezy.com/system/resources/previews/021/608/791/non_2x/cute-cartoon-bread-illustration-free-vector.jpg'],
    ['cake', 'https://static.vecteezy.com/system/resources/previews/021/608/789/non_2x/cute-cartoon-cake-illustration-free-vector.jpg'],
    ['milk', 'https://static.vecteezy.com/system/resources/previews/021/608/793/non_2x/cute-cartoon-milk-illustration-free-vector.jpg'],
    
    // Transportation
    ['car', 'https://static.vecteezy.com/system/resources/previews/024/647/020/non_2x/cute-cartoon-car-illustration-free-vector.jpg'],
    ['bus', 'https://static.vecteezy.com/system/resources/previews/024/647/018/non_2x/cute-cartoon-bus-illustration-free-vector.jpg'],
    ['train', 'https://static.vecteezy.com/system/resources/previews/024/647/036/non_2x/cute-cartoon-train-illustration-free-vector.jpg'],
    ['airplane', 'https://static.vecteezy.com/system/resources/previews/024/647/016/non_2x/cute-cartoon-airplane-illustration-free-vector.jpg'],
    ['bicycle', 'https://static.vecteezy.com/system/resources/previews/024/647/017/non_2x/cute-cartoon-bicycle-illustration-free-vector.jpg'],
    
    // Nature
    ['tree', 'https://static.vecteezy.com/system/resources/previews/021/608/797/non_2x/cute-cartoon-tree-illustration-free-vector.jpg'],
    ['flower', 'https://static.vecteezy.com/system/resources/previews/021/608/798/non_2x/cute-cartoon-flower-illustration-free-vector.jpg'],
    ['sun', 'https://static.vecteezy.com/system/resources/previews/024/647/034/non_2x/cute-cartoon-sun-illustration-free-vector.jpg'],
    ['moon', 'https://static.vecteezy.com/system/resources/previews/024/647/028/non_2x/cute-cartoon-moon-illustration-free-vector.jpg'],
    ['star', 'https://static.vecteezy.com/system/resources/previews/024/647/033/non_2x/cute-cartoon-star-illustration-free-vector.jpg'],
    ['water', 'https://static.vecteezy.com/system/resources/previews/021/608/799/non_2x/cute-cartoon-water-illustration-free-vector.jpg'],
    
    // School and learning
    ['book', 'https://static.vecteezy.com/system/resources/previews/024/647/019/non_2x/cute-cartoon-book-illustration-free-vector.jpg'],
    ['school', 'https://static.vecteezy.com/system/resources/previews/024/647/031/non_2x/cute-cartoon-school-illustration-free-vector.jpg'],
    ['pencil', 'https://static.vecteezy.com/system/resources/previews/024/647/029/non_2x/cute-cartoon-pencil-illustration-free-vector.jpg'],
    ['paper', 'https://static.vecteezy.com/system/resources/previews/021/608/800/non_2x/cute-cartoon-paper-illustration-free-vector.jpg'],
    
    // People and family
    ['brother', 'https://static.vecteezy.com/system/resources/thumbnails/007/153/145/small_2x/cartoon-little-boy-playing-bus-and-airplane-toys-vector.jpg'],
    ['sister', 'https://www.shutterstock.com/image-vector/playful-little-sister-vector-character-600nw-2509946969.jpg'],
    ['baby', 'https://static.vecteezy.com/system/resources/previews/001/312/544/non_2x/cute-baby-with-different-expression-vector.jpg'],
    ['mother', 'https://static.vecteezy.com/system/resources/previews/024/647/027/non_2x/cute-cartoon-mother-illustration-free-vector.jpg'],
    ['father', 'https://static.vecteezy.com/system/resources/previews/024/647/023/non_2x/cute-cartoon-father-illustration-free-vector.jpg'],
    ['grandmother', 'https://img.freepik.com/free-vector/cute-grandma-walking-with-cane-stick-cartoon-vector-icon-illustration-people-nature-icon-isolated_138676-6668.jpg?semt=ais_hybrid&w=740&q=80'],
    ['grandfather', 'https://img.freepik.com/premium-vector/cartoon-elderly-man-with-cane_122297-5891.jpg?semt=ais_hybrid&w=740&q=80'],
    ['aunt', 'https://thumbs.dreamstime.com/b/cartoon-illustration-stylish-older-woman-character-hat-dress-confident-well-dressed-378939395.jpg'],
    ['uncle', 'https://img.freepik.com/free-vector/smiling-elderly-man-glasses_1308-174843.jpg?semt=ais_hybrid&w=740&q=80'],
    
    // Emotions and feelings
    ['happy', 'https://static.vecteezy.com/system/resources/previews/024/647/032/non_2x/cute-cartoon-happy-face-illustration-free-vector.jpg'],
    ['sad', 'https://static.vecteezy.com/system/resources/previews/024/647/030/non_2x/cute-cartoon-sad-face-illustration-free-vector.jpg'],
    
    // Body parts
    ['hand', 'https://static.vecteezy.com/system/resources/previews/021/608/801/non_2x/cute-cartoon-hand-illustration-free-vector.jpg'],
    ['eye', 'https://static.vecteezy.com/system/resources/previews/021/608/802/non_2x/cute-cartoon-eye-illustration-free-vector.jpg'],
    ['mouth', 'https://static.vecteezy.com/system/resources/previews/021/608/803/non_2x/cute-cartoon-mouth-illustration-free-vector.jpg'],

    // numbers
    ['3', 'https://static.vecteezy.com/system/resources/previews/015/586/239/non_2x/3d-cartoon-render-yellow-shiny-number-3-three-design-web-element-isolated-on-white-background-vector.jpg'],
    ['4', 'https://st2.depositphotos.com/1561359/12173/v/450/depositphotos_121738682-stock-illustration-3d-shiny-blue-number-4.jpg'],
    ['5', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6CcZj4UkY-Ohex07eS0aXJZM5VLfb_EhFhg&s'],
    ['6', 'https://img.freepik.com/free-vector/beach-sunset-logo_474888-3019.jpg'],
    ['8', 'https://img.freepik.com/free-vector/onion-icon-logo-design_474888-3020.jpg'],
    ['10', 'https://img.freepik.com/free-vector/ice-cream-maker-logo_474888-3023.jpg?semt=ais_hybrid&w=740&q=80'],
    ['9', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu8b-2xdyxpx0muC6ROBZ4v9ocRmmsBuV16Q&s'],
    ['two', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpACfTyE-w9URh0HIrHUMT54ZHjqoPiDl55g&s'],
    ['three', 'https://static.vecteezy.com/system/resources/previews/015/586/239/non_2x/3d-cartoon-render-yellow-shiny-number-3-three-design-web-element-isolated-on-white-background-vector.jpg'],
    ['four', 'https://st2.depositphotos.com/1561359/12173/v/450/depositphotos_121738682-stock-illustration-3d-shiny-blue-number-4.jpg'],
    ['five', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6CcZj4UkY-Ohex07eS0aXJZM5VLfb_EhFhg&s'],
    ['six', 'https://img.freepik.com/free-vector/beach-sunset-logo_474888-3019.jpg'],
    ['nine', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu8b-2xdyxpx0muC6ROBZ4v9ocRmmsBuV16Q&s'],
    ['eight', 'https://img.freepik.com/free-vector/onion-icon-logo-design_474888-3020.jpg'],
    ['ten', 'https://img.freepik.com/free-vector/ice-cream-maker-logo_474888-3023.jpg?semt=ais_hybrid&w=740&q=80'],

    ['stand', 'https://i.pinimg.com/564x/1a/23/7d/1a237d8fc5ae06de892d2a2619379f57.jpg'],
    ['circle', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwRZ2lsscee9FquULul42LtBxIabL1281kAA&s'],
    ['ball', 'https://img.freepik.com/free-vector/beach-ball-filled-outline_78370-6149.jpg'],
    ['friend', 'https://static.vecteezy.com/system/resources/previews/047/718/218/non_2x/friends-special-love-and-emotional-moment-illustration-concept-for-friendship-day-vector.jpg'],
    ['groups', 'https://img.freepik.com/free-vector/african-male-female-character-wearing-casual-clothes-different-hairstyles-gathered-black-people-crowd-demanding-equal-rights-every-person-flat-vector-illustration-black-community-concept_74855-22098.jpg?semt=ais_hybrid&w=740&q=80'],

  ]);

  // Note: In a production app, you would need to:
  // 1. Get a Google Custom Search API key from Google Cloud Console
  // 2. Create a Custom Search Engine ID
  // 3. Store these securely (not in the code)
  // For now, using a placeholder that would need to be replaced with actual credentials
  private readonly API_KEY = "AIzaSyC6jx0h3inM3BLHuK1-WMSHLwv7RbIcL1w"; // Replace with actual API key
  private readonly SEARCH_ENGINE_ID = "b55cd7b0c6fb748bc"; // Replace with actual CSE ID
  private readonly BASE_URL = "https://www.googleapis.com/customsearch/v1";

  static getInstance(): GoogleImageService {
    if (!GoogleImageService.instance) {
      GoogleImageService.instance = new GoogleImageService();
    }
    return GoogleImageService.instance;
  }

  private buildEducationalSearchQuery(
    word: string,
    strategyIndex: number = 0
  ): string {
    return `${word} vector image`;
  }

  private async tryMultipleSearchStrategies(word: string): Promise<any[]> {
    const maxStrategies = 3; // Try up to 3 different search strategies
    let allResults: any[] = [];

    for (let i = 0; i < maxStrategies; i++) {
      try {
        const searchQuery = this.buildEducationalSearchQuery(word, i);
        const url = `${this.BASE_URL}?key=${this.API_KEY}&cx=${
          this.SEARCH_ENGINE_ID
        }&q=${encodeURIComponent(
          searchQuery
        )}&searchType=image&imgSize=medium&imgType=clipart&safe=active&num=5&fileType=png,jpg`;

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
        await new Promise((resolve) => setTimeout(resolve, 100));
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
      const acceptedFormats = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!acceptedFormats.includes(item.mime.toLowerCase())) return false;

      // Avoid problematic domains that might have loading issues
      const problematicDomains = [
        "shutterstock.com",
        "gettyimages.com",
        "istockphoto.com",
      ];
      const domain = new URL(item.link).hostname.toLowerCase();
      if (problematicDomains.some((pd) => domain.includes(pd))) return false;

      // Prefer direct image URLs (ending with image extensions)
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
      const hasImageExtension = imageExtensions.some((ext) =>
        item.link.toLowerCase().includes(ext)
      );

      return hasImageExtension;
    });
  }

  private scoreImageForEducationalValue(item: any, word: string): number {
    let score = 0;

    // Check title and snippet for educational keywords
    const title = (item.title || "").toLowerCase();
    const snippet = (item.snippet || "").toLowerCase();
    const context = (item.displayLink || "").toLowerCase();
    const combinedText = `${title} ${snippet} ${context}`;

    // First, check for completely irrelevant content and immediately disqualify
    const irrelevantTerms = [
      "building",
      "architecture",
      "skyscraper",
      "tower",
      "construction",
      "real estate",
      "property",
      "apartment",
      "office",
      "commercial",
      "city",
      "urban",
      "downtown",
      "skyline",
      "structure",
    ];

    // For the word "friend", reject building-related images completely
    if (word.toLowerCase() === "friend") {
      for (const term of irrelevantTerms) {
        if (combinedText.includes(term)) {
          return -100; // Completely disqualify
        }
      }
    }

    // Apply similar logic for other words - reject obviously unrelated content
    const wordSpecificRejects: { [key: string]: string[] } = {
      friend: ["building", "architecture", "tower", "construction", "property"],
      happy: [
        "building",
        "architecture",
        "construction",
        "property",
        "technology",
      ],
      house: ["person", "people", "human", "animal", "food"],
      dog: ["building", "car", "technology", "furniture", "plant"],
      book: ["building", "person", "animal", "vehicle", "food"],
    };

    const rejectTerms = wordSpecificRejects[word.toLowerCase()] || [];
    for (const term of rejectTerms) {
      if (combinedText.includes(term)) {
        score -= 50; // Heavy penalty for irrelevant content
      }
    }

    // Positive scoring for educational terms
    const educationalTerms = [
      "flashcard",
      "vocabulary",
      "dictionary",
      "learning",
      "kids",
      "children",
      "elementary",
      "esl",
      "teacher",
      "education",
      "clipart",
      "illustration",
      "simple",
      "drawing",
      "meaning",
    ];

    educationalTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        score += 20; // Increased weight for educational terms
      }
    });

    // Major bonus for having the word in title with educational context
    if (
      title.includes(word.toLowerCase()) &&
      (title.includes("vocabulary") ||
        title.includes("dictionary") ||
        title.includes("flashcard") ||
        title.includes("learning"))
    ) {
      score += 30;
    }

    // Heavy negative scoring for stock photos and commercial content
    const commercialTerms = [
      "stock",
      "getty",
      "shutterstock",
      "depositphotos",
      "unsplash",
      "premium",
      "professional",
      "photography",
      "photographer",
      "commercial",
      "business",
      "corporate",
      "marketing",
    ];

    commercialTerms.forEach((term) => {
      if (combinedText.includes(term)) {
        score -= 30; // Heavy penalty for commercial content
      }
    });

    // Prefer educational domains heavily
    const educationalDomains = [
      "education",
      "esl",
      "vocabulary",
      "dictionary",
      "flashcard",
      "kids",
      "children",
      "teacher",
      "classroom",
      "learning",
    ];

    educationalDomains.forEach((domain) => {
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
      this.cache.set(word, curatedUrl);
      return curatedUrl;
    }

    // Generate a consistent placeholder image based on the word
    const randomSeed = Math.abs(
      word.split("").reduce((a, b) => a + b.charCodeAt(0), 0)
    );
    const fallbackUrl = `https://picsum.photos/seed/${randomSeed}/120/120`;
    this.cache.set(word, fallbackUrl);
    return fallbackUrl;
  }

  async searchImage(word: string): Promise<string | null> {
    const normalizedWord = word.toLowerCase().trim();

    // Check cache first
    if (this.cache.has(normalizedWord)) {
      return this.cache.get(normalizedWord)!;
    }

    // Use only hardcoded curated images - Google search is commented out
    return this.getFallbackImage(normalizedWord);

    /* COMMENTED OUT - Google Image Search functionality (keeping code for future use)
    try {
      // Try multiple search strategies to find the best educational images
      const allValidImages = await this.tryMultipleSearchStrategies(
        normalizedWord
      );

      if (allValidImages.length > 0) {
        // Score and select the best educational image
        const scoredImages = allValidImages.map((item: any) => {
          const score = this.scoreImageForEducationalValue(
            item,
            normalizedWord
          );
          return {
            ...item,
            score: score,
          };
        });

        // Filter out negative scores (irrelevant content)
        const positiveScoreImages = scoredImages.filter((img) => img.score > 0);

        if (positiveScoreImages.length === 0) {
          return this.getFallbackImage(normalizedWord);
        }

        // Sort by score (highest first)
        positiveScoreImages.sort((a: any, b: any) => b.score - a.score);

        // Find the best valid image from scored results
        let selectedImageUrl: string | null = null;

        for (const scoredImage of positiveScoreImages) {
          const imageUrl = scoredImage.link;

          const isValidForEducation = await this.validateImageForEducationalUse(
            imageUrl,
            normalizedWord
          );

          if (isValidForEducation) {
            selectedImageUrl = imageUrl;

            break;
          } else {
          }
        }

        if (selectedImageUrl) {
          this.cache.set(normalizedWord, selectedImageUrl);
          return selectedImageUrl;
        } else {
          return this.getFallbackImage(normalizedWord);
        }
      } else {
        return this.getFallbackImage(normalizedWord);
      }
    } catch (error: any) {
      console.error(`Image search failed for "${word}":`, error);
      return this.getFallbackImage(normalizedWord);
    }
    */
  }

  private async isImageUrlValid(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD" });
      const isValidResponse =
        response.ok &&
        (response.headers.get("content-type")?.startsWith("image/") || false);

      if (!isValidResponse) return false;

      // Additional validation for image size (avoid too small or too large images)
      const contentLength = response.headers.get("content-length");
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

  private async validateImageForEducationalUse(
    imageUrl: string,
    word: string
  ): Promise<boolean> {
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
