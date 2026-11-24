import type { MfaGuidance } from '../dtos/mfa-guidance.dto';
import type { MfaMethod } from '../dtos/mfa-method.dto';
import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { createTranslator } from '../i18n/create-translator';

export function getMfaGuidance(method: MfaMethod, locale?: SupportedLocale): MfaGuidance {
  const t = createTranslator(locale);
  return {
    method,
    label: t(`mfa.${method}.label`),
    title: t(`mfa.${method}.title`),
    hint: t(`mfa.${method}.hint`),
  };
}
