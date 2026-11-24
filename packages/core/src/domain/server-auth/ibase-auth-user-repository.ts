import type { CompanyBinding } from '../entities/company-binding.entity';
import type { UserModel } from '../entities/user-model.entity';

export interface IBaseAuthUserRepository {
  findById(id: string): Promise<UserModel | undefined>;
  findByEmail(email: string): Promise<UserModel | undefined>;
  findByAuth0Id(auth0Id: string): Promise<UserModel | undefined>;
  linkAuth0Id(userId: string, auth0Id: string, emailVerified: boolean): Promise<void>;
  findBindingsByUserId(userId: string): Promise<CompanyBinding[]>;
}
