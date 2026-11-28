# Tasks: 010-shared-cleanup-and-edge-proxy

**Input**: Design documents from `/specs/010-shared-cleanup-and-edge-proxy/`
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)

## 0. Branch

- [x] T000 Create worktree at `New/Shareds/worktrees/010-shared-cleanup-and-edge-proxy` on branch `feature/010-shared-cleanup-and-edge-proxy` from `develop` (and carry current `New/Shareds` working-tree edits into the branch)

---

## Phase 1: Cleanup & Brand Constant (US1)

**Goal**: Concluir remoção de `BootstrapUseCase` / `bootstrap-user*` e consolidar `GENOVA_BRAND_NAME = 'Genova Cloud'` com cobertura de 100% em `@genovalv/core`.

**Independent Test**: `npm run build` e `npm run test:coverage` passam com 0 falhas.

- [x] T001 [P] [US1] Ensure `packages/core/src/domain/constants/brand-name.ts` exports `GENOVA_BRAND_NAME = 'Genova Cloud'`, re-export in `packages/core/src/index.ts`, and use it in `packages/core/src/domain/constants/default-login-context.ts`
- [x] T002 [P] [US1] Remove orphan files `packages/core/src/domain/server-auth/bootstrap-user-input.ts`, `packages/core/src/domain/server-auth/bootstrap-user-result.ts`, and their exports from `packages/core/src/index.ts`
- [x] T003 [US1] Update `packages/server/tests/auth-usecases.test.ts` removing `BootstrapUseCase` import and assertion while keeping all active auth use-case tests passing
- [x] T004 [US1] Run `npm run build` and `npm run test:coverage` across all workspaces to verify 100% core coverage and green unit/SSR/DOM tests

### Group 1 Commit Gate (Explicit User Authorization Required)
- [x] T005 Ask explicit user permission, then `git commit` + `git push` Group 1

---

## Phase 2: Migrate Cloudflare Edge Proxy & Remove Postgres from Compose (US2)

**Goal**: Incorporar integralmente o proxy de borda local da `worktrees/feature-cloudflare-edge-proxy` mantendo `package.json` compatível com `@genovalv/server` e removendo `postgres` de `docker-compose.yml`.

**Independent Test**: Estrutura `edge/` validada, `docker compose config` válido sem `postgres`, `npm run test:edge` executável com Docker.

- [x] T006 [P] [US2] Copy `edge/` (`certs-init/`, `nginx/`, `origin-echo/`, `tests/`, `test.env`), `playground/vite.config.ts`, `playwright.edge.config.ts`, and `.gitattributes` from `worktrees/feature-cloudflare-edge-proxy/`
- [x] T007 [P] [US2] Merge `.gitignore` (cert/cache ignores) and `.env.example` (`EDGE_*` variables on port `3010`) into the branch
- [x] T008 [P] [US2] Write `docker-compose.yml` containing only `edge-certs-init`, `edge-proxy`, `playground`, and `edge-origin-echo` (removing the `postgres` service)
- [x] T009 [US2] Update root `package.json` (preserving `@genovalv/server` in `build`, `test:unit`, `test:coverage`) adding `test:edge`, `test:edge:hmr`, and `@types/node`, then update `package-lock.json` via `npm install`

### Group 2 Commit Gate (Explicit User Authorization Required)
- [x] T010 Ask explicit user permission, then `git commit` + `git push` Group 2

---

## Phase 3: Verification, SemVer `0.4.0`, Tarballs & Pre-PR Documentation (US3)

**Goal**: Atualizar documentação (`README.md`, `AGENTS.md`, `specs/002-cloudflare-edge-proxy`), aplicar SemVer `0.4.0` nos pacotes, validar todos os testes/builds e gerar `.tgz` via `npm pack`.

- [x] T011 [P] [US3] Update `README.md` (removing `BootstrapUseCase` and local Postgres instructions; aligning edge-proxy docs to port `3010` and `admin`/`erp`/`factoryfloor`/`playground` hosts) and `AGENTS.md` (documenting `edge/`, `test:edge`, `test:edge:hmr`, `@genovalv/server`, and cert/cache rules)
- [x] T012 [P] [US3] Sync non-conflicting doc updates in `specs/002-cloudflare-edge-proxy/` from `worktrees/feature-cloudflare-edge-proxy` (aligning port `3010` reference)
- [x] T013 [US3] Bump SemVer `0.3.1 → 0.4.0` in `package.json`, `packages/{core,tokens,elements,server}/package.json` (including internal `@genovalv/core` dependencies/peerDependencies), and `package-lock.json`
- [x] T014 [US3] Run full validation: `npm run build`, `npm run test:unit`, `npm run test:coverage`, `npm run test:e2e`, and (with Docker) `npm run test:edge`; generate `0.4.0` tarballs via `npm pack` per package

---

## Phase 4: Create PR & Clean Up All Worktrees (Explicit User Authorization Required)

- [x] T015 Run `graphify update .` (or pre-commit hook) so `graphify-out/` reflects `0.4.0` and zero `bootstrap-user*` nodes
- [x] T016 Ask explicit user permission, then final `git commit` + `git push` and create PR (`source: feature/010-shared-cleanup-and-edge-proxy`, `target: develop`)
- [ ] T017 After PR merge and explicit user authorization, remove the 2 legacy worktrees (`worktrees/008-auth0-setup-metadata-and-no-seed` and `worktrees/feature-cloudflare-edge-proxy`) and clean up `worktrees/010-shared-cleanup-and-edge-proxy` (+ optional deletion of obsolete branches)
