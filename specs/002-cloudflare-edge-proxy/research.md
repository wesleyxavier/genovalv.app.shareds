# Research: Proxy de Borda Local (Simulação Cloudflare)

Fatos verificados no repositório (2026-11-23):

- `docker-compose.yml` de Shareds tem só `postgres` e a rede `genova-new-network`; o playground tem `Dockerfile` (porta 4173) mas não está no compose.
- ERP: Dockerfile multi-stage de **produção** (`npm start`, porta 3101) e compose próprio. Sem dev server, logo sem HMR no ERP.
- FactoryFloor: Nuxt 4, sem Dockerfile/compose, `nuxt dev` na porta 3000 por padrão.
- Admin: fora do escopo (URL própria).

## D1 — Hosts locais por roteamento

- **Decision**: `playground.genova.localhost`, `erp.genova.localhost`, `factoryfloor.genova.localhost` (sufixo configurável `EDGE_BASE_DOMAIN=genova.localhost`).
- **Rationale**: `*.localhost` resolve para loopback em navegadores modernos e no Chromium do Playwright, sem editar `hosts` (zero footprint local).
- **Alternatives**: `*.genova.local` (exige editar arquivo hosts); roteamento por path (quebra assets e basePath de cada app).

## D2 — Alcançar as origens

- **Decision**: upstreams por variável, padrão `host.docker.internal:<porta>` (`EDGE_UPSTREAM_ERP=host.docker.internal:3101`, `..._FACTORYFLOOR=host.docker.internal:3000`, `..._PLAYGROUND=host.docker.internal:4173`), com `extra_hosts: host-gateway`. Cada origem pode rodar em contêiner com porta publicada ou direto no host.
- **Rationale**: ERP e FactoryFloor vivem em repositórios/composes separados; não exige acoplamento de composes nem mudar o ERP. Funciona hoje, antes da dockerização do FactoryFloor.
- **Alternatives**: rede externa compartilhada `genova-new-network` com nomes de serviço (exigiria editar composes de outros repos; pode ser adotada depois sobrescrevendo as variáveis).

## D3 — TLS local

- **Decision**: serviço one-shot `edge-certs-init` (imagem alpine + openssl) gera CA-less cert autoassinado com SAN `*.genova.localhost` em `C:/Docker-Volumes/genova/new-edge/certs`, idempotente (não regenera se válido). `edge-proxy` depende dele (`service_completed_successfully`); ausência/expiração faz o proxy falhar com mensagem clara.
- **Rationale**: respeita isolamento Docker (sem mkcert/openssl no host). Navegador exibirá aviso de cert; testes usam `ignoreHTTPSErrors`.
- **Alternatives**: mkcert (instalação local, viola footprint zero); Caddy internal CA (outra tecnologia, contra o Princípio VI).

## D4 — Headers de borda

- **Decision**: snippet `cf-headers.conf` com `proxy_set_header` fixo que **substitui** qualquer valor do cliente: `CF-Connecting-IP $remote_addr`; `CF-Ray $request_id-${EDGE_CF_COLO}` (ex.: `GRU`); `CF-IPCountry ${EDGE_CF_COUNTRY}` (padrão `BR`); `CF-Visitor {"scheme":"https"}`; `X-Forwarded-For $proxy_add_x_forwarded_for`; `X-Forwarded-Proto $scheme`; `X-Forwarded-Host $host`.
- **Rationale**: `proxy_set_header` sobrescreve o header do cliente (US1-3); `$proxy_add_x_forwarded_for` anexa à cadeia (edge case XFF).
- **Alternatives**: módulo geoip (dependência extra sem valor para dev).

## D5 — Cache de borda

- **Decision**: `proxy_cache_path` em `tmpfs` (`/var/cache/nginx/edge`, zona `edge_cache`; bind mount do Windows causava sempre MISS por validação de inode, verificado empiricamente), `proxy_cache` apenas em `location` de estáticos (`~* \.(js|mjs|css|png|jpe?g|svg|woff2?|ico)$` e `/_nuxt/`, `/_next/static/`); `add_header X-Cache-Status $upstream_cache_status always`; sem cache em outras rotas (`proxy_cache off`, `Cache-Control` respeitado).
- **Rationale**: atende FR-004 e US2; `X-Cache-Status` ≈ `CF-Cache-Status` (adicionado também como `CF-Cache-Status` para paridade).
- **Alternatives**: cache global (cacheia HTML dinâmico, violaria US2-3).

## D6 — Rate limit

