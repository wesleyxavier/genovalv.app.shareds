import type {
  FileUploadValidationConfig,
  FileUploadValidationInput,
  FileUploadValidationResult,
} from '../dtos/file-upload.dto';

export const DEFAULT_DOCUMENT_UPLOAD_CONFIG: FileUploadValidationConfig = {
  acceptedExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  acceptedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  maxSizeBytes: 10 * 1024 * 1024,
};

/**
 * Formats a byte count into B, KB or MB for upload lists.
 */
export function formatFileSize(bytes: number): string {
  const safe = Math.max(0, bytes);
  if (safe < 1024) {
    return `${Math.round(safe)} B`;
  }
  if (safe < 1024 * 1024) {
    return `${Math.round(safe / 1024)} KB`;
  }
  return `${(safe / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates file extension/MIME type and maximum byte size.
 */
export function validateUploadFile(
  file: FileUploadValidationInput,
  config: FileUploadValidationConfig = DEFAULT_DOCUMENT_UPLOAD_CONFIG,
): FileUploadValidationResult {
  const lowerName = file.name.trim().toLowerCase();
  const hasValidExt = config.acceptedExtensions.some((ext) => lowerName.endsWith(ext.toLowerCase()));
  const lowerMime = file.mimeType.trim().toLowerCase();
  const hasValidMime = lowerMime.length === 0 || config.acceptedMimeTypes.includes(lowerMime);
  if (!hasValidExt || !hasValidMime) {
    return { valid: false, reason: 'invalid-type' };
  }
  if (file.sizeBytes <= 0 || file.sizeBytes > config.maxSizeBytes) {
    return { valid: false, reason: 'file-too-large' };
  }
  return { valid: true };
}
