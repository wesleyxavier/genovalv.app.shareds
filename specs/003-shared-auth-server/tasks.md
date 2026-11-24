# Tasks: Shared Pure Auth Contracts & `@genovalv/server`

**Input**: Design documents from `specs/003-shared-auth-server/`

## 0. Branch

- Worktree created at `New/Shareds/worktrees/003-shared-auth-server`
- Branch: `feature/003-shared-auth-server`
- Base: `develop` (uncommitted `core` auth work copied into worktree)

## 1. Governance & Pure Contracts (`@genovalv/core`)

- [x] T001 Update `AGENTS.md` and `.specify/memory/constitution.md` to authorize `@genovalv/server` in `packages/server/` while keeping `@genovalv/core` pure TS
- [x] T002 [P] Reorganize `packages/core/src/` under Clean Architecture (`domain/{constants,dtos,entities,i18n,interfaces,server-auth,validators,value-objects}/`, `application/use-cases/`, `infrastructure/`), 1 exported symbol per file
- [x] T003 [P] Export all pure auth, validator, i18n, VO, and use-case symbols through `packages/core/src/index.ts`
- [x] T004 Update Vitest unit suites in `packages/core/tests/` verifying `100%` coverage across statements, branches, functions, and lines

### 1.1 Commit Group 1
- [x] `git commit` + `git push` authorized by user

## 2. Shared Server Package (`@genovalv/server`)

- [x] T005 Scaffold `packages/server/` (`package.json`, `tsconfig.json`, `vite.config.ts`) and wire workspace scripts in root `package.json`
- [x] T006 [P] Implement `packages/server/src/infrastructure/` (`NodeHashService`, `JoseSessionTokenGateway`, `Auth0Gateway` + HTTP helpers, cookie helpers, session/idempotency guards, `loadEnvFile`) with Vitest unit specs
- [x] T007 [P] Implement shared Auth UseCases (`ResolvePostLoginUseCase`, `PasswordLoginUseCase`, `OAuthCallbackUseCase`, `BackchannelLogoutUseCase`, `BootstrapUseCase`) with Vitest specs
- [x] T008 [P] Implement shared H3 controllers (`BaseController`, `BaseAuthController`, `BaseUserController`, `LoginController`, `CallbackController`, `PasswordLoginController`, `MeController`, `LogoutController`, `BackchannelLogoutController`) with Vitest specs
- [x] T009 Export all `@genovalv/server` public symbols in `packages/server/src/index.ts` and verify `<= 100` lines/file

### 2.1 Commit Group 2
- [x] `git commit` + `git push` authorized by user

## 3. Verification & Tarball Packaging

- [x] T010 Run `npm run test:coverage` (`@genovalv/core` = 100%, `@genovalv/elements`, `@genovalv/server`) and `npm run build`
- [x] T011 Run `npm pack --workspace=@genovalv/core` and `npm pack --workspace=@genovalv/server` and stage updated `.tgz` packages for Admin and ERP

## 4. Pre-PR Checklist

- [x] Update `README.md` documenting `@genovalv/core` contracts and `@genovalv/server`
- [x] Run `graphify update .`

## 5. Create PR

- [x] Commit final + push (`feature/003-shared-auth-server`)
- [ ] Create PR targeting `develop` (`wesleyxavier/genovalv.app.shareds`)
