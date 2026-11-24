import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { createTranslator } from '../i18n/create-translator';

export function validatePassword(value: string, locale?: SupportedLocale): string | null {
  if (value.length === 0) {
    return createTranslator(locale)('validation.passwordRequired');
  }
  return null;
}
