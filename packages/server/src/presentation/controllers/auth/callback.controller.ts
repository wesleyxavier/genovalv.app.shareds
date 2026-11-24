import type { AuthCookieConfig } from '@genovalv/core';
import { sendRedirect, type H3Event } from 'h3';
import type { OAuthCallbackUseCase } from '../../../application/use-cases/auth/oauth-callback.usecase';
import { BaseAuthController } from '../base/base-auth.controller';

export class CallbackController extends BaseAuthController {
  constructor(cookieConfig: AuthCookieConfig, private readonly oauthCallbackUseCase: OAuthCallbackUseCase) {
    super(cookieConfig);
  }

  async handle(event: H3Event) {
    const code = this.getQueryString(event, 'code');
    const outcome = await this.oauthCallbackUseCase.execute(code);
    if (outcome.ok) {
      this.setSessionCookie(event, outcome.sessionJwt);
    }
    return sendRedirect(event, outcome.redirectTo, 302);
  }
}
