---

description: "Task list: Proxy de Borda Local (Simulação Cloudflare)"
---

# Tasks: Proxy de Borda Local (Simulação Cloudflare)

**Input**: Design documents from `/specs/002-cloudflare-edge-proxy/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/edge-contract.md](contracts/edge-contract.md), [quickstart.md](quickstart.md), [e2e-test-plan.md](e2e-test-plan.md)

**Tests**: OBRIGATÓRIOS (TDD, Constituição Princípio IV e FR-010). Cada fase de história escreve os testes primeiro e confirma que FALHAM antes da configuração.

**Organization**: Tarefas agrupadas por user story. Caminhos relativos a `New/Shareds/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizável (arquivos distintos, sem dependência pendente)
- **[Story]**: US1 a US4 (mapeia para spec.md)
- Commit, push e PR exigem autorização explícita do usuário a cada vez (regra global `authorization.md`)

---

## 0. Branch

**Purpose**: Isolar o trabalho em worktree (skill `/openspec-worktree`)

- [ ] T001 Validar branch base `develop` limpa no repo `New/Shareds` (`git status`, `git branch --show-current`) e confirmar com o usuário que a constitution v1.1.0 e a pasta `specs/002-cloudflare-edge-proxy/` serão commitadas na `develop` antes ou levadas para a feature branch
- [ ] T002 Criar worktree `worktrees/feature-cloudflare-edge-proxy` a partir da `develop` com branch `feature/cloudflare-edge-proxy` (`/openspec-worktree`); executar todas as tarefas abaixo dentro dela

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estrutura de diretórios, variáveis e ignores

- [ ] T003 Criar estrutura `edge/nginx/{templates,snippets}`, `edge/certs-init/`, `edge/origin-echo/`, `edge/tests/` conforme plan.md
- [ ] T004 [P] Acrescentar variáveis `EDGE_*` com defaults de [contracts/edge-contract.md](contracts/edge-contract.md) em `.env.example` (`EDGE_BASE_DOMAIN`, `EDGE_HTTP_PORT`, `EDGE_HTTPS_PORT`, `EDGE_UPSTREAM_PLAYGROUND|ERP|FACTORYFLOOR`, `EDGE_RATE_LIMIT_RPS`, `EDGE_RATE_LIMIT_BURST`, `EDGE_CF_COUNTRY`, `EDGE_CF_COLO`, `EDGE_CERT_DAYS`, `EDGE_DATA_DIR`)
- [ ] T005 [P] Criar `edge/test.env` com overrides de teste (`EDGE_RATE_LIMIT_RPS=5`, `EDGE_RATE_LIMIT_BURST=10`) — nome fora do padrão `.env.*` ignorado pelo git
- [ ] T006 [P] Atualizar `.gitignore` com `*.pem`, `*.key`, `*.crt`, `edge/certs/`, `edge/cache/` (FR-008, defesa em profundidade) e `.graphifyignore` se necessário
- [ ] T007 [P] Criar `playwright.edge.config.ts` com projetos `edge-api`, `edge-chromium-desktop` (1280x800), `edge-chromium-mobile` (390x844), `ignoreHTTPSErrors: true`, `testDir: ./edge/tests`, sem `webServer`, `globalSetup`/`globalTeardown`
- [ ] T008 Adicionar scripts `test:edge` e `test:edge:hmr` em `package.json`

### 1.1 Commit Group — Setup

- [ ] T009 `git commit` do grupo Setup e `git push` (**pedir autorização explícita ao usuário**)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Serviços base e testes de infra (L0) que bloqueiam todas as histórias

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase

### Tests (escrever primeiro, devem FALHAR)

- [ ] T010 [P] Teste L0 E2E-000/001 em `edge/tests/infra.spec.ts`: `docker compose config` válido sem variável indefinida e `nginx -t` com `syntax is ok`
- [ ] T011 [P] Teste L0 E2E-002/003/004/005 em `edge/tests/certs.spec.ts`: cert/chave em `C:/Docker-Volumes/genova/new-edge/certs`, idempotência, nenhum `.pem/.key/.crt` em `git ls-files`, falha clara sem cert
- [ ] T012 Implementar `globalSetup`/`globalTeardown` em `edge/tests/global-setup.ts` e `edge/tests/global-teardown.ts` (sobe/desce apenas contêineres do projeto, sem `down -v`; limpa cache antes das suítes)

