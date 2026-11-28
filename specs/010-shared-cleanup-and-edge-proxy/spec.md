# Feature Specification: Shared Cleanup, GENOVA_BRAND_NAME & Cloudflare Edge Proxy (v0.4.0)

**Feature Branch**: `feature/010-shared-cleanup-and-edge-proxy`

**Created**: 2026-11-27

**Status**: Draft (Aguardando aprovação)

**Input**: Consolidação das pendências de `New/Shareds` (`GENOVA_BRAND_NAME`, conclusão da remoção de `BootstrapUseCase`), incorporação integral do proxy de borda local (`feature-cloudflare-edge-proxy` e suas alterações não commitadas), remoção do serviço `postgres` do `docker-compose.yml`, bump SemVer `0.3.1 → 0.4.0`, empacotamento `.tgz` e remoção dos worktrees obsoletos (`008-auth0-setup-metadata-and-no-seed` e `feature-cloudflare-edge-proxy`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Concluir Remoção de `BootstrapUseCase` & Consolidar `GENOVA_BRAND_NAME` (Priority: P1)

Como mantenedor de `@genovalv/core` e `@genovalv/server`, quero a remoção completa dos resquícios de `BootstrapUseCase` / `bootstrap-user*` e a exportação consistente de `GENOVA_BRAND_NAME = 'Genova Cloud'` para que build, cobertura de 100% no `core` e suíte unitária completa voltem a passar sem erros.

**Why this priority**: Hoje `npm run test:unit` falha em `packages/server/tests/auth-usecases.test.ts` por referência quebrada a `BootstrapUseCase`.

**Independent Test**: Executar `npm run build` e `npm run test:coverage` em `New/Shareds` com zero erros e zero referências a `BootstrapUseCase` / `bootstrap-user*` nos pacotes.

**Acceptance Scenarios**:

1. **Given** `bootstrap-user.usecase.ts` removido de `@genovalv/server`, **When** removemos `BootstrapUseCase` de `packages/server/tests/auth-usecases.test.ts`, os contratos `bootstrap-user-input.ts` / `bootstrap-user-result.ts` de `packages/core/` (e `packages/core/src/index.ts`) e referências em `README.md`, **Then** `npm run test:unit` e `npm run test:coverage` passam integralmente (incluindo 100% no `@genovalv/core`).
2. **Given** `GENOVA_BRAND_NAME = 'Genova Cloud'` em `packages/core/src/domain/constants/brand-name.ts`, **When** exportado no barrel `packages/core/src/index.ts` e utilizado em `DEFAULT_LOGIN_CONTEXT`, **Then** apps consumidores (`Admin`, `ERP`, `FactoryFloor`) importam a constante diretamente de `@genovalv/core`.

---

### User Story 2 - Incorporar Proxy de Borda Local (Cloudflare Edge Proxy) sem PostgreSQL no Compose (Priority: P1)

Como desenvolvedor do ecossistema Genova, quero incorporar integralmente o proxy reverso local em Nginx/Docker (`edge/`, `playground/vite.config.ts`, `playwright.edge.config.ts`, scripts `test:edge` / `test:edge:hmr`, variáveis `EDGE_*` em `.env.example`, `.gitattributes`, `.gitignore`) a partir da `worktrees/feature-cloudflare-edge-proxy`, mantendo o `docker-compose.yml` enxuto apenas com os serviços `edge-*` e `playground` (sem `postgres`).

**Why this priority**: O trabalho completo do proxy de borda (`3010`, hosts `admin`/`erp`/`factoryfloor`/`playground`/`echo.genova.localhost`) estava preso e desatualizado em uma branch/worktree antiga (`da0ecd1`), sem os pacotes `0.3.x`.

**Independent Test**: Subir `docker compose up -d edge-proxy` e rodar `npm run test:edge` (quando Docker disponível), validando redirecionamento HTTP→HTTPS (`3010`), headers `CF-*` / `X-Forwarded-*`, cache `tmpfs`, rate limit (`429`), WAF (`403`) e vhosts `playground`, `admin`, `erp`, `factoryfloor` e `echo`.

**Acceptance Scenarios**:

1. **Given** arquivos de `edge/`, `playground/vite.config.ts`, `playwright.edge.config.ts`, `.gitattributes`, `.gitignore` e `.env.example` trazidos do worktree `feature-cloudflare-edge-proxy`, **When** mesclados sobre a base atual da `develop` preservando `@genovalv/server` nos scripts de `package.json`, **Then** tanto os testes unitários/build dos 4 pacotes quanto os scripts `test:edge` / `test:edge:hmr` coexistem sem regressões.
2. **Given** decisão de arquitetura adotada, **When** gerado o `docker-compose.yml` consolidado, **Then** o serviço `postgres` não faz parte do `docker-compose.yml` de `New/Shareds`, permanecendo apenas `edge-certs-init`, `edge-proxy`, `playground` e `edge-origin-echo`.

---

### User Story 3 - Release SemVer `0.4.0`, Tarballs `.tgz` e Limpeza de Worktrees Obsoletos (Priority: P2)

Como mantenedor da plataforma, quero atualizar os 4 pacotes (`core`, `tokens`, `elements`, `server`) e a raiz `@genovalv/shareds` para a versão `0.4.0`, atualizar documentação (`README.md`, `AGENTS.md`, `specs/002-cloudflare-edge-proxy`), gerar os pacotes `.tgz` via `npm pack` para consumo nos apps e remover os dois worktrees antigos (`008-auth0-setup-metadata-and-no-seed` e `feature-cloudflare-edge-proxy`).

**Why this priority**: Consolida o estado único em `develop` após PR/merge e elimina branches/worktrees defasados.

**Independent Test**: Verificar `"version": "0.4.0"` em todos os `package.json`, build + tarballs gerados sem erro e apenas o worktree ativo (e posteriormente `develop` limpa) listado em `git worktree list`.

**Acceptance Scenarios**:

1. **Given** todas as mudanças de código, edge e docs validadas, **When** atualizado o versionamento para `0.4.0` e executado `npm pack`, **Then** os tarballs `genovalv-{core,tokens,elements,server}-0.4.0.tgz` são produzidos a partir do build validado.
2. **Given** confirmação e autorização explícita do usuário para limpeza pós-migração, **When** removidos `worktrees/008-auth0-setup-metadata-and-no-seed` e `worktrees/feature-cloudflare-edge-proxy`, **Then** todo o código útil de borda já estará versionado na nova spec/branch sem perda de arquivos.

### Edge Cases

- Não perder alterações uncommitted de `worktrees/feature-cloudflare-edge-proxy` ao migrar (especialmente porta `3010`, vhost `admin.${EDGE_BASE_DOMAIN}`, `edge/`, `.gitattributes` LF e `playwright.edge.config.ts`).
- Não sobrescrever `@genovalv/server` nos scripts `build`, `test:unit`, `test:coverage` de `New/Shareds/package.json` ao trazer `test:edge` e `test:edge:hmr`.
- Manter `.env.example` e `README.md` consistentes com `EDGE_HTTPS_PORT=3010` e com todos os vhosts reais (`playground`, `admin`, `erp`, `factoryfloor`, `echo`).
- Preservar cada arquivo TypeScript `<= 100` linhas conforme Constituição v2.0.0.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `@genovalv/core` MUST exportar `GENOVA_BRAND_NAME = 'Genova Cloud'` em `packages/core/src/domain/constants/brand-name.ts` e remover `bootstrap-user-input.ts` e `bootstrap-user-result.ts` de `packages/core/src/domain/server-auth/` e `packages/core/src/index.ts`.
- **FR-002**: `@genovalv/server` MUST permanecer sem `BootstrapUseCase` e ter `packages/server/tests/auth-usecases.test.ts` atualizado para refletir os casos de uso ativos (`ResolvePostLoginUseCase`, `PasswordLoginUseCase`, `OAuthCallbackUseCase`, `BackchannelLogoutUseCase`).
- **FR-003**: `New/Shareds` MUST incorporar integralmente `edge/`, `playground/vite.config.ts`, `playwright.edge.config.ts`, `.gitattributes`, as regras de ignore de certificados/cache em `.gitignore` e as variáveis `EDGE_*` em `.env.example` oriundas de `worktrees/feature-cloudflare-edge-proxy`.
- **FR-004**: `New/Shareds/docker-compose.yml` MUST conter os serviços `edge-certs-init`, `edge-proxy`, `playground` e `edge-origin-echo` e NÃO conter serviço `postgres`.
- **FR-005**: `New/Shareds/package.json` MUST preservar os scripts de workspace de `core`, `tokens`, `elements` e `server` em `build`, `test:unit`, `test:coverage` e adicionar `test:edge`, `test:edge:hmr` e `@types/node`.
- **FR-006**: Os pacotes `@genovalv/shareds`, `@genovalv/core`, `@genovalv/tokens`, `@genovalv/elements` e `@genovalv/server` MUST ser versionados em `0.4.0` (bump `0.3.1 → 0.4.0`), compilados (`npm run build`) e empacotados com `npm pack`.
- **FR-007**: `New/Shareds/README.md` e `New/Shareds/AGENTS.md` MUST ser atualizados removendo referências a `BootstrapUseCase` e `postgres` local e documentando `GENOVA_BRAND_NAME`, porta `3010` e o proxy de borda (`admin`, `erp`, `factoryfloor`, `playground`).
- **FR-008**: Os dois worktrees legados (`worktrees/008-auth0-setup-metadata-and-no-seed` e `worktrees/feature-cloudflare-edge-proxy`) MUST ser removidos somente após migração validada e autorização explícita do usuário.

## Success Criteria *(mandatory)*

- **SC-001**: `npm run build`, `npm run test:unit` e `npm run test:coverage` passam com 0 falhas e 100% de cobertura em `@genovalv/core`.
- **SC-002**: `npm run test:e2e` e (em ambiente com Docker) `npm run test:edge` validam o playground e a borda Nginx HTTPS na porta `3010`.
- **SC-003**: Pacotes `0.4.0` compilados e `.tgz` prontos; `git worktree list` livre dos worktrees obsoletos após conclusão/autorização.