- **Decision**: `limit_req_zone $binary_remote_addr zone=edge_rl:10m rate=${EDGE_RATE_LIMIT_RPS}r/s`; `limit_req zone=edge_rl burst=${EDGE_RATE_LIMIT_BURST} nodelay`; `limit_req_status 429`. Padrão 100 r/s, burst 200 (um page load do Vite dev passa de 40 requisições e batia no limite). Testes de 429 sobem uma stack alternativa (projeto compose próprio) com 5 r/s e burst 10.
- **Rationale**: nativo, sem dependências, parametrizável (FR-005/007).
- **Alternatives**: `limit_conn` (mede conexões, não taxa).

## D7 — WAF básico

- **Decision**: `map` em `00-maps.conf` classificando `$request_method` (permitidos: GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS), `$request_uri` (padrões: `/.env`, `/.git`, `../`, `wp-admin`, `phpmyadmin`, `<script`, `union select`) e `$http_user_agent` (`sqlmap`, `nikto`, `masscan`, `nmap`); `if ($waf_block) { return 403; }` com header `X-Edge-Rule: <regra>`. Documentado como simulação, não equivalente ao Cloudflare WAF.
- **Rationale**: FR-006 sem ModSecurity (peso e complexidade excessivos para simulação).
- **Alternatives**: ModSecurity + OWASP CRS (imagem maior, falsos positivos em dev); Cloudflare real (fora de escopo, segredos).

## D8 — WebSocket/HMR

- **Decision**: `map $http_upgrade $connection_upgrade`, `proxy_http_version 1.1`, `Upgrade`/`Connection` repassados, `proxy_read_timeout 3600s` nos vhosts de dev.
- **Rationale**: Nuxt dev/Vite usam WebSocket para HMR (US4-3, SC-006). ERP em modo produção não tem HMR; o requisito vale para o FactoryFloor.

## D9 — Redirecionamento HTTP→HTTPS com portas não padrão

- **Decision**: portas host `EDGE_HTTP_PORT=8080`, `EDGE_HTTPS_PORT=8443`; redirect `return 301 https://$host:${EDGE_HTTPS_PORT}$request_uri`.
- **Rationale**: evita portas privilegiadas e conflitos (edge case porta ocupada); `X-Forwarded-Proto` continua `https`.

## D10 — Estratégia de testes (TDD)

- **Decision**: Playwright `APIRequestContext` (`ignoreHTTPSErrors`, `maxRedirects: 0`; conecta em `127.0.0.1` com header `Host`, pois o Node não resolve `*.localhost`) em `playwright.edge.config.ts`, contra `edge-origin-echo` (profile `test`, devolve JSON dos headers recebidos). Asserts: redirect 301 e `Location`; headers `CF-*` presentes e valores forjados substituídos; cache `MISS`→`HIT` em estático e ausência em rota dinâmica; 429 após exceder; 403 + `X-Edge-Rule` para WAF.
- **Rationale**: sem browser = rápido, determinístico; origin-echo permite verificar o que a origem realmente recebe (SC-002). Nota: "não alcança a origem" é verificado pelo header `X-Edge-Rule` (a origem nunca o emite).

## D11 — Dockerização do FactoryFloor

- **Decision**: fora deste repositório. Change própria no repo `genovalv.app.factoryfloor` (Dockerfile de dev com `nuxt dev --host 0.0.0.0`, porta 3000, HMR habilitado via host/porta da borda `server.hmr`). Esta spec só define o contrato que a borda espera (host + porta 3000 + WebSocket).
- **Rationale**: regra global de changes separadas por repositório; ordem Shareds → FactoryFloor.

## Pontos em aberto (não bloqueantes)

- Valores finais de `EDGE_CF_COUNTRY`/`EDGE_CF_COLO` (padrão `BR`/`GRU`): ajustáveis por `.env`.
- Hosts `*.genova.localhost` assumidos por convenção; confirmar com o time.

## Achados da implementação (2026-11-23)

- **Cache e bind mount (Windows)**: com `/var/cache/nginx/edge` em bind mount o Nginx gravava os arquivos mas nunca entregava HIT; em `tmpfs` o HIT funciona. Cache é efêmero por natureza, então `tmpfs` é adotado.
- **Traversal codificado** (`..%2f`, `%2e%2e%2f`): o parser do Nginx rejeita com 400 antes da regra WAF; os testes aceitam 400 ou 403 (ambos não alcançam a origem).
- **`add_header` não é permitido em `if` no contexto server**: a regra WAF usa `return 403` + `error_page 403 = @edge_waf`, que define `X-Edge-Rule`.
- **Dev server do Vite no playground**: o `CMD` padrão do Dockerfile usa `vite preview` (exige `dist/` do playground); o compose sobrescreve para `npm run dev` e `playground/vite.config.ts` libera `allowedHosts: ['.localhost']`.
- **Scripts em contêiner**: `.gitattributes` força LF em `*.sh`, `*.conf`, `*.template`, `*.mjs` (CRLF quebra no Alpine).
