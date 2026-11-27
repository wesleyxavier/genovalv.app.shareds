export interface AppHeaderNavSubItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface AppHeaderNavItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  hasDropdownIndicator?: boolean;
  items?: readonly AppHeaderNavSubItem[];
}

export interface AppHeaderSearchConfig {
  visible?: boolean;
  placeholder?: string;
  shortcut?: string;
  disabled?: boolean;
  value?: string;
}

export type AppHeaderUserMenuIcon = 'user' | 'sliders' | 'box' | 'logout';

export interface AppHeaderUserMenuItem {
  id: string;
  label: string;
  description?: string;
  href?: string;
  icon?: AppHeaderUserMenuIcon;
  disabled?: boolean;
  highlight?: boolean;
  danger?: boolean;
  dividerBefore?: boolean;
}
