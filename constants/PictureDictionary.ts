/**
 * Picture Dictionary Image Mappings
 * Maps words to their corresponding images for visual learning
 */

export const PICTURE_DICTIONARY: Record<string, string> = {
  ball: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV1bu5E8tUaL_qnvh10JrXSb7a1I2hnodcEg&s',
  circle: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52FjSG3YuYGecgJ6qM58qCBMvAZxBOybDwwPiV8IsOVVlOeJ6fbgF1iUg5Eulm0MhRwIZuUxV',
  friend: 'https://t3.ftcdn.net/jpg/02/87/50/20/360_F_287502091_5cWdV8b6qN06oNNrUa43MEdA1NxFEtJA.jpg',
  stand: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE9dfYjRE2J38J0rE8M074nS73jidVTc2__g&s',
  game: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFWaModVZEo-baTtKmFFiJgm11dUcN8lXodqXE84_uLpP5IMGIfFUwmFINDQ0OiWzsjBk&usqp=CAU',
  cat: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh_HJtvSuexaJZ8Ldr1_o8XoE2wmQB9Pbolw&s',
  dog: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRCg6mCSqNqiw1f3KhSR-bN38c0RxWQIMCPg&s',
  pet: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkhOW5IMt92A84dOkPn8cAfaaO3ZFDcgQ44A&s',
  raincoat: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFgm8Cx7Y3TjkNxyUXo9YZe3y9j4rVwD6MQ&s',
  clothes: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGq5uQDuNSE4Id1eKo4xyYQvQ78W8f8IQiWQ&s',
  dress: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcThb7YckcSwF9hS973x1SJFoxkeS0z040UQ&s',
  belt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfQUQe0c7uWnNLJDhIcw4br912k0QNPjwGcA&s',
  hat: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4d2QAceeJRtg4k3SLJyMV7IRKGkfkxyw9eQ&s',
  listen: 'https://static.vecteezy.com/system/resources/thumbnails/008/197/720/small/cute-little-boy-with-hearing-problem-try-listening-carefully-by-putting-her-hand-to-ear-vector.jpg',
  say: 'https://static.vecteezy.com/system/resources/thumbnails/047/417/239/small/color-icon-for-speak-vector.jpg',
  answer: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqv-X23lIu3D2_5_XuDLBm-DxLGW5Oz-6vhA&s',
  ask: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO33pPKLQQLAkupPCi_dwdOjYdRZQxIEek2g&s',
};

/**
 * Get picture dictionary image URL for a word
 * @param word - The word to look up (case-insensitive)
 * @returns Image URL if found, undefined otherwise
 */
export function getPictureDictionaryImage(word: string): string | undefined {
  const normalizedWord = word.toLowerCase().trim();
  return PICTURE_DICTIONARY[normalizedWord];
}

/**
 * Check if a word has a picture dictionary image
 * @param word - The word to check (case-insensitive)
 * @returns true if image exists, false otherwise
 */
export function hasPictureDictionaryImage(word: string): boolean {
  const normalizedWord = word.toLowerCase().trim();
  return normalizedWord in PICTURE_DICTIONARY;
}
