import type { ISessionTokenGateway, UserCookieSession } from '@genovalv/core';
import type { H3Event } from 'h3';
import { requireIdempotencyKey } from '../../../infrastructure/http/require-idempotency-key';
import { requireUserSession } from '../../../infrastructure/http/require-user-session';
import { BaseController } from './base.controller';

export abstract class BaseUserController extends BaseController {
  constructor(
    private readonly cookieName: string,
    private readonly sessionTokens: ISessionTokenGateway,
  ) {
    super();
  }

  protected requireSession(event: H3Event): Promise<UserCookieSession> {
    return requireUserSession(event, this.cookieName, this.sessionTokens);
  }

  protected requireIdempotencyKey(event: H3Event): string {
    return requireIdempotencyKey(event);
  }
}
