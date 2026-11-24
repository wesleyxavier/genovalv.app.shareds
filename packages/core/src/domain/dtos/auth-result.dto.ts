import type { AuthSession } from '../entities/auth-session.entity';

export interface AuthResult<TSession = AuthSession, TErrorKey extends string = string> {
  ok: boolean;
  session?: TSession;
  errorKey?: TErrorKey;
}
