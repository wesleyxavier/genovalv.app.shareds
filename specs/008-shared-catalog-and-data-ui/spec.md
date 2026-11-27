# Feature Specification: 008-shared-catalog-and-data-ui

**Feature Branch**: `feature/008-shared-catalog-and-data-ui`  
**Created**: 2026-11-27  
**Status**: Approved (Auto-authorized by user)  
**Design Source**: Mockups SVG 1–10 no padrão UI/UX Etapa 1 (`#FAF7F0`, `#FFFFFF`, `#715FAF`, `#3FA37C`, `#E7E2D8`, `#857F93`, `#0F172A`, `#475569`, `#64748B`, `#BC3737`, `Plus Jakarta Sans`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Catalog Modules, Effective Resolution & Money Contracts (`@genovalv/core`) (Priority: P1)

As any Genova application (`Admin`, `ERP`, `FactoryFloor`), I can import `BASE_MODULE_CATALOG`, `resolveEffectiveModules`, `validateCatalogCode`, `validateCatalogName`, and `Money` (using `decimal.js`) from `@genovalv/core` so module resolution, catalog validation, and monetary arithmetic are deterministic and shared across portals.

**Independent Test**: Run `vitest run --coverage` on `@genovalv/core` verifying 100% coverage for `resolveEffectiveModules`, `validateCatalogCode`, `validateCatalogName`, and `Money`.

### User Story 2 - Generic List Toolbar & Pagination (`@genovalv/elements` + `@genovalv/core`) (Priority: P1)

As any Genova portal rendering entity listings (such as `Empresas clientes` or `Usuários ADM`), I can compose `<genova-list-toolbar>` (search input + configurable filter dropdowns + action slot) and `<genova-pagination>` (`1–4 de 4` summary + prev/page/next controls) using pure helpers in `@genovalv/core` (`computePaginationRange`, `formatMaskedCpf`) so all list screens share identical Etapa 1 spacing, borders, and responsive behavior.

**Independent Test**: Render `<genova-list-toolbar>` and `<genova-pagination>` in Vitest (`happy-dom`) and Playwright (`1280x800` and `390x844`); verify `genova-search-change`, `genova-filter-change`, `genova-page-change` events, CPF masking `000.*** ***-00`, and zero horizontal overflow.

### User Story 3 - Generic Drag-and-Drop File Dropzone & Enhanced Modal (`@genovalv/elements` + `@genovalv/core`) (Priority: P1)

As any Genova portal requiring authenticated document uploads inside modals (such as LGPD support access authorization), I can use `<genova-file-dropzone>` inside `<genova-modal size="md">` (560px max-width, subtitle, `slot="footer"`) with drag-and-drop + click-to-pick, file type/size validation (`validateUploadFile`, `formatFileSize`), attached file list with green check and trash remove action, and inline validation feedback.

**Independent Test**: Render `<genova-file-dropzone>` and `<genova-modal size="md">` in Vitest (`happy-dom`) and Playwright; verify dragover/drop, file input change, invalid type/oversize rejection, `genova-files-select` / `genova-file-remove` / `genova-close` events, and `Escape` key closing.

### Edge Cases

- SSR safety: importing `@genovalv/core` and `@genovalv/elements` in Node MUST NOT touch `window`, `document`, or `customElements` at module evaluation time.
- Empty pagination (`totalItems = 0`): renders `0–0 de 0` with disabled prev/next buttons.
- Oversized (> 10 MB) or unsupported file extension/MIME: rejected by `validateUploadFile` without emitting valid selection, surfacing an accessible error message.
- `<genova-badge variant="neutral">`: supports neutral muted pills (`A definir`, `Inativo`, `Não se aplica`).

## Requirements *(mandatory)*

- **FR-001**: `@genovalv/core` MUST export `BASE_MODULE_CATALOG`, `resolveEffectiveModules`, `validateCatalogCode`, `validateCatalogName`, `Money`, `ListFilterOption`, `ListFilterConfig`, `PaginationSummary`, `computePaginationRange`, `formatMaskedCpf`, `UploadedFileItem`, `FileUploadValidationConfig`, `formatFileSize`, and `validateUploadFile` with 100% test coverage.
- **FR-002**: `@genovalv/elements` MUST export and register `<genova-list-toolbar>`, `<genova-pagination>`, and `<genova-file-dropzone>`, plus enhance `<genova-modal>` (`size`, `subtitle`, `slot="footer"`, `Escape` close) and `<genova-badge>` (`neutral` variant).
- **FR-003**: All new/modified TypeScript files MUST stay `<= 100` lines, use `strict: true`, and emit `{ bubbles: true, composed: true }` custom events.
- **FR-004**: `playground/` MUST include Storybook stories and Playwright E2E tests covering desktop (`1280x800`) and mobile (`390x844`).
- **FR-005**: Workspace packages MUST bump SemVer from `0.1.0` to `0.2.0` (`feat:` minor bump) and produce `.tgz` bundles.
