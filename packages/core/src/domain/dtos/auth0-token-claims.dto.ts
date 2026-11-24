import type { CompanyBinding } from '../entities/company-binding.entity';

export interface Auth0TokenClaims {
  id: string;
  auth0Id: string;
  cpf: string;
  bindings: CompanyBinding[];
}
