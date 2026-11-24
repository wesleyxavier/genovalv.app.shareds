import type {
  BootstrapUserInput,
  BootstrapUserResult,
  IAuth0Gateway,
  IBaseAuthUserRepository,
  IHashService,
} from '@genovalv/core';

export class BootstrapUseCase {
  constructor(
    private readonly userRepo: IBaseAuthUserRepository,
    private readonly auth0: IAuth0Gateway,
    private readonly hashService: IHashService,
  ) {}

  async execute(input: BootstrapUserInput): Promise<BootstrapUserResult> {
    const user = await this.userRepo.findByEmail(input.seedUserEmail);
    if (!user) throw new Error(`Seed user ${input.seedUserEmail} not found. Run migrations first.`);

    const temporaryPassword = input.seedUserPassword || this.hashService.generateStrongPassword();
    const tokenRes = await this.auth0.obtainManagementToken();

    if (tokenRes.ok) {
      const created = await this.auth0.createManagementUser(tokenRes.token, {
        email: user.email,
        fullName: user.fullName,
        password: temporaryPassword,
        sqlId: user.id,
        cpf: user.documentNumber,
      });
      await this.userRepo.linkAuth0Id(user.id, created.userId, true);
      const passwordChangeTicketUrl = await this.auth0.createPasswordChangeTicket(tokenRes.token, created.userId, `${input.appBaseUrl}/login`);
      return { email: user.email, auth0Id: created.userId, temporaryPassword, passwordChangeTicketUrl, emailVerified: true, provisioningMode: 'management-api' };
    }

    if (tokenRes.status === 401 || tokenRes.status === 403) {
      const signedUp = await this.auth0.signupDatabaseUser(user.email, user.fullName, temporaryPassword);
      await this.userRepo.linkAuth0Id(user.id, signedUp.auth0Id, signedUp.emailVerified);
      return { email: user.email, auth0Id: signedUp.auth0Id, temporaryPassword, passwordChangeTicketUrl: '', emailVerified: signedUp.emailVerified, provisioningMode: 'dbconnections-signup' };
    }

    throw new Error(`Failed to obtain Auth0 Management token (${tokenRes.status}): ${tokenRes.errorBody}`);
  }
}
