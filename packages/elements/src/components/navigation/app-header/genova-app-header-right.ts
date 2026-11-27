import { html, type TemplateResult } from 'lit';
import type { AppHeaderSearchConfig, AppHeaderUserMenuItem } from '@genovalv/core';
import { renderBellIcon, renderHamburgerIcon, renderSearchIcon } from './genova-app-header.icons';
import { renderUserPopover } from './genova-app-header-user';

export interface RightBarProps {
  search: AppHeaderSearchConfig;
  envLabel: string;
  notificationsVisible: boolean;
  notificationsDisabled: boolean;
  notificationCount: number;
  userMenuOpen: boolean;
  mobileOpen: boolean;
  initials: string;
  userName: string;
  userEmail: string;
  userMenuItems: readonly AppHeaderUserMenuItem[];
}

export interface RightBarHandlers {
  onSearchKey: (event: KeyboardEvent) => void;
  onBellClick: () => void;
  onToggleUser: () => void;
  onSelectUser: (event: Event, item: AppHeaderUserMenuItem) => void;
  onToggleMobile: () => void;
}

export function renderHeaderRightBar(p: RightBarProps, h: RightBarHandlers): TemplateResult {
  return html`
    <div class="right">
      ${p.search.visible !== false
        ? html`<label class=${`search-wrap ${p.search.disabled ? 'disabled' : ''}`}>
            ${renderSearchIcon()}
            <input class="search-input" data-testid="header-search" type="search"
              .value=${p.search.value ?? ''} placeholder=${p.search.placeholder ?? 'Buscar...'}
              ?disabled=${Boolean(p.search.disabled)} @keydown=${h.onSearchKey} />
            ${p.search.shortcut ? html`<kbd class="shortcut">${p.search.shortcut}</kbd>` : ''}
          </label>`
        : ''}
      ${p.envLabel ? html`<span class="env-badge" data-testid="env-badge">${p.envLabel}</span>` : ''}
      ${p.notificationsVisible
        ? html`<button type="button" class="bell-btn" data-testid="header-bell" aria-label="Notificações"
            ?disabled=${p.notificationsDisabled} @click=${h.onBellClick}>
            ${renderBellIcon()}
            ${p.notificationCount > 0 ? html`<span class="bell-count">${p.notificationCount}</span>` : ''}
          </button>`
        : ''}
      ${renderUserPopover(
        { open: p.userMenuOpen, initials: p.initials, userName: p.userName, userEmail: p.userEmail, menuItems: p.userMenuItems },
        h.onToggleUser,
        h.onSelectUser,
      )}
      <button type="button" class="mobile-toggle" data-testid="mobile-menu-toggle" aria-label="Abrir menu"
        aria-expanded=${String(p.mobileOpen)} @click=${h.onToggleMobile}>
        ${renderHamburgerIcon(p.mobileOpen)}
      </button>
    </div>
  `;
}
