# Tasks: 007-app-header-menu

## 0. Branch
- [x] Create worktree at `worktrees/007-app-header-menu` (branch `feature/007-app-header-menu`) from `develop`

## 1. Core Contracts & Helpers (`@genovalv/core` — TDD)
- [x] Write failing unit tests in `packages/core/tests/app-header.helpers.test.ts` (`getUserInitials`, `formatEnvBadgeLabel`, normalization edge cases)
- [x] Create `packages/core/src/domain/dtos/app-header.dto.ts` and `packages/core/src/domain/helpers/app-header.helpers.ts` (`<= 100` lines each) and export in `packages/core/src/index.ts`
- [x] Verify `app-header.helpers.ts` 100% coverage and `@genovalv/core` tests (`29 passed`)

## 1.1 Commit Group 1
- [ ] `git commit -m "feat(core): add app-header contracts and helpers"`
- [ ] `git push -u origin feature/007-app-header-menu`

## 2. Shared Web Component `<genova-app-header>` (`@genovalv/elements` — TDD)
- [x] Write failing unit/DOM/SSR/a11y tests in `packages/elements/tests/app-header.test.ts`
- [x] Implement `genova-header-brand.ts` (`genova-cabecalho` SVG renderer), `genova-app-header.styles.ts`, `genova-app-header-menu.styles.ts`, `genova-app-header.icons.ts`, `genova-app-header-nav.ts`, `genova-app-header-user.ts`, `genova-app-header-right.ts`, `genova-app-header-mobile.ts`, and `genova-app-header.ts` (all `<= 100` lines)
- [x] Register `<genova-app-header>` in `packages/elements/src/index.ts` and verify `npm run test:unit`

## 2.1 Commit Group 2
- [ ] `git commit -m "feat(elements): add configurable genova-app-header component"`
- [ ] `git push`

## 3. Storybook Stories, Build, Pack & E2E
- [x] Add Storybook stories in `playground/src/stories/etapa1/app-header.stories.ts` (desktop, dropdown open, user popover, production hidden badge, mobile hamburger)
- [x] Run `npm run build`, `npm run test:unit`, and `npm run test:e2e` (verify desktop + mobile, zero horizontal overflow)
- [x] Generate updated `.tgz` packages (`npm pack`) for `@genovalv/core`, `@genovalv/tokens`, `@genovalv/elements`, and `@genovalv/server`

## 4. Pre-PR Checklist
- [x] Update `README.md` documenting `<genova-app-header>` and `@genovalv/core` header contracts

## 5. Create PR
- [ ] Commit final + push to `origin/feature/007-app-header-menu`
- [ ] Create PR (`source: feature/007-app-header-menu`, `target: develop`) via MCP / GitHub CLI after explicit user authorization
