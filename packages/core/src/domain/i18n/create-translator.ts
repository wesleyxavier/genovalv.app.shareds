import { LOGIN_TRANSLATIONS } from '../constants/login-translations';
import type { LoginDictionary } from '../dtos/login-dictionary.dto';
import type { LoginTranslationKey } from '../dtos/login-translation-key.dto';
import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { resolveSupportedLocale } from './resolve-supported-locale';

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
