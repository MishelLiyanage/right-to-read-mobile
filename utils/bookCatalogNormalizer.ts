/**
 * Utilities for safely working with book manifest structures
 */

export function normalizeFiles(files: unknown): any[] {
  if (!files) return [];

  if (Array.isArray(files)) return files;

  if (typeof files === "object") {
    return Object.values(files as Record<string, any>);
  }

  return [];
}

export function normalizePages(pages: unknown): any[] {
  if (!pages) return [];

  if (Array.isArray(pages)) return pages;

  if (typeof pages === "object") {
    return Object.values(pages as Record<string, any>);
  }

  return [];
}
