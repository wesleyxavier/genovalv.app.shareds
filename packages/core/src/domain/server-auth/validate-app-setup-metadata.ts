import type { AppSetupContext, Auth0UserMetadataSnapshot } from './app-setup-context';

export interface AppSetupValidationSuccess {
  ok: true;
}

export interface AppSetupValidationFailure {
  ok: false;
  reason: 'app_setup_mismatch' | 'genova_admin_required';
}

function readString(source: Record<string, unknown>, key: string): string {
  const raw = source[key];
  return typeof raw === 'string' ? raw.trim() : '';
}

export function extractAppSetupMetadata(
  claims: Record<string, unknown>,
  metadata?: Auth0UserMetadataSnapshot,
  claimsNamespace = 'https://genova.cloud/',
): { appSetupId: string; appSetupSecret: string; environment: string; genovaAdmin: boolean } {
  const appMeta = metadata?.appMetadata ?? {};
  const userMeta = metadata?.userMetadata ?? {};
  return {
    appSetupId: readString(claims, `${claimsNamespace}app_setup_id`) || readString(appMeta, 'app_setup_id'),
    appSetupSecret: readString(claims, `${claimsNamespace}app_setup_secret`) || readString(appMeta, 'app_setup_secret'),
    environment: readString(claims, `${claimsNamespace}environment`) || readString(appMeta, 'environment'),
    genovaAdmin:
      claims[`${claimsNamespace}genova_admin`] === true ||
      userMeta['genova_admin'] === true,
  };
}

export function validateAppSetupMetadata(
  expected: AppSetupContext,
  claims: Record<string, unknown>,
  metadata?: Auth0UserMetadataSnapshot,
): AppSetupValidationSuccess | AppSetupValidationFailure {
  const resolved = extractAppSetupMetadata(claims, metadata, expected.claimsNamespace);
  const matchesAppSetup =
    Boolean(expected.appSetupId && expected.appSetupSecret && expected.environment) &&
    resolved.appSetupId === expected.appSetupId &&
    resolved.appSetupSecret === expected.appSetupSecret &&
    resolved.environment === expected.environment;
  if (!matchesAppSetup) {
    return { ok: false, reason: 'app_setup_mismatch' };
  }
  if (expected.requireGenovaAdmin && !resolved.genovaAdmin) {
    return { ok: false, reason: 'genova_admin_required' };
  }
  return { ok: true };
}
