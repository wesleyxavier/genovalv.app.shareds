# Implementation Plan: 007-app-header-menu

**Branch**: `007-app-header-menu` | **Date**: 2026-11-26 | **Spec**: [spec.md](spec.md)

## Summary

Design and implement `<genova-app-header>` (`GenovaAppHeaderElement`) in `@genovalv/elements` backed by pure TypeScript contracts and helpers in `@genovalv/core`, plus SVG header branding (`genova-cabecalho`), Storybook stories in `playground/`, Playwright E2E coverage, and fresh `.tgz` package builds for cross-framework consumption (`Admin`, `ERP`, `FactoryFloor`).

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`, `ES2022`), Node 22+  
**Primary Dependencies**: Lit 3 (`@genovalv/elements`), zero dependencies in `@genovalv/core`, CSS tokens from `@genovalv/tokens`  
**Storage**: N/A (stateless configurable UI component)  
**Testing**: Vitest (`node` for `@genovalv/core` 100% coverage; `happy-dom` + SSR `node` for `@genovalv/elements`), Playwright E2E (`chromium-desktop` 1280x800 & `chromium-mobile` 390x844)  
**Target Platform**: Browser + SSR (`AnalogJS`, `Next.js`, `Nuxt.js`)  
**Constraints**: All `.ts` source files `<= 100` lines, English-only code/comments, `{ bubbles: true, composed: true }` custom events, SSR-safe (`registerCustomElement`).

## Constitution Check

- **Principle I (Package Boundaries)**: Pure DTOs/helpers in `@genovalv/core`; Lit UI in `@genovalv/elements`; no framework or server imports. ✅
- **Principle II (Etapa 1 Design System)**: Uses `#FFFFFF`, `#FAF7F0`, `#715FAF`, `#F1EEFC`, `#3FA37C`, `#E7E2D8`, `#E9EDF8`/`#2F4A8C`, `#BC3737`, `Plus Jakarta Sans`, and `genova-cabecalho` SVG logo. ✅
- **Principle III (SSR-Safety & A11y)**: Top-level code avoids `window`/`document`/`customElements`; ARIA attributes (`aria-expanded`, `aria-disabled`, `aria-current="page"`, `role="menu"`/`menuitem`), keyboard `Escape` + outside click handling. ✅
- **Principle IV (TDD & <= 100 Lines)**: Split `<genova-app-header>` into cohesive modules (`<= 100` lines each): styles, SVG icons, desktop nav, user popover, mobile drawer, root element. ✅

## Project Structure

### Documentation (`specs/007-app-header-menu/`)

```text
specs/007-app-header-menu/
├── spec.md
├── plan.md
├── data-model.md
├── tasks.md
└── checklists/requirements.md
```

### Source Code (`New/Shareds/`)

```text
packages/core/src/
├── domain/dtos/app-header.dto.ts
├── domain/helpers/app-header.helpers.ts
└── domain/helpers/app-header.helpers.spec.ts

packages/elements/src/
├── components/genova-header-brand.ts
├── components/navigation/app-header/
│   ├── genova-app-header.ts
│   ├── genova-app-header.styles.ts
│   ├── genova-app-header.icons.ts
│   ├── genova-app-header-nav.ts
│   ├── genova-app-header-user.ts
│   ├── genova-app-header-mobile.ts
│   └── genova-app-header.spec.ts
└── index.ts

playground/src/stories/etapa1/
└── app-header.stories.ts
```

**Structure Decision**: Split `<genova-app-header>` across `components/navigation/app-header/` helper templates and styles so every `.ts` file strictly remains `<= 100` lines while exporting only `GenovaAppHeaderElement` (`genova-app-header`) through `packages/elements/src/index.ts`.
