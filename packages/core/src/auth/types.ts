export type SupportedLocale = 'pt-BR' | 'en-US' | 'es-ES';
export type MfaMode = 'hidden' | 'optional' | 'required';
export type MfaMethod = 'totp' | 'yubikey' | 'biometric';
export type SubmissionState = 'idle' | 'validating' | 'success' | 'error';

export type LoginTranslationKey =
  | 'header.securityBadge'
  | 'auth.emailLabel'
  | 'auth.emailPlaceholder'
  | 'auth.passwordLabel'
  | 'auth.forgotPassword'
  | 'auth.showPassword'
  | 'auth.hidePassword'
  | 'auth.mfaLabel'
  | 'auth.mfaHint'
  | 'auth.rememberDevice'
  | 'auth.submit'
  | 'auth.submitting'
  | 'auth.success'
  | 'auth.invalidCredentials'
  | 'validation.emailRequired'
  | 'validation.emailInvalid'
  | 'validation.passwordRequired'
  | 'validation.mfaRequired'
  | 'validation.mfaLength'
  | 'mfa.totp.label'
  | 'mfa.totp.title'
  | 'mfa.totp.hint'
  | 'mfa.yubikey.label'
  | 'mfa.yubikey.title'
  | 'mfa.yubikey.hint'
  | 'mfa.biometric.label'
  | 'mfa.biometric.title'
  | 'mfa.biometric.hint';

export type LoginDictionary = Record<LoginTranslationKey, string>;

export interface LoginLink {
  label: string;
  href: string;
  external?: boolean;
}

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

export interface LoginRawInput {
  email: string;
  password: string;
  mfaCode?: string;
  mfaMethod?: MfaMethod;
  rememberDevice?: boolean;
}

export interface LoginSubmissionInput {
  email: string;
  password: string;
  mfaCode?: string;
  mfaMethod?: MfaMethod;
  rememberDevice: boolean;
}

export type LoginFieldName = 'email' | 'password' | 'mfaCode';

export interface LoginValidationResult {
  valid: boolean;
  errors: Partial<Record<LoginFieldName, string>>;
  errorKeys: Partial<Record<LoginFieldName, LoginTranslationKey>>;
  normalized: LoginSubmissionInput;
}

export interface MfaGuidance {
  method: MfaMethod;
  label: string;
  title: string;
  hint: string;
}
