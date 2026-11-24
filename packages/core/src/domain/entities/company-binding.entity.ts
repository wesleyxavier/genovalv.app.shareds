import type { BranchType } from '../dtos/branch-type.dto';

export interface CompanyBinding {
  id: string;
  tenantId: string;
  companyGroup?: string;
  profileId: string;
  cpf: string;
  cnpj: string;
  branchType: BranchType;
  sandbox: boolean;
  active: boolean;
}
