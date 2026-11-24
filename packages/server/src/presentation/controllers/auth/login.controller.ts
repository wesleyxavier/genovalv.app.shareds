import type { IAuth0Gateway } from '@genovalv/core';
import { sendRedirect, type H3Event } from 'h3';
import { BaseController } from '../base/base.controller';

export class LoginController extends BaseController {
  constructor(private readonly auth0: Pick<IAuth0Gateway, 'buildAuthorizeUrl'>) {
    super();
  }

  handle(event: H3Event) {
    return sendRedirect(event, this.auth0.buildAuthorizeUrl(), 302);
  }
}
