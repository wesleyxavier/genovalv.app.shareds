import type { AuthCookieConfig, PasswordLoginInput } from '@genovalv/core';
import { createError, type H3Event } from 'h3';
import type { PasswordLoginUseCase } from '../../../application/use-cases/auth/password-login.usecase';
import { BaseAuthController } from '../base/base-auth.controller';

export class PasswordLoginController extends BaseAuthController {
  constructor(
    cookieConfig: AuthCookieConfig,
    private readonly passwordLoginUseCase: PasswordLoginUseCase,
    private readonly defaultRole = 'user',
  ) {
    super(cookieConfig);
  }

  async handle(event: H3Event) {
    const body = await this.readJsonBody<PasswordLoginInput>(event);
    const outcome = await this.passwordLoginUseCase.execute(body);
    if (!outcome.ok) {
      throw createError({ statusCode: outcome.statusCode, statusMessage: outcome.message });
    }
    this.setSessionCookie(event, outcome.sessionJwt, outcome.ttlSeconds);
    return {
      authenticated: true,
      user: { id: outcome.session.userId, email: outcome.session.email, name: outcome.session.fullName, role: this.defaultRole },
      expiresAt: Date.now() + outcome.ttlSeconds * 1000,
      rememberDevice: outcome.rememberDevice,
    };
  }
}
