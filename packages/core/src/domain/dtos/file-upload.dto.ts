export interface UploadedFileItem {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export interface FileUploadValidationConfig {
  acceptedExtensions: readonly string[];
  acceptedMimeTypes: readonly string[];
  maxSizeBytes: number;
}

export interface FileUploadValidationInput {
  name: string;
  sizeBytes: number;
  mimeType: string;
}

export type FileUploadRejectionReason = 'invalid-type' | 'file-too-large';

export interface FileUploadValidationResult {
  valid: boolean;
  reason?: FileUploadRejectionReason;
}
