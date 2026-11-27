import type {
  AuditLogger,
  IAuth0Gateway,
  ISessionTokenGateway,
  OAuthCallbackOutcome,
} from '@genovalv/core';
import { SHARED_AUTH_AUDIT_ACTIONS } from '../../../domain/constants/shared-auth-audit-actions';
import type { ResolvePostLoginUseCase } from './resolve-post-login.usecase';

export class OAuthCallbackUseCase {
  constructor(
    private readonly auth0: IAuth0Gateway,
    private readonly resolvePostLogin: ResolvePostLoginUseCase,
    private readonly sessionTokens: ISessionTokenGateway,
    private readonly auditLogger: AuditLogger,
  ) {}

  async execute(code: string): Promise<OAuthCallbackOutcome> {
    if (!code) return { ok: false, redirectTo: '/login?error=missing_code' };
    const tokenRes = await this.auth0.exchangeAuthorizationCode(code);
    if (!tokenRes.ok) {
      await this.auditLogger.log({ level: 'error', action: SHARED_AUTH_AUDIT_ACTIONS.oauthCallbackFailed, errorMessage: `Token exchange HTTP ${tokenRes.status}` });
      return { ok: false, redirectTo: '/login?error=token_exchange_failed' };
    }

    const claims = await this.auth0.verifyJwt(tokenRes.idToken);
    const email = String(claims.email || '');
    const sub = String(claims.sub || '');
    let emailVerified = claims.email_verified === true;
    if (!emailVerified && this.auth0.getUserEmailVerified) {
      const fetched = await this.auth0.getUserEmailVerified(sub, tokenRes.accessToken);
      if (fetched !== null) emailVerified = fetched;
    }
    const resolved = await this.resolvePostLogin.execute(sub, email, emailVerified);
    if (!resolved.ok) {
      await this.auditLogger.log({ level: 'warn', action: SHARED_AUTH_AUDIT_ACTIONS.oauthCallbackDenied, actorEmail: email, errorMessage: resolved.reason });
      return { ok: false, redirectTo: `/login?error=${resolved.reason}` };
    }

    const sessionJwt = await this.sessionTokens.sign(resolved.session);
    await this.auditLogger.log({ level: 'info', action: SHARED_AUTH_AUDIT_ACTIONS.oauthCallbackSuccess, actorEmail: resolved.session.email, actorUserId: resolved.session.userId });
    return { ok: true, sessionJwt, redirectTo: '/' };
  }
}
