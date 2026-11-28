import { describe, expect, it, vi } from 'vitest';
import { registerGenovaElements } from '../src/index';

describe('genova-input search type & cpf/cnpj/cep masks', () => {
  it('masks cpf, blocks letters and negative sign, and triggers genova-search on magnifier click', async () => {
    registerGenovaElements();
    const el = document.createElement('genova-input') as HTMLElement & {
      type: string; inputmode: string; name: string; value: string;
      checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    el.type = 'search';
    el.inputmode = 'cpf';
    el.name = 'cpf';
    document.body.appendChild(el);
    await el.updateComplete;

    const inner = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(inner.type).toBe('search');
    expect(inner.getAttribute('inputmode')).toBe('numeric');

    const minusEv = new KeyboardEvent('keydown', { key: '-', cancelable: true });
    inner.dispatchEvent(minusEv);
    expect(minusEv.defaultPrevented).toBe(true);

    inner.value = '-529a98224725';
    inner.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.value).toBe('529.982.247-25');
    expect(el.checkValidity()).toBe(true);

    const searchSpy = vi.fn();
    el.addEventListener('genova-search', (ev) => searchSpy((ev as CustomEvent).detail));
    const searchBtn = el.shadowRoot?.querySelector('button.search-btn') as HTMLButtonElement;
    expect(searchBtn).toBeTruthy();
    searchBtn.click();
    expect(searchSpy).toHaveBeenCalledWith({
      value: '529.982.247-25',
      rawDigits: '52998224725',
      inputmode: 'cpf',
      name: 'cpf',
    });
    el.remove();
  });

  it('masks cnpj and cep and validates via ElementInternals', async () => {
    registerGenovaElements();
    const cnpj = document.createElement('genova-input') as HTMLElement & {
      type: string; inputmode: string; value: string; checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    cnpj.type = 'search';
    cnpj.inputmode = 'cnpj';
    const cep = document.createElement('genova-input') as HTMLElement & {
      type: string; inputmode: string; value: string; checkValidity: () => boolean; updateComplete: Promise<boolean>;
    };
    cep.type = 'search';
    cep.inputmode = 'cep';
    document.body.append(cnpj, cep);
    await Promise.all([cnpj.updateComplete, cep.updateComplete]);

    const cnpjInner = cnpj.shadowRoot?.querySelector('input') as HTMLInputElement;
    cnpjInner.value = '11222333000181';
    cnpjInner.dispatchEvent(new Event('input'));
    expect(cnpj.value).toBe('11.222.333/0001-81');
    expect(cnpj.checkValidity()).toBe(true);

    const cepInner = cep.shadowRoot?.querySelector('input') as HTMLInputElement;
    cepInner.value = '01001000';
    cepInner.dispatchEvent(new Event('input'));
    expect(cep.value).toBe('01001-000');
    expect(cep.checkValidity()).toBe(true);

    cepInner.value = '123';
    cepInner.dispatchEvent(new Event('input'));
    expect(cep.checkValidity()).toBe(false);
    cnpj.remove();
    cep.remove();
  });
});
