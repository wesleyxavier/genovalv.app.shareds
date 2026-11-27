import type { PaginationSummary } from '../dtos/list-ui.dto';
import { stripNonDigits } from '../validators/strip-non-digits';

/**
 * Computes 1-based item range and clamped pagination metadata.
 */
export function computePaginationRange(
  page: number,
  pageSize: number,
  totalItems: number,
): PaginationSummary {
  const safeTotal = Math.max(0, Math.floor(totalItems));
  const safeSize = Math.max(1, Math.floor(pageSize));
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeSize));
  const currentPage = Math.min(Math.max(1, Math.floor(page)), totalPages);
  if (safeTotal === 0) {
    return { currentPage: 1, totalPages: 1, start: 0, end: 0, totalItems: 0 };
  }
  const start = (currentPage - 1) * safeSize + 1;
  const end = Math.min(safeTotal, currentPage * safeSize);
  return { currentPage, totalPages, start, end, totalItems: safeTotal };
}

/**
 * Masks an 11-digit CPF as 000.*** ***-00 for admin user listings.
 */
export function formatMaskedCpf(cpf: string | null | undefined): string {
  const digits = stripNonDigits(cpf ?? '');
  if (digits.length !== 11) {
    return '—';
  }
  return `${digits.slice(0, 3)}.*** ***-${digits.slice(9, 11)}`;
}
