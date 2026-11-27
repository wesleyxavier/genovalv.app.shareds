import { describe, expect, it } from 'vitest';
import { Money } from '../src/index';

describe('Money helper (decimal.js)', () => {
  it('parses pt-BR and dot-decimal strings to fixed 2-decimal DB strings', () => {
    expect(Money.toDbString('490')).toBe('490.00');
    expect(Money.toDbString('490.5')).toBe('490.50');
    expect(Money.toDbString('1.490,90')).toBe('1490.90');
    expect(Money.toDbString('0,00')).toBe('0.00');
  });

  it('rejects negative or invalid money strings', () => {
    expect(Money.isValidNonNegative('-1.00')).toBe(false);
    expect(Money.isValidNonNegative('abc')).toBe(false);
    expect(Money.isValidNonNegative('0.00')).toBe(true);
    expect(Money.isValidNonNegative('199,90')).toBe(true);
    expect(() => Money.toDbString('-5')).toThrow();
  });

  it('formats DB money strings as pt-BR BRL currency', () => {
    const formatted = Money.formatBrl('1490.90');
    expect(formatted).toContain('1.490,90');
    expect(formatted).toContain('R$');
  });
});
