import type { EmailCpfCompanyEntry } from '../dtos/email-cpf-company-entry.dto';
import { stripNonDigits } from './strip-non-digits';

export function hasEmailCpfCompanyConflict(
  existing: readonly EmailCpfCompanyEntry[],
  candidate: EmailCpfCompanyEntry,
): boolean {
  const normalizedEmail = candidate.email.trim().toLowerCase();
  const normalizedCpf = stripNonDigits(candidate.cpf);
  return existing.some(
    (item) =>
      item.email.trim().toLowerCase() === normalizedEmail &&
      stripNonDigits(item.cpf) === normalizedCpf &&
      item.cnpjRoot !== candidate.cnpjRoot,
  );
}
