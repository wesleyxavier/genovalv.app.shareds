import type { CreateManagementUserPayload } from '@genovalv/core';

/** Builds Auth0 POST /api/v2/users body with app_metadata and optional user_metadata. */
export function buildManagementUserBody(payload: CreateManagementUserPayload): Record<string, unknown> {
  const appMetadata: Record<string, unknown> = {
    sql_id: payload.sqlId,
    cpf: payload.cpf,
    active: true,
    must_change_password: payload.mustChangePassword ?? true,
    ...(payload.env ? { env: payload.env } : {}),
    ...(payload.appSetupId ? { app_setup_id: payload.appSetupId } : {}),
    ...(payload.appSetupSecret ? { app_setup_secret: payload.appSetupSecret } : {}),
    ...(payload.environment ? { environment: payload.environment } : {}),
  };

  return {
    connection: 'Username-Password-Authentication',
    email: payload.email,
    name: payload.fullName,
    password: payload.password,
    email_verified: true,
    app_metadata: appMetadata,
    ...(payload.genovaAdmin !== undefined ? { user_metadata: { genova_admin: payload.genovaAdmin } } : {}),
  };
}
