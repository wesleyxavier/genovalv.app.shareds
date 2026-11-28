import { describe, expect, it } from 'vitest';
import { validateAppSetupMetadata, type AppSetupContext } from '../src/index';

const baseCtx: AppSetupContext = {
  appSetupId: 'setup-1',
  appSetupSecret: 'sec-1',
  environment: 'production',
  requireGenovaAdmin: true,
  claimsNamespace: 'https://genova.cloud/',
};

describe('validateAppSetupMetadata', () => {
  it('accepts matching namespaced claims including genova_admin true', () => {
    const res = validateAppSetupMetadata(baseCtx, {
      'https://genova.cloud/app_setup_id': ' setup-1 ',
      'https://genova.cloud/app_setup_secret': 'sec-1',
      'https://genova.cloud/environment': 'production',
      'https://genova.cloud/genova_admin': true,
    });
    expect(res).toEqual({ ok: true });
  });

  it('accepts matching appMetadata and userMetadata when claims omit them', () => {
    const res = validateAppSetupMetadata(
      { appSetupId: 'setup-1', appSetupSecret: 'sec-1', environment: 'development' },
      { 'https://genova.cloud/app_setup_id': 123 },
      {
        appMetadata: { app_setup_id: 'setup-1', app_setup_secret: 'sec-1', environment: 'development' },
        userMetadata: { genova_admin: true },
      },
    );
    expect(res).toEqual({ ok: true });
  });

  it('rejects mismatched or missing app setup metadata', () => {
    expect(validateAppSetupMetadata(baseCtx, {})).toEqual({ ok: false, reason: 'app_setup_mismatch' });
    expect(
      validateAppSetupMetadata({ ...baseCtx, appSetupSecret: '' }, {}, { appMetadata: { app_setup_id: 'setup-1' } }),
    ).toEqual({ ok: false, reason: 'app_setup_mismatch' });
    expect(
      validateAppSetupMetadata(baseCtx, {}, {
        appMetadata: { app_setup_id: 'setup-1', app_setup_secret: 'sec-1', environment: 'staging' },
        userMetadata: { genova_admin: true },
      }),
    ).toEqual({ ok: false, reason: 'app_setup_mismatch' });
  });

  it('rejects missing genova_admin when requireGenovaAdmin is true', () => {
    const res = validateAppSetupMetadata(baseCtx, {}, {
      appMetadata: { app_setup_id: 'setup-1', app_setup_secret: 'sec-1', environment: 'production' },
      userMetadata: { genova_admin: false },
    });
    expect(res).toEqual({ ok: false, reason: 'genova_admin_required' });
  });
});
