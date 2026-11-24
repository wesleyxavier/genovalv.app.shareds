import type { AuthCookieConfig, IAuth0Gateway } from '@genovalv/core';
import type { H3Event } from 'h3';
import { BaseAuthController } from '../base/base-auth.controller';

export class LogoutController extends BaseAuthController {
  constructor(cookieConfig: AuthCookieConfig, private readonly auth0: Pick<IAuth0Gateway, 'buildLogoutUrl'>) {
    super(cookieConfig);
  }

  handle(event: H3Event) {
    this.clearSessionCookie(event);
    return { ok: true, logoutUrl: this.auth0.buildLogoutUrl() };
  }
}
