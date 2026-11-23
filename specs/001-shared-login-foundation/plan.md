# Implementation Plan: Shared Login Foundation & Base Components

**Branch**: `001-shared-login-foundation` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-shared-login-foundation/spec.md`

## Summary

Estruturar o workspace `New/Shareds/` em três pacotes desacoplados (`@genovalv/core` em TypeScript puro, `@genovalv/tokens` com CSS Custom Properties e `@theme` Tailwind v4 extraídos do `DESIGN.md`, e `@genovalv/elements` com Web Components Lit 3 SSR-safe) mais um sandbox visual local (`playground/` em Vite) para validar os componentes base da tela de login (`Genova Cloud`) com Vitest (unitário, 100% no `core`) e Playwright (E2E desktop/mobile) antes da integração com `Admin` (AnalogJS), `ERP` (Next.js) e `FactoryFloor` (Nuxt.js).

## Technical Context

**Language/Version**: TypeScript 5.x (`strict: true`), Node.js `22.23.5`, npm `11.21.2`

**Primary Dependencies**: `lit` (v3.x para Web Components), `vite` (build do `@genovalv/elements` e servidor do `playground/`), `tsup` ou `typescript` (`@genovalv/core`), `tailwindcss` v4 (opcional no `playground` / compatível via `@genovalv/tokens`)

**Storage**: N/A (pacotes compartilhados *stateless*; infra PostgreSQL em `New/Shareds/docker-compose.yml` não é alterada nesta feature)

**Testing**: `vitest` + `@vitest/coverage-v8` + `happy-dom` (unitário, componente DOM e teste SSR em Node); `@playwright/test` (E2E em Chromium headless contra `playground/` nos viewports desktop `1280x800` e mobile `390x844`)

**Target Platform**: Browser moderno (ES2022+, Shadow DOM, Custom Elements) + execução SSR-safe em Node.js (`AnalogJS`, `Next.js`, `Nuxt.js`)

**Project Type**: Monorepo de bibliotecas frontend multi-framework (`npm workspaces`: `packages/*` + `playground`)

**Performance Goals**: Validação síncrona de formulário < 100 ms (`SC-003`), zero submissões duplicadas durante estado `validating` (`SC-004`), bundle enxuto de `@genovalv/elements` sem carregar runtimes de React/Angular/Vue

**Constraints**: SSR-safety estrito (zero acesso a `window`/`document` no import em Node), eventos `CustomEvent` com `{ bubbles: true, composed: true }`, aderência 100% aos tokens do `DESIGN.md`, zero credenciais ou lógica de emissão própria de token

**Scale/Scope**: 3 pacotes compartilhados (`core`, `tokens`, `elements`), 7 Web Components base de autenticação/estrutura, receitas CSS para inputs nativos, 1 sandbox `playground/` reproduzindo o template HTML de login, suítes Vitest + Playwright

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Verificação Pré-Design | Verificação Pós-Design |
|---|---|---|
| **I. Arquitetura Híbrida (`New/Shareds`)** | Separa `core` (TS puro), `tokens` (CSS) e `elements` (Lit apenas para blocos autocontidos sem acoplamento de framework). | Confirmado nos contratos `core-api.md`, `tokens-api.md` e `elements-api.md`: inputs de formulário permanecem nativos estilizados por `tokens` e validados por `core`. |
| **II. Design System (`DESIGN.md`)** | Adota exatamente cores, fontes (`Inter` + `JetBrains Mono`), grade 4px e raios (`4px`/`8px`) do `DESIGN.md` e HTML de referência. | Confirmado em `tokens-api.md` e `quickstart.md` com conferência visual no `playground/`. |
| **III. Cross-Framework & SSR-Safety** | Prevê registro protegido `typeof window !== 'undefined'` e `CustomEvent` `composed: true`. | Confirmado em `elements-api.md` + teste explícito de importação SSR em Node no Vitest. |
| **IV. Test-First (TDD)** | Prevê Vitest (100% cobertura em `core`) + testes de componente + Playwright E2E no `playground/`. | Confirmado em `research.md` e `quickstart.md` (Red-Green-Refactor obrigatório na geração de tasks). |
| **V. Spec Kit, Simplicidade & Segurança** | Sem credenciais estáticas nem protótipo `setTimeout` hardcoded em produção; `playground/` usa handler simulado isolado apenas no sandbox. | Confirmado: `spec.md` §Assumptions e `core-api.md` mantêm autenticação real delegada aos apps consumidores. |

## Project Structure

### Documentation (this feature)

```text
specs/001-shared-login-foundation/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Decisões técnicas e alternativas avaliadas
├── data-model.md        # Entidades, validações e máquina de estados
├── quickstart.md        # Guia executável de build, unit, preview e E2E
├── contracts/
│   ├── core-api.md      # Contratos públicos do @genovalv/core
│   ├── tokens-api.md    # Variáveis CSS e @theme do @genovalv/tokens
│   └── elements-api.md  # Custom Elements, props, slots e eventos do @genovalv/elements
└── tasks.md             # Saída do /speckit-tasks (próxima etapa)
```

### Source Code (`New/Shareds/`)

```text
New/Shareds/
├── package.json                 # npm workspaces ("packages/*", "playground") + scripts raiz
├── tsconfig.base.json           # Configuração TypeScript estrita compartilhada
├── playwright.config.ts         # Configuração E2E contra o playground/
├── docker-compose.yml           # Infra local existente (inalterada)
├── packages/
│   ├── core/                    # @genovalv/core
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── i18n/
│   │   │   │   ├── locales.ts
│   │   │   │   └── translator.ts
│   │   │   ├── auth/
│   │   │   │   ├── context.ts
│   │   │   │   ├── mfa.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── validation.ts
│   │   │   └── index.ts
│   │   └── tests/
│   │       ├── auth.validation.test.ts
│   │       └── i18n.translator.test.ts
│   ├── tokens/                  # @genovalv/tokens
│   │   ├── package.json
│   │   └── src/
│   │       ├── tokens.css
│   │       └── tailwind.css
│   └── elements/                # @genovalv/elements (Lit 3)
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── src/
│       │   ├── register.ts
│       │   ├── components/
│       │   │   ├── genova-action-button.ts
│       │   │   ├── genova-alert-banner.ts
│       │   │   ├── genova-auth-card.ts
│       │   │   ├── genova-auth-shell.ts
│       │   │   ├── genova-footer.ts
│       │   │   ├── genova-header.ts
│       │   │   └── genova-mfa-selector.ts
│       │   └── index.ts
│       └── tests/
│           ├── elements.dom.test.ts
│           └── elements.ssr.test.ts
└── playground/                  # Sandbox visual local + alvo dos testes E2E Playwright
    ├── package.json
    ├── index.html
    ├── src/
    │   └── main.ts
    └── e2e/
        └── login-foundation.spec.ts
```

**Structure Decision**: Adotado monorepo `npm workspaces` dentro de `New/Shareds/` separando `packages/core`, `packages/tokens`, `packages/elements` e `playground/`, permitindo desenvolver, buildar e validar unitariamente e E2E dentro de `New/Shareds/` antes de expor os pacotes para `Admin`, `ERP` e `FactoryFloor`.

## Complexity Tracking

Nenhuma violação à Constituição identificada — todas as camadas respeitam diretamente os Princípios I a V.
