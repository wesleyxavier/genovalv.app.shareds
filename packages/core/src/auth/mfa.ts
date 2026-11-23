import { createTranslator } from '../i18n/translator';
import type { MfaGuidance, MfaMethod, MfaMode, SupportedLocale } from './types';

export const MFA_GUIDANCE_MAP: Readonly<Record<MfaMethod, MfaGuidance>> = {
  totp: {
    method: 'totp',
    label: 'App Authenticator',
    title: 'Abra o Google Authenticator ou Microsoft Auth',
    hint: 'Insira o token temporário de 6 dígitos gerado.',
  },
  yubikey: {
    method: 'yubikey',
    label: 'Chave FIDO2 / YubiKey',
    title: 'Insira ou toque no seu YubiKey',
    hint: 'Aguardando sinal WebAuthn CTAP2...',
  },
  biometric: {
    method: 'biometric',
    label: 'Biometria',
    title: 'Autenticação Biométrica Pronta',
    hint: 'Posicione o dedo no sensor Touch ID ou use Windows Hello.',
  },
};

export function sanitizeMfaCode(value: string): string {
  return value.replace(/\D/g, '').slice(0, 6);
}

export function formatMfaCodeDisplay(value: string): string {
  const digits = sanitizeMfaCode(value);
  if (digits.length <= 3) {
    return digits;
  }
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function validateMfaCode(
  value: string | undefined,
  mode: MfaMode,
  locale?: SupportedLocale,
): string | null {
  if (mode === 'hidden') {
    return null;
  }

  const digits = sanitizeMfaCode(value ?? '');
  const t = createTranslator(locale);

  if (digits.length === 0) {
    return mode === 'required' ? t('validation.mfaRequired') : null;
  }

  if (digits.length !== 6) {
    return t('validation.mfaLength');
  }

  return null;
}

export function getMfaGuidance(method: MfaMethod, locale?: SupportedLocale): MfaGuidance {
  const t = createTranslator(locale);
  return {
    method,
    label: t(`mfa.${method}.label`),
    title: t(`mfa.${method}.title`),
    hint: t(`mfa.${method}.hint`),
  };
}
