import type { H3Event } from 'h3';
import type { BackchannelLogoutUseCase } from '../../../application/use-cases/auth/backchannel-logout.usecase';
import { BaseController } from '../base/base.controller';

export class BackchannelLogoutController extends BaseController {
  constructor(private readonly backchannelLogoutUseCase: BackchannelLogoutUseCase) {
    super();
  }

  async handle(event: H3Event) {
    const body = await this.readJsonBody<{ logout_token?: string }>(event);
    return this.executeOrBadRequest(() => this.backchannelLogoutUseCase.execute(body.logout_token), 'Invalid logout_token');
  }
}
