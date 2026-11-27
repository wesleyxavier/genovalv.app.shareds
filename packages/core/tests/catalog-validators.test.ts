import { describe, expect, it } from 'vitest';
import {
  validateCatalogCode,
  validateCatalogDescription,
  validateCatalogName,
} from '../src/index';

describe('catalog validators', () => {
  it('accepts uppercase A-Z0-9_ codes between 2 and 32 chars', () => {
    expect(validateCatalogCode('BASICO')).toBe(true);
    expect(validateCatalogCode('PLAN_PRO_2')).toBe(true);
    expect(validateCatalogCode('A')).toBe(false);
    expect(validateCatalogCode('basico')).toBe(false);
    expect(validateCatalogCode('A-B')).toBe(false);
    expect(validateCatalogCode('A'.repeat(33))).toBe(false);
  });

  it('validates names between 1 and 120 chars after trim', () => {
    expect(validateCatalogName('Plano Básico')).toBe(true);
    expect(validateCatalogName('   ')).toBe(false);
    expect(validateCatalogName('A'.repeat(121))).toBe(false);
    expect(validateCatalogName(null as unknown as string)).toBe(false);
  });

  it('validates optional descriptions up to 500 chars', () => {
    expect(validateCatalogDescription(null)).toBe(true);
    expect(validateCatalogDescription(undefined)).toBe(true);
    expect(validateCatalogDescription('A'.repeat(500))).toBe(true);
    expect(validateCatalogDescription('A'.repeat(501))).toBe(false);
  });
});
