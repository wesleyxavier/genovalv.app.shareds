# Feature Specification: Shared Pure Auth Contracts (`@genovalv/core`) & Shared BFF Auth Server (`@genovalv/server`)

**Feature Branch**: `feature/003-shared-auth-server`
**Created**: 2026-11-24
**Status**: Draft
**Input**: User request & Admin TODO review: extract pure TypeScript auth/session/security contracts into `@genovalv/core`, update `AGENTS.md` to authorize a dedicated `@genovalv/server` package inside `New/Shareds/packages/server`, and move shared Auth0/Jose/H3/Cookie/UseCase/Controller building blocks there with 1 exported symbol per file (`<= 100` lines/file) and TDD Vitest coverage.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pure Auth & Repository Contracts in `@genovalv/core` (Priority: P1)

As an application (`Admin`, `ERP`, `FactoryFloor`), I import framework-agnostic auth/session/security interfaces, DTOs, and Post-Login claim validation rules from `@genovalv/core` without pulling any Node.js or HTTP runtime code into browser bundles.

**Why this priority**: Browser bundles (AnalogJS, Next.js, Nuxt.js) import `@genovalv/core` directly and fail if Node builtins (`node:crypto`, `dotenv`, `h3`) leak into `.`.

**Independent Test**: `npm run build` and `npm run test:coverage` in `packages/core` pass with 100% statements/branches/functions/lines and zero Node imports.

**Acceptance Scenarios**:

1. **Given** pure auth DTOs and gateway/service interfaces in `packages/core/src/`, **When** `@genovalv/core` builds ESM + `.d.ts`, **Then** no Node.js or HTTP framework dependency exists in `packages/core`.
2. **Given** `IBaseAuthUserRepository` and `BaseAuthUserSession` in `@genovalv/core`, **When** `Admin` and `ERP` extend them locally, **Then** neither app inherits fields belonging exclusively to the other.

---

### User Story 2 - Governance Alignment & `@genovalv/server` Package Creation (Priority: P1)

As a maintainer, I have `New/Shareds/AGENTS.md` updated to authorize backend auth/BFF packages strictly inside `packages/server/` (preserving the no-backend rule for `packages/core`, `packages/elements`, `packages/tokens`), and `@genovalv/server` exports shared Node/Auth0/Jose/H3 gateways, HTTP cookie/session helpers, base/auth use cases, and base/auth Nitro/H3 controllers.

**Why this priority**: Eliminates duplicating identical Auth0, JOSE cookie signing, and H3 session-guard code across `Admin` and `FactoryFloor` (and shares gateways/use cases with `ERP`).

**Independent Test**: `npm run test --workspace=@genovalv/server` and `npm run build --workspace=@genovalv/server` compile ESM + `.d.ts` cleanly and pack `.tgz` tarballs for consuming apps.

**Acceptance Scenarios**:

1. **Given** `packages/server/src/` with 1 exported symbol per file (`<= 100` lines/file), **When** `Vitest` runs, **Then** `NodeHashService`, `JoseSessionTokenGateway`, `Auth0Gateway`, cookie helpers, `requireUserSession`/`requireIdempotencyKey`, auth use cases, and base/auth H3 controllers pass unit tests.
2. **Given** `@genovalv/core` and `@genovalv/server` built in `New/Shareds`, **When** packed via `npm pack`, **Then** `.vendor/genovalv-core-0.1.0.tgz` and `.vendor/genovalv-server-0.1.0.tgz` install cleanly into `Admin`, `ERP`, and `FactoryFloor`.

### Edge Cases

- Browser apps importing `@genovalv/core` must never pull `@genovalv/server` transitively.
- `loadEnvFile` and auth helpers must never embed hardcoded fallback passwords, DB credentials, or session secrets.

## Requirements *(mandatory)*

- **FR-001**: Update `New/Shareds/AGENTS.md` (and `constitution.md` alignment note) so `packages/server/` (`@genovalv/server`) is explicitly permitted for shared Node/Auth0/H3 BFF modules while keeping `packages/core` browser-safe.
- **FR-002**: Keep strict Clean Code: 1 exported symbol per file, English-only code/comments, `<= 100` lines/file, no `any`.
- **FR-003**: Export pure DTOs, interfaces, `IBaseAuthUserRepository`, and `onExecutePostLogin` from `@genovalv/core` preserving 100% test coverage.
- **FR-004**: Create `@genovalv/server` workspace (`packages/server/`) exposing Auth0/Jose/NodeHash gateways, cookie/session guards, env loader helper, auth use cases, and Nitro/H3 base/auth controllers with Vitest tests.
- **FR-005**: Pack `.tgz` artifacts (`npm pack`) for `@genovalv/core` and `@genovalv/server` ready for consumption.

## Success Criteria *(mandatory)*

- **SC-001**: `@genovalv/core` achieves `100%` Vitest coverage (`lines`, `functions`, `branches`, `statements`).
- **SC-002**: `@genovalv/server` passes all Vitest unit suites and builds ESM + `.d.ts` with zero TypeScript errors.
- **SC-003**: Zero source files in `packages/core` or `packages/server` exceed `100` lines.
