import type { PostLoginApi } from '../../domain/server-auth/ipost-login-api';
import type { PostLoginEvent } from '../../domain/server-auth/ipost-login-event';
import { validateActiveBindings } from '../../domain/validators/validate-active-bindings';

export async function onExecutePostLogin(
  event: PostLoginEvent,
  api: PostLoginApi,
  namespace = 'https://genova.cloud/',
): Promise<void> {
  if (!event.user.email_verified) {
    api.access.deny('Please verify your email before accessing the system.');
    return;
  }
  const metadata = event.user.app_metadata ?? {};
  if (metadata.active === false) {
    api.access.deny('Your account is inactive. Please contact support.');
    return;
  }
  const validation = validateActiveBindings(metadata.bindings ?? []);
  if (!validation.ok) {
    api.access.deny(validation.reason === 'no_active_bindings'
      ? 'No active company binding found for this user.'
      : 'Registration conflict: your email/CPF is linked to different companies. Contact your company.');
    return;
  }
  if (event.authorization) {
    const claims: Record<string, unknown> = {
      [`${namespace}id`]: metadata.sql_id,
      [`${namespace}cpf`]: metadata.cpf,
      [`${namespace}bindings`]: validation.activeBindings,
    };
    if (metadata.app_setup_id) claims[`${namespace}app_setup_id`] = metadata.app_setup_id;
    if (metadata.app_setup_secret) claims[`${namespace}app_setup_secret`] = metadata.app_setup_secret;
    if (metadata.environment) claims[`${namespace}environment`] = metadata.environment;
    if (event.user.user_metadata?.genova_admin !== undefined) {
      claims[`${namespace}genova_admin`] = event.user.user_metadata.genova_admin;
    }
    for (const [k, v] of Object.entries(claims)) {
      api.idToken.setCustomClaim(k, v);
      api.accessToken.setCustomClaim(k, v);
    }
  }
}
