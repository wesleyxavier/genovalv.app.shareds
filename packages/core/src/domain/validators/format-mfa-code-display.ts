import { sanitizeMfaCode } from './sanitize-mfa-code';

export function formatMfaCodeDisplay(value: string): string {
  const digits = sanitizeMfaCode(value);
  if (digits.length <= 3) {
    return digits;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}
