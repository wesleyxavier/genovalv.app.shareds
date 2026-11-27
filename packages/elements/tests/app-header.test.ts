import { beforeAll, describe, expect, it, vi } from 'vitest';
import { registerGenovaElements } from '../src/index';

type AppHeaderEl = HTMLElement & {
  brandHref: string;
  navItems: unknown[];
  searchConfig: Record<string, unknown>;
  environmentLabel: string;
  notificationCount: number;
  notificationsVisible: boolean;
  notificationsDisabled: boolean;
  userName: string;
  userEmail: string;
  userInitials: string;
  userMenuItems: unknown[];
  updateComplete: Promise<boolean>;
};

describe('<genova-app-header>', () => {
  beforeAll(() => {
    registerGenovaElements();
  });

  function mountHeader(overrides: Partial<AppHeaderEl> = {}): AppHeaderEl {
    const el = document.createElement('genova-app-header') as AppHeaderEl;
    el.navItems = [
      { id: 'home', label: 'Início', href: '/', active: true },
      {
        id: 'registrations',
        label: 'Cadastros',
        items: [
          { id: 'companies', label: 'Empresas', disabled: true },
          { id: 'users', label: 'Usuários', href: '/users' },
        ],
      },
      { id: 'plans', label: 'Planos', disabled: true, hasDropdownIndicator: true },
    ];
    el.searchConfig = { visible: true, placeholder: 'Buscar empresa', shortcut: 'Ctrl K', disabled: true };
    el.environmentLabel = 'development';
    el.notificationCount = 3;
    el.notificationsVisible = true;
    el.notificationsDisabled = true;
    el.userName = 'Administrador';
    el.userEmail = 'admin@empresa.com.br';
    el.userMenuItems = [
      { id: 'account', label: 'Minha conta', icon: 'user', disabled: true },
      { id: 'sandbox', label: 'Acessar sandbox', description: 'ERP com empresa fictícia', icon: 'box', highlight: true },
      { id: 'logout', label: 'Sair', icon: 'logout', danger: true, dividerBefore: true },
    ];
    Object.assign(el, overrides);
    document.body.appendChild(el);
    return el;
  }

  it('renders brand, nav items, disabled controls and hides badge in production', async () => {
    const el = mountHeader({ environmentLabel: 'production' });
    await el.updateComplete;
    const root = el.shadowRoot!;
    expect(root.textContent).toContain('Início');
    expect(root.textContent).toContain('Cadastros');
    expect(root.textContent).toContain('Planos');
    expect(root.querySelector('[data-testid="env-badge"]')).toBeNull();
    expect(root.querySelector<HTMLInputElement>('[data-testid="header-search"]')?.disabled).toBe(true);
    expect(root.querySelector<HTMLButtonElement>('[data-testid="header-bell"]')?.disabled).toBe(true);
    el.remove();
  });

  it('opens dropdown, emits for enabled sub-item, and ignores disabled items', async () => {
    const el = mountHeader();
    await el.updateComplete;
    const onSelect = vi.fn();
    el.addEventListener('genova-nav-select', (e) => {
      e.preventDefault();
      onSelect((e as CustomEvent).detail);
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-nav-id="plans"]')?.click();
    expect(onSelect).not.toHaveBeenCalled();

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-nav-id="registrations"]')?.click();
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-sub-id="companies"]')?.click();
    expect(onSelect).not.toHaveBeenCalled();

    el.shadowRoot!.querySelector<HTMLAnchorElement>('[data-sub-id="users"]')?.click();
    expect(onSelect).toHaveBeenCalledWith({ id: 'users', href: '/users', parentId: 'registrations' });
    el.remove();
  });

  it('opens user popover, suppresses disabled actions, emits enabled actions and toggles hamburger', async () => {
    const el = mountHeader();
    await el.updateComplete;
    const onUserAction = vi.fn();
    el.addEventListener('genova-user-menu-select', (e) => {
      onUserAction((e as CustomEvent).detail);
    });

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-testid="user-avatar-btn"]')?.click();
    await el.updateComplete;
    expect(el.shadowRoot!.textContent).toContain('Administrador');
    expect(el.shadowRoot!.textContent).toContain('admin@empresa.com.br');

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-user-item-id="account"]')?.click();
    expect(onUserAction).not.toHaveBeenCalled();

    el.shadowRoot!.querySelector<HTMLButtonElement>('[data-user-item-id="sandbox"]')?.click();
    expect(onUserAction).toHaveBeenCalledWith({ id: 'sandbox', href: undefined });

    const hamburger = el.shadowRoot!.querySelector<HTMLButtonElement>('[data-testid="mobile-menu-toggle"]');
    expect(hamburger?.getAttribute('aria-expanded')).toBe('false');
    hamburger?.click();
    await el.updateComplete;
    expect(hamburger?.getAttribute('aria-expanded')).toBe('true');
    expect(el.shadowRoot!.querySelector('[data-testid="mobile-menu-panel"]')).not.toBeNull();
    el.remove();
  });
});
