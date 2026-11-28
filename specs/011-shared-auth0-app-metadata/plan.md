# Implementation Plan: Shared Auth0 App Setup Metadata & Login Guard (v0.5.0)

**Branch**: `feature/011-shared-auth0-app-metadata` | **Date**: 2026-11-28 | **Spec**: [spec.md](spec.md)

**Input**: Specification em `specs/011-shared-auth0-app-metadata/spec.md`

## Summary

Adicionar suporte completo e retrocompatível no `@genovalv/core` e `@genovalv/server` para provisionamento e verificação por aplicação/ambiente no Auth0:
1. Em `@genovalv/core`: tipos `AppSetupContext`, `CreateManagementUserPayload`, extensão de `IAuth0Gateway` (campos opcionais no `createManagementUser` + `getUserMetadata?`), extensão de `PostLoginUserMetadata` / `PostLoginEvent` / `onExecutePostLogin` e função pura `validateAppSetupMetadata`.
2. Em `@genovalv/server`: helper `buildManagementUserPayload` / `Auth0Gateway.createManagementUser` (enviando `app_setup_id`, `app_setup_secret`, `environment` em `app_metadata` e `genova_admin` em `user_metadata`), `Auth0Gateway.getUserMetadata`, helper compartilhado `verifyAppSetupLogin` (lê custom claims ou faz fallback para `auth0.getUserMetadata`), e parâmetro opcional `expectedAppSetup?: AppSetupContext` em `PasswordLoginUseCase` e `OAuthCallbackUseCase`.
3. Atualizar `README.md`, bumpar `0.4.0 → 0.5.0`, validar cobertura 100% no `core` + testes no `server`/`elements`/E2E, e gerar `.tgz` em `dist/tarballs/`.

## Technical Context

**Language/Version**: TypeScript `^5.8.2` (`strict: true`, `ES2022`)
**Primary Dependencies**: `jose`, `dotenv`, `decimal.js`, `vitest`, `vite`
**Storage**: N/A (`Auth0` metadata remoto via API HTTP)
**Testing**: Vitest 3 (`node` + `happy-dom`, gate 100% em `@genovalv/core`), Playwright (`test:e2e`)
**Target Platform**: Node BFF + Browser/SSR agnóstico de framework
**Project Type**: Monorepo npm workspaces (`packages/{core,tokens,elements,server}`, `playground/`)
**Constraints**: `<= 100` linhas/arquivo, 100% cobertura em `@genovalv/core`, TDD obrigatório, zero secrets hardcoded, zero acoplamento a framework HTTP (`h3`, Angular, Next, Nuxt), sem commit/push/PR sem autorização explícita.

## Constitution Check

- **Princípio I (Arquitetura Híbrida):** Tipos e validação pura em `@genovalv/core`; adaptador HTTP Auth0 e casos de uso em `@genovalv/server`; sem acoplamento a um único app. **PASS**
- **Princípio III (SSR-Safety):** Zero uso de DOM/Node builtins em `@genovalv/core`. **PASS**
- **Princípio IV (TDD, Clean Code, <=100 Linhas):** Testes criados/atualizados antes da implementação; helpers extraídos (`buildManagementUserPayload` / `verifyAppSetupLogin`) para manter `auth0.gateway.ts` e casos de uso enxutos (`<= 100` linhas). **PASS**
- **Princípio V (Governança & Segurança):** Sem secrets hardcoded; usa apenas credenciais injetadas por `AppSetupContext` do app consumidor; Spec Kit + worktree dedicado a partir da `develop`. **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/011-shared-auth0-app-metadata/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (`New/Shareds/`)

```text
packages/
├── core/
│   ├── package.json                                              # 0.4.0 → 0.5.0
│   ├── src/
│   │   ├── index.ts                                              # exporta AppSetupContext, validateAppSetupMetadata, CreateManagementUserPayload
│   │   ├── application/use-cases/post-login-action.usecase.ts    # propaga app_setup_id, app_setup_secret, environment, genova_admin
│   │   └── domain/server-auth/
│   │       ├── app-setup-context.ts                              # interface AppSetupContext + CreateManagementUserPayload (ou arquivo dedicado)
│   │       ├── validate-app-setup-metadata.ts                    # validador puro de metadata/claims
│   │       ├── iauth0-gateway.ts                                 # estende createManagementUser + getUserMetadata?
│   │       ├── ipost-login-event.ts                              # inclui user_metadata opcional
│   │       └── post-login-user-metadata.ts                       # inclui app_setup_id, app_setup_secret, environment
│   └── tests/
│       ├── app-setup-validation.test.ts                          # TDD unitário (100% branch coverage)
│       └── post-login-action.test.ts                             # cobertura dos claims de setup/genova_admin
└── server/
    ├── package.json                                              # 0.4.0 → 0.5.0, @genovalv/core: ^0.5.0
    ├── src/
    │   ├── application/use-cases/auth/
    │   │   ├── verify-app-setup-login.ts                         # helper compartilhado (claims -> fallback getUserMetadata -> validateAppSetupMetadata)
    │   │   ├── password-login.usecase.ts                         # parâmetro opcional expectedAppSetup?: AppSetupContext
    │   │   └── oauth-callback.usecase.ts                         # parâmetro opcional expectedAppSetup?: AppSetupContext
    │   └── infrastructure/auth0/
    │       ├── build-management-user-body.ts                     # helper puro para manter auth0.gateway.ts <= 100 linhas
    │       └── auth0.gateway.ts                                  # envia metadata estendido + getUserMetadata(userId)
    └── tests/
        ├── auth0-and-security.test.ts                            # TDD createManagementUser + getUserMetadata
        └── auth-usecases.test.ts                                 # TDD PasswordLoginUseCase + OAuthCallbackUseCase com expectedAppSetup
```
