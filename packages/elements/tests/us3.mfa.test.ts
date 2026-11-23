import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';

describe('US3 MFA Selector Element', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('switches MFA method, updates guidance text and emits composed event', async () => {
    const selector = document.createElement('genova-mfa-selector') as HTMLElement & {
      selectedMethod: 'totp' | 'yubikey' | 'biometric';
      locale: 'pt-BR' | 'en-US';
      updateComplete: Promise<boolean>;
    };
    selector.selectedMethod = 'totp';
    selector.locale = 'pt-BR';
    document.body.appendChild(selector);
    await selector.updateComplete;

    let lastEvent: { method: string; guidance: { title: string } } | null = null;
    document.body.addEventListener('genova-mfa-method-change', (ev) => {
      lastEvent = (ev as CustomEvent).detail;
    });

    const yubikeyBtn = selector.shadowRoot?.querySelector('[data-method="yubikey"]') as HTMLButtonElement;
    expect(yubikeyBtn).not.toBeNull();
    yubikeyBtn.click();
    await selector.updateComplete;

    expect(selector.selectedMethod).toBe('yubikey');
    expect(lastEvent?.method).toBe('yubikey');
    expect(lastEvent?.guidance.title).toContain('YubiKey');
    expect(selector.shadowRoot?.textContent).toContain('WebAuthn CTAP2');
  });
});
