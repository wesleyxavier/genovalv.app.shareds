import type { AuthResult } from '../../domain/dtos/auth-result.dto';
import type { AuthSession } from '../../domain/entities/auth-session.entity';
import type { CredentialsSubmission } from '../../domain/entities/credentials-submission.entity';
import type { IAuthRepository } from '../../domain/interfaces/iauth-repository';
import type { IAuthSessionWriter } from '../../domain/interfaces/iauth-session-writer';
import type { ILoginAuthUseCase } from '../../domain/interfaces/ilogin-auth-use-case';

export class BaseLoginAuthUseCase<
  TSubmission = CredentialsSubmission,
  TSession = AuthSession,
  TErrorKey extends string = string,
> implements ILoginAuthUseCase<TSubmission, AuthResult<TSession, TErrorKey>>
{
  constructor(
    protected readonly repository: Pick<IAuthRepository<TSubmission, TSession, unknown, TErrorKey>, 'login'>,
    protected readonly sessionStore: IAuthSessionWriter<TSession>,
  ) {}

  async login(input: TSubmission): Promise<AuthResult<TSession, TErrorKey>> {
    const result = await this.repository.login(input);
    if (result.ok && result.session) {
      this.sessionStore.setSession(result.session);
    } else {
      this.sessionStore.clearSession();
    }
    return result;
  }
}
