import type { AuthenticatedMeResponse } from '../../domain/dtos/authenticated-me-response.dto';
import type { AuthSession } from '../../domain/entities/auth-session.entity';
import type { IAuthRepository } from '../../domain/interfaces/iauth-repository';
import type { IAuthSessionWriter } from '../../domain/interfaces/iauth-session-writer';
import type { IRefreshFromCookieAuthUseCase } from '../../domain/interfaces/irefresh-from-cookie-auth-use-case';

export class BaseRefreshSessionUseCase<TUser, TSession = AuthSession<TUser>>
  implements IRefreshFromCookieAuthUseCase
{
  constructor(
    protected readonly repository: Pick<IAuthRepository<unknown, TSession, AuthenticatedMeResponse>, 'refreshFromCookie'>,
    protected readonly sessionStore: Pick<IAuthSessionWriter<TSession>, 'setSession'>,
    protected readonly toSession: (session: NonNullable<AuthenticatedMeResponse['session']>) => TSession,
  ) {}

  async refreshFromCookie(): Promise<void> {
    try {
      const data = await this.repository.refreshFromCookie();
      if (data.authenticated && data.session) {
        this.sessionStore.setSession(this.toSession(data.session));
      }
    } catch {
      // Preserve in-memory session state when refresh fails
    }
  }
}
