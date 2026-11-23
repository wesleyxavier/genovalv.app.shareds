# AGENTS.md — `New/Shareds` (`@genovalv/shareds`)

Instruções operacionais para agentes atuando na camada compartilhada multi-framework da plataforma Genova (`Admin` AnalogJS, `ERP` Next.js e `FactoryFloor` Nuxt.js).

## Build & Test

Executar a partir de `New/Shareds/`:

- **Instalar dependências:** `npm install`
- **Build completo (ESM + `.d.ts`):** `npm run build`
- **Testes unitários e DOM/SSR:** `npm run test:unit`
- **Gate de cobertura (100% obrigatório no `core`):** `npm run test:coverage`
- **Playground visual (Vite):** `npm run preview` (`http://localhost:4173`)
- **Testes E2E (Playwright desktop `1280x800` + mobile `390x844`):** `npm run test:e2e`

> No Windows PowerShell 5.1, encadeie comandos dependentes com `; if ($LASTEXITCODE -eq 0) { ... }` em vez de `&&`.

## Workflow & Governance

- Este workspace usa **Spec Kit** (`.specify/` e `specs/{NNN-nome}/`). Leia `.specify/memory/constitution.md` antes de alterações arquiteturais.
- **Autorização obrigatória:** nunca execute `git commit`, `git push` ou crie PR sem confirmação explícita do usuário.
- Toda nova feature ou mudança de contrato exige atualização de `spec.md`, `plan.md`, `tasks.md` e `README.md`.

## Architecture & Package Boundaries

Monorepo `npm workspaces` (`packages/*` e `playground`):

- **`@genovalv/core` (`packages/core/`)**: TypeScript puro, zero dependências de DOM/browser/framework. Contém tipos, `DEFAULT_LOGIN_CONTEXT`, normalização/validação (`email`, `password`, `mfaCode`), e i18n (`pt-BR`, `en-US`, `es-ES` com fallback para `pt-BR`).
- **`@genovalv/tokens` (`packages/tokens/`)**: CSS Custom Properties (`src/tokens.css`), mapeamento `@theme` Tailwind v4 (`src/tailwind.css`) e classes utilitárias para `<input>` / `<label>` / checkbox nativos alinhados ao `DESIGN.md`.
- **`@genovalv/elements` (`packages/elements/`)**: Web Components em **Lit 3** (`<genova-auth-shell>`, `<genova-header>`, `<genova-footer>`, `<genova-auth-card>`, `<genova-action-button>`, `<genova-alert-banner>`, `<genova-mfa-selector>`).
- **`@genovalv/playground` (`playground/`)**: Sandbox Vite e alvo dos testes E2E do Playwright. Na tela inicial (`/`), o MFA fica oculto por padrão (`mfaMode = 'hidden'`); use `?mfaMode=required` ou `?mfaMode=optional` para testá-lo.

## Conventions

- **TypeScript:** `strict: true`, `ES2022`, named exports nos barrels (`src/index.ts`). Proibido `any`.
- **Arquitetura Híbrida:** inputs de formulário (`<input>`, checkbox, toggle de senha) permanecem nativos em cada app consumidor para preservar SSR, autofill, `FormData` e acessibilidade; use `@genovalv/tokens` para estilização e `@genovalv/elements` para casca, botões, alertas e seletor MFA.
- **SSR-Safety:** todo registro de custom element deve passar por `registerCustomElement()` (`typeof window !== 'undefined' && typeof customElements !== 'undefined'`). Imports de `@genovalv/core` e `@genovalv/elements` não podem falhar em Node puro.
- **Web Components (Lit 3):**
  - Eventos customizados devem usar `{ bubbles: true, composed: true }` para atravessar Shadow DOM.
  - Sempre inclua `:host([hidden]) { display: none; }` quando `:host` definir `display`.
  - Use `slot` explícitos para composição (`genova-auth-shell` encaminha `slot="actions"` para `genova-header`).
- **i18n:** todo texto visível ao usuário deve usar chaves de `LOGIN_TRANSLATIONS` via `createTranslator(locale)`. Nunca hardcode textos fixos sem suporte a `pt-BR`, `en-US` e `es-ES`.
- **Contexto externo:** `brandName`, `brandSuffix`, `portalTitle`, `portalSubtitle`, `supportLinks` e `footerLinks` aceitam sobrescrita via atributos/props usando `DEFAULT_LOGIN_CONTEXT` apenas como fallback.

## Testing

- **TDD obrigatório:** escreva/atualize testes antes da implementação.
- **`@genovalv/core`:** `Vitest` em ambiente `node` com threshold estrito de **100%** (`lines`, `functions`, `branches`, `statements`).
- **`@genovalv/elements`:** `Vitest` com `happy-dom` para Shadow DOM/eventos + teste SSR em Node (`@vitest-environment node`).
- **`playground/`:** testes E2E Playwright cobrindo `chromium-desktop` e `chromium-mobile` (incluindo overflow horizontal, navegação por teclado, i18n ao vivo e estados de erro/sucesso).

## Do NOT

- Não adicione dependências de React, Vue, Angular, Next.js, Nuxt ou AnalogJS dentro de `New/Shareds/`.
- Não acesse `window`, `document` ou `customElements` no escopo top-level de módulos.
- Não duplique regras de validação, sanitização ou dicionários i18n fora de `@genovalv/core`.
- Não coloque chamadas HTTP, tokens Auth0, secrets ou regras de backend neste repositório.
- Não edite arquivos gerados em `dist/`, `test-results/` ou `playwright-report/`.
