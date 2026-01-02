/**
 * Type definitions for backend API responses
 */

export interface BookCatalogItem {
  id?: number;
  book_id: number;
  title: string;
  subject: string | null;
  author: string | null;
  s3_folder_name: string;
  grade: number | string;
  total_pages: number | null;
  has_slow_audio: boolean;
  has_dictionary: boolean;
  status: string;
  is_downloadable: boolean;
  total_size_bytes: number | null;
  total_files: number | null;
  ui_metadata: any | null;
}

export interface BookDetails {
  id?: number;
  book_id: number;
  title: string;
  subject: string | null;
  author: string | null;
  s3_folder_name: string;
  grade: number | string;
  total_pages: number | null;
  s3_base_path: string | null;
  has_slow_audio: boolean;
  has_dictionary: boolean;
  dictionary_s3_key: string | null;
  status: string;
  is_downloadable: boolean;
  total_size_bytes: number | null;
  total_files: number | null;
  ui_metadata: any | null;
  file_manifest: any | null;
  file_manifest_updated_at: number | null;
}

export interface FileManifest {
  book_id: number;
  book_name: string;
  grade: number;
  s3_base_path: string;
  scanned_at: string;
  total_files: number;
  total_size_bytes: number;
  pages: {
    [pageNumber: string]: PageManifest;
  };
  dictionary?: {
    key: string;
    size: number;
  };
}

export interface PageManifest {
  page_number: number;
  files: FileEntry[];
  total_size: number;
}

export interface FileEntry {
  key: string;
  size: number;
  type: 'image' | 'blocks' | 'slow_blocks' | 'audio' | 'slow_audio' | 'speech_marks' | 'slow_speech_marks' | 'metadata' | 'dictionary';
  block_id?: string;
}

export interface DownloadUrlsRequest {
  file_keys: string[];
  expiration_seconds?: number;
}

export type DownloadUrlsResponse = {
  [key: string]: string;
};
