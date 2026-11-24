# Implementation Plan: Shared Pure Auth Contracts (`@genovalv/core`) & `@genovalv/server`

**Branch**: `feature/003-shared-auth-server` | **Date**: 2026-11-24 | **Spec**: [spec.md](./spec.md)

## Summary

Split shared concerns cleanly across two workspace packages in `New/Shareds`:
1. **`@genovalv/core`**: pure TypeScript domain contracts, DTOs, `IBaseAuthUserRepository`, `UserCookieSession`, Auth0/Hash/Token gateway interfaces, `PostLogin` rule (`onExecutePostLogin`), 100% browser/SSR-safe.
2. **`@genovalv/server`**: Node/H3/Jose/Auth0 server infrastructure (`NodeHashService`, `JoseSessionTokenGateway`, `Auth0Gateway`, cookie & session-guard helpers, `loadEnvFile`), auth use cases (`ResolvePostLoginUseCase`, `PasswordLoginUseCase`, `OAuthCallbackUseCase`, `BackchannelLogoutUseCase`, `BootstrapUseCase`), and H3 base/auth controllers.

## Technical Context

- **Language/Version**: TypeScript `^5.8.2` (`strict: true`, `ES2022`, ESM)
- **Primary Dependencies**: `@genovalv/core` (zero runtime deps); `@genovalv/server` (`@genovalv/core`, `jose`, `h3`, `dotenv`)
- **Testing**: Vitest `^3.1.0` (`node` environment; 100% coverage gate in `core`)
- **Constraints**: 1 exported symbol/file where modular contracts/helpers are split; `<= 100` lines per source file; English-only source/comments

## Constitution Check

- [x] `AGENTS.md` updated before placing HTTP/Auth0/Node code into `packages/server/`.
- [x] `@genovalv/core` retains zero browser DOM or Node builtin imports.
- [x] TDD written before/alongside modules; 100% coverage in `@genovalv/core`.
- [x] Every source file `<= 100` lines.

## Project Structure

```text
New/Shareds/
├── AGENTS.md                        # Add @genovalv/server boundary rules
├── package.json                     # Add @genovalv/server build & test scripts
└── packages/
    ├── core/src/                    # Pure TS contracts, DTOs, interfaces, onExecutePostLogin
    └── server/                      # New @genovalv/server workspace package
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts
        ├── src/
        │   ├── domain/constants/
        │   ├── application/use-cases/auth/
        │   ├── infrastructure/{auth0,config,http,security}/
        │   ├── presentation/controllers/{base,auth}/
        │   └── index.ts
        └── tests/
```
