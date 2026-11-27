import { describe, expect, it } from 'vitest';
import { registerGenovaElements } from '../src/index';

describe('genova-loading-state', () => {
  it('renders fullscreen and card variants with accessible status message', async () => {
    registerGenovaElements();
    const el = document.createElement('genova-loading-state') as HTMLElement & { variant: string; message: string; updateComplete: Promise<boolean> };
    el.variant = 'fullscreen';
    el.message = 'Carregando...';
    document.body.appendChild(el);
    await el.updateComplete;

    const status = el.shadowRoot?.querySelector('[role="status"]');
    expect(status?.classList.contains('fullscreen')).toBe(true);
    expect(el.shadowRoot?.textContent).toContain('Carregando...');
    el.remove();
  });
});
