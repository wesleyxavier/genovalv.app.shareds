import { stripNonDigits } from './strip-non-digits';

function computeCpfDigit(baseDigits: string, factorStart: number): number {
  let sum = 0;
  for (let i = 0; i < baseDigits.length; i++) {
    sum += Number(baseDigits[i]) * (factorStart - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

export function isValidCpf(value: string): boolean {
  const digits = stripNonDigits(value);
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
    return false;
  }
  const first = computeCpfDigit(digits.slice(0, 9), 10);
  const second = computeCpfDigit(digits.slice(0, 10), 11);
  return first === Number(digits[9]) && second === Number(digits[10]);
}
