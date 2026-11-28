# Genova Shareds (`New/Shareds`)

Camada compartilhada multi-framework para os frontends **Admin** (`AnalogJS`), **ERP** (`Next.js`) e **FactoryFloor** (`Nuxt.js`), além do proxy de borda local (simulação Cloudflare).

## Pacotes (`v0.6.1`)

- **`@genovalv/core`** (`packages/core/`): TypeScript puro (SSR-safe, zero dependências de DOM/Node/framework) com `GENOVA_BRAND_NAME` (`'Genova Cloud'`), contratos puros de sessão/auth/repositórios base (`AppSetupContext`, `CreateManagementUserPayload`, `validateAppSetupMetadata`), normalização/validação (`email`, `password`, `mfaCode`, CPF/CNPJ/CEP e máscaras `formatCpf`, `formatCnpj`, `formatCep`, `isValidCep`), catálogo/resolução de módulos, `Money`, idempotência, `onExecutePostLogin` e i18n padrão (`pt-BR`, `en-US`, `es-ES`).
- **`@genovalv/server`** (`packages/server/`): Pacote BFF/Node compartilhado **agnóstico de framework** (zero dependência de `h3`, Next ou Nuxt) com `Auth0Gateway` (suporte a `app_setup_id`, `app_setup_secret`, `environment` em `app_metadata` e `genova_admin` em `user_metadata`, além de `getUserMetadata`), `JoseSessionTokenGateway`, `NodeHashService`, cookies `HttpOnly`, `loadEnvFile` e casos de uso de autenticação (`ResolvePostLoginUseCase`, `PasswordLoginUseCase`, `OAuthCallbackUseCase`, `BackchannelLogoutUseCase`, com validação opcional `expectedAppSetup`).
- **`@genovalv/tokens`** (`packages/tokens/`): Variáveis CSS (`tokens.css`), mapeamento `@theme` para Tailwind CSS v4 (`tailwind.css`), paleta Etapa 1 (`#FAF7F0`, `#715faf`, `#E7E2D8`), fonte **`Plus Jakarta Sans`** e logos SVG da marca (`logo/*`).
- **`@genovalv/elements`** (`packages/elements/`): Catálogo UI/UX Etapa 1 com Web Components em Lit 3 (SSR-safe) com validação nativa de formulário (`formAssociated` + `ElementInternals` em `<genova-button>`, `<genova-input>`, `<genova-select>`, `<genova-textarea>`), `<genova-input type="search" inputmode="cpf|cnpj|cep">` (máscara em tempo real, bloqueio de não-dígitos/negativos e botão lupa `genova-search`), botões com `min-height: 34.5px; width: 100%;` e componentes de navegação/feedback/dados/auth.
- **`@genovalv/playground`** (`playground/`): **Storybook (`@storybook/web-components-vite`)** para catálogo interativo, documentação de stories de `@genovalv/elements` / `@genovalv/tokens` e alvo dos testes E2E com Playwright.

## Comandos

```powershell
cd New/Shareds
npm install
npm run build           # Compila core, tokens, elements e server (dist/ + .d.ts)
npm run test:unit       # Testes unitários e SSR/DOM (Vitest)
npm run test:coverage   # Cobertura 100% em @genovalv/core + testes do @genovalv/elements e @genovalv/server
npm run preview         # Sobe o Storybook em http://localhost:6006 (ou preview estático na 4173)
npm run test:e2e        # Testes E2E (Playwright desktop + mobile) sobre o playground
npm run test:edge       # Testes da borda local (Docker + Playwright): API, browser, resiliência
npm run test:edge:hmr   # HMR/WebSocket via borda
```

## Proxy de borda local (simulação Cloudflare)

> **Simulação de desenvolvimento.** Não é equivalente funcional ao Cloudflare real: não há rede global, DDoS, Bot Management nem WAF gerenciado. Serve para validar o contrato de borda (HTTPS, headers `CF-*`, cache, rate limit e bloqueios básicos) antes do deploy.

Nginx em Docker (`edge/`, specs `002-cloudflare-edge-proxy` e `010-shared-cleanup-and-edge-proxy`), sem instalar Nginx/OpenSSL no host e sem serviço `postgres` no `docker-compose.yml`:

| Host local | Origem (padrão) |
| --- | --- |
| `https://playground.genova.localhost:3010` | `host.docker.internal:4173` |
| `https://admin.genova.localhost:3010` | `host.docker.internal:3103` |
| `https://erp.genova.localhost:3010` | `host.docker.internal:3101` |
| `https://factoryfloor.genova.localhost:3010` | `host.docker.internal:3102` |

`*.localhost` resolve para loopback nos navegadores modernos, sem editar o arquivo `hosts`.

```powershell
Copy-Item .env.example .env
docker compose up -d edge-proxy                 # gera o certificado (edge-certs-init) e sobe a borda na 3010
docker compose --profile playground up -d playground   # opcional: playground como origem em contêiner
```

O certificado é **autoassinado** (gerado em `C:\Docker-Volumes\genova\new-edge\certs`, fora do git): o navegador exibirá aviso. Remover a pasta `certs` e rodar `docker compose run --rm edge-certs-init` regenera.

**O que a borda faz**

- HTTP (`8080`) → HTTPS (`3010`, `301` preservando path e query).
- Injeta/sobrescreve `CF-Connecting-IP`, `CF-Ray`, `CF-IPCountry`, `CF-Visitor`, `X-Forwarded-For/Proto/Host` (valores `CF-*` forjados pelo cliente são descartados).
- Cache de estáticos (`X-Cache-Status` / `CF-Cache-Status`: `MISS`, `HIT`...); rotas dinâmicas nunca são cacheadas. O cache fica em `tmpfs` (bind mount do Windows quebra a validação de inode do Nginx).
- Rate limit por IP (`429`): padrão 100 r/s com burst 200 (`EDGE_RATE_LIMIT_RPS` / `EDGE_RATE_LIMIT_BURST`).
- WAF básico (`403` + `X-Edge-Rule`): métodos inválidos, `/.env`, `/.git`, path traversal, `wp-admin`, `phpmyadmin`, XSS/SQLi óbvios e user-agents de scanners (`sqlmap`, `nikto`, `masscan`, `nmap`). Traversal codificado (`..%2f`) é rejeitado com `400` pelo próprio parser do Nginx.
- WebSocket/HMR repassados (Vite/Next/Nuxt/Analog dev).

**Configuração** (`.env`): `EDGE_BASE_DOMAIN`, `EDGE_HTTP_PORT` (`8080`), `EDGE_HTTPS_PORT` (`3010`), `EDGE_UPSTREAM_PLAYGROUND|ADMIN|ERP|FACTORYFLOOR`, `EDGE_RATE_LIMIT_RPS|BURST`, `EDGE_CF_COUNTRY` (`BR`), `EDGE_CF_COLO` (`GRU`), `EDGE_CERT_DAYS`, `EDGE_DATA_DIR`. Contrato completo em `specs/002-cloudflare-edge-proxy/contracts/edge-contract.md`.
