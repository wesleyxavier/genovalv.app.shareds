import type { AuthResult } from '../domain/dtos/auth-result.dto';
import type { AuthenticatedMeResponse } from '../domain/dtos/authenticated-me-response.dto';
import type { HttpAuthRoutes } from '../domain/dtos/http-auth-routes.dto';
import type { HttpFetch } from '../domain/dtos/http-fetch.dto';
import type { AuthSession } from '../domain/entities/auth-session.entity';
import type { CredentialsSubmission } from '../domain/entities/credentials-submission.entity';
import type { IAuthRepository } from '../domain/interfaces/iauth-repository';

export class HttpAuthRepository<
  TSubmission = CredentialsSubmission,
  TSession = AuthSession,
  TErrorKey extends string = string,
> implements IAuthRepository<TSubmission, TSession, AuthenticatedMeResponse, TErrorKey>
{
  constructor(
    protected readonly routes: HttpAuthRoutes,
    protected readonly invalidCredentialsKey: TErrorKey,
    protected readonly fetchFn: HttpFetch = (globalThis as unknown as { fetch: HttpFetch }).fetch,
  ) {}

  async login(input: TSubmission): Promise<AuthResult<TSession, TErrorKey>> {
    try {
      const response = await this.fetchFn(this.routes.passwordLogin, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        return { ok: false, errorKey: this.invalidCredentialsKey };
      }
      const session = (await response.json()) as TSession;
      return { ok: true, session };
    } catch {
      return { ok: false, errorKey: this.invalidCredentialsKey };
    }
  }

  async logout(): Promise<void> {
    await this.fetchFn(this.routes.logout, { method: 'POST', credentials: 'include' }).catch(() => undefined);
  }

  async refreshFromCookie(): Promise<AuthenticatedMeResponse> {
    try {
      const res = await this.fetchFn(this.routes.me, { credentials: 'include' });
      if (!res.ok) return { authenticated: false };
      return (await res.json()) as AuthenticatedMeResponse;
    } catch {
      return { authenticated: false };
    }
  }
}
