import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';

describe('US2 Action Button & Alert Banner', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('blocks genova-action event while state is validating or disabled', async () => {
    const btn = document.createElement('genova-action-button') as HTMLElement & {
      state: 'idle' | 'validating' | 'success' | 'error';
      disabled: boolean;
      updateComplete: Promise<boolean>;
    };
    document.body.appendChild(btn);
    await btn.updateComplete;

    let clicks = 0;
    btn.addEventListener('genova-action', () => {
      clicks += 1;
    });

    const nativeBtn = () => btn.shadowRoot?.querySelector('button') as HTMLButtonElement;
    nativeBtn().click();
    expect(clicks).toBe(1);

    btn.state = 'validating';
    await btn.updateComplete;
    expect(nativeBtn().disabled).toBe(true);
    nativeBtn().click();
    expect(clicks).toBe(1);

    btn.state = 'idle';
    btn.disabled = true;
    await btn.updateComplete;
    nativeBtn().click();
    expect(clicks).toBe(1);
  });

  it('renders genova-alert-banner only when visible and exposes role=alert for error', async () => {
    const alert = document.createElement('genova-alert-banner') as HTMLElement & {
      variant: 'error' | 'success' | 'warning' | 'info';
      message: string;
      visible: boolean;
      updateComplete: Promise<boolean>;
    };
    alert.variant = 'error';
    alert.message = 'Credenciais inválidas';
    alert.visible = false;
    document.body.appendChild(alert);
    await alert.updateComplete;

    expect(alert.shadowRoot?.querySelector('[role="alert"]')).toBeNull();

    alert.visible = true;
    await alert.updateComplete;
    const banner = alert.shadowRoot?.querySelector('[role="alert"]');
    expect(banner?.textContent).toContain('Credenciais inválidas');
  });
});
