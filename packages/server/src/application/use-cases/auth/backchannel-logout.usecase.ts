import type { IAuth0Gateway } from '@genovalv/core';

export class BackchannelLogoutUseCase {
  constructor(private readonly auth0: IAuth0Gateway) {}

  async execute(logoutToken?: string): Promise<{ ok: true; sid: string | null; sub: string | null }> {
    if (!logoutToken) {
      throw new Error('Missing logout_token');
    }
    const claims = await this.auth0.verifyJwt(logoutToken);
    return {
      ok: true,
      sid: typeof claims.sid === 'string' ? claims.sid : null,
      sub: claims.sub ?? null,
    };
  }
}
