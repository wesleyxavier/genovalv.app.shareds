import { html, type TemplateResult } from 'lit';
import type {
  AppHeaderNavItem,
  AppHeaderSearchConfig,
  AppHeaderUserMenuItem,
} from '@genovalv/core';
import { renderChevronDownIcon, renderSearchIcon } from './genova-app-header.icons';
import { renderUserMenuItem } from './genova-app-header-user';

export interface MobileMenuProps {
  navItems: readonly AppHeaderNavItem[];
  searchConfig: AppHeaderSearchConfig;
  envLabel: string;
  userName: string;
  userEmail: string;
  userMenuItems: readonly AppHeaderUserMenuItem[];
}

export interface MobileMenuHandlers {
  onSelectNav: (event: Event, item: { id: string; href?: string; disabled?: boolean }, parentId?: string) => void;
  onSelectUser: (event: Event, item: AppHeaderUserMenuItem) => void;
  onSearchKeydown: (event: KeyboardEvent) => void;
}

export function renderMobileMenu(props: MobileMenuProps, handlers: MobileMenuHandlers): TemplateResult {
  return html`
    <div class="mobile-panel" data-testid="mobile-menu-panel" role="navigation" aria-label="Menu mobile">
      ${props.searchConfig.visible !== false
        ? html`
            <label class=${`search-wrap mobile-search ${props.searchConfig.disabled ? 'disabled' : ''}`}>
              ${renderSearchIcon()}
              <input class="search-input" type="search"
                .value=${props.searchConfig.value ?? ''}
                placeholder=${props.searchConfig.placeholder ?? 'Buscar...'}
                ?disabled=${Boolean(props.searchConfig.disabled)}
                @keydown=${handlers.onSearchKeydown} />
              ${props.searchConfig.shortcut ? html`<kbd class="shortcut">${props.searchConfig.shortcut}</kbd>` : ''}
            </label>
          `
        : ''}
      ${props.envLabel ? html`<div class="mobile-meta"><span class="env-badge">${props.envLabel}</span></div>` : ''}
      ${props.navItems.map((item) => html`
        <div class="mobile-group">
          ${item.href && !item.items?.length && !item.disabled
            ? html`<a class=${`menu-item ${item.active ? 'active' : ''}`} href=${item.href}
                @click=${(e: Event) => handlers.onSelectNav(e, item)}>
                <span>${item.label}</span>
              </a>`
            : html`<button type="button" class=${`menu-item ${item.active ? 'active' : ''}`}
                ?disabled=${Boolean(item.disabled)} aria-disabled=${item.disabled ? 'true' : 'false'}
                @click=${(e: Event) => handlers.onSelectNav(e, item)}>
                <span>${item.label}</span>
                ${item.items?.length || item.hasDropdownIndicator ? renderChevronDownIcon() : ''}
              </button>`}
          ${item.items?.length
            ? html`<div class="mobile-children">
                ${item.items.map((sub) =>
                  sub.href && !sub.disabled
                    ? html`<a class=${`menu-item ${sub.active ? 'active' : ''}`} href=${sub.href}
                        @click=${(e: Event) => handlers.onSelectNav(e, sub, item.id)}>${sub.label}</a>`
                    : html`<button type="button" class=${`menu-item ${sub.active ? 'active' : ''}`}
                        ?disabled=${Boolean(sub.disabled)} aria-disabled=${sub.disabled ? 'true' : 'false'}
                        @click=${(e: Event) => handlers.onSelectNav(e, sub, item.id)}>${sub.label}</button>`,
                )}
              </div>`
            : ''}
        </div>
      `)}
      <div class="divider" role="separator"></div>
      <div class="popover-head">
        <p class="popover-name">${props.userName || 'Usuário'}</p>
        ${props.userEmail ? html`<p class="popover-email">${props.userEmail}</p>` : ''}
      </div>
      ${props.userMenuItems.map((item) => renderUserMenuItem(item, handlers.onSelectUser))}
    </div>
  `;
}
