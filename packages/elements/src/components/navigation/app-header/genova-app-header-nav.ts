import { html, type TemplateResult } from 'lit';
import type { AppHeaderNavItem, AppHeaderNavSubItem } from '@genovalv/core';
import { renderChevronDownIcon } from './genova-app-header.icons';

export interface NavRenderHandlers {
  onToggleDropdown: (id: string) => void;
  onSelectItem: (event: Event, item: { id: string; href?: string; disabled?: boolean }, parentId?: string) => void;
}

function renderSubItem(
  sub: AppHeaderNavSubItem,
  parentId: string,
  onSelect: NavRenderHandlers['onSelectItem'],
): TemplateResult {
  const cls = `menu-item ${sub.active ? 'active' : ''}`;
  if (sub.href && !sub.disabled) {
    return html`
      <a class=${cls} role="menuitem" data-sub-id=${sub.id} href=${sub.href}
        aria-current=${sub.active ? 'page' : 'false'}
        @click=${(e: Event) => onSelect(e, sub, parentId)}>${sub.label}</a>
    `;
  }
  return html`
    <button type="button" class=${cls} role="menuitem" data-sub-id=${sub.id}
      ?disabled=${Boolean(sub.disabled)} aria-disabled=${sub.disabled ? 'true' : 'false'}
      @click=${(e: Event) => onSelect(e, sub, parentId)}>${sub.label}</button>
  `;
}

export function renderDesktopNav(
  items: readonly AppHeaderNavItem[],
  openDropdownId: string | null,
  handlers: NavRenderHandlers,
): TemplateResult {
  return html`
    <nav class="nav" aria-label="Menu principal">
      ${items.map((item) => {
        const hasChildren = Boolean(item.items?.length);
        const isOpen = hasChildren && openDropdownId === item.id;
        const cls = `nav-item ${item.active ? 'active' : ''}`;
        const showChevron = Boolean(item.hasDropdownIndicator || hasChildren);
        return html`
          <div class="nav-group">
            ${item.href && !hasChildren && !item.disabled
              ? html`<a class=${cls} data-nav-id=${item.id} href=${item.href}
                  aria-current=${item.active ? 'page' : 'false'}
                  @click=${(e: Event) => handlers.onSelectItem(e, item)}>
                  <span>${item.label}</span>
                  ${showChevron ? renderChevronDownIcon() : ''}
                </a>`
              : html`<button type="button" class=${cls} data-nav-id=${item.id}
                  ?disabled=${Boolean(item.disabled)}
                  aria-disabled=${item.disabled ? 'true' : 'false'}
                  aria-haspopup=${hasChildren ? 'menu' : 'false'}
                  aria-expanded=${hasChildren ? String(isOpen) : 'false'}
                  @click=${(e: Event) => {
                    if (item.disabled) return;
                    if (hasChildren) handlers.onToggleDropdown(item.id);
                    else handlers.onSelectItem(e, item);
                  }}>
                  <span>${item.label}</span>
                  ${showChevron ? renderChevronDownIcon() : ''}
                </button>`}
            ${item.active ? html`<span class="active-bar" aria-hidden="true"></span>` : ''}
            ${isOpen
              ? html`<div class="dropdown" role="menu" aria-label=${item.label}>
                  ${item.items!.map((sub) => renderSubItem(sub, item.id, handlers.onSelectItem))}
                </div>`
              : ''}
          </div>
        `;
      })}
    </nav>
  `;
}
