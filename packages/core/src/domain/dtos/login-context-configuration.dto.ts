import type { LoginLink } from './login-link.dto';
import type { MfaMethod } from './mfa-method.dto';
import type { MfaMode } from './mfa-mode.dto';
import type { SupportedLocale } from './supported-locale.dto';

export interface LoginContextConfiguration {
  locale: SupportedLocale;
  brandName: string;
  brandSuffix?: string;
  portalTitle: string;
  portalSubtitle: string;
  securityBadgeText: string;
  mfaMode: MfaMode;
  allowMfaMethodSwitch: boolean;
  defaultMfaMethod?: MfaMethod;
  submitLabel: string;
  forgotPasswordHref?: string;
  rememberDeviceDays: number;
  supportLinks: LoginLink[];
  footerLinks: LoginLink[];
  copyrightText: string;
}
