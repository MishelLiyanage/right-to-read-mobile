/**
 * Service for loading books from downloaded files (replaces bundled asset loading)
 */
import { Paths, Directory, File } from 'expo-file-system';
import { bookStorage } from './bookStorageService';

const BOOKS_DIR = new Directory(Paths.document, 'books');

export interface DownloadedBook {
  bookId: number;
  title: string;
  folderName: string;
  grade: number;
  totalPages: number;
}

/**
 * Load a JSON file from downloaded book directory
 */
async function loadJsonFile(file: File): Promise<any> {
  try {
    const text = await file.text();
    return JSON.parse(text);
  } catch (error) {
    console.error(`Error loading JSON file ${file.uri}:`, error);
    throw error;
  }
}

/**
 * Get the local path for a book's page image
 */
export function getBookPageImagePath(bookFolderName: string, grade: number, pageNumber: number): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  // Assuming naming pattern: {book_name}.pdf_page_{N}.png
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}.pdf_page_${pageNumber}.png`);
  return file.uri;
}

/**
 * Get the local path for a book's page blocks JSON
 */
export function getBookPageBlocksPath(bookFolderName: string, grade: number, pageNumber: number): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}.pdf_page_${pageNumber}_blocks.json`);
  return file.uri;
}

/**
 * Get the local path for a book's page slow blocks JSON
 */
export function getBookPageSlowBlocksPath(bookFolderName: string, grade: number, pageNumber: number): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}.pdf_page_${pageNumber}_slow_blocks.json`);
  return file.uri;
}

/**
 * Get the local path for a block's audio file
 */
export function getBlockAudioPath(
  bookFolderName: string,
  grade: number,
  pageNumber: number,
  blockId: string,
  isSlow: boolean = false
): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const suffix = isSlow ? '_slow_audio.mp3' : '_audio.mp3';
  const file = new File(bookDir, `block_${pageNumber}_${blockId}${suffix}`);
  return file.uri;
}

/**
 * Get the local path for a block's speech marks JSON
 */
export function getBlockSpeechMarksPath(
  bookFolderName: string,
  grade: number,
  pageNumber: number,
  blockId: string,
  isSlow: boolean = false
): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const suffix = isSlow ? '_slow_speech_marks.json' : '_speech_marks.json';
  const file = new File(bookDir, `block_${pageNumber}_${blockId}${suffix}`);
  return file.uri;
}

/**
 * Get the local path for a book's dictionary JSON
 */
export function getBookDictionaryPath(bookFolderName: string, grade: number): string {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}_dictionary.json`);
  return file.uri;
}

/**
 * Load blocks data for a specific page
 */
export async function loadPageBlocks(bookFolderName: string, grade: number, pageNumber: number): Promise<any> {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}.pdf_page_${pageNumber}_blocks.json`);
  return await loadJsonFile(file);
}

/**
 * Load slow blocks data for a specific page
 */
export async function loadPageSlowBlocks(bookFolderName: string, grade: number, pageNumber: number): Promise<any> {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const parts = bookFolderName.split('_grade_');
  const bookName = parts[0];
  const file = new File(bookDir, `${bookName}.pdf_page_${pageNumber}_slow_blocks.json`);
  return await loadJsonFile(file);
}

/**
 * Load dictionary for a book
 */
export async function loadBookDictionary(bookFolderName: string, grade: number): Promise<any> {
  try {
    const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
    const parts = bookFolderName.split('_grade_');
    const bookName = parts[0];
    const file = new File(bookDir, `${bookName}_dictionary.json`);
    
    if (!file.exists) {
      console.log('Dictionary file not found');
      return null;
    }
    
    return await loadJsonFile(file);
  } catch (error) {
    console.error('Error loading dictionary:', error);
    return null;
  }
}

/**
 * Load speech marks for a specific block
 */
export async function loadBlockSpeechMarks(
  bookFolderName: string,
  grade: number,
  pageNumber: number,
  blockId: string,
  isSlow: boolean = false
): Promise<any> {
  const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
  const suffix = isSlow ? '_slow_speech_marks.json' : '_speech_marks.json';
  const file = new File(bookDir, `block_${pageNumber}_${blockId}${suffix}`);
  return await loadJsonFile(file);
}

/**
 * Check if a book is available locally
 */
export async function isBookAvailableLocally(bookFolderName: string, grade: number): Promise<boolean> {
  try {
    const bookDir = bookStorage.getBookDirectory(bookFolderName, grade);
    return bookDir.exists;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of all downloaded books
 */
export async function getLocalBooks(): Promise<DownloadedBook[]> {
  try {
    const folderNames = await bookStorage.getDownloadedBooks();
    
    const books: DownloadedBook[] = [];
    
    for (const folderName of folderNames) {
      // Parse folder name: {book_name}_grade_{N}
      const match = folderName.match(/(.+)_grade_(\d+)/);
      if (match) {
        const bookName = match[1];
        const grade = parseInt(match[2], 10);
        
        // Try to determine page count by checking files
        const bookDir = new Directory(BOOKS_DIR, folderName);
        const files = bookDir.list();
        
        // Count PNG files (page images)
        const pageFiles = files.filter((item) => 
          item instanceof File && item.name.endsWith('.png')
        );
        
        books.push({
          bookId: 0, // Will need to be mapped from backend
          title: bookName.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
          folderName,
          grade,
          totalPages: pageFiles.length,
        });
      }
    }
    
    return books;
  } catch (error) {
    console.error('Error getting local books:', error);
    return [];
  }
}
