import { stripNonDigits } from './strip-non-digits';

function computeCnpjDigit(baseDigits: string, weights: readonly number[]): number {
  let sum = 0;
  for (let i = 0; i < baseDigits.length; i++) {
    sum += Number(baseDigits[i]) * weights[i]!;
  }
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

export function isValidCnpj(value: string): boolean {
  const digits = stripNonDigits(value);
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) {
    return false;
  }
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const first = computeCnpjDigit(digits.slice(0, 12), w1);
  const second = computeCnpjDigit(digits.slice(0, 13), w2);
  return first === Number(digits[12]) && second === Number(digits[13]);
}
