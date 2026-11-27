import { describe, expect, it } from 'vitest';
import { computePaginationRange, formatMaskedCpf } from '../src';

describe('list-ui helpers', () => {
  it('computes pagination range for populated and empty lists', () => {
    expect(computePaginationRange(1, 10, 0)).toEqual({
      currentPage: 1,
      totalPages: 1,
      start: 0,
      end: 0,
      totalItems: 0,
    });
    expect(computePaginationRange(1, 10, 4)).toEqual({
      currentPage: 1,
      totalPages: 1,
      start: 1,
      end: 4,
      totalItems: 4,
    });
    expect(computePaginationRange(5, 10, 25)).toEqual({
      currentPage: 3,
      totalPages: 3,
      start: 21,
      end: 25,
      totalItems: 25,
    });
  });

  it('masks valid 11-digit CPFs and returns em-dash for invalid values', () => {
    expect(formatMaskedCpf('123.456.789-01')).toBe('123.*** ***-01');
    expect(formatMaskedCpf('12345678901')).toBe('123.*** ***-01');
    expect(formatMaskedCpf('123')).toBe('—');
    expect(formatMaskedCpf(null)).toBe('—');
  });
});