### Implementation

- [ ] T013 [P] Criar `edge/certs-init/generate-cert.sh`: openssl em contêiner alpine, SAN `*.${EDGE_BASE_DOMAIN}` e `${EDGE_BASE_DOMAIN}`, validade `EDGE_CERT_DAYS` (padrão 825), idempotente, `data-model.md` LocalCertificate (cert/key PEM; regenera se ausente/expirado)
- [ ] T014 [P] Criar `edge/nginx/nginx.conf` base: `http{}` com `include` de `/etc/nginx/conf.d/*.conf`, `proxy_cache_path` zona `edge_cache`, `limit_req_zone` `edge_rl`, `limit_req_status 429`, `map $http_upgrade $connection_upgrade`
- [ ] T015 [P] Criar `edge/nginx/snippets/proxy-common.conf` (HTTP/1.1, Upgrade/Connection, timeouts, `proxy_read_timeout 3600s` para dev) e `edge/nginx/snippets/cf-headers.conf` (`CF-Connecting-IP`, `CF-Ray`, `CF-IPCountry`, `CF-Visitor`, `X-Forwarded-For/Proto/Host` via `proxy_set_header`, FR-003, research D4)
- [ ] T016 Adicionar ao `docker-compose.yml` os serviços `edge-certs-init` (one-shot, volume `${EDGE_DATA_DIR}/certs`) e `edge-proxy` (`nginx:1.27-alpine`, portas `${EDGE_HTTP_PORT:-8080}:80` e `${EDGE_HTTPS_PORT:-8443}:443`, `extra_hosts: host.docker.internal:host-gateway`, volumes `edge/nginx` somente leitura e `${EDGE_DATA_DIR}/cache`, `depends_on: edge-certs-init: service_completed_successfully`, healthcheck, rede `genova-new-network`)
- [ ] T017 [P] Criar `edge/origin-echo/nginx.conf` (origem de teste que devolve em JSON os headers recebidos e expõe contador de requisições) e serviço `edge-origin-echo` com `profiles: ["test"]` no `docker-compose.yml`
- [ ] T018 Rodar T010 e T011 e confirmar verdes (L0)

### 2.1 Commit Group — Foundational

- [ ] T019 `git commit` e `git push` (**pedir autorização**)

**Checkpoint**: Borda sobe saudável com TLS; histórias podem começar

---

## Phase 3: User Story 1 - Acesso HTTPS local com headers de borda (Priority: P1) 🎯 MVP

**Goal**: HTTP→HTTPS, headers `CF-*`/`X-Forwarded-*` com sobrescrita de forjados, roteamento por host

**Independent Test**: E2E-101 a E2E-105, E2E-141 e E2E-201/202 verdes

### Tests for User Story 1 (escrever primeiro, devem FALHAR) ⚠️

- [ ] T020 [P] [US1] Teste L1 E2E-101 em `edge/tests/redirect.spec.ts`: `GET http://echo.genova.localhost:8080/x?a=1` → 301 com `Location: https://echo.genova.localhost:8443/x?a=1` (`maxRedirects: 0`)
- [ ] T021 [P] [US1] Teste L1 E2E-102 a E2E-105 em `edge/tests/headers.spec.ts`: origem recebe os 7 headers preenchidos (SC-002), `CF-Connecting-IP`/`CF-IPCountry` forjados substituídos, `X-Forwarded-For: 9.9.9.9` vira cadeia `9.9.9.9, <ip>`, `CF-Ray` distinto entre requisições
- [ ] T022 [P] [US1] Teste L1 E2E-141/142 em `edge/tests/routing.spec.ts`: host desconhecido e `admin.genova.localhost` não roteados (404/421), sem vazar upstream (FR-012, FR-014)
- [ ] T023 [P] [US1] Teste L2 E2E-201/202/206/207 em `edge/tests/browser-playground.spec.ts` (Chromium desktop e mobile): playground carrega por HTTPS pela borda sem erros de console/rede; versão `http://` termina em `https://`; suíte `playground/e2e` existente reexecutável com `baseURL` da borda

### Implementation for User Story 1

