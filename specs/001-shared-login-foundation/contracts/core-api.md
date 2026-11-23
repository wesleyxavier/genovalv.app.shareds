# Contract: `@genovalv/core` Public API

**Package**: `@genovalv/core`
**Runtime**: Pure TypeScript (ESM + `.d.ts`, zero DOM/framework dependencies, SSR-safe)

## Exported Types

```ts
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
```

## Exported Functions & Constants

- `DEFAULT_LOCALE: SupportedLocale` (`'pt-BR'`)
- `LOGIN_TRANSLATIONS: Readonly<Record<SupportedLocale, LoginDictionary>>` (`pt-BR`, `en-US`, `es-ES`)
- `createTranslator(locale?: SupportedLocale | string, overrides?: Partial<LoginDictionary>): (key: LoginTranslationKey, params?: Record<string, string | number>) => string` — resolve chave no idioma escolhido, com fallback seguro para `pt-BR` e interpolação simples `{param}`.
- `DEFAULT_LOGIN_CONTEXT: Readonly<LoginContextConfiguration>`
- `MFA_GUIDANCE_MAP: Readonly<Record<MfaMethod, MfaGuidance>>`
- `normalizeEmail(value: string): string` — remove espaços externos e converte para minúsculas.
- `validateEmail(value: string, locale?: SupportedLocale): string | null` — retorna `null` se válido ou mensagem traduzida.
- `validatePassword(value: string, locale?: SupportedLocale): string | null` — retorna `null` se não vazia ou mensagem traduzida.
- `sanitizeMfaCode(value: string): string` — mantém apenas dígitos `0-9`, limitado a 6 caracteres.
- `formatMfaCodeDisplay(value: string): string` — formata `123456` como `123 456` para exibição legível.
- `validateMfaCode(value: string | undefined, mode: MfaMode, locale?: SupportedLocale): string | null` — ignora quando `'hidden'`; quando `'optional'`, valida 6 dígitos apenas se não vazio após sanitização; quando `'required'`, exige exatamente 6 dígitos.
- `validateLoginSubmission(raw: LoginRawInput, options?: { mfaMode?: MfaMode; locale?: SupportedLocale }): LoginValidationResult` — normaliza e valida todos os campos em conjunto, retornando `errors` e `errorKeys`.
- `getMfaGuidance(method: MfaMethod, locale?: SupportedLocale): MfaGuidance` — retorna label, título e dica técnica traduzidos para o método MFA selecionado.
