<!--
Sync Impact Report
- Version change: 1.1.0 → 2.0.0 (MAJOR)
- Modified principles: I (models/funções TS compartilhadas no core), IV (Clean Code + limite de 100 linhas/arquivo + idempotência), V (Cookies HttpOnly vs localStorage, Auth0/@simulacrum/auth0-simulator)
- Added/Aligned: Alinhado à Genova Constitution v2.0.0
- Follow-up TODOs: Revisar arquivos > 100 linhas em futuras refatorações e adicionar models compartilhados de perfis/auth/idempotência em @genovalv/core
-->

# Genova Shareds (`New/Shareds`) Constitution

## Core Principles

### I. Arquitetura Híbrida de Pacotes Compartilhados e TS Compartilhado

Todo código compartilhado em `New/Shareds/` entre os frontends `Admin` (AnalogJS/Angular), `ERP` (Next.js/React) e `FactoryFloor` (Nuxt.js/Vue) DEVE ser organizado em pacotes independentes, coesos e sem dependências cruzadas indevidas:

- **`@genovalv/core` / Camadas TS Compartilhadas (TypeScript puro, 100% em inglês):** DEVE concentrar entidades/models, contratos puros de repositório/gateway/sessão e funções puras agnósticas de framework (validações, máscaras CPF/CNPJ/CEP, formatadores, i18n, `onExecutePostLogin` e aritmética monetária com `decimal`). NÃO DEVE importar Angular, React, Vue, Lit, Node builtins ou APIs de DOM no core puro.
- **`@genovalv/server` (BFF/Node compartilhado em `packages/server/`):** DEVE concentrar adaptadores Auth0/JOSE/NodeHash, helpers `HttpOnly` e guards/controllers H3 compartilháveis, e casos de uso transversais de autenticação, sem armazenar secrets hardcoded nem lógica exclusiva de um app.
- **`@genovalv/tokens` (Design Tokens CSS & Tailwind):** fonte única de verdade visual do `DESIGN.md` consumível por Tailwind v4 e CSS padrão.
- **`@genovalv/elements` (Web Components em Lit):** componentes autocontidos multi-framework com estilos isolados e `CustomEvent` (`bubbles: true, composed: true`), carregados *client-only* em SSR.

### II. Design System Único (Genova Cloud Console)

Todo token e componente visual em `New/Shareds/` DEVE seguir integralmente a especificação `Genova Cloud Console` de `DESIGN.md` (paleta semântica, tipografia `Inter` + `JetBrains Mono`, grade 4px, raios compactos e referência visual aprovada em `design/`).

### III. Compatibilidade Cross-Framework e SSR-Safety

Todo artefato exportado por `New/Shareds/` DEVE operar com segurança em SSR (`AnalogJS`, `Next.js`, `Nuxt.js`): zero acesso a `window`, `document` ou `customElements` no escopo de módulo; registro seguro contra execução dupla; acessibilidade ARIA e navegação por teclado.

### IV. Test-First (TDD), Clean Code e Limite de 100 Linhas

- **Red-Green-Refactor:** testes escritos antes da implementação; 100% de cobertura unitária em `@genovalv/core` e testes de renderização/eventos/acessibilidade em `@genovalv/elements`.
- **Clean Code (`/clean-code`):** nomes significativos, funções pequenas de responsabilidade única, zero duplicação e erros explícitos.
- **Limite de 100 linhas por arquivo:** todo arquivo de código-fonte DEVE ter até 100 linhas; se maior, analisar e dividir em módulos/componentes menores.

### V. Governança Spec Kit, Segurança e Estratégia de Idempotência

- **Regra Zero & Autorização:** nada é presumido; `git commit`, `push` e PR exigem autorização explícita do usuário; seguir `/openspec-worktree` para novas features.
- **Sessão e Contratos:** `New/Shareds/` não armazena segredos nem tokens; contratos e helpers de idempotência (`Guid` / `Idempotency-Key`) e sessão (Cookies `HttpOnly` para auth, `localStorage` apenas para UI/idioma) são compartilhados em `@genovalv/core`.

### VI. Paridade Local com Cloudflare via Reverse Proxy Nginx em Docker

O ambiente local de `New/Shareds/` DEVE simular a borda Cloudflare via Nginx em Docker (`genova-new-network`, HTTPS local, headers `CF-*`, cache/rate limit/WAF básico, volumes em `C:\Docker-Volumes\genova\...`).

## Governance

Esta Constituição alinha-se à **Genova Constitution v2.0.0**. Emendas exigem atualização semântica de versão e verificação em todo plano e revisão de código.

**Version**: 2.0.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
