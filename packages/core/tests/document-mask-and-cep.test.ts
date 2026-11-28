import { describe, expect, it } from 'vitest';
import {
  createTranslator,
  formatCep,
  formatCnpj,
  formatCpf,
  isValidCep,
} from '../src/index';

describe('document mask & cep helpers', () => {
  it('formats CPF progressively while stripping non-digits and negative signs', () => {
    expect(formatCpf('-123a4')).toBe('123.4');
    expect(formatCpf('1234567')).toBe('123.456.7');
    expect(formatCpf('1234567890')).toBe('123.456.789-0');
    expect(formatCpf('52998224725999')).toBe('529.982.247-25');
    expect(formatCpf('')).toBe('');
  });

  it('formats CNPJ progressively while stripping non-digits and negative signs', () => {
    expect(formatCnpj('-11')).toBe('11');
    expect(formatCnpj('11222')).toBe('11.222');
    expect(formatCnpj('11222333')).toBe('11.222.333');
    expect(formatCnpj('112223330001')).toBe('11.222.333/0001');
    expect(formatCnpj('1122233300018199')).toBe('11.222.333/0001-81');
  });

  it('formats and validates CEP', () => {
    expect(formatCep('-01001')).toBe('01001');
    expect(formatCep('0100100099')).toBe('01001-000');
    expect(isValidCep('01001-000')).toBe(true);
    expect(isValidCep('01001000')).toBe(true);
    expect(isValidCep('00000-000')).toBe(false);
    expect(isValidCep('1234')).toBe(false);
  });

  it('provides form validation & search keys across all locales', () => {
    for (const locale of ['pt-BR', 'en-US', 'es-ES'] as const) {
      const t = createTranslator(locale);
      expect(t('validation.fieldRequired')).toBeTruthy();
      expect(t('validation.cpfInvalid')).toBeTruthy();
      expect(t('validation.cnpjInvalid')).toBeTruthy();
      expect(t('validation.cepInvalid')).toBeTruthy();
      expect(t('auth.searchAction')).toBeTruthy();
    }
  });
});
