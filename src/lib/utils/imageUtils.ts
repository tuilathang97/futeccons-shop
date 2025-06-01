/**
 * Converts a File object to a base64 string
 * @param file - The File object to convert
 * @returns Promise that resolves to base64 string
 */
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a file is a valid image
 * @param file - The File object to validate
 * @returns boolean indicating if the file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Validates image file size
 * @param file - The File object to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes (default: 5MB)
 * @returns boolean indicating if the file size is valid
 */
export function isValidImageSize(file: File, maxSizeInMB: number = 5): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Validates an image file for both type and size
 * @param file - The File object to validate
 * @param maxSizeInMB - Maximum allowed size in megabytes (default: 5MB)
 * @returns object with validation result and error message if invalid
 */
export function validateImageFile(file: File, maxSizeInMB: number = 5): {
  isValid: boolean;
  error?: string;
} {
  if (!isValidImageFile(file)) {
    return {
      isValid: false,
      error: 'Chỉ hỗ trợ các định dạng ảnh: JPEG, PNG, GIF, WebP',
    };
  }

  if (!isValidImageSize(file, maxSizeInMB)) {
    return {
      isValid: false,
      error: `Kích thước ảnh không được vượt quá ${maxSizeInMB}MB`,
    };
  }

  return { isValid: true };
} 