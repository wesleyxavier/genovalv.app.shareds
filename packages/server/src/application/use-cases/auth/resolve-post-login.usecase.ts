import {
  validateActiveBindings,
  type IBaseAuthUserRepository,
  type ResolveUserResult,
} from '@genovalv/core';

export class ResolvePostLoginUseCase {
  constructor(private readonly userRepo: IBaseAuthUserRepository) {}

  async execute(auth0Sub: string, email: string, emailVerified: boolean): Promise<ResolveUserResult> {
    if (!emailVerified) return { ok: false, reason: 'email_not_verified' };

    const user = (await this.userRepo.findByAuth0Id(auth0Sub)) ?? (await this.userRepo.findByEmail(email));
    if (!user) return { ok: false, reason: 'contact_company' };
    if (!user.active) return { ok: false, reason: 'inactive' };

    if (!user.auth0Id || user.emailVerified !== emailVerified) {
      await this.userRepo.linkAuth0Id(user.id, auth0Sub, emailVerified);
    }

    const bindings = await this.userRepo.findBindingsByUserId(user.id);
    const validation = validateActiveBindings(bindings);
    if (bindings.length > 0 && !validation.ok) return { ok: false, reason: 'binding_conflict' };

    return {
      ok: true,
      session: {
        userId: user.id,
        auth0Id: auth0Sub,
        email: user.email,
        fullName: user.fullName,
        documentType: user.documentType,
        documentNumber: user.documentNumber,
        bindings: validation.ok ? validation.activeBindings : [],
      },
    };
  }
}
