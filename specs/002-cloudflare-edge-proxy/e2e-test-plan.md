# Plano de Testes E2E: Proxy de Borda Local

**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md) | **Contrato**: [contracts/edge-contract.md](contracts/edge-contract.md)

Objetivo: provar, de ponta a ponta e a partir de ambiente limpo, que a borda cumpre FR-001 a FR-014 e SC-001 a SC-006. Testes escritos **antes** da config (TDD, Princípio IV): todos começam vermelhos.

## 1. Estratégia em camadas

| Camada | Alvo | Ferramenta | Origem | Cobre |
|--------|------|-----------|--------|-------|
| L0 Smoke de infra | Config válida, contêineres saudáveis | `docker compose config`, `nginx -t`, healthcheck | n/a | FR-001, FR-007, FR-008, FR-009 |
| L1 Contrato (API) | Comportamento da borda com origem controlada | Playwright `request` (`ignoreHTTPSErrors`, `maxRedirects: 0`) | `edge-origin-echo` | FR-002 a FR-006, SC-002 a SC-004 |
| L2 E2E browser | Navegação real via HTTPS pela borda | Playwright Chromium (desktop 1280x800 e mobile 390x844) | playground, ERP | US1, US4, SC-001, SC-006 |
| L3 E2E HMR/WebSocket | Hot reload do FactoryFloor via borda | Playwright Chromium + edição de arquivo | FactoryFloor em contêiner | FR-013, SC-006 |
| L4 Resiliência | Falhas e bordas do ambiente | Playwright `request` + `docker compose` | echo / origens paradas | Edge cases da spec |

Configuração: `playwright.edge.config.ts` com projetos `edge-api`, `edge-chromium-desktop`, `edge-chromium-mobile`. Sem `webServer` Vite; o ambiente sobe via `docker compose` em `globalSetup` e desce em `globalTeardown` (somente contêineres do projeto, sem `down -v` em volumes de dados).

## 2. Pré-requisitos e dados

- Docker Desktop ativo; `.env` a partir de `.env.example` (`edge/test.env`).
- Rate limit (E2E-121/122) usa stack alternativa (`-p genova-edge-rl`, RPS=5, BURST=10, portas 28080/28443); a stack principal usa 100/200.
- Profile `test` sobe `edge-origin-echo` (`echo.genova.localhost`).
- Playground servido em contêiner (Dockerfile existente) na porta 4173.
- ERP via compose do repo ERP (porta 3101). Se indisponível, os testes de ERP são marcados `skip` com motivo explícito (não falsos verdes).
- FactoryFloor: testes L3 ficam **bloqueados** até a change de dockerização no repo dele; entram como `test.fixme` com referência à change.
- Estado limpo: antes de cada suíte, cache limpo (`EDGE_DATA_DIR/cache`) e janela de rate limit reiniciada (`docker compose restart edge-proxy` ou espera da janela). Testes de limite rodam em arquivo/worker isolado (`serial`) para não contaminar os demais.

## 3. Casos de teste

### L0 — Smoke

| ID | Caso | Esperado |
|----|------|----------|
| E2E-000 | `docker compose config` | válido, sem variável indefinida |
| E2E-001 | `nginx -t` no contêiner | `syntax is ok` |
| E2E-002 | `edge-certs-init` em ambiente limpo | exit 0; cert/chave em `C:/Docker-Volumes/genova/new-edge/certs` |
| E2E-003 | Reexecutar `edge-certs-init` | idempotente, não regenera cert válido |
| E2E-004 | `git ls-files` | nenhum `.pem/.key/.crt` versionado (FR-008) |
| E2E-005 | Remover cert e subir proxy | falha com mensagem clara; não sobe sem TLS |

### L1 — Contrato (API)

