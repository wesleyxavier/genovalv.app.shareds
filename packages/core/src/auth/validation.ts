import { createTranslator } from '../i18n/translator';
import { sanitizeMfaCode, validateMfaCode } from './mfa';
import type {
  LoginFieldName,
  LoginRawInput,
  LoginTranslationKey,
  LoginValidationResult,
  MfaMode,
  SupportedLocale,
} from './types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

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

export function validatePassword(value: string, locale?: SupportedLocale): string | null {
  if (value.length === 0) {
    return createTranslator(locale)('validation.passwordRequired');
  }
  return null;
}

export function validateLoginSubmission(
  raw: LoginRawInput,
  options?: { mfaMode?: MfaMode; locale?: SupportedLocale },
): LoginValidationResult {
  const mfaMode = options?.mfaMode ?? 'optional';
  const locale = options?.locale;
  const t = createTranslator(locale);

  const normalizedEmail = normalizeEmail(raw.email);
  const sanitizedMfa = sanitizeMfaCode(raw.mfaCode ?? '');

  const errors: Partial<Record<LoginFieldName, string>> = {};
  const errorKeys: Partial<Record<LoginFieldName, LoginTranslationKey>> = {};

  if (!normalizedEmail) {
    errorKeys.email = 'validation.emailRequired';
    errors.email = t('validation.emailRequired');
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errorKeys.email = 'validation.emailInvalid';
    errors.email = t('validation.emailInvalid');
  }

  const passwordError = validatePassword(raw.password, locale);
  if (passwordError) {
    errorKeys.password = 'validation.passwordRequired';
    errors.password = passwordError;
  }

  const mfaError = validateMfaCode(raw.mfaCode, mfaMode, locale);
  if (mfaError) {
    errorKeys.mfaCode = sanitizedMfa.length === 0 ? 'validation.mfaRequired' : 'validation.mfaLength';
    errors.mfaCode = mfaError;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    errorKeys,
    normalized: {
      email: normalizedEmail,
      password: raw.password,
      mfaCode: sanitizedMfa.length > 0 ? sanitizedMfa : undefined,
      mfaMethod: raw.mfaMethod,
      rememberDevice: Boolean(raw.rememberDevice),
    },
  };
}
