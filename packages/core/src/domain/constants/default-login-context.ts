import type { LoginContextConfiguration } from '../dtos/login-context-configuration.dto';
import { GENOVA_BRAND_NAME } from './brand-name';

export const DEFAULT_LOGIN_CONTEXT: Readonly<LoginContextConfiguration> = {
  locale: 'pt-BR',
  brandName: 'Genova',
  brandSuffix: 'Cloud',
  portalTitle: GENOVA_BRAND_NAME,
  portalSubtitle: 'Admin Console • Acesso Restrito',
  securityBadgeText: 'Ambiente Seguro',
  mfaMode: 'optional',
  allowMfaMethodSwitch: false,
  defaultMfaMethod: 'totp',
  submitLabel: 'Entrar',
  forgotPasswordHref: '#forgot-password',
  rememberDeviceDays: 30,
  supportLinks: [
    { label: 'Ajuda', href: '#help' },
    { label: 'Políticas de Privacidade', href: '#privacy' },
    { label: 'Status do Sistema', href: '#status' },
  ],
  footerLinks: [
    { label: 'Termos de Uso', href: '#terms' },
    { label: 'Segurança', href: '#security' },
    { label: 'Suporte', href: '#support' },
  ],
  copyrightText: '© 2026 Genova Cloud. Todos os direitos reservados.',
};
