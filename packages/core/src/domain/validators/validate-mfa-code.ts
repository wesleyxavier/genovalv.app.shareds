import type { MfaMode } from '../dtos/mfa-mode.dto';
import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { createTranslator } from '../i18n/create-translator';
import { sanitizeMfaCode } from './sanitize-mfa-code';

export function validateMfaCode(
  value: string | undefined,
  mode: MfaMode,
  locale?: SupportedLocale,
): string | null {
  if (mode === 'hidden') {
    return null;
  }

  const digits = sanitizeMfaCode(value ?? '');
  const t = createTranslator(locale);

  if (digits.length === 0) {
    return mode === 'required' ? t('validation.mfaRequired') : null;
  }

  if (digits.length !== 6) {
    return t('validation.mfaLength');
  }

  return null;
}
