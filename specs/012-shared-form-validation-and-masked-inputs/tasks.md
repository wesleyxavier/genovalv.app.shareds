# Tasks: 012-shared-form-validation-and-masked-inputs

**Input**: Design documents from `/specs/012-shared-form-validation-and-masked-inputs/`
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)

## 0. Branch

- [ ] T000 Create worktree at `New/Shareds/worktrees/012-shared-form-validation-and-masked-inputs` on branch `feature/012-shared-form-validation-and-masked-inputs` from `develop`, moving `specs/012-shared-form-validation-and-masked-inputs/` into the worktree and keeping `develop` clean

---

## Phase 1: Máscaras CPF/CNPJ/CEP, Validação de CEP & i18n em `@genovalv/core` (US1 — TDD) 🎯 MVP

**Goal**: Exportar `formatCpf`, `formatCnpj`, `formatCep`, `isValidCep` e chaves de validação/busca nos 3 idiomas com 100% de cobertura.

### Tests First (Red)
- [ ] T001 [P] [US1] Write unit tests in `packages/core/tests/document-mask-and-cep.test.ts` covering `formatCpf`, `formatCnpj`, `formatCep`, `isValidCep` (digits-only, negative sign rejection, max length truncation, partial typing masks) and new translation keys

### Implementation (Green)
- [ ] T002 [P] [US1] Create `packages/core/src/domain/validators/format-document-mask.ts` (`<= 100` lines) and export from `packages/core/src/index.ts`
- [ ] T003 [P] [US1] Update `packages/core/src/domain/dtos/login-translation-key.dto.ts` and `packages/core/src/domain/constants/login-translations.ts` (splitting per-locale if > 100 lines) with `validation.fieldRequired`, `validation.cpfInvalid`, `validation.cnpjInvalid`, `validation.cepInvalid`, and `auth.searchAction`
- [ ] T004 [US1] Run `npm run build --workspace=@genovalv/core` and `npm run test:coverage --workspace=@genovalv/core` confirming 100% coverage

### Group 1 Commit Gate (Explicit User Authorization Required)
- [ ] T005 Ask explicit user permission, then `git commit` + `git push` Group 1

---

## Phase 2: Validação Nativa & `type="search"` + `inputmode="cpf|cnpj|cep"` em `@genovalv/elements` (US2 & US3 — TDD)

**Goal**: Fazer `<genova-button>`, `<genova-input>`, `<genova-select>` e `<genova-textarea>` participarem de validação/submit nativo via `ElementInternals`, bloquear negativos no `GenovaNumberInputElement` quando `min >= 0`, e habilitar máscara + botão lupa (`genova-search`) para `cpf`/`cnpj`/`cep`.

### Tests First (Red)
- [ ] T006 [P] [US2] Extend `packages/elements/tests/us4.form-controls.test.ts` verifying `<genova-button type="submit">` calling `requestSubmit()` / respecting `preventDefault()` on `genova-press`, `<genova-select required>` `setValidity` + `[error]` rendering, `<genova-textarea required>` `setValidity`, and `GenovaNumberInputElement` negative blocking when `min >= 0`
- [ ] T007 [P] [US3] Create `packages/elements/tests/input-search-masks.test.ts` testing `GenovaInputElement` `ElementInternals.setValidity`, `type="search"` magnifying-glass button (`genova-search` event + Enter key), and `inputmode="cpf" | "cnpj" | "cep"` live masking + rejection of letters/negative signs

### Implementation (Green)
- [ ] T008 [P] [US2] Update `packages/elements/src/components/actions/genova-button.ts` (`formAssociated`, `requestSubmit`/`reset`, `min-height: 34.5px; width: 100%;` on `button`), `packages/elements/src/components/selection/genova-select.ts`, `packages/elements/src/components/forms/genova-textarea.ts`, and `packages/elements/src/components/forms/genova-number-input.ts` (`<= 100` lines each)
- [ ] T009 [US2] [US3] Refactor `packages/elements/src/components/genova-input.ts` into `<= 100`-line cohesive modules (`styles`, `mask/validity/search` helpers, `GenovaInputElement`) implementing `ElementInternals.setValidity`, `type="search"` + magnifying-glass button (`genova-search`), and `inputmode="cpf" | "cnpj" | "cep"` masking/numeric guard
- [ ] T010 [US2] [US3] Run `npm run build` and `npm run test:coverage` across all `New/Shareds` workspaces

### Group 2 Commit Gate (Explicit User Authorization Required)
- [ ] T011 Ask explicit user permission, then `git commit` + `git push` Group 2

---

## Phase 3: Documentação, SemVer `0.6.0`, Tarballs `.tgz` & PR (US4)

- [ ] T012 Update `README.md` documenting native form validation (`ElementInternals`), `type="search"` + `inputmode="cpf|cnpj|cep"`, and new `@genovalv/core` mask helpers
- [ ] T013 Bump SemVer `0.5.0 → 0.6.0` in `package.json`, `packages/{core,tokens,elements,server}/package.json`, `playground/package.json`, and `package-lock.json` (`npm install`)
- [ ] T014 Run `npm run build`, `npm run test:coverage`, generate `0.6.0` tarballs in `dist/tarballs/` via `npm pack`, and run `graphify update .`
- [ ] T015 Ask explicit user permission, then final `git commit` + `git push` and create PR (`source: feature/012-shared-form-validation-and-masked-inputs`, `target: develop`)
- [ ] T016 After explicit user authorization (and merge), remove `worktrees/012-shared-form-validation-and-masked-inputs`
