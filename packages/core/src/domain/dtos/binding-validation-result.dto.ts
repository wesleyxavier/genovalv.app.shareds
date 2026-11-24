import type { CompanyBinding } from '../entities/company-binding.entity';

export type BindingValidationResult =
  | { ok: true; activeBindings: CompanyBinding[]; cnpjRoot: string }
  | { ok: false; reason: 'no_active_bindings' | 'multiple_company_roots' };
