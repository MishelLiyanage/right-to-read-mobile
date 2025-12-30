/**
 * Service for communicating with the backend book catalog API
 */
import { API_CONFIG } from "@/config/apiConfig";
import {
  BookCatalogItem,
  BookDetails,
  FileManifest,
  DownloadUrlsResponse,
} from "@/types/bookCatalog";

type FetchOptions = RequestInit & { timeoutMs?: number };

async function fetchWithTimeout(url: string, options: FetchOptions = {}) {
  const { timeoutMs = API_CONFIG.TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

class BookCatalogApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Fetch the list of available books from the catalog
   */
  async fetchCatalog(): Promise<BookCatalogItem[]> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.CATALOG}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch catalog: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      // you said backend returns { data: [...] }
      return data.data || [];
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error("Catalog request timed out");
      } else {
        console.error("Error fetching book catalog:", error);
      }
      throw error;
    }
  }

  /**
   * Fetch detailed information about a specific book
   */
  async fetchBookDetails(bookId: number): Promise<BookDetails> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.BOOK_DETAILS(bookId)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch book details: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error(`Book details request timed out for ID ${bookId}`);
      } else {
        console.error(`Error fetching book details for ID ${bookId}:`, error);
      }
      throw error;
    }
  }

  /**
   * Fetch the file manifest (structure) for a book
   */
  async fetchBookManifest(bookId: number, forceRefresh = false): Promise<FileManifest> {
    try {
      const url = new URL(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.BOOK_MANIFEST(bookId)}`
      );
      if (forceRefresh) {
        url.searchParams.set("force_refresh", "true");
      }

      const response = await fetchWithTimeout(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch book manifest: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error(`Manifest request timed out for ID ${bookId}`);
      } else {
        console.error(`Error fetching book manifest for ID ${bookId}:`, error);
      }
      throw error;
    }
  }

  /**
   * Get presigned download URLs for specific S3 files
   */
  async getDownloadUrls(
    bookId: number,
    fileKeys: string[],
    expirationSeconds = 3600
  ): Promise<DownloadUrlsResponse> {
    try {
      const requestBody = {
        s3Keys: fileKeys,
        expiresIn: expirationSeconds,
      };

      console.log(`Requesting download URLs for book ${bookId}`);
      console.log(`Request body:`, JSON.stringify(requestBody, null, 2));

      const response = await fetchWithTimeout(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.DOWNLOAD_URLS(bookId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Download URLs error response:`, errorText);
        throw new Error(
          `Failed to get download URLs: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log(`Received ${Object.keys(result.data || {}).length} download URLs`);
      return result.data;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error(`Download URLs request timed out for book ID ${bookId}`);
      } else {
        console.error(`Error getting download URLs for book ID ${bookId}:`, error);
      }
      throw error;
    }
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`,
        {
          method: "GET",
          timeoutMs: 5000,
        }
      );
      return response.ok;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error("Backend health check timed out");
      } else {
        console.error("Backend health check failed:", error);
      }
      return false;
    }
  }
}

// Export singleton instance
export const bookCatalogApi = new BookCatalogApiService();
