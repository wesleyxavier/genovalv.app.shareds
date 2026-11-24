import { describe, expect, it } from 'vitest';
import {
  normalizeEmail,
  validateEmail,
  validateLoginSubmission,
  validatePassword,
} from '../src';

describe('auth validation (US2)', () => {
  it('normalizes email by trimming whitespace and lowercasing', () => {
    expect(normalizeEmail('  Admin.User@Genova.Cloud  ')).toBe('admin.user@genova.cloud');
  });

  it('validates required and format rules for email across locales', () => {
    expect(validateEmail('')).toBe('Informe o e-mail corporativo.');
    expect(validateEmail('   ', 'en-US')).toBe('Enter your corporate email.');
    expect(validateEmail('invalid-email')).toBe('Informe um e-mail válido.');
    expect(validateEmail('invalid-email', 'es-ES')).toBe('Ingresa un correo electrónico válido.');
    expect(validateEmail('user@genova.cloud')).toBeNull();
  });

  it('validates required password without silently trimming spaces', () => {
    expect(validatePassword('')).toBe('Informe sua senha.');
    expect(validatePassword('', 'en-US')).toBe('Enter your password.');
    expect(validatePassword('   ')).toBeNull();
    expect(validatePassword('secret123')).toBeNull();
  });

  it('validates complete login submission and exposes normalized payload and errorKeys', () => {
    const missing = validateLoginSubmission(
      { email: '', password: '' },
      { locale: 'pt-BR', mfaMode: 'hidden' },
    );
    expect(missing.valid).toBe(false);
    expect(missing.errorKeys.email).toBe('validation.emailRequired');
    expect(missing.errors.email).toBe('Informe o e-mail corporativo.');

    const defaultOptions = validateLoginSubmission({
      email: 'user@genova.cloud',
      password: 'secret',
    });
    expect(defaultOptions.valid).toBe(true);

    const invalid = validateLoginSubmission(
      { email: ' bad ', password: '', rememberDevice: true },
      { locale: 'en-US', mfaMode: 'hidden' },
    );

    expect(invalid.valid).toBe(false);
    expect(invalid.errors.email).toBe('Enter a valid email address.');
    expect(invalid.errorKeys.email).toBe('validation.emailInvalid');
    expect(invalid.errors.password).toBe('Enter your password.');
    expect(invalid.errorKeys.password).toBe('validation.passwordRequired');

    const valid = validateLoginSubmission(
      { email: '  Operador@Genova.Cloud ', password: ' MySecret! ', rememberDevice: true },
      { locale: 'pt-BR', mfaMode: 'hidden' },
    );

    expect(valid.valid).toBe(true);
    expect(valid.errors).toEqual({});
    expect(valid.errorKeys).toEqual({});
    expect(valid.normalized).toEqual({
      email: 'operador@genova.cloud',
      password: ' MySecret! ',
      mfaCode: undefined,
      mfaMethod: undefined,
      rememberDevice: true,
    });
  });
});
