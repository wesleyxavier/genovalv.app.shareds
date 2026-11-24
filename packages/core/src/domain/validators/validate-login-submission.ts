import type { LoginFieldName } from '../dtos/login-field-name.dto';
import type { LoginRawInput } from '../dtos/login-raw-input.dto';
import type { LoginTranslationKey } from '../dtos/login-translation-key.dto';
import type { LoginValidationResult } from '../dtos/login-validation-result.dto';
import type { MfaMode } from '../dtos/mfa-mode.dto';
import type { SupportedLocale } from '../dtos/supported-locale.dto';
import { normalizeEmail } from './normalize-email';
import { sanitizeMfaCode } from './sanitize-mfa-code';
import { validateEmail } from './validate-email';
import { validateMfaCode } from './validate-mfa-code';
import { validatePassword } from './validate-password';

export function validateLoginSubmission(
  raw: LoginRawInput,
  options?: { mfaMode?: MfaMode; locale?: SupportedLocale },
): LoginValidationResult {
  const mfaMode = options?.mfaMode ?? 'optional';
  const locale = options?.locale;
  const normalizedEmail = normalizeEmail(raw.email);
  const sanitizedMfa = sanitizeMfaCode(raw.mfaCode ?? '');
  const errors: Partial<Record<LoginFieldName, string>> = {};
  const errorKeys: Partial<Record<LoginFieldName, LoginTranslationKey>> = {};

  const emailError = validateEmail(normalizedEmail, locale);
  if (emailError) {
    errorKeys.email = normalizedEmail ? 'validation.emailInvalid' : 'validation.emailRequired';
    errors.email = emailError;
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
