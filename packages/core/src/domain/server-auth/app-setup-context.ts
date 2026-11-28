export interface AppSetupContext {
  appSetupId: string;
  appSetupSecret: string;
  environment: string;
  requireGenovaAdmin?: boolean;
  claimsNamespace?: string;
}

export interface Auth0UserMetadataSnapshot {
  appMetadata?: Record<string, unknown>;
  userMetadata?: Record<string, unknown>;
}
