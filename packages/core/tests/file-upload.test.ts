import { describe, expect, it } from 'vitest';
import { formatFileSize, validateUploadFile } from '../src';

describe('file-upload helpers', () => {
  it('formats byte, kilobyte and megabyte sizes', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(124 * 1024)).toBe('124 KB');
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
  });

  it('validates accepted document types and max size', () => {
    expect(validateUploadFile({ name: 'auth.pdf', sizeBytes: 1024, mimeType: 'application/pdf' })).toEqual({ valid: true });
    expect(validateUploadFile({ name: 'doc.JPG', sizeBytes: 2048, mimeType: '' })).toEqual({ valid: true });
    expect(validateUploadFile({ name: 'script.exe', sizeBytes: 1024, mimeType: 'application/octet-stream' })).toEqual({
      valid: false,
      reason: 'invalid-type',
    });
    expect(validateUploadFile({ name: 'bad.pdf', sizeBytes: 1024, mimeType: 'text/plain' })).toEqual({
      valid: false,
      reason: 'invalid-type',
    });
    expect(validateUploadFile({ name: 'huge.pdf', sizeBytes: 11 * 1024 * 1024, mimeType: 'application/pdf' })).toEqual({
      valid: false,
      reason: 'file-too-large',
    });
    expect(validateUploadFile({ name: 'empty.pdf', sizeBytes: 0, mimeType: 'application/pdf' })).toEqual({
      valid: false,
      reason: 'file-too-large',
    });
  });
});
