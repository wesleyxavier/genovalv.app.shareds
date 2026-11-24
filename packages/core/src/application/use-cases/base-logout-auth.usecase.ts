import type { IAuthRepository } from '../../domain/interfaces/iauth-repository';
import type { IAuthSessionWriter } from '../../domain/interfaces/iauth-session-writer';
import type { ILogoutAuthUseCase } from '../../domain/interfaces/ilogout-auth-use-case';

export class BaseLogoutAuthUseCase implements ILogoutAuthUseCase {
  constructor(
    protected readonly repository: Pick<IAuthRepository, 'logout'>,
    protected readonly sessionStore: Pick<IAuthSessionWriter, 'clearSession'>,
  ) {}

  async logout(): Promise<void> {
    await this.repository.logout();
    this.sessionStore.clearSession();
  }
}
