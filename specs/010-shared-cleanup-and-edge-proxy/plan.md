# Implementation Plan: Shared Cleanup, GENOVA_BRAND_NAME & Cloudflare Edge Proxy (v0.4.0)

**Branch**: `feature/010-shared-cleanup-and-edge-proxy` | **Date**: 2026-11-27 | **Spec**: [spec.md](spec.md)

**Input**: Specification em `specs/010-shared-cleanup-and-edge-proxy/spec.md`

## Summary

Consolidar na `develop` do `New/Shareds` (via worktree dedicado `feature/010-shared-cleanup-and-edge-proxy`):
1. Finalizar a remoção de `BootstrapUseCase` / `bootstrap-user*` no `core`, `server`, testes e docs, mantendo `GENOVA_BRAND_NAME = 'Genova Cloud'`.
2. Trazer toda a stack e testes do proxy de borda local Nginx/Docker de `worktrees/feature-cloudflare-edge-proxy` (incluindo arquivos untracked e uncommitted como `edge/`, `playwright.edge.config.ts`, `playground/vite.config.ts`, `.gitattributes`), removendo o serviço `postgres` do `docker-compose.yml`.
3. Atualizar `README.md` e `AGENTS.md`, elevar versão SemVer `0.3.1 → 0.4.0` em todos os pacotes, validar build + unit + coverage + E2E/edge, gerar tarballs `.tgz` e limpar os 2 worktrees legados após autorização.

## Technical Context

**Language/Version**: TypeScript `^5.8.2` (`strict: true`, `ES2022`), Lit `^3.2.1`, Node `22+`, Nginx `1.27-alpine`, OpenSSL (container `alpine/openssl`)
**Primary Dependencies**: `decimal.js`, `dotenv`, `jose`, `playwright`, `vitest`, `vite`
**Storage**: N/A no repositório (serviço `postgres` removido do `docker-compose.yml`; cache Nginx em `tmpfs`, certs locais em `C:/Docker-Volumes/genova/new-edge/certs`)
**Testing**: Vitest 3 (`node` + `happy-dom`, 100% coverage gate em `@genovalv/core`), Playwright (`test:e2e`, `test:edge`, `test:edge:hmr`)
**Target Platform**: Cross-framework SSR/Browser (`AnalogJS`, `Next.js`, `Nuxt.js`) + Docker Desktop Linux containers on Windows host
**Project Type**: Monorepo npm workspaces (`packages/{core,tokens,elements,server}`, `playground/`, `edge/`)
**Constraints**: Sem dependências de framework UI em `packages/*`, código-fonte `<= 100` linhas/arquivo, cache Nginx em `tmpfs` (nunca bind mount Windows), CRLF preservado fora dos scripts Linux (`.gitattributes` com LF para `*.sh/*.conf/*.template/*.mjs`), sem commit/push/worktree remove sem autorização explícita.

## Constitution Check

- **Princípio I (Arquitetura Híbrida):** `GENOVA_BRAND_NAME` fica isolado em `@genovalv/core`; `@genovalv/server` remove acoplamento residual de bootstrap/seed. **PASS**
- **Princípio II & III (Design System & SSR-Safety):** Nenhuma quebra SSR; `playground/vite.config.ts` adiciona `allowedHosts: ['.localhost']` apenas para dev behind proxy. **PASS**
- **Princípio IV (TDD, Clean Code, <=100 linhas):** Testes de `packages/server/tests/auth-usecases.test.ts` e cobertura 100% do `core` restaurados como pré-condição obrigatória. **PASS**
- **Princípio V (Governança & Idempotência):** Spec Kit + worktree `feature/010-shared-cleanup-and-edge-proxy` a partir de `develop`; autorizações respeitadas. **PASS**
- **Princípio VI (Paridade Cloudflare em Docker):** `edge/` com Nginx + `tmpfs` + `C:/Docker-Volumes/genova/new-edge` implementado conforme contrato. **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/010-shared-cleanup-and-edge-proxy/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code Affected (`New/Shareds/`)

```text
New/Shareds/
├── .env.example                                  # Adiciona variáveis EDGE_* (HTTPS 3010, upstreams 3101/3102/3103/4173)
├── .gitattributes                                # Força LF em *.sh, *.conf, *.template, *.mjs
├── .gitignore                                    # Ignora *.pem, *.key, *.crt, edge/certs/, edge/cache/
├── docker-compose.yml                            # Apenas edge-certs-init, edge-proxy, playground, edge-origin-echo (sem postgres)
├── package.json & package-lock.json              # Scripts test:edge / test:edge:hmr, @types/node, bump 0.4.0
├── playwright.edge.config.ts                     # Config Playwright da borda local
├── AGENTS.md & README.md                         # Documentação consolidada (sem BootstrapUseCase/postgres, com edge 3010)
├── edge/                                         # certs-init/, nginx/{entrypoint.sh,nginx.conf,templates/}, origin-echo/, tests/, test.env
├── playground/vite.config.ts                     # allowedHosts: ['.localhost'] + polling HMR
└── packages/
    ├── core/src/{index.ts,domain/constants/brand-name.ts,domain/constants/default-login-context.ts}
    ├── core/src/domain/server-auth/              # Remoção de bootstrap-user-input.ts e bootstrap-user-result.ts
    ├── server/tests/auth-usecases.test.ts        # Remoção da asserção/import de BootstrapUseCase
    └── {core,tokens,elements,server}/package.json # Versão 0.4.0 + peer/devDependencies alinhadas + npm pack
```

## Migration Strategy (`worktrees/feature-cloudflare-edge-proxy` → `feature/010-shared-cleanup-and-edge-proxy`)

1. Criar worktree `New/Shareds/worktrees/010-shared-cleanup-and-edge-proxy` na branch `feature/010-shared-cleanup-and-edge-proxy` a partir da `develop` (e transferir para ela as mudanças de working tree atualmente em `New/Shareds`: `brand-name.ts`, remoção de `bootstrap-user.usecase.ts`, etc.).
2. Copiar da `worktrees/feature-cloudflare-edge-proxy` os arquivos novos (`edge/`, `playground/vite.config.ts`, `playwright.edge.config.ts`, `.gitattributes`) e aplicar os deltas de `.env.example`, `.gitignore` e serviços `edge-*` no `docker-compose.yml` (sem `postgres`).
3. Preservar as definições atuais de `develop` em `package.json` (`@genovalv/server` em `build`, `test:unit`, `test:coverage`) acrescentando `test:edge`, `test:edge:hmr` e `@types/node`.
4. Atualizar `README.md`, `AGENTS.md` e `specs/002-cloudflare-edge-proxy/` (alinhando porta `3010` e host `admin.genova.localhost` caso referenciados).
5. Atualizar SemVer para `0.4.0` em todos os `package.json` + `package-lock.json`, rodar validações (`build`, `test:unit`, `test:coverage`, `test:edge` se Docker disponível) e gerar tarballs `.tgz`.
6. Após PR/merge na `develop` (mediante autorização explícita), remover os 2 worktrees legados (`008-auth0-setup-metadata-and-no-seed` e `feature-cloudflare-edge-proxy`) e o worktree da `010` após encerramento.
