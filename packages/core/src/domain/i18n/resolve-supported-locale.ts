import { DEFAULT_LOCALE } from '../constants/default-locale';
import type { SupportedLocale } from '../dtos/supported-locale.dto';

export function resolveSupportedLocale(locale?: string): SupportedLocale {
  if (locale === 'pt-BR' || locale === 'en-US' || locale === 'es-ES') {
    return locale;
  }
  return DEFAULT_LOCALE;
}
