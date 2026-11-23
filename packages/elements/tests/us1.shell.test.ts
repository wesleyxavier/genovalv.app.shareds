import { afterEach, describe, expect, it } from 'vitest';
import '../src/index';

describe('US1 Shell & Structural Elements', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders genova-header with configurable brand and translated security badge', async () => {
    const el = document.createElement('genova-header') as HTMLElement & {
      brandName: string;
      brandSuffix: string;
      locale: 'pt-BR' | 'en-US';
      updateComplete: Promise<boolean>;
    };
    el.brandName = 'Genova';
    el.brandSuffix = 'Cloud';
    el.locale = 'en-US';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).toContain('Genova');
    expect(el.shadowRoot?.textContent).toContain('Cloud');
    expect(el.shadowRoot?.textContent).toContain('Secure Environment');
  });

  it('renders genova-footer and emits composed genova-link-click event', async () => {
    const el = document.createElement('genova-footer') as HTMLElement & {
      copyrightText: string;
      links: Array<{ label: string; href: string }>;
      updateComplete: Promise<boolean>;
    };
    el.copyrightText = '© 2026 Genova Cloud';
    el.links = [{ label: 'Suporte', href: '#support' }];
    document.body.appendChild(el);
    await el.updateComplete;

    let receivedDetail: unknown = null;
    document.body.addEventListener('genova-link-click', (ev) => {
      receivedDetail = (ev as CustomEvent).detail;
    });

    const anchor = el.shadowRoot?.querySelector('a');
    expect(anchor?.textContent?.trim()).toBe('Suporte');
    anchor?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, cancelable: true }));

    expect(receivedDetail).toEqual({ label: 'Suporte', href: '#support' });
  });

  it('renders genova-auth-card with portal title, subtitle and support links', async () => {
    const el = document.createElement('genova-auth-card') as HTMLElement & {
      portalTitle: string;
      portalSubtitle: string;
      supportLinks: Array<{ label: string; href: string }>;
      updateComplete: Promise<boolean>;
    };
    el.portalTitle = 'Genova ERP';
    el.portalSubtitle = 'Portal do Cliente';
    el.supportLinks = [{ label: 'Ajuda', href: '#help' }];
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.textContent).toContain('Genova ERP');
    expect(el.shadowRoot?.textContent).toContain('Portal do Cliente');
    expect(el.shadowRoot?.textContent).toContain('Ajuda');
  });

  it('renders genova-auth-shell with default slot', async () => {
    const el = document.createElement('genova-auth-shell') as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    el.innerHTML = '<div id="slot-marker">Card Slot</div>';
    document.body.appendChild(el);
    await el.updateComplete;

    expect(el.shadowRoot?.querySelector('genova-header')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('genova-footer')).not.toBeNull();
    expect(el.querySelector('#slot-marker')?.textContent).toBe('Card Slot');
  });
});
