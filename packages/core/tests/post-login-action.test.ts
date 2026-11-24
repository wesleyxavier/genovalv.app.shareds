import { describe, expect, it, vi } from 'vitest';
import { onExecutePostLogin, type CompanyBinding, type PostLoginApi } from '../src/index';

function createApi(): PostLoginApi {
  return {
    access: { deny: vi.fn() },
    idToken: { setCustomClaim: vi.fn() },
    accessToken: { setCustomClaim: vi.fn() },
  };
}

const binding = (overrides: Partial<CompanyBinding> = {}): CompanyBinding => ({
  id: 'b-1',
  tenantId: 't-1',
  profileId: 'p-1',
  cpf: '11111111111',
  cnpj: '11222333000181',
  branchType: 'headquarters',
  sandbox: false,
  active: true,
  ...overrides,
});

describe('onExecutePostLogin', () => {
  it('denies unverified emails, inactive users, missing bindings and root conflicts', async () => {
    const api1 = createApi();
    await onExecutePostLogin({ user: { email_verified: false } }, api1);
    expect(api1.access.deny).toHaveBeenCalledWith('Please verify your email before accessing the system.');

    const api2 = createApi();
    await onExecutePostLogin({ user: { email_verified: true, app_metadata: { active: false } } }, api2);
    expect(api2.access.deny).toHaveBeenCalledWith('Your account is inactive. Please contact support.');

    const api3 = createApi();
    await onExecutePostLogin({ user: { email_verified: true } }, api3);
    expect(api3.access.deny).toHaveBeenCalledWith('No active company binding found for this user.');

    const api4 = createApi();
    await onExecutePostLogin({
      user: {
        email_verified: true,
        app_metadata: { bindings: [binding({ cnpj: '11222333000181' }), binding({ id: 'b-2', cnpj: '99888777000166' })] },
      },
    }, api4);
    expect(api4.access.deny).toHaveBeenCalledWith('Registration conflict: your email/CPF is linked to different companies. Contact your company.');
  });

  it('sets namespaced claims when authorization is present and handles missing authorization cleanly', async () => {
    const apiNoAuth = createApi();
    await onExecutePostLogin({
      user: { email_verified: true, app_metadata: { sql_id: 'u-1', cpf: '000', bindings: [binding()] } },
    }, apiNoAuth);
    expect(apiNoAuth.access.deny).not.toHaveBeenCalled();
    expect(apiNoAuth.idToken.setCustomClaim).not.toHaveBeenCalled();

    const apiWithAuth = createApi();
    await onExecutePostLogin(
      {
        user: { email_verified: true, app_metadata: { sql_id: 'u-1', cpf: '000', bindings: [binding()] } },
        authorization: {},
      },
      apiWithAuth,
      'https://custom.genova/',
    );
    expect(apiWithAuth.idToken.setCustomClaim).toHaveBeenCalledWith('https://custom.genova/id', 'u-1');
    expect(apiWithAuth.accessToken.setCustomClaim).toHaveBeenCalledWith('https://custom.genova/bindings', [binding()]);
  });
});
