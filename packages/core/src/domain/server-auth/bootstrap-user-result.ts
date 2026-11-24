export interface BootstrapUserResult {
  email: string;
  auth0Id: string;
  temporaryPassword: string;
  passwordChangeTicketUrl: string;
  emailVerified: boolean;
  provisioningMode: 'management-api' | 'dbconnections-signup';
}
