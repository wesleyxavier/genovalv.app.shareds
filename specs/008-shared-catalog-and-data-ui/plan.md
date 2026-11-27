# Implementation Plan: 008-shared-catalog-and-data-ui

**Branch**: `feature/008-shared-catalog-and-data-ui` (base: `develop`)  
**Worktree**: `worktrees/008-shared-catalog-and-data-ui`  
**Stack**: TypeScript 5.8 (`strict`), Lit 3, Vite 6, Vitest 3 (`node` + `happy-dom`), Playwright

## Architecture & File Layout

1. **`packages/core/src/`** (pure TS, 100% coverage):
   - `domain/constants/base-module-catalog.ts` (10 base modules)
   - `domain/helpers/resolve-effective-modules.ts`
   - `domain/validators/catalog-validators.ts`
   - `domain/value-objects/money.ts` (`decimal.js`)
   - `domain/helpers/app-header.helpers.ts` (`TS2532` fix)
   - `domain/dtos/list-ui.dto.ts` + `domain/helpers/list-ui.helpers.ts`
   - `domain/dtos/file-upload.dto.ts` + `domain/helpers/file-upload.helpers.ts`
   - Export all in `packages/core/src/index.ts`

2. **`packages/elements/src/`** (Lit 3, SSR-safe, `<= 100` lines/file):
   - `components/data/genova-badge.ts` (add `'neutral'` variant)
   - `components/data/genova-list-toolbar.ts` + `genova-list-toolbar.styles.ts`
   - `components/data/genova-pagination.ts` + `genova-pagination.styles.ts`
   - `components/forms/genova-file-dropzone.ts` + `genova-file-dropzone.styles.ts`
   - `components/overlays/genova-modal.ts` (add `size`, `subtitle`, `slot="footer"`, `Escape` handler)
   - Register in `packages/elements/src/index.ts`

3. **`playground/`**:
   - `src/stories/etapa1/08-list-and-upload.stories.ts`
   - `e2e/list-and-upload.spec.ts`

4. **Packaging & Versioning**:
   - Bump `0.1.0` -> `0.2.0` in root + `packages/{core,tokens,elements,server}/package.json` and update internal `@genovalv/core` dependency in `@genovalv/elements` and `@genovalv/server`.
   - `npm run build`, `npm run test:coverage`, `npm run test:e2e`.