- [ ] T024 [US1] Criar `edge/nginx/templates/10-redirect.conf.template`: `server :80` com `return 301 https://$host:${EDGE_HTTPS_PORT}$request_uri` (research D9)
- [ ] T025 [US1] Criar `edge/nginx/templates/20-vhosts.conf.template`: `server :443 ssl` com `ssl_certificate` do volume, vhosts `playground|erp|factoryfloor|echo.${EDGE_BASE_DOMAIN}` usando upstreams `EDGE_UPSTREAM_*`, `include` dos snippets, `server` default devolvendo 404/421 sem detalhes
- [ ] T026 [US1] Adicionar serviço do playground ao `docker-compose.yml` (build do `Dockerfile` existente, porta 4173) ou documentar execução no host, conforme research D2; garantir `server.allowedHosts` do Vite para `*.genova.localhost` em `playground/` se necessário
- [ ] T027 [US1] Rodar T020 a T023 e confirmar verdes (E2E-101 a 105, 141/142, 201, 202, 206, 207)

### 3.1 Commit Group — US1

- [ ] T028 `git commit` e `git push` (**pedir autorização**)

**Checkpoint**: MVP funcional e testável de forma independente

---

## Phase 4: User Story 2 - Cache de borda para ativos estáticos (Priority: P2)

**Goal**: Cache de estáticos com `X-Cache-Status`; dinâmico nunca cacheado

**Independent Test**: E2E-111 a E2E-113 e E2E-203 verdes

### Tests for User Story 2 (escrever primeiro, devem FALHAR) ⚠️

- [ ] T029 [P] [US2] Teste L1 E2E-111/112/113 em `edge/tests/cache.spec.ts` (`serial`): estático inédito `MISS`, segundo `HIT` sem incrementar contador da origem, rota dinâmica 2x sem `HIT`
- [ ] T030 [P] [US2] Teste L2 E2E-203 em `edge/tests/browser-playground.spec.ts`: recarregar o playground e verificar `HIT` nos assets via `response.headers()`

### Implementation for User Story 2

- [ ] T031 [US2] Criar `edge/nginx/snippets/cache-static.conf`: `location` de estáticos (`~* \.(js|mjs|css|png|jpe?g|svg|woff2?|ico)$`, `/_nuxt/`, `/_next/static/`) com `proxy_cache edge_cache`, `add_header X-Cache-Status $upstream_cache_status always` e `CF-Cache-Status`; demais rotas `proxy_cache off` (research D5)
- [ ] T032 [US2] Incluir `cache-static.conf` nos vhosts em `edge/nginx/templates/20-vhosts.conf.template`
- [ ] T033 [US2] Rodar T029/T030 e confirmar verdes

### 4.1 Commit Group — US2

- [ ] T034 `git commit` e `git push` (**pedir autorização**)

**Checkpoint**: US1 e US2 funcionam de forma independente

---

## Phase 5: User Story 3 - Rate limiting e WAF básico (Priority: P3)

**Goal**: 429 por IP acima do limite; 403 para padrões maliciosos; tráfego legítimo nunca bloqueado

**Independent Test**: E2E-121/122 e E2E-131 a E2E-134 verdes

### Tests for User Story 3 (escrever primeiro, devem FALHAR) ⚠️

- [ ] T035 [P] [US3] Teste L1 E2E-121/122 em `edge/tests/ratelimit.spec.ts` (`serial`, worker isolado, usa `edge/test.env`): rajada acima de limite+burst recebe 429 e volta a 200 após a janela; tráfego abaixo do limite sem 429 (use `expect.poll`, sem `waitForTimeout` fixo)
- [ ] T036 [P] [US3] Teste L1 E2E-131/132/133 em `edge/tests/waf.spec.ts`: `/.env`, `/.git/config`, `/../etc/passwd`, `/wp-admin`, `?q=<script>`, UA `sqlmap`/`nikto`, métodos `TRACE`/`CONNECT` → 403 com `X-Edge-Rule`
- [ ] T037 [P] [US3] Teste L1 E2E-134 em `edge/tests/waf-corpus.spec.ts`: 20 payloads maliciosos 100% bloqueados e 20 rotas legítimas 0% bloqueadas (SC-004)

### Implementation for User Story 3

