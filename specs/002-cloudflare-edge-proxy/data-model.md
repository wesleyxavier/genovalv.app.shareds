# Data Model: Proxy de Borda Local

Sem persistência relacional. Entidades são configuração e artefatos de arquivo.

## Regra de borda (EdgeRule)

| Campo | Tipo | Regras |
|-------|------|--------|
| kind | enum `redirect` \| `headers` \| `cache` \| `rate_limit` \| `waf` | obrigatório |
| match | host / path / método / user-agent | definido por regra |
| action | status (301/403/429) ou mutação de headers | obrigatório |
| parameters | env (`EDGE_*`) | com default seguro (FR-007) |

**Estados**: estático (configuração). Mudança de parâmetro exige reload/recriação do contêiner.

## Origem (Origin)

| Campo | Tipo | Regras |
|-------|------|--------|
| name | `playground` \| `erp` \| `factoryfloor` (+ `echo` em teste) | único |
| host | `<name>.${EDGE_BASE_DOMAIN}` | resolve a 127.0.0.1 |
| upstream | `host:porta` | `EDGE_UPSTREAM_<NAME>` |
| websocket | bool | true para `factoryfloor` e `playground` |

Admin NÃO é uma Origem (FR-014).

## Certificado local (LocalCertificate)

| Campo | Tipo | Regras |
|-------|------|--------|
| cert / key | arquivos PEM em `C:/Docker-Volumes/genova/new-edge/certs` | nunca versionados (FR-008) |
| san | `*.${EDGE_BASE_DOMAIN}`, `${EDGE_BASE_DOMAIN}` | obrigatório |
| validity | dias (`EDGE_CERT_DAYS`, padrão 825) | regenerar se ausente/expirado |

**Transições**: `ausente → gerado → válido → expirado → regenerado`.

## Variáveis de configuração

Ver [contracts/edge-contract.md](contracts/edge-contract.md).
