import type {
  AppSetupContext,
  AuditLogger,
  IAuth0Gateway,
  ISessionTokenGateway,
  PasswordLoginInput,
  PasswordLoginOutcome,
} from '@genovalv/core';
import {
  DEFAULT_COOKIE_TTL_SECONDS,
  REMEMBER_COOKIE_TTL_SECONDS,
} from '../../../domain/constants/auth-cookie.constants';
import { SHARED_AUTH_AUDIT_ACTIONS } from '../../../domain/constants/shared-auth-audit-actions';
import type { ResolvePostLoginUseCase } from './resolve-post-login.usecase';
import { verifyAppSetupLogin } from './verify-app-setup-login';

export class PasswordLoginUseCase {
  constructor(
    private readonly auth0: IAuth0Gateway,
    private readonly resolvePostLogin: ResolvePostLoginUseCase,
    private readonly sessionTokens: ISessionTokenGateway,
    private readonly auditLogger: AuditLogger,
    private readonly expectedAppSetup?: AppSetupContext,
  ) {}

  async execute(input: PasswordLoginInput): Promise<PasswordLoginOutcome> {
    if (!input.email || !input.password) {
      return { ok: false, statusCode: 400, message: 'Missing credentials' };
    }
    const email = input.email.trim().toLowerCase();
    const tokenRes = await this.auth0.loginWithPassword(email, input.password);
    if (!tokenRes.ok) {
      await this.auditLogger.log({ level: 'warn', action: SHARED_AUTH_AUDIT_ACTIONS.passwordLoginFailed, actorEmail: email, errorMessage: `HTTP ${tokenRes.status}: ${tokenRes.errorBody}`.slice(0, 500) });
      return { ok: false, statusCode: 401, message: 'Invalid credentials' };
    }

    const claims = await this.auth0.verifyJwt(tokenRes.idToken);
    const sub = String(claims.sub || '');
    const appCheck = await verifyAppSetupLogin(this.auth0, claims, sub, this.expectedAppSetup);
    if (!appCheck.ok) {
      await this.auditLogger.log({ level: 'warn', action: SHARED_AUTH_AUDIT_ACTIONS.passwordLoginDenied, actorEmail: email, errorMessage: appCheck.reason });
      return { ok: false, statusCode: 403, message: appCheck.reason };
    }

    let emailVerified = claims.email_verified === true;
    if (!emailVerified && this.auth0.getUserEmailVerified) {
      const fetched = await this.auth0.getUserEmailVerified(sub, tokenRes.accessToken);
      if (fetched !== null) emailVerified = fetched;
    }
    const resolved = await this.resolvePostLogin.execute(sub, String(claims.email || email), emailVerified);
    if (!resolved.ok) {
      await this.auditLogger.log({ level: 'warn', action: SHARED_AUTH_AUDIT_ACTIONS.passwordLoginDenied, actorEmail: email, errorMessage: resolved.reason });
      return { ok: false, statusCode: 403, message: resolved.reason };
    }

    const ttlSeconds = input.rememberDevice ? REMEMBER_COOKIE_TTL_SECONDS : DEFAULT_COOKIE_TTL_SECONDS;
    const sessionJwt = await this.sessionTokens.sign(resolved.session, ttlSeconds);
    await this.auditLogger.log({ level: 'info', action: SHARED_AUTH_AUDIT_ACTIONS.passwordLoginSuccess, actorEmail: resolved.session.email, actorUserId: resolved.session.userId });
    return { ok: true, sessionJwt, ttlSeconds, rememberDevice: Boolean(input.rememberDevice), session: resolved.session };
  }
}
