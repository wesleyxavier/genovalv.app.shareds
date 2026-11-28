# Feature Specification: Shared Auth0 App Setup Metadata & Login Guard (v0.5.0)

**Feature Branch**: `feature/011-shared-auth0-app-metadata`

**Created**: 2026-11-28

**Status**: Draft (Aguardando aprovação)

**Input**: Habilitar no `@genovalv/core` e `@genovalv/server` o provisionamento e validação de `app_setup_id`, `app_setup_secret`, `environment` (`app_metadata`) e `genova_admin` (`user_metadata`) no Auth0 para que apps consumidores como `genovalv.app.admin` possam restringir logins por aplicação, ambiente e papel administrativo sem romper compatibilidade com chamadores existentes.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contrato e Validador Puro em `@genovalv/core` (Priority: P1)

Como consumidor de `@genovalv/core`, quero os contratos `AppSetupContext`, extensão retrocompatível de `IAuth0Gateway` / `PostLoginUserMetadata` / `PostLoginEvent` e a função pura `validateAppSetupMetadata` + atualização de `onExecutePostLogin` para validar `app_setup_id`, `app_setup_secret`, `environment` e `genova_admin` sem acoplamento a framework ou Node builtins.

**Why this priority**: Centraliza a regra de validação no domínio compartilhado puro (TDD com 100% de cobertura) antes de qualquer adaptador Auth0 ou BFF.

**Independent Test**: Executar testes unitários + cobertura no `@genovalv/core` validando todos os ramos (match válido, mismatch de `app_setup_id`, `app_setup_secret`, `environment`, `genova_admin !== true` quando `requireGenovaAdmin: true`, claims com namespace e metadata bruto).

**Acceptance Scenarios**:

1. **Given** `AppSetupContext` com `appSetupId`, `appSetupSecret`, `environment`, `requireGenovaAdmin?: boolean` e `claimsNamespace?: string`, **When** `validateAppSetupMetadata` recebe metadata ou claims compatíveis, **Then** retorna `{ ok: true }`.
2. **Given** qualquer divergência em `app_setup_id`, `app_setup_secret` ou `environment`, ou `genova_admin !== true` quando `requireGenovaAdmin: true`, **When** `validateAppSetupMetadata` é executado, **Then** retorna `{ ok: false, reason }` sem aceitar coerção frouxa.
3. **Given** `onExecutePostLogin` com `event.user.app_metadata` (`app_setup_id`, `app_setup_secret`, `environment`) e `event.user.user_metadata` (`genova_admin`), **When** executada a Auth0 Action, **Then** os custom claims correspondentes são gravados sob `${namespace}` em `idToken` e `accessToken`.

---

### User Story 2 - Provisionamento e Verificação no `@genovalv/server` (Priority: P1)

Como BFF consumidor de `@genovalv/server` (ex.: `genovalv.app.admin`), quero enviar `appSetupId`, `appSetupSecret`, `environment` e `genovaAdmin` em `Auth0Gateway.createManagementUser` e configurar `expectedAppSetup?: AppSetupContext` em `PasswordLoginUseCase` e `OAuthCallbackUseCase` para barrar com `403` (ou redirect `?error=...`) acessos de outros apps/ambientes.

**Why this priority**: Permite que o `Admin` (e futuros apps `ERP` / `FactoryFloor`) proteja o login e grave os metadados completos no Auth0 usando a mesma camada BFF compartilhada.

**Independent Test**: Testes Vitest de `@genovalv/server` validando payload enviado ao `POST /api/v2/users` (`app_metadata` + `user_metadata.genova_admin`), fallback `GET /api/v2/users/:id?fields=app_metadata,user_metadata` quando omitidos do `id_token`, e rejeição/aceitação no `PasswordLoginUseCase` e `OAuthCallbackUseCase` com e sem `expectedAppSetup`.

**Acceptance Scenarios**:

