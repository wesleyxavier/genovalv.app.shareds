import { LitElement, html } from 'lit';
import {
  formatEnvBadgeLabel, getUserInitials,
  type AppHeaderNavItem, type AppHeaderSearchConfig, type AppHeaderUserMenuItem,
} from '@genovalv/core';
import { renderGenovaHeaderLogo } from '../../genova-header-brand';
import { etapa1BaseStyles } from '../../../styles/etapa1-base.css';
import { appHeaderLayoutStyles } from './genova-app-header.styles';
import { appHeaderMenuStyles } from './genova-app-header-menu.styles';
import { renderDesktopNav } from './genova-app-header-nav';
import { renderHeaderRightBar } from './genova-app-header-right';
import { renderMobileMenu } from './genova-app-header-mobile';

let nextLogoId = 0;

export class GenovaAppHeaderElement extends LitElement {
  static override properties = {
    brandHref: { type: String, attribute: 'brand-href' },
    navItems: { type: Array, attribute: 'nav-items' },
    searchConfig: { type: Object, attribute: 'search-config' },
    environmentLabel: { type: String, attribute: 'environment-label' },
    notificationCount: { type: Number, attribute: 'notification-count' },
    notificationsVisible: { type: Boolean, attribute: 'notifications-visible' },
    notificationsDisabled: { type: Boolean, attribute: 'notifications-disabled' },
    userName: { type: String, attribute: 'user-name' },
    userEmail: { type: String, attribute: 'user-email' },
    userInitials: { type: String, attribute: 'user-initials' },
    userMenuItems: { type: Array, attribute: 'user-menu-items' },
    openDropdownId: { state: true },
    userMenuOpen: { state: true },
    mobileOpen: { state: true },
  };
  static override styles = [etapa1BaseStyles, appHeaderLayoutStyles, appHeaderMenuStyles];

  brandHref = '/';
  navItems: readonly AppHeaderNavItem[] = [];
  searchConfig: AppHeaderSearchConfig = { visible: true, placeholder: 'Buscar...', shortcut: 'Ctrl K', disabled: true };
  environmentLabel = '';
  notificationCount = 0;
  notificationsVisible = true;
  notificationsDisabled = true;
  userName = '';
  userEmail = '';
  userInitials = '';
  userMenuItems: readonly AppHeaderUserMenuItem[] = [];
  openDropdownId: string | null = null;
  userMenuOpen = false;
  mobileOpen = false;
  private readonly logoPrefix = `gnvh-${++nextLogoId}`;

  private readonly onDocClick = (e: Event) => {
    if (!e.composedPath().includes(this)) { this.openDropdownId = null; this.userMenuOpen = false; }
  };
  private readonly onDocKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { this.openDropdownId = null; this.userMenuOpen = false; this.mobileOpen = false; }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof document !== 'undefined') { document.addEventListener('click', this.onDocClick); document.addEventListener('keydown', this.onDocKey); }
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (typeof document !== 'undefined') { document.removeEventListener('click', this.onDocClick); document.removeEventListener('keydown', this.onDocKey); }
  }

  private emitNav = (e: Event, item: { id: string; href?: string; disabled?: boolean }, parentId?: string) => {
    if (item.disabled) { e.preventDefault(); return; }
    this.openDropdownId = null; this.mobileOpen = false;
    if (!this.dispatchEvent(new CustomEvent('genova-nav-select', { detail: { id: item.id, href: item.href, parentId }, bubbles: true, composed: true, cancelable: true }))) e.preventDefault();
  };
  private emitUser = (e: Event, item: AppHeaderUserMenuItem) => {
    if (item.disabled) { e.preventDefault(); return; }
    this.userMenuOpen = false; this.mobileOpen = false;
    if (!this.dispatchEvent(new CustomEvent('genova-user-menu-select', { detail: { id: item.id, href: item.href }, bubbles: true, composed: true, cancelable: true }))) e.preventDefault();
  };
  private onSearchKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !this.searchConfig.disabled) {
      this.dispatchEvent(new CustomEvent('genova-search-submit', { detail: { query: (e.target as HTMLInputElement).value }, bubbles: true, composed: true }));
    }
  };

  override render() {
    const env = formatEnvBadgeLabel(this.environmentLabel);
    const initials = this.userInitials.trim() || getUserInitials(this.userName, this.userEmail);
    const search = this.searchConfig ?? {};
    const rightProps = { search, envLabel: env, notificationsVisible: this.notificationsVisible, notificationsDisabled: this.notificationsDisabled, notificationCount: this.notificationCount, userMenuOpen: this.userMenuOpen, mobileOpen: this.mobileOpen, initials, userName: this.userName, userEmail: this.userEmail, userMenuItems: this.userMenuItems };
    const rightHandlers = { onSearchKey: this.onSearchKey, onBellClick: () => !this.notificationsDisabled && this.dispatchEvent(new CustomEvent('genova-notifications-click', { bubbles: true, composed: true })), onToggleUser: () => { this.openDropdownId = null; this.userMenuOpen = !this.userMenuOpen; }, onSelectUser: this.emitUser, onToggleMobile: () => { this.mobileOpen = !this.mobileOpen; } };
    const navHandlers = { onToggleDropdown: (id: string) => { this.userMenuOpen = false; this.openDropdownId = this.openDropdownId === id ? null : id; }, onSelectItem: this.emitNav };
    return html`
      <header class="bar"><div class="left"><a class="brand" href=${this.brandHref} aria-label="Genova" @click=${(e: Event) => this.emitNav(e, { id: 'brand', href: this.brandHref })}>${renderGenovaHeaderLogo(110.6, 34, this.logoPrefix)}</a>${renderDesktopNav(this.navItems, this.openDropdownId, navHandlers)}</div>${renderHeaderRightBar(rightProps, rightHandlers)}</header>
      ${this.mobileOpen ? renderMobileMenu({ navItems: this.navItems, searchConfig: search, envLabel: env, userName: this.userName, userEmail: this.userEmail, userMenuItems: this.userMenuItems }, { onSelectNav: this.emitNav, onSelectUser: this.emitUser, onSearchKeydown: this.onSearchKey }) : ''}
    `;
  }
}
