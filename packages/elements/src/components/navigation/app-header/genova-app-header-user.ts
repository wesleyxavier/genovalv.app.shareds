import { html, type TemplateResult } from 'lit';
import type { AppHeaderUserMenuItem } from '@genovalv/core';
import { renderChevronRightIcon, renderUserMenuIcon } from './genova-app-header.icons';

export interface UserPopoverProps {
  open: boolean;
  initials: string;
  userName: string;
  userEmail: string;
  menuItems: readonly AppHeaderUserMenuItem[];
}

export function renderUserMenuItem(
  item: AppHeaderUserMenuItem,
  onSelect: (event: Event, item: AppHeaderUserMenuItem) => void,
): TemplateResult {
  const cls = [
    'menu-item',
    item.highlight ? 'highlight' : '',
    item.danger ? 'danger' : '',
  ].filter(Boolean).join(' ');

  const content = html`
    <span class="item-left">
      ${item.icon ? html`<span class="item-icon">${renderUserMenuIcon(item.icon)}</span>` : ''}
      <span>
        <span>${item.label}</span>
        ${item.description ? html`<span class="item-desc">${item.description}</span>` : ''}
      </span>
    </span>
    ${item.highlight ? renderChevronRightIcon() : ''}
  `;

  return html`
    ${item.dividerBefore ? html`<div class="divider" role="separator"></div>` : ''}
    ${item.href && !item.disabled
      ? html`<a class=${cls} role="menuitem" data-user-item-id=${item.id} href=${item.href}
          @click=${(e: Event) => onSelect(e, item)}>${content}</a>`
      : html`<button type="button" class=${cls} role="menuitem" data-user-item-id=${item.id}
          ?disabled=${Boolean(item.disabled)} aria-disabled=${item.disabled ? 'true' : 'false'}
          @click=${(e: Event) => onSelect(e, item)}>${content}</button>`}
  `;
}

export function renderUserPopover(
  props: UserPopoverProps,
  onToggle: () => void,
  onSelect: (event: Event, item: AppHeaderUserMenuItem) => void,
): TemplateResult {
  return html`
    <div class="user-wrap user-desktop">
      <button type="button" class="avatar-btn" data-testid="user-avatar-btn"
        aria-label="Menu do usuário" aria-haspopup="menu" aria-expanded=${String(props.open)}
        @click=${onToggle}>${props.initials}</button>
      ${props.open
        ? html`
            <div class="popover" role="menu" aria-label="Opções da conta">
              <div class="popover-head">
                <p class="popover-name">${props.userName || 'Usuário'}</p>
                ${props.userEmail ? html`<p class="popover-email">${props.userEmail}</p>` : ''}
              </div>
              <div class="divider" role="separator"></div>
              ${props.menuItems.map((item) => renderUserMenuItem(item, onSelect))}
            </div>
          `
        : ''}
    </div>
  `;
}
