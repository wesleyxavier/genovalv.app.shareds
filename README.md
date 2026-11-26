# Genova Shareds (`New/Shareds`)

Camada compartilhada multi-framework para os frontends **Admin** (`AnalogJS`), **ERP** (`Next.js`) e **FactoryFloor** (`Nuxt.js`), além da infraestrutura local de desenvolvimento.

## Pacotes

- **`@genovalv/core`** (`packages/core/`): TypeScript puro (SSR-safe, zero dependências de DOM/Node/framework) com contratos puros de sessão/auth/repositórios base, normalização/validação (`email`, `password`, `mfaCode`, CPF/CNPJ), idempotência, `onExecutePostLogin` e i18n padrão (`pt-BR`, `en-US`, `es-ES`).
- **`@genovalv/server`** (`packages/server/`): Pacote BFF/Node compartilhado **agnóstico de framework** (zero dependência de `h3`, Next ou Nuxt) com `Auth0Gateway` e helpers HTTP, `JoseSessionTokenGateway`, `NodeHashService`, cookies `HttpOnly`, `loadEnvFile` e casos de uso de autenticação (`ResolvePostLoginUseCase`, `PasswordLoginUseCase`, `OAuthCallbackUseCase`, `BackchannelLogoutUseCase`, `BootstrapUseCase`).
- **`@genovalv/tokens`** (`packages/tokens/`): Variáveis CSS (`tokens.css`), mapeamento `@theme` para Tailwind CSS v4 (`tailwind.css`) e classes base de inputs nativos alinhadas ao `DESIGN.md` (*Genova Cloud Console*).
- **`@genovalv/elements`** (`packages/elements/`): Web Components em Lit 3 com registro SSR-safe e eventos `CustomEvent` (`bubbles: true, composed: true`): `<genova-auth-shell>`, `<genova-header>`, `<genova-footer>`, `<genova-auth-card>`, `<genova-action-button>`, `<genova-alert-banner>`, `<genova-mfa-selector>`, `<genova-locale-selector>`, `<genova-input>` e `<genova-checkbox>` (Form-Associated via `ElementInternals`).
- **`@genovalv/playground`** (`playground/`): Sandbox Vite local para inspeção visual e alvo dos testes E2E com Playwright.

## Comandos

```powershell
cd New/Shareds
npm install
npm run build           # Compila core, tokens e elements (dist/ + .d.ts)
npm run test:unit       # Testes unitários e SSR/DOM (Vitest)
npm run test:coverage   # Cobertura 100% em @genovalv/core + testes do @genovalv/elements
npm run preview         # Sobe o playground visual em http://localhost:4173
npm run test:e2e        # Testes E2E (Playwright desktop + mobile) sobre o playground
```

## Infraestrutura Local (PostgreSQL 17)

```powershell
cd New/Shareds
Copy-Item .env.example .env
docker compose up -d
```
