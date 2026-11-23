import { describe, expect, it, vi } from 'vitest';
import { registerGenovaElements } from '../src/index';

describe('genova form & locale web components', () => {
  it('renders genova-locale-selector and dispatches genova-locale-change', async () => {
    registerGenovaElements();
    const el = document.createElement('genova-locale-selector') as HTMLElement & {
      locale: string;
      updateComplete: Promise<boolean>;
    };
    document.body.appendChild(el);
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener('genova-locale-change', (ev) => {
      spy((ev as CustomEvent<{ locale: string }>).detail);
    });

    const select = el.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.value = 'en-US';
    select.dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(spy).toHaveBeenCalledWith({ locale: 'en-US' });
    el.remove();
  });

  it('renders genova-input with password toggle, error state and genova-input event', async () => {
    registerGenovaElements();
    const el = document.createElement('genova-input') as HTMLElement & {
      type: string;
      name: string;
      label: string;
      value: string;
      error: string;
      showPasswordToggle: boolean;
      updateComplete: Promise<boolean>;
    };
    el.type = 'password';
    el.name = 'password';
    el.label = 'Senha';
    el.showPasswordToggle = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const inputSpy = vi.fn();
    el.addEventListener('genova-input', (ev) => {
      inputSpy((ev as CustomEvent<{ value: string; name: string }>).detail);
    });

    const innerInput = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(innerInput.type).toBe('password');

    const toggle = el.shadowRoot?.querySelector('button.toggle') as HTMLButtonElement;
    toggle.click();
    await el.updateComplete;
    expect((el.shadowRoot?.querySelector('input') as HTMLInputElement).type).toBe('text');

    innerInput.value = 'Secret123';
    innerInput.dispatchEvent(new Event('input'));
    expect(inputSpy).toHaveBeenCalledWith({ value: 'Secret123', name: 'password' });

    el.error = 'Informe sua senha.';
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('#error-msg')?.textContent).toBe('Informe sua senha.');
    el.remove();
  });

  it('renders genova-checkbox and dispatches genova-change', async () => {
    registerGenovaElements();
    const el = document.createElement('genova-checkbox') as HTMLElement & {
      name: string;
      label: string;
      checked: boolean;
      updateComplete: Promise<boolean>;
    };
    el.name = 'rememberDevice';
    el.label = 'Lembrar este dispositivo por 30 dias';
    el.checked = true;
    document.body.appendChild(el);
    await el.updateComplete;

    const spy = vi.fn();
    el.addEventListener('genova-change', (ev) => {
      spy((ev as CustomEvent<{ checked: boolean; name: string }>).detail);
    });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = false;
    input.dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(spy).toHaveBeenCalledWith({ checked: false, name: 'rememberDevice' });
    el.remove();
  });
});
