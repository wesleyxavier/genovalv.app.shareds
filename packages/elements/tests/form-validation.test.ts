import { describe, expect, it, vi } from 'vitest';
import { registerGenovaElements } from '../src/index';

describe('form-associated validation & button submit', () => {
  it('submits parent form on genova-button type=submit unless genova-press prevented', async () => {
    registerGenovaElements();
    const form = document.createElement('form');
    const input = document.createElement('genova-input') as HTMLElement & {
      required: boolean; value: string; checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    input.required = true;
    const select = document.createElement('genova-select') as HTMLElement & {
      required: boolean; value: string; options: Array<{ label: string; value: string }>;
      error: string; checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    select.required = true;
    select.options = [{ label: 'Geral', value: 'g1' }];

    const btn = document.createElement('genova-button') as HTMLElement & {
      type: 'button' | 'submit' | 'reset'; updateComplete: Promise<boolean>;
    };
    btn.type = 'submit';
    form.append(input, select, btn);
    document.body.appendChild(form);
    await Promise.all([input.updateComplete, select.updateComplete, btn.updateComplete]);

    expect(input.checkValidity()).toBe(false);
    expect(select.checkValidity()).toBe(false);

    const submitSpy = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener('submit', submitSpy);
    const shadowBtn = btn.shadowRoot?.querySelector('button') as HTMLButtonElement;
    shadowBtn.click();
    expect(submitSpy).not.toHaveBeenCalled();

    input.value = 'Empresa OK';
    select.value = 'g1';
    await Promise.all([input.updateComplete, select.updateComplete]);
    expect(input.checkValidity()).toBe(true);
    expect(select.checkValidity()).toBe(true);

    shadowBtn.click();
    expect(submitSpy).toHaveBeenCalledTimes(1);

    select.error = 'Selecione um item';
    await select.updateComplete;
    expect(select.shadowRoot?.querySelector('#error-msg')?.textContent).toBe('Selecione um item');
    form.remove();
  });

  it('validates genova-textarea and blocks negative values in genova-number-input when min >= 0', async () => {
    registerGenovaElements();
    const ta = document.createElement('genova-textarea') as HTMLElement & {
      required: boolean; value: string; error: string; checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    ta.required = true;
    const num = document.createElement('genova-number-input') as HTMLElement & {
      min: number; value: number; updateComplete: Promise<boolean>;
    };
    num.min = 0;
    num.value = 5;
    document.body.append(ta, num);
    await Promise.all([ta.updateComplete, num.updateComplete]);

    expect(ta.checkValidity()).toBe(false);
    ta.value = 'Texto válido';
    await ta.updateComplete;
    expect(ta.checkValidity()).toBe(true);

    const innerNum = num.shadowRoot?.querySelector('input') as HTMLInputElement;
    innerNum.value = '-10';
    innerNum.dispatchEvent(new Event('change'));
    expect(num.value).toBe(0);
    ta.remove();
    num.remove();
  });
});
