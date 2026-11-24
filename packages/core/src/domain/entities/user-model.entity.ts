import type { DocumentType } from '../dtos/document-type.dto';

export interface UserModel {
  id: string;
  auth0Id: string | null;
  email: string;
  emailVerified: boolean;
  fullName: string;
  documentType: DocumentType;
  documentNumber: string;
  active: boolean;
}
