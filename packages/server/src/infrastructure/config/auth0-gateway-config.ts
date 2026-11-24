export interface Auth0GatewayConfig {
  auth0Domain: string;
  auth0ClientId: string;
  auth0ClientSecret: string;
  auth0MgmtClientId: string;
  auth0MgmtClientSecret: string;
  auth0Audience: string;
  auth0CallbackUrl: string;
  auth0LogoutReturnUrl: string;
}
