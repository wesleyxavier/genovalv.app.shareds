import type { DocumentType } from '../dtos/document-type.dto';
import type { CompanyBinding } from '../entities/company-binding.entity';

export interface UserCookieSession {
  userId: string;
  auth0Id: string;
  email: string;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  bindings: CompanyBinding[];
}
