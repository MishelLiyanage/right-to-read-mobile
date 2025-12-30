/**
 * Service for orchestrating book downloads from backend to device storage
 */
import { bookCatalogApi } from './bookCatalogApiService';
import { bookStorage, DownloadProgress } from './bookStorageService';
import { normalizeFiles, normalizePages } from '@/utils/bookCatalogNormalizer';
import { FileManifest, BookDetails } from '@/types/bookCatalog';

const BATCH_SIZE = 10; // Download 10 files at a time
const URL_EXPIRATION = 3600; // 1 hour

export class BookDownloadService {
  private activeDownloads: Map<number, AbortController> = new Map();
  private progressCallbacks: Map<number, (progress: DownloadProgress) => void> = new Map();

  /**
   * Start downloading a book
   */
  async downloadBook(
    bookId: number,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      // Check if already downloading
      if (this.activeDownloads.has(bookId)) {
        console.log(`Book ${bookId} is already being downloaded`);
        return;
      }

      if (onProgress) {
        this.progressCallbacks.set(bookId, onProgress);
      }

      // Create abort controller for cancellation
      const abortController = new AbortController();
      this.activeDownloads.set(bookId, abortController);

      // Initialize storage
      await bookStorage.initialize();

      // Fetch book details and manifest
      console.log(`Fetching details for book ${bookId}...`);
      const details = await bookCatalogApi.fetchBookDetails(bookId);
      console.log(`✅ Book details received:`, {
        s3_folder_name: details.s3_folder_name,
        grade: details.grade,
        title: details.title
      });
      
      console.log(`Fetching manifest for book ${bookId}...`);
      const manifest = await bookCatalogApi.fetchBookManifest(bookId);

      // Check if already downloaded
      const isDownloaded = await bookStorage.isBookDownloaded(
        details.s3_folder_name,
        Number(details.grade),
        manifest
      );

      if (isDownloaded) {
        console.log(`Book ${bookId} is already downloaded`);
        await this.updateProgress(bookId, {
          bookId,
          totalFiles: manifest.total_files,
          downloadedFiles: manifest.total_files,
          totalBytes: manifest.total_size_bytes,
          downloadedBytes: manifest.total_size_bytes,
          status: 'completed',
          completedAt: Date.now(),
        });
        return;
      }

      // Initialize progress
      await this.updateProgress(bookId, {
        bookId,
        totalFiles: manifest.total_files,
        downloadedFiles: 0,
        totalBytes: manifest.total_size_bytes,
        downloadedBytes: 0,
        status: 'downloading',
        startedAt: Date.now(),
      });

      // Collect all file keys to download
      const fileKeys: string[] = [];
      normalizePages(manifest.pages).forEach((page) => {
        normalizeFiles(page.files).forEach((file) => {
          if (file.key) {  // Filter out null/undefined keys
            fileKeys.push(file.key);
          }
        });
      });
      
      if (manifest.dictionary?.key) {  // Check dictionary.key exists
        fileKeys.push(manifest.dictionary.key);
      }

      console.log(`Starting download of ${fileKeys.length} files for book ${bookId}`);

      // Download files in batches
      let downloadedFiles = 0;
      let downloadedBytes = 0;

      for (let i = 0; i < fileKeys.length; i += BATCH_SIZE) {
        if (abortController.signal.aborted) {
          throw new Error('Download cancelled');
        }

        const batch = fileKeys.slice(i, i + BATCH_SIZE);
        
        // Get presigned URLs for this batch
        const urlsResponse = await bookCatalogApi.getDownloadUrls(
          bookId,
          batch,
          URL_EXPIRATION
        );

        // Download files in parallel
        const downloadPromises = batch.map(async (s3Key) => {
          const url = urlsResponse[s3Key];
          if (!url) {
            throw new Error(`No URL for file: ${s3Key}`);
          }

          const localFile = bookStorage.getLocalFilePath(
            details.s3_folder_name,
            Number(details.grade),
            s3Key
          );

          await bookStorage.downloadFile(url, localFile, (bytes, total) => {
            // File-level progress (could be used for per-file UI)
          });

          // Find file size from manifest
          let fileSize = 0;
          for (const page of Object.values(manifest.pages)) {
            const file = page.files.find((f) => f.key === s3Key);
            if (file) {
              fileSize = file.size;
              break;
            }
          }
          if (fileSize === 0 && manifest.dictionary?.key === s3Key) {
            fileSize = manifest.dictionary.size;
          }

          return fileSize;
        });

        // Wait for batch to complete
        const fileSizes = await Promise.all(downloadPromises);
        
        downloadedFiles += batch.length;
        downloadedBytes += fileSizes.reduce((sum, size) => sum + size, 0);

        // Update progress
        await this.updateProgress(bookId, {
          bookId,
          totalFiles: manifest.total_files,
          downloadedFiles,
          totalBytes: manifest.total_size_bytes,
          downloadedBytes,
          status: 'downloading',
          startedAt: Date.now(),
        });

        console.log(
          `Book ${bookId}: Downloaded ${downloadedFiles}/${fileKeys.length} files (${Math.round((downloadedBytes / manifest.total_size_bytes) * 100)}%)`
        );
      }

      // Download complete
      await this.updateProgress(bookId, {
        bookId,
        totalFiles: manifest.total_files,
        downloadedFiles: manifest.total_files,
        totalBytes: manifest.total_size_bytes,
        downloadedBytes: manifest.total_size_bytes,
        status: 'completed',
        completedAt: Date.now(),
      });

      console.log(`Book ${bookId} download completed successfully!`);
    } catch (error) {
      console.error(`Error downloading book ${bookId}:`, error);
      
      await this.updateProgress(bookId, {
        bookId,
        totalFiles: 0,
        downloadedFiles: 0,
        totalBytes: 0,
        downloadedBytes: 0,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    } finally {
      this.activeDownloads.delete(bookId);
      this.progressCallbacks.delete(bookId);
    }
  }

  /**
   * Cancel an ongoing download
   */
  cancelDownload(bookId: number): void {
    const controller = this.activeDownloads.get(bookId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(bookId);
      this.progressCallbacks.delete(bookId);
      console.log(`Cancelled download for book ${bookId}`);
    }
  }

  /**
   * Check if a book is currently being downloaded
   */
  isDownloading(bookId: number): boolean {
    return this.activeDownloads.has(bookId);
  }

  /**
   * Update and persist download progress
   */
  private async updateProgress(bookId: number, progress: DownloadProgress): Promise<void> {
    await bookStorage.saveDownloadProgress(bookId, progress);
    
    const callback = this.progressCallbacks.get(bookId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Get download progress for a book
   */
  async getDownloadProgress(bookId: number): Promise<DownloadProgress | null> {
    const state = await bookStorage.getDownloadState();
    return state[bookId.toString()] || null;
  }

  /**
   * Delete a downloaded book
   */
  async deleteBook(bookId: number, bookName: string, grade: number): Promise<void> {
    try {
      // Cancel download if in progress
      this.cancelDownload(bookId);

      // Delete files
      await bookStorage.deleteBook(bookName, grade);

      // Clear progress
      const state = await bookStorage.getDownloadState();
      delete state[bookId.toString()];
      await bookStorage.saveDownloadProgress(bookId, state[bookId.toString()]);

      console.log(`Deleted book ${bookId}`);
    } catch (error) {
      console.error(`Error deleting book ${bookId}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookDownloader = new BookDownloadService();
