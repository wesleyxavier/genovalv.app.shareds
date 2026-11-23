import { describe, expect, it } from 'vitest';
import { DEFAULT_LOGIN_CONTEXT } from '../src/auth/context';

describe('DEFAULT_LOGIN_CONTEXT', () => {
  it('provides Genova Cloud Console defaults aligned with reference template', () => {
    expect(DEFAULT_LOGIN_CONTEXT.locale).toBe('pt-BR');
    expect(DEFAULT_LOGIN_CONTEXT.brandName).toBe('Genova');
    expect(DEFAULT_LOGIN_CONTEXT.brandSuffix).toBe('Cloud');
    expect(DEFAULT_LOGIN_CONTEXT.portalTitle).toBe('Genova Cloud');
    expect(DEFAULT_LOGIN_CONTEXT.portalSubtitle).toBe('Admin Console • Acesso Restrito');
    expect(DEFAULT_LOGIN_CONTEXT.securityBadgeText).toBe('Ambiente Seguro');
    expect(DEFAULT_LOGIN_CONTEXT.mfaMode).toBe('optional');
    expect(DEFAULT_LOGIN_CONTEXT.rememberDeviceDays).toBe(30);
    expect(DEFAULT_LOGIN_CONTEXT.submitLabel).toBe('Entrar');
    expect(DEFAULT_LOGIN_CONTEXT.supportLinks.length).toBe(3);
    expect(DEFAULT_LOGIN_CONTEXT.footerLinks.length).toBe(3);
  });
});
