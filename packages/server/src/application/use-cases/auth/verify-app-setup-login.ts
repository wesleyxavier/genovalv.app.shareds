import {
  extractAppSetupMetadata,
  validateAppSetupMetadata,
  type AppSetupContext,
  type IAuth0Gateway,
} from '@genovalv/core';

/** Verifies APP_SETUP_* / ENVIRONMENT / GENOVA_ADMIN from JWT claims with Management API fallback. */
export async function verifyAppSetupLogin(
  auth0: IAuth0Gateway,
  claims: Record<string, unknown>,
  sub: string,
  expectedAppSetup?: AppSetupContext,
) {
  if (!expectedAppSetup) {
    return { ok: true as const };
  }
  const direct = validateAppSetupMetadata(expectedAppSetup, claims);
  if (direct.ok) {
    return direct;
  }
  const fromClaims = extractAppSetupMetadata(claims, undefined, expectedAppSetup.claimsNamespace);
  const claimsMissingSetup = !fromClaims.appSetupId && !fromClaims.appSetupSecret && !fromClaims.environment;
  if (claimsMissingSetup && auth0.getUserMetadata && sub) {
    const metadata = await auth0.getUserMetadata(sub);
    return validateAppSetupMetadata(expectedAppSetup, claims, metadata ?? undefined);
  }
  return direct;
}
