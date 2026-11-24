import type { AuthResult } from '../dtos/auth-result.dto';
import type { CredentialsSubmission } from '../entities/credentials-submission.entity';

export interface ILoginAuthUseCase<
  TSubmission = CredentialsSubmission,
  TResult = AuthResult,
> {
  login(input: TSubmission): Promise<TResult>;
}
