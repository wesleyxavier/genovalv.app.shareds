# Data Model: 007-app-header-menu

## Pure Contracts (`@genovalv/core`)

- **`AppHeaderNavSubItem`**:
  - `id: string`
  - `label: string`
  - `href?: string`
  - `active?: boolean`
  - `disabled?: boolean`
- **`AppHeaderNavItem`**:
  - `id: string`
  - `label: string`
  - `href?: string`
  - `active?: boolean`
  - `disabled?: boolean`
  - `hasDropdownIndicator?: boolean` (shows chevron even when disabled/placeholder)
  - `items?: readonly AppHeaderNavSubItem[]`
- **`AppHeaderSearchConfig`**:
  - `visible?: boolean`
  - `placeholder?: string`
  - `shortcut?: string`
  - `disabled?: boolean`
  - `value?: string`
- **`AppHeaderUserMenuItem`**:
  - `id: string`
  - `label: string`
  - `description?: string`
  - `href?: string`
  - `icon?: 'user' | 'sliders' | 'box' | 'logout'`
  - `disabled?: boolean`
  - `highlight?: boolean`
  - `danger?: boolean`
  - `dividerBefore?: boolean`

## Pure Helpers (`@genovalv/core`)

- `getUserInitials(fullName?: string | null, email?: string | null): string`
  - Extracts up to 2 uppercase initials from full name or email local-part; defaults to `'AD'` if empty.
- `formatEnvBadgeLabel(env?: string | null): string`
  - Returns `''` when trimmed lowercase is `''`, `'production'`, or `'prod'`; otherwise returns trimmed uppercase string (e.g. `'DEVELOPMENT'`, `'STAGING'`).
