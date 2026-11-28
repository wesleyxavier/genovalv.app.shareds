import { stripNonDigits } from './strip-non-digits';

function applyNumericMask(value: string, maxDigits: number, separators: ReadonlyArray<[number, string]>): string {
  const digits = stripNonDigits(value).slice(0, maxDigits);
  let out = '';
  for (let i = 0; i < digits.length; i++) {
    const match = separators.find(([idx]) => idx === i);
    if (match) out += match[1];
    out += digits[i];
  }
  return out;
}

/** Formats numeric input as a progressive Brazilian CPF (`000.000.000-00`). */
export function formatCpf(value: string): string {
  return applyNumericMask(value, 11, [[3, '.'], [6, '.'], [9, '-']]);
}

/** Formats numeric input as a progressive Brazilian CNPJ (`00.000.000/0001-00`). */
export function formatCnpj(value: string): string {
  return applyNumericMask(value, 14, [[2, '.'], [5, '.'], [8, '/'], [12, '-']]);
}

/** Formats numeric input as a progressive Brazilian CEP (`00000-000`). */
export function formatCep(value: string): string {
  return applyNumericMask(value, 8, [[5, '-']]);
}

/** Validates a Brazilian CEP (`8` non-zero-only numeric digits). */
export function isValidCep(value: string): boolean {
  const digits = stripNonDigits(value);
  return digits.length === 8 && !/^0{8}$/.test(digits);
}
