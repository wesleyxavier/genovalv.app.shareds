import { describe, expect, it } from 'vitest';
import {
  MFA_GUIDANCE_MAP,
  formatMfaCodeDisplay,
  getMfaGuidance,
  sanitizeMfaCode,
  validateLoginSubmission,
  validateMfaCode,
} from '../src';

describe('auth MFA rules (US3)', () => {
  it('sanitizes pasted MFA code keeping max 6 numeric digits', () => {
    expect(sanitizeMfaCode('123 456')).toBe('123456');
    expect(sanitizeMfaCode('ab12-34cd5678')).toBe('123456');
    expect(sanitizeMfaCode('')).toBe('');
  });

  it('formats MFA code display with middle space when 6 digits or partial', () => {
    expect(formatMfaCodeDisplay('123456')).toBe('123 456');
    expect(formatMfaCodeDisplay('123')).toBe('123');
    expect(formatMfaCodeDisplay('12 34')).toBe('123 4');
  });

  it('validates MFA according to mode (hidden, optional, required) and locale', () => {
    expect(validateMfaCode('', 'hidden')).toBeNull();
    expect(validateMfaCode('12', 'hidden')).toBeNull();

    expect(validateMfaCode(undefined, 'optional')).toBeNull();
    expect(validateMfaCode('', 'optional')).toBeNull();
    expect(validateMfaCode('123', 'optional')).toBe('O código de verificação deve conter 6 dígitos numéricos.');
    expect(validateMfaCode('123 456', 'optional')).toBeNull();

    expect(validateMfaCode('', 'required')).toBe('Informe o código de verificação de 6 dígitos.');
    expect(validateMfaCode('', 'required', 'en-US')).toBe('Enter the 6-digit verification code.');
    expect(validateMfaCode('12345', 'required', 'es-ES')).toBe('El código de verificación debe tener 6 dígitos numéricos.');
    expect(validateMfaCode('654321', 'required')).toBeNull();
  });

  it('integrates MFA validation into validateLoginSubmission', () => {
    const missingRequired = validateLoginSubmission(
      { email: 'admin@genova.cloud', password: 'secret', mfaCode: '123', mfaMethod: 'totp' },
      { mfaMode: 'required', locale: 'pt-BR' },
    );
    expect(missingRequired.valid).toBe(false);
    expect(missingRequired.errorKeys.mfaCode).toBe('validation.mfaLength');

    const emptyRequired = validateLoginSubmission(
      { email: 'admin@genova.cloud', password: 'secret', mfaCode: '' },
      { mfaMode: 'required', locale: 'pt-BR' },
    );
    expect(emptyRequired.valid).toBe(false);
    expect(emptyRequired.errorKeys.mfaCode).toBe('validation.mfaRequired');

    const validMfa = validateLoginSubmission(
      { email: 'admin@genova.cloud', password: 'secret', mfaCode: '123 456', mfaMethod: 'yubikey' },
      { mfaMode: 'required' },
    );
    expect(validMfa.valid).toBe(true);
    expect(validMfa.normalized.mfaCode).toBe('123456');
    expect(validMfa.normalized.mfaMethod).toBe('yubikey');
  });

  it('provides translated guidance for totp, yubikey and biometric methods', () => {
    expect(Object.keys(MFA_GUIDANCE_MAP).sort()).toEqual(['biometric', 'totp', 'yubikey']);
    expect(getMfaGuidance('yubikey', 'pt-BR').title).toContain('YubiKey');
    expect(getMfaGuidance('biometric', 'en-US').title).toContain('Biometric');
    expect(getMfaGuidance('totp', 'es-ES').hint).toContain('6 dígitos');
  });
});
