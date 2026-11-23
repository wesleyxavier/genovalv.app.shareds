import type { LoginDictionary, LoginTranslationKey, SupportedLocale } from '../auth/types';
import { DEFAULT_LOCALE, LOGIN_TRANSLATIONS } from './locales';

export { DEFAULT_LOCALE, LOGIN_TRANSLATIONS };

export function resolveSupportedLocale(locale?: string): SupportedLocale {
  if (locale === 'pt-BR' || locale === 'en-US' || locale === 'es-ES') {
    return locale;
  }
  return DEFAULT_LOCALE;
}

export function createTranslator(
  locale?: SupportedLocale | string,
  overrides?: Partial<LoginDictionary>,
): (key: LoginTranslationKey, params?: Record<string, string | number>) => string {
  const resolved = resolveSupportedLocale(locale);
  const dict = LOGIN_TRANSLATIONS[resolved];

  return (key: LoginTranslationKey, params?: Record<string, string | number>): string => {
    const template = overrides?.[key] ?? dict[key];
    if (!params) {
      return template;
    }
    return template.replace(/\{(\w+)\}/g, (_match, paramKey: string) =>
      params[paramKey] !== undefined ? String(params[paramKey]) : `{${paramKey}}`,
    );
  };
}