- [ ] T038 [P] [US3] Criar `edge/nginx/templates/00-maps.conf.template`: `map` de método, URI e user-agent produzindo `$waf_rule` (research D7) e parâmetros `EDGE_RATE_LIMIT_RPS/BURST` na zona `edge_rl`
- [ ] T039 [US3] Criar `edge/nginx/snippets/waf.conf`: `if ($waf_rule) { add_header X-Edge-Rule $waf_rule always; return 403; }` e `limit_req zone=edge_rl burst=${EDGE_RATE_LIMIT_BURST} nodelay`; incluir nos vhosts em `20-vhosts.conf.template`
- [ ] T040 [US3] Rodar T035 a T037 e confirmar verdes

### 5.1 Commit Group — US3

- [ ] T041 `git commit` e `git push` (**pedir autorização**)

**Checkpoint**: Borda completa para o conjunto de origens atuais

---

## Phase 6: User Story 4 - Apps ERP e FactoryFloor atrás da borda (Priority: P2)

**Goal**: ERP e FactoryFloor por hosts HTTPS distintos; Admin fora; HMR do FactoryFloor via borda

**Independent Test**: E2E-204/205 e E2E-301 a E2E-304 (L3 bloqueado até change do FactoryFloor)

### Tests for User Story 4 (escrever primeiro, devem FALHAR) ⚠️

- [ ] T042 [P] [US4] Teste L2 E2E-204/205 em `edge/tests/browser-apps.spec.ts`: ERP renderiza em `https://erp.genova.localhost:8443/`; Admin pela URL própria sem headers de borda; `skip` com motivo explícito se origem indisponível (nunca falso verde)
- [ ] T043 [P] [US4] Teste L3 E2E-301 a E2E-304 em `edge/tests/hmr.spec.ts`: handshake WebSocket 101, edição de `app/app.vue` (cópia temporária revertida em `afterEach`) refletida em ≤ 5 s (SC-006); marcar `test.fixme` referenciando a change de dockerização do FactoryFloor
- [ ] T044 [P] [US4] Teste L4 E2E-143 em `edge/tests/resilience.spec.ts`: origem parada → 502/504 genérico sem hostname/IP interno

### Implementation for User Story 4

- [ ] T045 [US4] Validar/ajustar vhosts `erp` e `factoryfloor` em `edge/nginx/templates/20-vhosts.conf.template` (WebSocket, `proxy_read_timeout`, `error_page 502 504` com corpo genérico)
- [ ] T046 [US4] Confirmar com o usuário as portas/hosts finais do ERP (3101) e FactoryFloor (3000) e registrar em `.env.example`
- [ ] T047 [US4] Rodar T042 e T044 verdes; manter T043 como `fixme` rastreado
- [ ] T048 [US4] **Fora deste repo**: abrir change separada no repo `New/FactoryFloor/App/genovalv.app.factoryfloor` (Dockerfile de dev `nuxt dev --host 0.0.0.0`, porta 3000, `server.hmr` via borda) em fluxo próprio (spec → plan → tasks), após o merge desta change; depois remover `fixme` de T043 e validar E2E-301 a 304

### 6.1 Commit Group — US4

- [ ] T049 `git commit` e `git push` (**pedir autorização**)

---

## Phase 7: Resiliência e Edge Cases (L4)

**Purpose**: Cobrir edge cases da spec (E2E-401 a E2E-406)

- [ ] T050 [P] Teste E2E-401 em `edge/tests/resilience.spec.ts`: porta HTTPS ocupada → subir com outra `EDGE_HTTPS_PORT` via env e redirect coerente
- [ ] T051 [P] Teste E2E-402/403/404 em `edge/tests/resilience.spec.ts`: cert expirado falha claro e regenera; origem cai e volta sem reiniciar a borda; `down`/`up` preserva cache/cert em `C:/Docker-Volumes/genova/new-edge`
- [ ] T052 [P] Teste E2E-405/406: ambiente limpo sobe seguindo README em ≤ 5 min (cronometrado); `nginx`/`openssl` ausentes no host não impedem a execução (Princípio VI)
- [ ] T053 Ajustar configs conforme falhas encontradas e rodar `npm run test:edge` completo verde (SC-005)

### 7.1 Commit Group — Resiliência

