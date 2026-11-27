# Tasks: 008-shared-catalog-and-data-ui

## 0. Branch
- [ ] Validate `develop` is up to date (`rtk git fetch origin develop`)
- [ ] Create worktree at `worktrees/008-shared-catalog-and-data-ui` on branch `feature/008-shared-catalog-and-data-ui` from `develop` (skill: `openspec-worktree`)

## 1. Core Contracts & Helpers (`@genovalv/core` — TDD)
- [ ] Include catalog modules, `resolveEffectiveModules`, `catalog-validators`, `Money`, and `app-header.helpers.ts` fix
- [ ] Write failing unit tests in `packages/core/tests/list-ui.test.ts` and `packages/core/tests/file-upload.test.ts`
- [ ] Create `list-ui.dto.ts`, `list-ui.helpers.ts`, `file-upload.dto.ts`, `file-upload.helpers.ts` (`<= 100` lines each) and export in `packages/core/src/index.ts`
- [ ] Verify `npm run test:coverage --workspace=@genovalv/core` (100% coverage)

### 1.1 Commit Group 1
- [ ] `git commit -m "feat(core): add catalog helpers, list pagination, CPF mask and file upload validators"`
- [ ] `git push -u origin feature/008-shared-catalog-and-data-ui`

## 2. Shared Web Components (`@genovalv/elements` — TDD)
- [ ] Write failing unit/DOM/SSR tests in `packages/elements/tests/list-and-upload.test.ts` and update `elements.ssr.test.ts`
- [ ] Enhance `genova-badge.ts` (`neutral` variant) and `genova-modal.ts` (`size`, `subtitle`, `slot="footer"`, `Escape` close)
- [ ] Implement `genova-list-toolbar.ts` (+ styles), `genova-pagination.ts` (+ styles), `genova-file-dropzone.ts` (+ styles) (`<= 100` lines each)
- [ ] Register new elements in `packages/elements/src/index.ts` and verify `npm run test:unit`

### 2.1 Commit Group 2
- [ ] `git commit -m "feat(elements): add genova-list-toolbar, genova-pagination, genova-file-dropzone and enhance modal/badge"`
- [ ] `git push`

## 3. Storybook, Build, E2E & SemVer
- [ ] Add Storybook stories in `playground/src/stories/etapa1/08-list-and-upload.stories.ts`
- [ ] Add Playwright E2E tests in `playground/e2e/list-and-upload.spec.ts`
- [ ] Bump version `0.1.0` → `0.2.0` (`semantic-versioning`) in root and `packages/{core,tokens,elements,server}`
- [ ] Run `npm run build`, `npm run test:coverage`, and `npm run test:e2e`

## 4. Pre-PR Checklist
- [ ] Update `README.md` documenting new `@genovalv/core` helpers and `@genovalv/elements` components
- [ ] Run `graphify update .` (if available)

## 5. Create PR & Merge
- [ ] Final `git commit` + `git push` on `feature/008-shared-catalog-and-data-ui`
- [ ] Create PR (`source: feature/008-shared-catalog-and-data-ui`, `target: develop`) via `gh pr create`
- [ ] Merge PR via `gh pr merge`, checkout `develop`, `git pull origin develop`, and remove worktree
