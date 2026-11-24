import type { MfaGuidance } from '../dtos/mfa-guidance.dto';
import type { MfaMethod } from '../dtos/mfa-method.dto';

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
