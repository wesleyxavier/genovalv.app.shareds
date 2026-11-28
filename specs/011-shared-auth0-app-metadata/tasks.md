# Tasks: 011-shared-auth0-app-metadata

**Input**: Design documents from `/specs/011-shared-auth0-app-metadata/`
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)

## 0. Branch

- [x] T000 Create worktree at `New/Shareds/worktrees/011-shared-auth0-app-metadata` on branch `feature/011-shared-auth0-app-metadata` from `develop` (moving `specs/011-shared-auth0-app-metadata/` and `.specify/feature.json` into the worktree)

---

## Phase 1: Contratos e Validadores Puros em `@genovalv/core` (US1 — TDD) 🎯 MVP

**Goal**: Definir `AppSetupContext`, estender `IAuth0Gateway` / `PostLogin*` e implementar `validateAppSetupMetadata` + `onExecutePostLogin` com 100% de cobertura.

**Independent Test**: `npm run build --workspace=@genovalv/core` e `npm run test:coverage --workspace=@genovalv/core` passam com 100% em todas as métricas.

### Tests First (Red)
- [x] T001 [P] [US1] Write unit tests for `validateAppSetupMetadata` in `packages/core/tests/app-setup-validation.test.ts` (valid match, non-empty check, `app_setup_id`/`app_setup_secret`/`environment` mismatch, `requireGenovaAdmin`, namespaced claims extraction)
- [x] T002 [P] [US1] Extend `packages/core/tests/post-login-action.test.ts` verifying custom claims for `app_setup_id`, `app_setup_secret`, `environment`, and `user_metadata.genova_admin`

### Implementation (Green)
- [x] T003 [P] [US1] Create `packages/core/src/domain/server-auth/app-setup-context.ts` and `packages/core/src/domain/server-auth/create-management-user-payload.ts`, exporting from `packages/core/src/index.ts`
- [x] T004 [P] [US1] Create `packages/core/src/domain/server-auth/validate-app-setup-metadata.ts` (pure function `<= 100` lines) and export from `packages/core/src/index.ts`
- [x] T005 [P] [US1] Update `packages/core/src/domain/server-auth/iauth0-gateway.ts` (use `CreateManagementUserPayload`, add optional `getUserMetadata?`), `post-login-user-metadata.ts`, and `ipost-login-event.ts`
- [x] T006 [US1] Update `packages/core/src/application/use-cases/post-login-action.usecase.ts` to emit `app_setup_id`, `app_setup_secret`, `environment`, and `genova_admin` claims under `${namespace}`
- [x] T007 [US1] Run `npm run build --workspace=@genovalv/core` and `npm run test:coverage --workspace=@genovalv/core` confirming 100% coverage

### Group 1 Commit Gate (Explicit User Authorization Required)
- [x] T008 Ask explicit user permission, then `git commit` + `git push` Group 1

---

## Phase 2: `Auth0Gateway` e Login Guards em `@genovalv/server` (US2 — TDD)

**Goal**: Suportar metadados estendidos no `Auth0Gateway` (provisionamento + leitura via Management API) e verificação opcional `expectedAppSetup` no `PasswordLoginUseCase` e `OAuthCallbackUseCase`, mantendo arquivos `<= 100` linhas.

**Independent Test**: `npm run build --workspace=@genovalv/server` e `npm run test --workspace=@genovalv/server` passam com cobertura dos fluxos com e sem `expectedAppSetup`.

### Tests First (Red)
- [x] T009 [P] [US2] Extend `packages/server/tests/auth0-and-security.test.ts` covering `createManagementUser` (`app_metadata` + `user_metadata.genova_admin`) and `getUserMetadata` (`/api/v2/users/:id?fields=app_metadata,user_metadata`)
- [x] T010 [P] [US2] Extend `packages/server/tests/auth-usecases.test.ts` covering `PasswordLoginUseCase` (`403` on mismatch/missing, `ok` on match, backward-compat when omitted) and `OAuthCallbackUseCase` (redirect error vs success, fallback to `getUserMetadata`)

### Implementation (Green)
- [x] T011 [P] [US2] Create `packages/server/src/infrastructure/auth0/build-management-user-body.ts` and refactor `packages/server/src/infrastructure/auth0/auth0.gateway.ts` (`<= 100` lines) to send extended metadata and implement `getUserMetadata`
- [x] T012 [P] [US2] Create `packages/server/src/application/use-cases/auth/verify-app-setup-login.ts` to check JWT claims and fallback to `auth0.getUserMetadata`
- [x] T013 [US2] Update `packages/server/src/application/use-cases/auth/password-login.usecase.ts` and `oauth-callback.usecase.ts` accepting optional `expectedAppSetup?: AppSetupContext`
- [x] T014 [US2] Run `npm run build` and `npm run test:coverage` across all workspaces

### Group 2 Commit Gate (Explicit User Authorization Required)
- [x] T015 Ask explicit user permission, then `git commit` + `git push` Group 2

---

## Phase 3: Documentação, SemVer `0.5.0` & Empacotamento `.tgz` (US3)

- [x] T016 Update `README.md` documenting `AppSetupContext`, `validateAppSetupMetadata`, and optional `expectedAppSetup` enforcement in `@genovalv/server`
- [x] T017 Bump SemVer `0.4.0 → 0.5.0` in `package.json`, `packages/{core,tokens,elements,server}/package.json`, `playground/package.json`, and `package-lock.json` (`npm install`)
- [x] T018 Run full validation (`npm run build`, `npm run test:coverage`, `npm run test:e2e`) and generate `0.5.0` tarballs in `dist/tarballs/` via `npm pack`

---

## Phase 4: PR & Worktree Cleanup (Explicit User Authorization Required)

- [x] T019 Run `graphify update .` (via pre-commit hook), commit final + push `feature/011-shared-auth0-app-metadata`, and open PR targeting `develop` (after explicit user authorization)
- [ ] T020 After PR merge and explicit user authorization, remove `worktrees/011-shared-auth0-app-metadata` (`git worktree remove` + `git pull` on `develop`)
