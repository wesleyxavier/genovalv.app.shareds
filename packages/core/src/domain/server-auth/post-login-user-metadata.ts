import type { CompanyBinding } from '../entities/company-binding.entity';

export interface PostLoginUserMetadata {
  sql_id?: string;
  cpf?: string;
  active?: boolean;
  app_setup_id?: string;
  app_setup_secret?: string;
  environment?: string;
  bindings?: CompanyBinding[];
}
