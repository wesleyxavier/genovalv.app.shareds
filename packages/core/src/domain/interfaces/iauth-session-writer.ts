import type { AuthSession } from '../entities/auth-session.entity';

export interface IAuthSessionWriter<TSession = AuthSession> {
  setSession(session: TSession): void;
  clearSession(): void;
}
