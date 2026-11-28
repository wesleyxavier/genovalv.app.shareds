# Contrato da Borda Local

Contrato observável por origens e por testes. Simulação de desenvolvimento; não equivale ao Cloudflare real.

## Endpoints

| Host | Porta host | Origem (upstream padrão) |
|------|-----------|--------------------------|
| `http://*.genova.localhost` | `EDGE_HTTP_PORT` (8080) | 301 → HTTPS |
| `https://playground.genova.localhost` | `EDGE_HTTPS_PORT` (3010) | `host.docker.internal:4173` |
| `https://admin.genova.localhost` | 3010 | `host.docker.internal:3103` |
| `https://erp.genova.localhost` | 3010 | `host.docker.internal:3101` |
| `https://factoryfloor.genova.localhost` | 3010 | `host.docker.internal:3102` |
| `https://echo.genova.localhost` (profile `test`) | 3010 | `edge-origin-echo` |

## Redirecionamento

`GET http://<host>:8080/<path>` → `301 Location: https://<host>:3010/<path>`.

## Headers enviados à origem (sobrescrevem valores do cliente)

| Header | Valor |
|--------|-------|
| `CF-Connecting-IP` | IP do cliente |
| `CF-Ray` | id único `<request_id>-<EDGE_CF_COLO>` |
| `CF-IPCountry` | `EDGE_CF_COUNTRY` (padrão `BR`) |
| `CF-Visitor` | `{"scheme":"https"}` |
| `X-Forwarded-For` | cadeia existente + IP do cliente |
| `X-Forwarded-Proto` | `https` |
| `X-Forwarded-Host` | host original |

## Headers de resposta

| Header | Quando |
|--------|--------|
| `X-Cache-Status` / `CF-Cache-Status` | rotas de estáticos: `MISS`, `HIT`, `EXPIRED`, `BYPASS` |
| `X-Edge-Rule` | respostas 403 do WAF: nome da regra |

## Status gerados pela borda

| Status | Condição |
|--------|----------|
| 301 | HTTP → HTTPS |
| 403 | WAF: método inválido, path/user-agent malicioso conhecido |
| 400 | traversal codificado rejeitado pelo parser do Nginx |
| 429 | excedeu `EDGE_RATE_LIMIT_RPS` + `EDGE_RATE_LIMIT_BURST` por IP |
| 502/504 | origem indisponível/lenta (mensagem genérica, sem detalhes internos) |

## Variáveis de ambiente (`.env`)

| Variável | Padrão |
|----------|--------|
| `EDGE_BASE_DOMAIN` | `genova.localhost` |
| `EDGE_HTTP_PORT` / `EDGE_HTTPS_PORT` | `8080` / `8443` |
| `EDGE_UPSTREAM_PLAYGROUND` | `host.docker.internal:4173` |
| `EDGE_UPSTREAM_ERP` | `host.docker.internal:3101` |
| `EDGE_UPSTREAM_FACTORYFLOOR` | `host.docker.internal:3000` |
| `EDGE_RATE_LIMIT_RPS` / `EDGE_RATE_LIMIT_BURST` | `100` / `200` |
| `EDGE_CF_COUNTRY` / `EDGE_CF_COLO` | `BR` / `GRU` |
| `EDGE_CERT_DAYS` | `825` |
| `EDGE_DATA_DIR` | `C:/Docker-Volumes/genova/new-edge` (certs) |
| `EDGE_ECHO_PORT` | `9100` (origin-echo, profile `test`) |
