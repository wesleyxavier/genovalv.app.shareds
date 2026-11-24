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
    for (const [k, v] of Object.entries({
      [`${namespace}id`]: metadata.sql_id,
      [`${namespace}cpf`]: metadata.cpf,
      [`${namespace}bindings`]: validation.activeBindings,
    })) {
      api.idToken.setCustomClaim(k, v);
      api.accessToken.setCustomClaim(k, v);
    }
  }
}
