import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from './constants';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password (min 8 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate file type
 */
export function isValidFileType(filename: string): boolean {
  const extension = `.${filename.split('.').pop()?.toLowerCase()}`;
  return ALLOWED_FILE_TYPES.includes(extension);
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}

/**
 * Validate file for upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isValidFileType(file.name)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  if (!isValidFileSize(file.size)) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }
  
  return { valid: true };
}
