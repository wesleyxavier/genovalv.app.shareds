import type { BindingValidationResult } from '../dtos/binding-validation-result.dto';
import type { CompanyBinding } from '../entities/company-binding.entity';
import { extractCnpjRoot } from './extract-cnpj-root';

export function validateActiveBindings(
  bindings: readonly CompanyBinding[],
): BindingValidationResult {
  const activeBindings = bindings.filter((binding) => binding.active === true);
  if (activeBindings.length === 0) {
    return { ok: false, reason: 'no_active_bindings' };
  }

  const roots = new Set(activeBindings.map((binding) => extractCnpjRoot(binding.cnpj)));
  if (roots.size > 1) {
    return { ok: false, reason: 'multiple_company_roots' };
  }

  return {
    ok: true,
    activeBindings,
    cnpjRoot: Array.from(roots)[0]!,
  };
}
