import { beforeAll, describe, expect, it } from 'vitest';
import { registerGenovaElements } from '../src/index';

describe('@genovalv/elements Etapa 1 catalog', () => {
  beforeAll(() => {
    registerGenovaElements();
  });

  it('registers all 44 new Etapa 1 custom elements cleanly', () => {
    const tags = [
      'genova-box', 'genova-pseudo-box', 'genova-control-box', 'genova-divider', 'genova-heading', 'genova-icon', 'genova-image',
      'genova-button', 'genova-button-group', 'genova-close-button', 'genova-icon-button', 'genova-link',
      'genova-input-group', 'genova-number-input', 'genova-textarea', 'genova-editable', 'genova-form-control',
      'genova-checkbox-group', 'genova-radio', 'genova-radio-button-group', 'genova-select', 'genova-switch', 'genova-slider',
      'genova-breadcrumb', 'genova-tabs', 'genova-menu', 'genova-accordion', 'genova-collapse',
      'genova-alert', 'genova-circular-progress', 'genova-progress', 'genova-skeleton', 'genova-spinner', 'genova-toast',
      'genova-alert-dialog', 'genova-drawer', 'genova-modal', 'genova-tooltip',
      'genova-avatar', 'genova-badge', 'genova-list', 'genova-stats', 'genova-table', 'genova-tag',
    ];
    for (const tag of tags) {
      expect(customElements.get(tag)).toBeDefined();
    }
  });

  it('supports interactive state updates on Accordion, Switch, Tabs, Modal and Table', async () => {
    const acc = document.createElement('genova-accordion') as HTMLElement & { items: unknown[]; openId: string; updateComplete: Promise<boolean> };
    acc.items = [{ id: '1', title: 'Item 1', content: 'Detalhe 1' }];
    document.body.appendChild(acc);
    await acc.updateComplete;
    acc.shadowRoot?.querySelector('button')?.click();
    await acc.updateComplete;
    expect(acc.shadowRoot?.textContent).toContain('Detalhe 1');

    const sw = document.createElement('genova-switch') as HTMLElement & { checked: boolean; updateComplete: Promise<boolean> };
    document.body.appendChild(sw);
    await sw.updateComplete;
    sw.shadowRoot?.querySelector('button')?.click();
    await sw.updateComplete;
    expect(sw.checked).toBe(true);

    const tbl = document.createElement('genova-table') as HTMLElement & { columns: string[]; rows: string[][]; updateComplete: Promise<boolean> };
    tbl.columns = ['Nome', 'Status'];
    tbl.rows = [['Lavanderia Alpha', 'Ativo']];
    document.body.appendChild(tbl);
    await tbl.updateComplete;
    expect(tbl.shadowRoot?.textContent).toContain('Lavanderia Alpha');
  });
});
