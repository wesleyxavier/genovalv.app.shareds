import type { ISessionTokenGateway } from '@genovalv/core';
import { getCookie, setResponseStatus, type H3Event } from 'h3';
import { BaseController } from '../base/base.controller';

export class MeController extends BaseController {
  constructor(
    private readonly cookieName: string,
    private readonly sessionTokens: ISessionTokenGateway,
  ) {
    super();
  }

  async handle(event: H3Event) {
    const token = getCookie(event, this.cookieName);
    const session = token ? await this.sessionTokens.verify(token) : null;
    if (!session) {
      setResponseStatus(event, 401);
      return { authenticated: false };
    }
    return { authenticated: true, session };
  }
}