| ID | Spec | Caso | Esperado |
|----|------|------|----------|
| E2E-101 | US1-1, FR-002 | `GET http://echo.genova.localhost:8080/x?a=1` | 301, `Location: https://echo.genova.localhost:8443/x?a=1` |
| E2E-102 | US1-2, FR-003 | `GET https://echo...` | origem recebe `CF-Connecting-IP`, `CF-Ray`, `CF-IPCountry`, `CF-Visitor`, `X-Forwarded-For/Proto/Host` preenchidos (SC-002: 100%) |
| E2E-103 | US1-3 | enviar `CF-Connecting-IP: 1.2.3.4` e `CF-IPCountry: XX` | origem recebe valores da borda, não os forjados |
| E2E-104 | edge case XFF | enviar `X-Forwarded-For: 9.9.9.9` | origem recebe `9.9.9.9, <ip cliente>` |
| E2E-105 | `CF-Ray` | duas requisições | valores distintos |
| E2E-111 | US2-1, FR-004 | estático inédito | `X-Cache-Status: MISS` |
| E2E-112 | US2-2 | mesmo estático novamente | `HIT`; contador da origem não incrementa |
| E2E-113 | US2-3 | rota dinâmica (`/api/...`, HTML) 2x | sem `HIT`; sempre à origem |
| E2E-121 | US3-1, FR-005 | rajada > limite do mesmo IP | respostas 429 após burst; volta a 200 depois da janela |
| E2E-122 | US3-3 | tráfego legítimo abaixo do limite | 0 respostas 429 |
| E2E-131 | US3-2, FR-006 | `/.env`, `/.git/config`, `/../etc/passwd`, `/wp-admin`, `?q=<script>` | 403 + `X-Edge-Rule` |
| E2E-132 | FR-006 | UA `sqlmap`, `nikto` | 403 + `X-Edge-Rule` |
| E2E-133 | FR-006 | método `TRACE`, `CONNECT`, verbo inválido | 403 (ou 405 documentado) |
| E2E-134 | SC-004 | lista de 20 payloads maliciosos | 100% bloqueados; lista legítima de 20 rotas 0% bloqueada |
| E2E-141 | FR-012 | host desconhecido (`x.genova.localhost`) | resposta padrão da borda (404/421), sem vazar upstream |
| E2E-142 | FR-014 | `admin.genova.localhost` | não roteado (404/421) |
| E2E-143 | contrato | origem parada | 502/504 com corpo genérico, sem hostname/IP interno |

### L2 — E2E browser (Chromium, desktop + mobile)

| ID | Spec | Caso | Esperado |
|----|------|------|----------|
| E2E-201 | US1, SC-001 | abrir `https://playground.genova.localhost:8443/` | página carrega, 0 erros de console, 0 falhas de rede; cert aceito via `ignoreHTTPSErrors` |
| E2E-202 | US1-1 | abrir a versão `http://` no browser | termina em `https://` com a página carregada |
| E2E-203 | US2 | recarregar o playground | assets estáticos em `HIT` (inspeção de `response.headers()`) |
| E2E-204 | US4-1 | `https://erp.genova.localhost:8443/` | ERP renderiza (título/elemento âncora); headers de borda presentes na origem |
| E2E-205 | US4-4, FR-014 | Admin pela URL própria | acessível e sem `X-Cache-Status`/headers de borda |
| E2E-206 | regressão | reexecutar `playground/e2e` existente apontando `baseURL` para a borda | suíte do playground continua verde (desktop e mobile, sem overflow) |
| E2E-207 | acessibilidade de borda | navegação por teclado no playground via borda | mesmo resultado que direto na 4173 |

### L3 — HMR/WebSocket (FactoryFloor)

| ID | Spec | Caso | Esperado |
|----|------|------|----------|
| E2E-301 | US4-2 | abrir `https://factoryfloor.genova.localhost:8443/` | página Nuxt renderiza via borda |
| E2E-302 | US4-3, FR-013 | WebSocket de HMR conecta pela borda | handshake 101, sem reconexão em loop |
| E2E-303 | SC-006 | editar arquivo-fonte (`app/app.vue`) | texto novo aparece em ≤ 5 s sem reiniciar contêiner |
| E2E-304 | playground | idem com HMR do Vite do playground (dev) | atualização em ≤ 5 s |

