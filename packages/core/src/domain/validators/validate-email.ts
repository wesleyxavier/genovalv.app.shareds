import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { createTranslator } from '../i18n/create-translator';
import { normalizeEmail } from './normalize-email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string, locale?: SupportedLocale): string | null {
  const normalized = normalizeEmail(value);
  const t = createTranslator(locale);
  if (!normalized) {
    return t('validation.emailRequired');
  }
  if (!EMAIL_REGEX.test(normalized)) {
    return t('validation.emailInvalid');
  }
  return null;
}