1. **Given** `createManagementUser` recebendo `appSetupId`, `appSetupSecret`, `environment` e/ou `genovaAdmin`, **When** chama `POST /api/v2/users`, **Then** inclui `app_setup_id`, `app_setup_secret` e `environment` em `app_metadata` e `{ genova_admin }` em `user_metadata` (omitindo campos não informados para preservar retrocompatibilidade).
2. **Given** `PasswordLoginUseCase` ou `OAuthCallbackUseCase` instanciado com `expectedAppSetup`, **When** os claims do JWT já trazem os dados ou são consultados via `getUserMetadata`, **Then** aceita login válido e nega mismatch com `statusCode: 403` (`PasswordLoginUseCase`) ou `redirectTo: '/login?error=...'` (`OAuthCallbackUseCase`) com log de auditoria.
3. **Given** `PasswordLoginUseCase` ou `OAuthCallbackUseCase` instanciado **sem** `expectedAppSetup`, **When** executa login, **Then** mantém exatamente o comportamento anterior (100% retrocompatível).

---

### User Story 3 - Documentação, Bump SemVer `0.5.0` e Tarballs `.tgz` (Priority: P2)

Como mantenedor de `New/Shareds`, quero atualizar `README.md`, elevar todos os pacotes de `0.4.0` para `0.5.0`, validar build/coverage/E2E e empacotar `.tgz` prontos para atualização do `genovalv.app.admin`.

**Why this priority**: Disponibiliza o pacote versionado em SemVer para consumo imediato na nova spec do `Admin`.

**Independent Test**: `npm run build`, `npm run test:coverage` (100% no `core`) e `npm pack` geram `0.5.0` sem erros.

**Acceptance Scenarios**:

1. **Given** todas as alterações testadas, **When** bumped para `0.5.0` e rodado `npm pack`, **Then** os tarballs `genovalv-{core,tokens,elements,server}-0.5.0.tgz` são gerados em `dist/tarballs/`.

### Edge Cases

- Chamadores antigos sem `expectedAppSetup` ou sem os novos campos em `createManagementUser` não podem quebrar.
- Se `id_token` não trouxer claims namespaced e `auth0.getUserMetadata` não estiver implementado em um mock, tratar ausência de metadados explicitamente como falha de `expectedAppSetup`.
- Comparação de `appSetupSecret` e `appSetupId` deve exigir match exato de string não vazia (trim consistente, sem aceitar `undefined === undefined`).
- Todos os arquivos `.ts` criados/alterados em `packages/*` devem respeitar o limite `<= 100` linhas da Constituição v2.0.0.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `@genovalv/core` MUST exportar `AppSetupContext`, `validateAppSetupMetadata` e `CreateManagementUserPayload` (estendendo `IAuth0Gateway.createManagementUser` de forma opcional e adicionando `getUserMetadata?`).
- **FR-002**: `@genovalv/core` MUST atualizar `PostLoginUserMetadata`, `PostLoginEvent` (`user_metadata`) e `onExecutePostLogin` para propagar `app_setup_id`, `app_setup_secret`, `environment` e `genova_admin` sob `${namespace}`.
- **FR-003**: `@genovalv/server` `Auth0Gateway` MUST enviar `app_metadata` / `user_metadata` estendidos em `createManagementUser` e implementar `getUserMetadata(userId)` via Management API (`/api/v2/users/:id?fields=app_metadata,user_metadata`).
- **FR-004**: `@genovalv/server` `PasswordLoginUseCase` e `OAuthCallbackUseCase` MUST aceitar parâmetro opcional `expectedAppSetup?: AppSetupContext`, validando via helper compartilhado `verifyAppSetupLogin` e registrando falha em `AuditLogger` com status `403` / redirect de erro.
- **FR-005**: Manter 100% de cobertura unitária no `@genovalv/core` (`npm run test:coverage`) e suíte verde em `@genovalv/server` e `@genovalv/elements`.
- **FR-006**: Atualizar `README.md`, bumpar versão `0.4.0 → 0.5.0` nos `package.json` (`core`, `tokens`, `elements`, `server`, `playground`, raiz) + `package-lock.json` e empacotar `.tgz` em `dist/tarballs/`.

## Success Criteria *(mandatory)*

- **SC-001**: `npm run build`, `npm run test:coverage` (100% em `@genovalv/core`) e `npm run test:e2e` passam sem erros.
- **SC-002**: Todos os arquivos modificados/criados respeitam `<= 100` linhas/arquivo (inclusive dividindo `Auth0Gateway` se necessário para manter concisão).
- **SC-003**: Tarballs `genovalv-*-0.5.0.tgz` gerados e prontos para instalação no `.vendor/` do `genovalv.app.admin`.
