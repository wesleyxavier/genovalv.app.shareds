import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOGIN_TRANSLATIONS, createTranslator } from '../src';

describe('i18n translator', () => {
  it('defaults to pt-BR and exposes pt-BR, en-US and es-ES dictionaries', () => {
    expect(DEFAULT_LOCALE).toBe('pt-BR');
    expect(Object.keys(LOGIN_TRANSLATIONS).sort()).toEqual(['en-US', 'es-ES', 'pt-BR']);

    const ptKeys = Object.keys(LOGIN_TRANSLATIONS['pt-BR']).sort();
    expect(Object.keys(LOGIN_TRANSLATIONS['en-US']).sort()).toEqual(ptKeys);
    expect(Object.keys(LOGIN_TRANSLATIONS['es-ES']).sort()).toEqual(ptKeys);
  });

  it('translates keys for supported locales and falls back to pt-BR for unknown locale', () => {
    const tEn = createTranslator('en-US');
    const tEs = createTranslator('es-ES');
    const tFallback = createTranslator('fr-FR');

    expect(tEn('auth.submit')).toBe('Sign In');
    expect(tEs('auth.submit')).toBe('Iniciar sesión');
    expect(tFallback('auth.submit')).toBe('Entrar');
  });

  it('applies overrides and interpolates {param} placeholders', () => {
    const t = createTranslator('pt-BR', {
      'auth.rememberDevice': 'Lembrar este dispositivo por {days} dias',
    });

    expect(t('auth.rememberDevice', { days: 30 })).toBe('Lembrar este dispositivo por 30 dias');
    expect(t('header.securityBadge')).toBe('Ambiente Seguro');
  });

  it('falls back to pt-BR when a partial override or missing key occurs in non-default locale', () => {
    const tEn = createTranslator('en-US');
    expect(tEn('auth.rememberDevice', { days: 30 })).toBe('Remember this device for 30 days');
    expect(tEn('auth.rememberDevice', { other: 1 })).toBe('Remember this device for {days} days');
  });
});
