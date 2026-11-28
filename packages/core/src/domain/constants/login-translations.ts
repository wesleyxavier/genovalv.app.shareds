import type { LoginDictionary } from '../dtos/login-dictionary.dto';
import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { LOGIN_TRANSLATIONS_EN } from './login-translations.en';
import { LOGIN_TRANSLATIONS_ES } from './login-translations.es';
import { LOGIN_TRANSLATIONS_PT } from './login-translations.pt';

export const LOGIN_TRANSLATIONS: Readonly<Record<SupportedLocale, LoginDictionary>> = {
  'pt-BR': LOGIN_TRANSLATIONS_PT,
  'en-US': LOGIN_TRANSLATIONS_EN,
  'es-ES': LOGIN_TRANSLATIONS_ES,
};
