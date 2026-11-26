# Graph Report - 004-shared-remove-h3  (2026-11-26)

## Corpus Check
- 214 files · ~61,406 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1012 nodes · 1472 edges · 70 communities (69 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d6fa6693`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- index.ts
- Tasks: Shared Login Foundation & Base Components
- Custom Elements Catalog
- main.ts
- Tasks: [FEATURE NAME]
- SKILL.md
- Implementation Plan: Shared Login Foundation & Base Components
- package.json
- package.json
- package.json
- compilerOptions
- Execution Steps
- common.ps1
- package.json
- Feature Specification: [FEATURE NAME]
- SKILL.md
- SKILL.md
- SKILL.md
- package.json
- Core Principles
- Core Principles
- Implementation Plan: [FEATURE]
- AGENTS.md — `New/Shareds` (`@genovalv/shareds`)
- SKILL.md
- create-new-feature.ps1
- Phase 0 Research: Shared Login Foundation & Base Components
- SKILL.md
- SKILL.md
- compilerOptions
- compilerOptions
- SKILL.md
- SKILL.md
- Specification Quality Checklist: Shared Login Foundation & Base Components
- Genova Shareds (`New/Shareds`)
- [CHECKLIST TYPE] Checklist: [FEATURE NAME]
- GenovaInputElement
- Tasks: Proxy de Borda Local (Simulação Cloudflare)
- User Scenarios & Testing *(mandatory)*
- Plano de Testes E2E: Proxy de Borda Local
- Implementation Plan: Proxy de Borda Local (Simulação Cloudflare)
- auth-contracts.ts
- identity.ts
- Contrato da Borda Local
- audit-log.ts
- Specification Quality Checklist: Proxy de Borda Local (Simulação Cloudflare)
- Data Model: Proxy de Borda Local
- Quickstart: validar a borda local
- package.json
- Auth0Gateway
- index.ts
- base-auth.controller.ts
- Implementation Plan: Shared Pure Auth Contracts (`@genovalv/core`) & `@genovalv/server`
- BaseController
- Tasks: Shared Pure Auth Contracts & `@genovalv/server`
- compilerOptions
- JoseSessionTokenGateway

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Tasks: Proxy de Borda Local (Simulação Cloudflare)` - 16 edges
3. `SupportedLocale` - 14 edges
4. `CompanyBinding` - 14 edges
5. `registerGenovaElements()` - 14 edges
6. `registerCustomElement()` - 14 edges
7. `Tasks: Shared Login Foundation & Base Components` - 14 edges
8. `Auth0Gateway` - 13 edges
9. `Tasks: [FEATURE NAME]` - 13 edges
10. `Research: Proxy de Borda Local (Simulação Cloudflare)` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Auth0TokenClaims` --references--> `CompanyBinding`  [EXTRACTED]
  packages/core/src/domain/dtos/auth0-token-claims.dto.ts → packages/core/src/domain/entities/company-binding.entity.ts
- `CredentialsSubmission` --references--> `SupportedLocale`  [EXTRACTED]
  packages/core/src/domain/entities/credentials-submission.entity.ts → packages/core/src/domain/dtos/supported-locale.dto.ts
- `RememberedAuthSession` --inherits--> `AuthSession`  [EXTRACTED]
  packages/core/src/domain/entities/remembered-auth-session.entity.ts → packages/core/src/domain/entities/auth-session.entity.ts
- `UserCookieSession` --references--> `CompanyBinding`  [EXTRACTED]
  packages/core/src/domain/server-auth/user-cookie-session.ts → packages/core/src/domain/entities/company-binding.entity.ts
- `registerGenovaElements()` --indirect_call--> `GenovaActionButtonElement`  [INFERRED]
  packages/elements/src/index.ts → packages/elements/src/components/genova-action-button.ts

## Import Cycles
- None detected.

## Communities (70 total, 1 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.09
Nodes (31): DEFAULT_LOGIN_CONTEXT, LOGIN_TRANSLATIONS, MFA_GUIDANCE_MAP, LoginContextConfiguration, LoginDictionary, LoginFieldName, LoginLink, LoginRawInput (+23 more)

### Community 1 - "index.ts"
Cohesion: 0.08
Nodes (14): GenovaActionButtonElement, AlertVariant, GenovaAlertBannerElement, GenovaAuthCardElement, GenovaAuthShellElement, GenovaCheckboxElement, GenovaFooterElement, GenovaHeaderElement (+6 more)

### Community 2 - "Tasks: Shared Login Foundation & Base Components"
Cohesion: 0.06
Nodes (34): 0. Branch, 1.1 Commit Group 1, 2.1 Commit Group 2, 3.1 Commit Group 3, 4.1 Commit Group 4, 5.1 Commit Group 5, 6.1 Commit Group 6, Dependencies & Execution Order (+26 more)

### Community 3 - "Custom Elements Catalog"
Cohesion: 0.06
Nodes (28): Contract: `@genovalv/core` Public API, Exported Functions & Constants, Exported Types, 1. `<genova-header>`, 2. `<genova-footer>`, 3. `<genova-auth-shell>`, 4. `<genova-auth-card>`, 5. `<genova-action-button>` (+20 more)

### Community 4 - "main.ts"
Cohesion: 0.13
Nodes (12): alertBanner, card, emailInput, form, localeSelect, mfaInput, mfaSelector, params (+4 more)

### Community 5 - "Tasks: [FEATURE NAME]"
Cohesion: 0.07
Nodes (26): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery, MVP First (User Story 1 Only) (+18 more)

### Community 6 - "SKILL.md"
Cohesion: 0.08
Nodes (25): 1. Initialize Analysis Context, 2. Load Artifacts (Progressive Disclosure), 3. Build Semantic Models, 4. Detection Passes (Token-Efficient Analysis), 5. Severity Assignment, 6. Produce Compact Analysis Report, 7. Provide Next Actions, 8. Offer Remediation (+17 more)

### Community 7 - "Implementation Plan: Shared Login Foundation & Base Components"
Cohesion: 0.09
Nodes (21): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: Shared Login Foundation & Base Components, Project Structure, Source Code (`New/Shareds/`), Summary, Technical Context (+13 more)

### Community 8 - "package.json"
Cohesion: 0.10
Nodes (20): dependencies, @genovalv/core, lit, devDependencies, happy-dom, typescript, vite, vitest (+12 more)

### Community 9 - "package.json"
Cohesion: 0.12
Nodes (17): devDependencies, typescript, vitest, @vitest/coverage-v8, exports, files, import, main (+9 more)

### Community 10 - "package.json"
Cohesion: 0.12
Nodes (16): devDependencies, @playwright/test, typescript, vite, vitest, name, private, scripts (+8 more)

### Community 11 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, declaration, declarationMap, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, lib, module (+8 more)

### Community 12 - "Execution Steps"
Cohesion: 0.12
Nodes (15): 1. Initialize Convergence Context, 2. Load Artifacts (Progressive Disclosure), 3. Build the Intent Inventory, 4. Assess the Codebase and Classify Findings, 5. Assign Severity, 6. Present the In-Session Findings Summary, 7. Append Convergence Tasks (or report converged), 8. Provide Next Actions (Handoff) (+7 more)

### Community 13 - "common.ps1"
Cohesion: 0.23
Nodes (13): Find-SpecifyRoot(), Format-SpecKitCommand(), Get-CurrentBranch(), Get-FeaturePathsEnv(), Get-InvokeSeparator(), Get-NormalizedPriority(), Get-Python3Command(), Get-RepoRoot() (+5 more)

### Community 14 - "package.json"
Cohesion: 0.13
Nodes (14): dependencies, @genovalv/core, @genovalv/elements, @genovalv/tokens, devDependencies, vite, name, private (+6 more)

### Community 15 - "Feature Specification: [FEATURE NAME]"
Cohesion: 0.15
Nodes (12): Assumptions, Edge Cases, Feature Specification: [FEATURE NAME], Functional Requirements, Key Entities *(include if feature involves data)*, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+4 more)

### Community 16 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, Key rules, Mandatory Post-Execution Hooks, Outline, Phase 0: Outline & Research, Phase 1: Design & Contracts, Phases (+2 more)

### Community 17 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, For AI Generation, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, Quick Guidelines, Section Requirements (+2 more)

### Community 18 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Checklist Format (REQUIRED), Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Phase Structure, Pre-Execution Checks, Task Generation Rules (+2 more)

### Community 19 - "package.json"
Cohesion: 0.18
Nodes (10): exports, ./tailwind.css, ./tokens.css, files, name, private, scripts, build (+2 more)

### Community 20 - "Core Principles"
Cohesion: 0.20
Nodes (9): Core Principles, Genova Shareds (`New/Shareds`) Constitution, Governance, I. Arquitetura Híbrida de Pacotes Compartilhados e TS Compartilhado, II. Design System Único (Genova Cloud Console), III. Compatibilidade Cross-Framework e SSR-Safety, IV. Test-First (TDD), Clean Code e Limite de 100 Linhas, V. Governança Spec Kit, Segurança e Estratégia de Idempotência (+1 more)

### Community 21 - "Core Principles"
Cohesion: 0.18
Nodes (10): Core Principles, Governance, [PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], [PRINCIPLE_3_NAME], [PRINCIPLE_4_NAME], [PRINCIPLE_5_NAME], [PROJECT_NAME] Constitution (+2 more)

### Community 22 - "Implementation Plan: [FEATURE]"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: [FEATURE], Project Structure, Source Code (repository root), Summary, Technical Context

### Community 23 - "AGENTS.md — `New/Shareds` (`@genovalv/shareds`)"
Cohesion: 0.25
Nodes (7): AGENTS.md — `New/Shareds` (`@genovalv/shareds`), Architecture & Package Boundaries, Build & Test, Conventions, Do NOT, Testing, Workflow & Governance

### Community 24 - "SKILL.md"
Cohesion: 0.25
Nodes (7): Anti-Examples: What NOT To Do, Checklist Purpose: "Unit Tests for English", Example Checklist Types & Sample Items, Execution Steps, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 25 - "create-new-feature.ps1"
Cohesion: 0.39
Nodes (4): ConvertTo-AsciiLower(), ConvertTo-CleanBranchName(), ConvertTo-UnicodeWords(), Get-BranchName()

### Community 26 - "Phase 0 Research: Shared Login Foundation & Base Components"
Cohesion: 0.25
Nodes (7): 1. Monorepo / Workspace Orchestration, 2. Pure TypeScript Domain & Validation Package (`@genovalv/core`), 3. Design Tokens & Form Control Styling (`@genovalv/tokens`), 4. Web Components Multi-Framework (`@genovalv/elements` com Lit 3), 5. Local Visual Sandbox & Testing Strategy (`Vitest` + `Playwright`), 6. Framework-Agnostic i18n by Default (`@genovalv/core`), Phase 0 Research: Shared Login Foundation & Base Components

### Community 27 - "SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 28 - "SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 29 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, lib, outDir, rootDir, extends, include

### Community 30 - "compilerOptions"
Cohesion: 0.29
Nodes (6): compilerOptions, declarationDir, outDir, rootDir, extends, include

### Community 31 - "SKILL.md"
Cohesion: 0.33
Nodes (5): Outline, Post-Execution Checks, Pre-Execution Checks, Scope Guard, User Input

### Community 32 - "SKILL.md"
Cohesion: 0.33
Nodes (5): Deprecation Notice, Outline, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 33 - "Specification Quality Checklist: Shared Login Foundation & Base Components"
Cohesion: 0.33
Nodes (5): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Shared Login Foundation & Base Components

### Community 34 - "Genova Shareds (`New/Shareds`)"
Cohesion: 0.40
Nodes (4): Comandos, Genova Shareds (`New/Shareds`), Infraestrutura Local (PostgreSQL 17), Pacotes

### Community 35 - "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
Cohesion: 0.40
Nodes (4): [Category 1], [Category 2], [CHECKLIST TYPE] Checklist: [FEATURE NAME], Notes

### Community 45 - "GenovaInputElement"
Cohesion: 0.15
Nodes (13): D10 — Estratégia de testes (TDD), D11 — Dockerização do FactoryFloor, D1 — Hosts locais por roteamento, D2 — Alcançar as origens, D3 — TLS local, D4 — Headers de borda, D5 — Cache de borda, D6 — Rate limit (+5 more)

### Community 47 - "Tasks: Proxy de Borda Local (Simulação Cloudflare)"
Cohesion: 0.05
Nodes (38): 0. Branch, 1.1 Commit Group — Setup, 2.1 Commit Group — Foundational, 3.1 Commit Group — US1, 4.1 Commit Group — US2, 5.1 Commit Group — US3, 6.1 Commit Group — US4, 7.1 Commit Group — Resiliência (+30 more)

### Community 48 - "User Scenarios & Testing *(mandatory)*"
Cohesion: 0.15
Nodes (13): Assumptions, Edge Cases, Feature Specification: Proxy de Borda Local (Simulação Cloudflare), Functional Requirements, Key Entities, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+5 more)

### Community 49 - "Plano de Testes E2E: Proxy de Borda Local"
Cohesion: 0.17
Nodes (12): 1. Estratégia em camadas, 2. Pré-requisitos e dados, 3. Casos de teste, 4. Rastreabilidade, 5. Critérios de aceite e execução, 6. Riscos e lacunas, L0 — Smoke, L1 — Contrato (API) (+4 more)

### Community 50 - "Implementation Plan: Proxy de Borda Local (Simulação Cloudflare)"
Cohesion: 0.25
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: Proxy de Borda Local (Simulação Cloudflare), Project Structure, Source Code (repository root: `New/Shareds/`), Summary, Technical Context

### Community 51 - "auth-contracts.ts"
Cohesion: 0.09
Nodes (20): executeIdempotent(), onExecutePostLogin(), Auth0TokenClaims, BindingValidationResult, BranchType, EmailCpfCompanyEntry, IdempotencyRecord, CompanyBinding (+12 more)

### Community 52 - "identity.ts"
Cohesion: 0.07
Nodes (21): BaseLoginAuthUseCase, BaseLogoutAuthUseCase, BaseRefreshSessionUseCase, AuthResult, AuthenticatedMeResponse, HttpAuthRoutes, HttpFetch, HttpRequestInit (+13 more)

### Community 54 - "Contrato da Borda Local"
Cohesion: 0.29
Nodes (7): Contrato da Borda Local, Endpoints, Headers de resposta, Headers enviados à origem (sobrescrevem valores do cliente), Redirecionamento, Status gerados pela borda, Variáveis de ambiente (`.env`)

### Community 55 - "audit-log.ts"
Cohesion: 0.06
Nodes (17): AuditLogEntry, AuditLogInput, AuditLogLevel, DocumentType, UserModel, AuditLogger, Auth0JwtClaims, Auth0TokenExchangeResult (+9 more)

### Community 56 - "Specification Quality Checklist: Proxy de Borda Local (Simulação Cloudflare)"
Cohesion: 0.33
Nodes (5): Content Quality, Feature Readiness, Notes, Requirement Completeness, Specification Quality Checklist: Proxy de Borda Local (Simulação Cloudflare)

### Community 57 - "Data Model: Proxy de Borda Local"
Cohesion: 0.40
Nodes (5): Certificado local (LocalCertificate), Data Model: Proxy de Borda Local, Origem (Origin), Regra de borda (EdgeRule), Variáveis de configuração

### Community 58 - "Quickstart: validar a borda local"
Cohesion: 0.40
Nodes (5): 1. Subir a borda, 2. Validação manual, 3. Suíte automatizada, 4. Apps reais, Quickstart: validar a borda local

### Community 59 - "package.json"
Cohesion: 0.08
Nodes (24): dependencies, dotenv, jose, devDependencies, @genovalv/core, @types/node, typescript, vite (+16 more)

### Community 60 - "Auth0Gateway"
Cohesion: 0.06
Nodes (16): BackchannelLogoutUseCase, BootstrapUseCase, OAuthCallbackUseCase, PasswordLoginUseCase, ResolvePostLoginUseCase, AUTH0_PASSWORD_REALM_GRANT, SHARED_AUTH_AUDIT_ACTIONS, Auth0Gateway (+8 more)

### Community 61 - "index.ts"
Cohesion: 0.29
Nodes (6): 0. Branch, 1. Desacoplamento de h3, 2. Testes e Build, 3. Pre-PR Checklist, 4. Create PR, Tasks: 004-shared-remove-h3

### Community 62 - "base-auth.controller.ts"
Cohesion: 0.50
Nodes (3): Feature Specification: 004-shared-remove-h3, Overview, Requirements

### Community 63 - "Implementation Plan: Shared Pure Auth Contracts (`@genovalv/core`) & `@genovalv/server`"
Cohesion: 0.14
Nodes (12): Constitution Check, Implementation Plan: Shared Pure Auth Contracts (`@genovalv/core`) & `@genovalv/server`, Project Structure, Summary, Technical Context, Edge Cases, Feature Specification: Shared Pure Auth Contracts (`@genovalv/core`) & Shared BFF Auth Server (`@genovalv/server`), Requirements *(mandatory)* (+4 more)

### Community 66 - "Tasks: Shared Pure Auth Contracts & `@genovalv/server`"
Cohesion: 0.20
Nodes (9): 0. Branch, 1.1 Commit Group 1, 1. Governance & Pure Contracts (`@genovalv/core`), 2.1 Commit Group 2, 2. Shared Server Package (`@genovalv/server`), 3. Verification & Tarball Packaging, 4. Pre-PR Checklist, 5. Create PR (+1 more)

### Community 67 - "compilerOptions"
Cohesion: 0.25
Nodes (7): compilerOptions, lib, outDir, rootDir, types, extends, include

### Community 71 - "JoseSessionTokenGateway"
Cohesion: 0.23
Nodes (8): DEFAULT_BASE_PROFILES, DEFAULT_BASE_SEED_CONFIG, AdminProfileRole, BaseSeedConfig, BaseSeedProfile, ClientProfileRole, ProfileRole, ProfileScope

## Knowledge Gaps
- **462 isolated node(s):** `name`, `version`, `private`, `type`, `workspaces` (+457 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ResolvePostLoginUseCase` connect `Auth0Gateway` to `audit-log.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `CompanyBinding` connect `auth-contracts.ts` to `audit-log.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `registerGenovaElements()` (e.g. with `GenovaActionButtonElement` and `GenovaAlertBannerElement`) actually correct?**
  _`registerGenovaElements()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _462 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08779631255487269 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07826694619147449 - nodes in this community are weakly interconnected._
- **Should `Tasks: Shared Login Foundation & Base Components` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._