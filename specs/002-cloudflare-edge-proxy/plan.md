# Implementation Plan: Proxy de Borda Local (Simulação Cloudflare)

**Branch**: `002-cloudflare-edge-proxy` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-cloudflare-edge-proxy/spec.md`

## Summary

Adicionar ao `docker-compose.yml` de `New/Shareds/` um serviço `edge-proxy` (Nginx) que simula a borda Cloudflare: TLS local com certificado gerado em contêiner, redirecionamento HTTP→HTTPS, injeção de `CF-*`/`X-Forwarded-*` (sobrescrevendo valores forjados), cache de estáticos com `X-Cache-Status`, rate limit por IP (429) e WAF básico por regras `map` (403). Roteamento por host (`*.genova.localhost`) para playground, ERP e FactoryFloor; Admin fica fora. Configuração por templates `envsubst` parametrizados por `.env`. Comportamento validado por testes Playwright (`APIRequestContext`) escritos antes da config, contra um origin-echo de teste. A dockerização do FactoryFloor é change separada no repo dele (ordem: Shareds → FactoryFloor).

## Technical Context

**Language/Version**: Nginx (imagem `nginx:1.27-alpine`, parametrizada); testes em TypeScript 5.8 (strict)

**Primary Dependencies**: Docker Compose, Nginx (`ngx_http_limit_req`, `proxy_cache`, `map`), OpenSSL (via imagem alpine, apenas em contêiner), Playwright ^1.52

**Storage**: Certificados em `C:/Docker-Volumes/genova/new-edge/certs/` (persistente); cache de borda em `tmpfs` (efêmero); nenhum banco

**Testing**: Estratégia completa em [e2e-test-plan.md](e2e-test-plan.md): L0 smoke (`docker compose config`, `nginx -t`), L1 contrato via Playwright `request`, L2/L3 browser Chromium (desktop + mobile, HMR), L4 resiliência; projeto próprio `playwright.edge.config.ts`

**Target Platform**: Docker Desktop no Windows 11 (dev local); contêiner Linux alpine

**Project Type**: Infraestrutura de desenvolvimento (config Docker/Nginx + testes), dentro do workspace npm `New/Shareds`

**Performance Goals**: Subida do ambiente com borda em ≤ 5 min seguindo README (SC-001); HMR refletido em ≤ 5 s (SC-006)

**Constraints**: Rate limit padrão 100 r/s (burst 200); limites baixos só em stack de teste alternativa. Sem Nginx/OpenSSL/mkcert instalados no host; certificados e chaves não versionados; volumes só em `C:\Docker-Volumes\genova\...`; sem segredos Cloudflare; simulação declarada como não equivalente ao Cloudflare real

**Scale/Scope**: 1 serviço de borda + 1 init de certificado + 1 origin-echo (profile `test`); 3 hosts roteados (playground, ERP, FactoryFloor)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Resultado |
|-----------|-----------|-----------|
| I. Pacotes compartilhados | Infra de dev em `New/Shareds/` é prevista ("infraestrutura de desenvolvimento local"); nenhum pacote `core/tokens/elements` alterado; nenhuma dependência de framework | PASS |
| II. Design System | Sem UI nova; páginas de erro da borda são texto mínimo (sem nova família visual) | PASS (N/A) |
| III. Cross-framework/SSR | Sem código de runtime nos pacotes; borda transparente a SSR e WebSocket/HMR | PASS |
| IV. TDD | Testes de borda escritos antes da config (red → green); `strict: true` nos testes | PASS |
| V. Governança/segurança | Sem segredos; cert/keys fora do git; commit/push/PR só com autorização; mudanças no FactoryFloor em change separada | PASS |
| VI. Paridade Cloudflare (Nginx/Docker) | Nginx em contêiner, rede `genova-new-network`, TLS local, headers, cache, rate limit, WAF, volumes em `C:\Docker-Volumes`, testes | PASS |

**Re-check pós-design (Phase 1)**: PASS. Nenhuma violação; Complexity Tracking vazio.

## Project Structure

### Documentation (this feature)

```text
specs/002-cloudflare-edge-proxy/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── e2e-test-plan.md     # plano de testes E2E (camadas L0 a L4, rastreabilidade FR/SC)
├── contracts/
│   └── edge-contract.md
└── tasks.md             # /speckit-tasks (não criado aqui)
```

### Source Code (repository root: `New/Shareds/`)

```text
New/Shareds/
├── docker-compose.yml                 # + edge-certs-init, edge-proxy, playground, edge-origin-echo (profile test)
├── .env.example                       # + variáveis EDGE_*
├── playwright.edge.config.ts          # projeto de testes da borda (sem webServer Vite)
├── edge/
│   ├── nginx/
│   │   ├── nginx.conf                 # http{}: includes, cache zone, upgrade map
│   │   ├── entrypoint.sh              # valida cert e roda envsubst (saída em /etc/nginx/edge.d)
│   │   └── templates/
│   │       ├── 00-maps.conf.template      # rate limit zone + maps WAF
│   │       ├── 10-redirect.conf.template  # :80 → https
│   │       ├── 20-vhosts.conf.template    # playground / erp / factoryfloor / echo
│   │       └── snippets/
│   │           ├── server-common.conf.template  # WAF, rate limit, erros, locations
│   │           ├── cf-headers.conf.template     # injeção/sobrescrita CF-* e X-Forwarded-*
│   │           ├── proxy-common.conf.template   # upgrade/websocket, timeouts
│   │           └── static-cache.conf.template   # proxy_cache + X-Cache-Status
│   ├── certs-init/
│   │   └── generate-cert.sh           # openssl em contêiner, idempotente
│   ├── origin-echo/
│   │   └── server.mjs                 # origem de teste (Node): headers em JSON, contador, estático
│   └── tests/
│       ├── redirect.spec.ts
│       ├── headers.spec.ts
│       ├── cache.spec.ts
│       ├── ratelimit.spec.ts
│       └── waf.spec.ts
└── package.json                       # + script "test:edge"
```

**Structure Decision**: Diretório `edge/` isolado dentro do workspace Shareds (não é pacote npm publicável). Config Nginx em templates `envsubst` para parametrização por `.env` (FR-007). Testes em projeto Playwright próprio para não depender do webServer Vite do playground.

## Complexity Tracking

Sem violações a justificar.