Bloqueados por: change de dockerização no repo FactoryFloor. Editar arquivo é feito em cópia temporária/revertido em `afterEach`, nunca deixando alteração no repositório do app.

### L4 — Resiliência e edge cases

| ID | Caso | Esperado |
|----|------|----------|
| E2E-401 | porta 8443 ocupada | subir com outra `EDGE_HTTPS_PORT` via env, sem editar arquivos versionados; redirect usa a porta nova |
| E2E-402 | cert expirado | proxy falha com mensagem clara; regenerar restaura |
| E2E-403 | origem cai e volta | 502/504 durante queda; 200 após retorno sem reiniciar a borda |
| E2E-404 | `docker compose down` e `up` | cache/cert persistem em `C:/Docker-Volumes/genova/new-edge` |
| E2E-405 | ambiente limpo (volumes apagados) | sobe só com README, ≤ 5 min (SC-001, cronometrado) |
| E2E-406 | Nginx ausente no host | `where nginx`/`openssl` não necessários; tudo em contêiner (Princípio VI) |

## 4. Rastreabilidade

| Requisito | Casos |
|-----------|-------|
| FR-001 | E2E-000, 405 |
| FR-002 | 101, 202 |
| FR-003 | 102 a 105, 204 |
| FR-004 | 111 a 113, 203 |
| FR-005 | 121, 122 |
| FR-006 | 131 a 134 |
| FR-007 | 000, 401 |
| FR-008 | 004 |
| FR-009 | 002, 404 |
| FR-010 | Esta suíte; commits mostram testes vermelhos antes da config |
| FR-011 | revisão do README (checagem manual em PR) |
| FR-012 | 141, 201, 204, 301 |
| FR-013 | 301 a 303 |
| FR-014 | 142, 205 |
| SC-001 | 201, 405 |
| SC-002 | 102 |
| SC-003 | 112 |
| SC-004 | 121, 134 |
| SC-005 | execução completa verde |
| SC-006 | 303, 304 |

## 5. Critérios de aceite e execução

- **Ordem TDD**: escrever L0/L1 e rodar (todos vermelhos) → implementar config → verde; depois L2 → L3.
- **Gate de conclusão**: L0 + L1 + L2 100% verdes; L3 verde quando o FactoryFloor estiver dockerizado (até lá `fixme` rastreado, não ignorado); L4 verde.
- **Comando**: `npm run test:edge` (L0 a L2 e L4) e `npm run test:edge:hmr` (L3).
- **Flakiness**: `retries: 1` somente em CI; testes de rate limit e cache em `serial`; sem `waitForTimeout` fixo (usar polling/`expect.poll`).
- **Artefatos**: `trace: on-first-retry`, logs do `edge-proxy` anexados em falha (`docker compose logs edge-proxy`); relatório em `test-results/` (já ignorado no git).
- **CI**: suíte roda em contêiner/ambiente com Docker; L2 de ERP/FactoryFloor condicionados à disponibilidade das origens.

## 6. Riscos e lacunas

- Cert autoassinado: browser real avisa; testes usam `ignoreHTTPSErrors`. Confiar em CA local fica fora do escopo.
- `*.genova.localhost` depende do resolvedor do Chromium; em outros navegadores pode exigir hosts file (documentar no README).
- Verificação de "não alcança a origem" no WAF é indireta (`X-Edge-Rule`); E2E-112 usa contador do echo para provar não-chamada no cache. Contador análogo pode ser adicionado ao echo para o WAF se desejado.
- ERP e FactoryFloor dependem de outros repositórios; mudanças lá exigem changes próprias.
