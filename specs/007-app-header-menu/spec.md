# Feature Specification: 007-app-header-menu

**Feature Branch**: `007-app-header-menu`  
**Created**: 2026-11-26  
**Status**: Draft (Aguardando aprovação)  
**Design Source**: Mockups SVG Desktop (`1440px`), Responsivo (`1920` / `1366` / `1024` / Mobile) e Popover Usuário (`AD`) no padrão UI/UX Etapa 1 (`#FAF7F0`, `#715FAF`, `#3FA37C`, `#E7E2D8`, `Plus Jakarta Sans`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configurable Application Header Bar & Dropdown Navigation (Priority: P1)

As any Genova frontend application (`Admin`, `ERP`, `FactoryFloor`), I can render `<genova-app-header>` with declarative navigation items (links, active pill, disabled state, and expandable dropdown sub-lists) so each portal shares the exact Etapa 1 visual header while customizing only labels, links, and enabled/disabled state.

**Why this priority**: Establishes the shared navigation chrome and contracts in `@genovalv/core` + `@genovalv/elements`, eliminating duplicated header markup across portals.

**Independent Test**: Render `<genova-app-header>` in Vitest (`happy-dom`) and Storybook with mixed active, enabled, disabled, and dropdown items; verify active pill + bottom mint indicator (`#3FA37C`), dropdown opening/closing on click and `Escape`, and that disabled items never emit `genova-nav-select`.

**Acceptance Scenarios**:

1. **Given** a `navItems` array with top-level links and dropdown items, **When** rendered on desktop (`>= 1024px`), **Then** the logo (`genova-cabecalho`) and horizontal nav items appear in a `64px` `#FFFFFF` bar with `#E7E2D8` bottom border, and the active item displays `#F1EEFC` background, `#715FAF` text, and `#3FA37C` bottom indicator.
2. **Given** a nav item with `children` and `disabled = false`, **When** clicked, **Then** a floating dropdown menu opens below it showing its sub-items (`label`, `active`, `disabled`); clicking an enabled sub-item emits `genova-nav-select` with `{ id, href, parentId }` and closes the dropdown.
3. **Given** a nav item or sub-item with `disabled = true`, **When** clicked or activated via keyboard, **Then** it has `aria-disabled="true"` / muted styling and emits no navigation event.

---

### User Story 2 - Search, Conditional Environment Badge, Notifications & User Popover (Priority: P1)

As an authenticated Genova user, I see optional search input (`Ctrl K`), non-production environment badge, notification bell with counter, and avatar popover menu (`Minha conta`, `Preferências`, actions like `Acessar sandbox`, `Sair`) configurable per application.

**Why this priority**: Admin and other portals need consistent user/session actions, environment visibility (hidden in production), and cleanly disabled placeholders for upcoming features.

**Independent Test**: Pass `environmentLabel="development"` vs `"production"`, disabled `search` and `notifications`, and `userMenuItems` (enabled, disabled, highlighted, danger); verify badge hides on `"production"`, disabled controls ignore clicks, and clicking enabled popover items emits `genova-user-menu-select`.

**Acceptance Scenarios**:

1. **Given** `environmentLabel="production"` (or empty), **When** rendered, **Then** the environment badge is hidden; for `"development"` or `"staging"`, it renders uppercase (`DEVELOPMENT`, `STAGING`) with `#E9EDF8` fill, `#C3CEEB` border, and `#2F4A8C` text.
2. **Given** `searchConfig.disabled = true` and `notificationsDisabled = true`, **When** rendered, **Then** both controls remain visible in muted disabled state and do not submit or emit click events.
3. **Given** `userName`, `userEmail`, and `userMenuItems`, **When** clicking the initials avatar (`AD`), **Then** a popover opens showing user name/email and all configured items (supporting `description`, `highlight`, `danger`, `dividerBefore`, and `disabled`), closing on outside click or `Escape`.

---

### User Story 3 - Responsive Hamburger Navigation (`< 1024px` Mobile/Tablet) (Priority: P1)

As a user on narrow viewports (`< 1024px`), I see a clean header with brand, compact actions, and a hamburger toggle button that opens a vertical drawer/panel containing navigation links, expandable sub-lists, search, and user menu actions without horizontal overflow.

**Why this priority**: Guarantees mobile usability and zero horizontal overflow across all Genova portals.

**Independent Test**: Render in Playwright at `390x844` and `1024x768`; verify hamburger button toggles `aria-expanded`, renders mobile menu panel with sub-items and user actions, and `document.documentElement.scrollWidth <= window.innerWidth`.

**Acceptance Scenarios**:

1. **Given** viewport `< 1024px`, **When** clicking the hamburger button, **Then** the mobile menu panel opens listing top-level items, nested sub-items, search input (when visible), and user popover actions cleanly stacked.
2. **Given** the mobile menu is open, **When** pressing `Escape` or selecting an enabled navigation item, **Then** the mobile panel closes cleanly.

### Edge Cases

- SSR execution in Node (`AnalogJS`, `Next.js`, `Nuxt.js`): importing `@genovalv/core` and `@genovalv/elements` MUST NOT touch `window`, `document`, or `customElements` at module evaluation time.
- Missing `userInitials`: fallback derives 2 uppercase letters from `userName` or `userEmail` (e.g., `"Administrador"` → `"AD"`, `"admin@empresa.com.br"` → `"AD"`).
- Keyboard & Accessibility: `Enter`/`Space` open/select menus, `Escape` closes dropdown/popover/mobile menu, disabled items expose `aria-disabled="true"` and `disabled`.
- Duplicate gradient IDs in SVG logo: SVG `<defs>` IDs MUST remain unique per instance.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `@genovalv/core` MUST export pure TypeScript contracts (`AppHeaderNavItem`, `AppHeaderNavSubItem`, `AppHeaderSearchConfig`, `AppHeaderUserMenuItem`, `AppHeaderEnvFormat`) and pure helpers (`getUserInitials`, `formatEnvBadgeLabel`) with zero DOM/framework dependencies.
- **FR-002**: `@genovalv/elements` MUST export and register `<genova-app-header>` (`GenovaAppHeaderElement`) using Etapa 1 tokens and SVG logo (`genova-cabecalho`).
- **FR-003**: `<genova-app-header>` MUST accept configurable `brandHref`, `navItems`, `searchConfig`, `environmentLabel`, `notificationCount`, `notificationsVisible`, `notificationsDisabled`, `userName`, `userEmail`, `userInitials`, and `userMenuItems` (via JS properties or JSON attributes for framework compatibility).
- **FR-004**: `<genova-app-header>` MUST emit `{ bubbles: true, composed: true }` `CustomEvent`s: `genova-nav-select`, `genova-user-menu-select`, `genova-search-submit`, and `genova-notifications-click` — strictly suppressing events on disabled items.
- **FR-005**: `<genova-app-header>` MUST provide a hamburger button and collapsible mobile menu panel below `1024px`, automatically closing popups on `Escape` or outside click.
- **FR-006**: Every new/modified source file MUST stay `<= 100` lines, follow English-only code/comments, achieve 100% coverage in `@genovalv/core`, include DOM/SSR/a11y tests in `@genovalv/elements`, include interactive Storybook stories in `playground/`, and produce updated `.tgz` packages.

### Key Entities

- **`AppHeaderNavItem` / `AppHeaderNavSubItem`**: Navigation node (`id`, `label`, `href?`, `active?`, `disabled?`, `items?`).
- **`AppHeaderSearchConfig`**: Search box configuration (`visible?`, `placeholder?`, `shortcut?`, `disabled?`, `value?`).
- **`AppHeaderUserMenuItem`**: User popover action (`id`, `label`, `description?`, `href?`, `icon?`, `disabled?`, `highlight?`, `danger?`, `dividerBefore?`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `npm run test:coverage` passes with 100% statements/branches/functions/lines in `@genovalv/core`.
- **SC-002**: `npm run test:unit`, `npm run build`, and `npm run test:e2e` (`chromium-desktop` + `chromium-mobile`) pass with zero errors and zero horizontal overflow.
- **SC-003**: `@genovalv/playground` Storybook displays `<genova-app-header>` stories covering desktop, open dropdown, user popover, hidden production badge, and mobile hamburger views.
- **SC-004**: Packed `.tgz` tarballs (`@genovalv/core`, `@genovalv/elements`, `@genovalv/tokens`, `@genovalv/server`) install cleanly in downstream apps (`Admin`).
