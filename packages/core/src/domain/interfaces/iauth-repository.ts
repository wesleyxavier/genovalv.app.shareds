import type { AuthResult } from '../dtos/auth-result.dto';
import type { AuthenticatedMeResponse } from '../dtos/authenticated-me-response.dto';
import type { AuthSession } from '../entities/auth-session.entity';
import type { CredentialsSubmission } from '../entities/credentials-submission.entity';

export interface IAuthRepository<
  TSubmission = CredentialsSubmission,
  TSession = AuthSession,
  TMe = AuthenticatedMeResponse,
  TErrorKey extends string = string,
> {
  login(input: TSubmission): Promise<AuthResult<TSession, TErrorKey>>;
  logout(): Promise<void>;
  refreshFromCookie(): Promise<TMe>;
}
