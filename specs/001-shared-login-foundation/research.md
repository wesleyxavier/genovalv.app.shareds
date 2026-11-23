# Phase 0 Research: Shared Login Foundation & Base Components

**Feature**: `001-shared-login-foundation`
**Date**: 2026-11-23
**Scope**: `New/Shareds/`

## 1. Monorepo / Workspace Orchestration

- **Decision**: Usar `npm workspaces` nativo (Node `22.23.5`, npm `11.21.2`) na raiz de `New/Shareds/` com `packages/*` (`core`, `tokens`, `elements`) e `playground`.
- **Rationale**: Zero dependências externas de gerenciador de pacotes; compatível nativamente com o ambiente já instalado e com os três consumidores (`AnalogJS`, `Next.js`, `Nuxt.js`).
- **Alternatives considered**:
  - `pnpm workspaces` / `Turborepo`: útil apenas quando houver dezenas de pacotes ou cache remoto distribuído; adiciona complexidade desnecessária no estágio atual (YAGNI).

## 2. Pure TypeScript Domain & Validation Package (`@genovalv/core`)

- **Decision**: Implementar `@genovalv/core` em TypeScript estrito (`strict: true`), compilado para ESM + declarações `.d.ts` via `tsup` (ou `tsc`), sem qualquer dependência de DOM (`window`, `document`) ou framework.
- **Rationale**: Garante 100% de portabilidade entre `AnalogJS`, `Next.js` (inclusive Server Components/Actions) e `Nuxt.js` (Nitro SSR), além de permitir execução instantânea de testes unitários com 100% de cobertura no Vitest.
- **Alternatives considered**:
  - Biblioteca acoplada a `zod` ou framework específico: `zod` pode ser usado futuramente como adaptador, mas funções puras tipadas mantêm o bundle mínimo e zero dependências transitivas obrigatórias.

## 3. Design Tokens & Form Control Styling (`@genovalv/tokens`)

- **Decision**: Exportar dois artefatos CSS principais em `@genovalv/tokens`:
  1. `tokens.css`: variáveis CSS (`:root`) fiéis ao `DESIGN.md` (paleta semântica `#f8f9ff`, `#ffffff`, `#eff4ff`, `#0b1c30`, `#0051d5`, `#316bf3`, `#ba1a1a`, `emerald`/`amber`/`rose`, fontes `Inter` + `JetBrains Mono`, espaçamentos 4px e raios compactos `4px`/`8px`) + estilos de superfícies e controles nativos (`.genova-input`, `.genova-checkbox`, `.genova-label`, `.genova-dot-grid`).
  2. `tailwind.css`: bloco `@theme` para Tailwind CSS v4 mapeando automaticamente os mesmos tokens para utilitários (`bg-surface`, `text-on-surface`, `bg-secondary`, `font-code-md`, `p-space-xl`, etc.).
- **Rationale**: Permite que Web Components (Shadow DOM herdando CSS Custom Properties do `:root`), inputs nativos de formulário em React/Angular/Vue e o `playground/` compartilhem exatamente a mesma identidade visual sem runtime JS.
- **Alternatives considered**:
  - Tailwind-only config JS (`tailwind.config.js`): não funciona de forma uniforme dentro de Shadow DOM nem em builds Tailwind v4 baseados em `@theme`.

## 4. Web Components Multi-Framework (`@genovalv/elements` com Lit 3)

- **Decision**: Construir os componentes estruturais e visuais autocontidos em **Lit 3** (`lit`), compilados em ESM + `.d.ts` via Vite Library Mode / `tsc`, com:
  - Registro idempotente e SSR-safe (`if (typeof window !== 'undefined' && typeof customElements !== 'undefined' && !customElements.get(tag))`).
  - Shadow DOM aberto (`ShadowRoot`) consumindo CSS Custom Properties herdadas de `@genovalv/tokens`.
  - Eventos nativos `CustomEvent` sempre com `{ bubbles: true, composed: true }` para atravessar a barreira do Shadow DOM em React 19, Angular 22 e Vue 3.
- **Rationale**: Lit adiciona ~5 KB ao bundle, não injeta runtime React/Angular/Vue em outros apps e segue integralmente o Princípio I da Constituição de `New/Shareds/`.
- **Alternatives considered**:
  - Embrulhar componentes React via `createRoot`: duplicaria runtime React dentro do Angular (`Admin`) e do Vue (`FactoryFloor`), além de quebrar encapsulamento de portais.
  - Stencil: exige compilador proprietário mais pesado para poucos componentes base.

## 5. Local Visual Sandbox & Testing Strategy (`Vitest` + `Playwright`)

- **Decision**:
  - **Unitário & Componente (`Vitest`):** `@genovalv/core` testado em Node com `@vitest/coverage-v8` (gate 100% em statements/branches/functions/lines); `@genovalv/elements` testado em `happy-dom`/`jsdom` para API/eventos + teste explícito de importação SSR em Node puro (sem `window`/`document`).
  - **Visual & E2E (`playground/` + `Playwright`):** mini app HTML + TypeScript + Vite em `New/Shareds/playground/` montando a tela de login completa com `@genovalv/tokens` + `@genovalv/core` + `@genovalv/elements` e um handler simulado (sem credenciais Auth0), testado ponta a ponta em Chromium headless (`1280x800` desktop e `390x844` mobile) com Playwright.
- **Rationale**: Prova renderização real de Shadow DOM, foco/teclado, colagem de MFA, prevenção de duplo clique e ausência de rolagem horizontal dentro de `New/Shareds/` antes de qualquer integração nos 3 portais.
- **Alternatives considered**:
  - Storybook for Web Components: mais pesado para o estágio inicial; pode ser adicionado depois sem alterar os pacotes.

## 6. Framework-Agnostic i18n by Default (`@genovalv/core`)

- **Decision**: Implementar i18n leve e 100% tipado em `@genovalv/core` (`SupportedLocale`: `'pt-BR' | 'en-US' | 'es-ES'`, `pt-BR` padrão, fallback automático para `pt-BR`, e `createTranslator(locale, overrides?)`), repassado via propriedade `locale` para `@genovalv/elements`.
- **Rationale**: Evita acoplamento com bibliotecas específicas de um único framework (`next-intl`, `@nuxtjs/i18n`, `@ngx-translate`), mantém `@genovalv/core` com zero dependências externas e permite que qualquer app troque o idioma ou sobrescreva chaves sem alterar os componentes.
- **Alternatives considered**:
  - `i18next` / `@lit/localize`: adicionam boilerplate de extração/runtime desnecessário para um catálogo base enxuto; os dicionários tipados em TS já permitem futura ponte para qualquer biblioteca de i18n dos apps consumidores.
