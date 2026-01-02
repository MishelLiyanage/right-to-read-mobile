/**
 * Service for managing downloaded book files on device
 */
import { Paths, Directory, File } from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FileManifest, PageManifest, FileEntry } from '@/types/bookCatalog';
import { normalizePages, normalizeFiles } from "@/utils/bookCatalogNormalizer";


const BOOKS_DIR = new Directory(Paths.document, 'books');
const DOWNLOAD_STATE_KEY = 'download_state';

export interface DownloadProgress {
  bookId: number;
  totalFiles: number;
  downloadedFiles: number;
  totalBytes: number;
  downloadedBytes: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'paused';
  error?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface BookDownloadState {
  [bookId: string]: DownloadProgress;
}

class BookStorageService {
  /**
   * Initialize the books directory structure
   */
  async initialize(): Promise<void> {
    try {
      if (!BOOKS_DIR.exists) {
        await BOOKS_DIR.create();
        console.log('Created books directory:', BOOKS_DIR.uri);
      }
    } catch (error) {
      console.error('Error initializing books directory:', error);
      throw error;
    }
  }

  /**
   * Get the local directory path for a specific book
   */
  getBookDirectory(bookName: string, grade: number): Directory {
    const folderName = `${bookName}_grade_${grade}`;
    return new Directory(BOOKS_DIR, folderName);
  }

  /**
   * Get the local file path for a specific S3 key
   */
  getLocalFilePath(bookName: string, grade: number, s3Key: string): File {
    // Extract filename from S3 key (e.g., "books/book_name/file.png" -> "file.png")
    const parts = s3Key.split('/');
    const filename = parts[parts.length - 1];
    
    const bookDir = this.getBookDirectory(bookName, grade);
    return new File(bookDir, filename);
  }

  /**
   * Check if a book is fully downloaded
   */
  async isBookDownloaded(bookName: string, grade: number, manifest: FileManifest): Promise<boolean> {
    try {
      const bookDir = this.getBookDirectory(bookName, grade);
      
      if (!bookDir.exists) {
        return false;
      }

      // Check if all files from manifest exist locally
      const allFiles: string[] = [];
      
      // Collect all file keys from manifest
      Object.values(manifest.pages).forEach((page) => {
        normalizeFiles(page.files).forEach((file) => {
          allFiles.push(file.key);
        });
      });
      
      if (manifest.dictionary) {
        allFiles.push(manifest.dictionary.key);
      }

      // Check each file
      for (const s3Key of allFiles) {
        const localFile = this.getLocalFilePath(bookName, grade, s3Key);
        
        if (!localFile.exists) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking if book is downloaded:', error);
      return false;
    }
  }

  /**
   * Download a file from URL to local storage
   */
  async downloadFile(
    url: string,
    localFile: File,
    onProgress?: (bytesDownloaded: number, totalBytes: number) => void
  ): Promise<void> {
    try {
      console.log(`📥 Downloading from URL (length: ${url.length})`);
      console.log(`   First 200 chars: ${url.substring(0, 200)}...`);
      console.log(`   Target file: ${localFile.uri}`);
      
      // Ensure parent directory exists
      const parentDir = localFile.parentDirectory;
      if (!parentDir.exists) {
        await parentDir.create();
      }

      // Download file using fetch and write to file
      const response = await fetch(url);
      console.log(`   Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        // Log response body for 403 errors
        const errorText = await response.text();
        console.error(`   ❌ Response body: ${errorText.substring(0, 500)}`);
        throw new Error(`Download failed: ${response.status}`);
      }

      const totalBytes = parseInt(response.headers.get('content-length') || '0', 10);
      let downloadedBytes = 0;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        downloadedBytes += value.length;
        
        if (onProgress && totalBytes > 0) {
          onProgress(downloadedBytes, totalBytes);
        }
      }

      // Combine chunks and write to file
      const blob = new Blob(chunks as BlobPart[]);
      const arrayBuffer = await blob.arrayBuffer();
      await localFile.write(new Uint8Array(arrayBuffer));

      console.log('Downloaded:', localFile.uri);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Delete all downloaded files for a book
   */
  async deleteBook(bookName: string, grade: number): Promise<void> {
    try {
      const bookDir = this.getBookDirectory(bookName, grade);
      
      if (bookDir.exists) {
        await bookDir.delete();
        console.log('Deleted book directory:', bookDir.uri);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  /**
   * Get download state for all books
   */
  async getDownloadState(): Promise<BookDownloadState> {
    try {
      const stateJson = await AsyncStorage.getItem(DOWNLOAD_STATE_KEY);
      return stateJson ? JSON.parse(stateJson) : {};
    } catch (error) {
      console.error('Error reading download state:', error);
      return {};
    }
  }

  /**
   * Save download state for a book
   */
  async saveDownloadProgress(bookId: number, progress: DownloadProgress): Promise<void> {
    try {
      const state = await this.getDownloadState();
      state[bookId.toString()] = progress;
      await AsyncStorage.setItem(DOWNLOAD_STATE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving download progress:', error);
      throw error;
    }
  }

  /**
   * Get the size of downloaded book files
   */
  async getBookSize(bookName: string, grade: number): Promise<number> {
    try {
      const bookDir = this.getBookDirectory(bookName, grade);
      
      if (!bookDir.exists) {
        return 0;
      }

      // Calculate total size by summing all files
      let totalSize = 0;
      const files = bookDir.list();
      
      for (const item of files) {
        if (item instanceof File) {
          totalSize += item.size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error getting book size:', error);
      return 0;
    }
  }

  /**
   * Get list of all downloaded books
   */
  async getDownloadedBooks(): Promise<string[]> {
    try {
      if (!BOOKS_DIR.exists) {
        return [];
      }

      const contents = BOOKS_DIR.list();
      return contents
        .filter((item) => item instanceof Directory)
        .map((dir) => (dir as Directory).name)
        .filter((name) => name.includes('_grade_'));
    } catch (error) {
      console.error('Error listing downloaded books:', error);
      return [];
    }
  }
}

// Export singleton instance
export const bookStorage = new BookStorageService();
