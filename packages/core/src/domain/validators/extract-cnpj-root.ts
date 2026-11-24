import { stripNonDigits } from './strip-non-digits';

export function extractCnpjRoot(cnpj: string): string {
  return stripNonDigits(cnpj).slice(0, 8);
}
