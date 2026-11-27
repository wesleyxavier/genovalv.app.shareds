import { beforeAll, describe, expect, it } from 'vitest';
import { registerGenovaElements } from '../src';

describe('@genovalv/elements list-toolbar, pagination, dropzone & modal', () => {
  beforeAll(() => {
    registerGenovaElements();
  });

  it('emits search and filter events from genova-list-toolbar', async () => {
    const el = document.createElement('genova-list-toolbar') as HTMLElement & {
      searchPlaceholder: string;
      filters: unknown[];
      updateComplete: Promise<boolean>;
    };
    el.searchPlaceholder = 'Nome ou CNPJ';
    el.filters = [{ id: 'status', label: 'Situação', value: 'all', options: [{ value: 'all', label: 'Todas' }, { value: 'active', label: 'Ativa' }] }];
    document.body.appendChild(el);
    await el.updateComplete;

    let searched = '';
    let filtered = '';
    el.addEventListener('genova-search-change', (e: Event) => { searched = (e as CustomEvent<{ value: string }>).detail.value; });
    el.addEventListener('genova-filter-change', (e: Event) => { filtered = (e as CustomEvent<{ value: string }>).detail.value; });

    const input = el.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'Lavanderia';
    input.dispatchEvent(new Event('input'));
    const select = el.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.value = 'active';
    select.dispatchEvent(new Event('change'));
    expect(searched).toBe('Lavanderia');
    expect(filtered).toBe('active');
  });

  it('renders pagination summary and emits genova-page-change', async () => {
    const el = document.createElement('genova-pagination') as HTMLElement & {
      page: number; pageSize: number; totalItems: number; updateComplete: Promise<boolean>;
    };
    el.page = 1; el.pageSize = 10; el.totalItems = 25;
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toContain('1–10 de 25');

    let nextPage = 0;
    el.addEventListener('genova-page-change', (e: Event) => { nextPage = (e as CustomEvent<{ page: number }>).detail.page; });
    const buttons = el.shadowRoot?.querySelectorAll('button') ?? [];
    buttons[2]?.click();
    expect(nextPage).toBe(2);
  });

  it('validates dropped files and emits remove in genova-file-dropzone', async () => {
    const el = document.createElement('genova-file-dropzone') as HTMLElement & {
      files: Array<{ id: string; name: string; sizeBytes: number; mimeType: string }>;
      updateComplete: Promise<boolean>;
    };
    el.files = [{ id: 'f1', name: 'termo-lgpd.pdf', sizeBytes: 128000, mimeType: 'application/pdf' }];
    document.body.appendChild(el);
    await el.updateComplete;
    expect(el.shadowRoot?.textContent).toContain('termo-lgpd.pdf');

    let removedId = '';
    el.addEventListener('genova-file-remove', (e: Event) => { removedId = (e as CustomEvent<{ id: string }>).detail.id; });
    el.shadowRoot?.querySelector<HTMLButtonElement>('button.remove')?.click();
    expect(removedId).toBe('f1');
  });
});
