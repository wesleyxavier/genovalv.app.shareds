export interface CreateManagementUserPayload {
  email: string;
  fullName: string;
  password: string;
  sqlId: string;
  cpf: string;
  env?: string;
  mustChangePassword?: boolean;
  appSetupId?: string;
  appSetupSecret?: string;
  environment?: string;
  genovaAdmin?: boolean;
}