- [ ] T054 `git commit` e `git push` (**pedir autorização**)

---

## Phase 8: Execute test (unit/integration)

- [ ] T055 Rodar `npm run test:edge` (L0, L1, L2, L4) e `npm run test:unit` / `npm run test:coverage` para garantir que `@genovalv/core` mantém 100% e nada regrediu
- [ ] T056 Rodar `docker compose up` completo e executar [quickstart.md](quickstart.md) ponta a ponta; registrar resultados (L3 pendente de T048)

---

## Phase 9: Pre-PR Checklist

- [ ] T057 [P] Atualizar `README.md` com: o que é a borda, como subir, hosts/portas, variáveis `EDGE_*`, aviso de que é simulação e não equivalente ao Cloudflare real (FR-011), aviso de cert autoassinado e `*.genova.localhost`
- [ ] T058 [P] Atualizar `AGENTS.md` (Build & Test: `npm run test:edge`; Architecture: diretório `edge/`; Do NOT: sem segredos Cloudflare, sem Nginx local)
- [ ] T059 Validar conformidade com constituição v1.1.0 (princípios I a VI) e marcar `specs/002-cloudflare-edge-proxy/checklists/requirements.md`
- [ ] T060 Rodar `graphify update .` (AST-only)

---

## Phase 10: Create PR

- [ ] T061 Commit final + push da branch `feature/cloudflare-edge-proxy` (**autorização explícita**; hook `pre-commit` do graphify roda sem ser pulado)
- [ ] T062 Criar PR via MCP do Azure (`mcp__azure-repos__create_pull_request`) — source `feature/cloudflare-edge-proxy`, target `develop` (**autorização explícita**; se o MCP estiver indisponível, avisar o usuário)
- [ ] T063 Após merge: remover worktree (`/openspec-worktree`) e encerrar change

---

## Dependencies & Execution Order

- **Fase 0** → **Fase 1** → **Fase 2 (bloqueia tudo)** → histórias
- **US1 (P1, MVP)** depende só da Fase 2. **US2** e **US3** dependem de US1 (compartilham `20-vhosts.conf.template` e o origin-echo) mas testam de forma independente. **US4** depende de US1 (vhosts); T048 depende do merge desta change
- Fases 7 a 10 dependem das histórias desejadas concluídas
- Dentro de cada história: testes FALHAM primeiro → config → verde → commit (com autorização)

### Parallel Opportunities

- Setup: T004 a T007 em paralelo
- Foundational: T010/T011 (testes) em paralelo; T013, T014, T015, T017 em paralelo
- US1: T020 a T023 em paralelo
- US2: T029/T030; US3: T035 a T038 em paralelo
- Cuidado: `20-vhosts.conf.template` e `docker-compose.yml` são arquivos compartilhados; tarefas que os editam (T016, T025, T032, T039, T045) são sequenciais

### Parallel Example: User Story 3

```bash
Task: "Teste rate limit em edge/tests/ratelimit.spec.ts"
Task: "Teste WAF em edge/tests/waf.spec.ts"
Task: "Teste corpus WAF em edge/tests/waf-corpus.spec.ts"
Task: "Maps WAF em edge/nginx/templates/00-maps.conf.template"
```

---

## Implementation Strategy

### MVP First (US1)

1. Fase 0, 1, 2 → 2. Fase 3 (US1) → 3. **PARAR e validar** (E2E-101 a 105, 141/142, 201, 202) → 4. demo

### Incremental Delivery

US1 → US2 (cache) → US3 (rate limit/WAF) → US4 (ERP/FactoryFloor) → resiliência → PR. Cada passo adiciona valor sem quebrar o anterior.

### Cross-repo

Ordem obrigatória (AGENTS.md global): 1) esta change em `New/Shareds` com PR/merge na `develop`; 2) change de dockerização no repo FactoryFloor (T048); 3) E2E L3 habilitado.

---

## Notes

- [P] = arquivos distintos, sem dependência
- Verificar que os testes FALHAM antes de implementar (evidência no histórico de commits)
- Nenhum `git commit`/`push`/PR sem autorização explícita do usuário
- Evitar: conflito em `docker-compose.yml`/`20-vhosts.conf.template`, `waitForTimeout` fixo, segredos Cloudflare no repo
