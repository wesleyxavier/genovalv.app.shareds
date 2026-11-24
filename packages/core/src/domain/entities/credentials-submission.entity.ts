import type { SupportedLocale } from '../dtos/supported-locale.dto';

export interface CredentialsSubmission {
  email: string;
  password: string;
  rememberDevice: boolean;
  locale: SupportedLocale;
}
