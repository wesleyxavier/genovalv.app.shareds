import type { AuthCookieConfig } from '@genovalv/core';
import { setHeader, type H3Event } from 'h3';
import { buildSessionCookieHeader } from '../../../infrastructure/http/build-session-cookie-header';
import { clearSessionCookieHeader } from '../../../infrastructure/http/clear-session-cookie-header';
import { BaseController } from './base.controller';

export abstract class BaseAuthController extends BaseController {
  constructor(protected readonly cookieConfig: AuthCookieConfig) {
    super();
  }

  protected setSessionCookie(event: H3Event, jwt: string, ttlSeconds?: number): void {
    const header = buildSessionCookieHeader(
      this.cookieConfig.cookieName,
      jwt,
      this.cookieConfig.cookieSecure,
      ttlSeconds,
    );
    setHeader(event, 'Set-Cookie', header);
  }

  protected clearSessionCookie(event: H3Event): void {
    setHeader(event, 'Set-Cookie', clearSessionCookieHeader(this.cookieConfig.cookieName, this.cookieConfig.cookieSecure));
  }
}
