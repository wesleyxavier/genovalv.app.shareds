import type { CompanyBinding } from '../entities/company-binding.entity';

export interface PostLoginUserMetadata {
  sql_id?: string;
  cpf?: string;
  active?: boolean;
  bindings?: CompanyBinding[];
}
