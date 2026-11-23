<!--
Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles: N/A (initial ratification for New/Shareds)
- Added principles:
  - I. Arquitetura Híbrida de Pacotes Compartilhados (Core, Tokens e Web Components)
  - II. Design System Único (Genova Cloud Console — DESIGN.md)
  - III. Compatibilidade Cross-Framework e SSR-Safety
  - IV. Test-First (TDD) e Contratos Verificáveis
  - V. Governança Spec Kit, Simplicidade e Segurança
- Added sections:
  - Estrutura de Pacotes, Tecnologias e Padrões de Exportação
  - Fluxo de Desenvolvimento e Portões de Qualidade
  - Governance
- Removed sections: None (all template placeholders resolved)
- Follow-up TODOs: None
-->

# Genova Shareds (`New/Shareds`) Constitution

## Core Principles

### I. Arquitetura Híbrida de Pacotes Compartilhados

Todo código compartilhado em `New/Shareds/` entre os frontends `Admin` (AnalogJS/Angular), `ERP` (Next.js/React) e `FactoryFloor` (Nuxt.js/Vue) DEVE ser organizado em pacotes independentes, coesos e sem dependências cruzadas indevidas:

- **`@genovalv/core` (TypeScript puro):** DEVE concentrar exclusivamente lógica agnóstica de framework (validações de entrada, máscaras de CPF/CNPJ/CEP/MFA, formatadores, tipos/contratos e utilitários monetários exatos com `decimal` — nunca `number`/float). NÃO DEVE importar Angular, React, Vue, Lit ou APIs exclusivas do DOM.
- **`@genovalv/tokens` (Design Tokens CSS & Tailwind):** DEVE ser a fonte única de verdade visual (variáveis CSS, paleta semântica, escalas tipográficas, espaçamentos, raios e elevações extraídos do `DESIGN.md`), consumível diretamente por Tailwind CSS v4 e folhas CSS de qualquer framework.
- **`@genovalv/elements` (Web Components em Lit):** DEVE implementar componentes visuais e estruturais autocontidos multi-framework sem acoplamento a stores ou ciclo de formulários de um único framework (ex.: cabeçalho e rodapé institucionais, shell/card de autenticação, badges de status de worker, alertas, toasts, modais de confirmação/aviso e etiquetas QR).
- **Separação de formulários:** validações complexas de formulário, *bind* de `ReactiveForms`/`Signals` (Angular), `Server Actions`/React Hooks (Next.js) e composables/formulários Vue (Nuxt.js) DEVEM permanecer nos apps consumidores ou em adaptadores específicos, consumindo `@genovalv/core` e `@genovalv/tokens`. É PROIBIDO empacotar aplicações Next.js ou Nuxt.js inteiras como Web Components.

### II. Design System Único (Genova Cloud Console)

Todo token e componente visual em `New/Shareds/` DEVE seguir integralmente a especificação `Genova Cloud Console` de `DESIGN.md` e o template HTML de referência aprovado:

- **Paleta semântica:** fundo/canvas `surface` (`#f8f9ff`) e `background` (`#f8f9ff`), cartões e superfícies elevadas `surface-container-lowest` (`#ffffff`), campos/camadas tonais `surface-container-low` (`#eff4ff`) e `surface-container` (`#e5eeff`), texto principal `on-surface` (`#0b1c30`), texto secundário `on-surface-variant` (`#45464d`), marca `primary` (`#000000`) / `primary-container` (`#131b2e`), ação interativa `secondary` (`#0051d5`) / `secondary-container` (`#316bf3`), erro `error` (`#ba1a1a`) / `error-container` (`#ffdad6`), contornos `outline` (`#76777d`) / `outline-variant` (`#c6c6cd`), e indicadores operacionais (`emerald` `#10B981`, `amber` `#F59E0B`, `rose` `#EF4444`).
- **Tipografia:** `Inter` como família principal de interface (com OpenType `cv05`, `cv11` e `tnum` ativos em tabelas, códigos numéricos e métricas) e `JetBrains Mono` (`code-md` 13px, `code-sm` 11px) para códigos MFA, UUIDs, identificadores de tenant, schemas e mensagens técnicas.
- **Espaçamento e formas:** grade base de 4px (`space-xs` 4px, `space-sm` 8px, `space-md` 12px, `space-lg` 16px, `space-xl` 24px) e raios compactos (`0.25rem` / `4px` padrão para inputs, botões e tags; `0.5rem` / `8px` para cards, painéis e modais; `9999px` restrito a badges/pílulas de status).
- **Referência visual obrigatória:** nenhuma nova família de componentes visuais PODE ser criada sem referência visual aprovada (HTML ou PNG, como o `DESIGN.md` e o template de referência da tela de login).

### III. Compatibilidade Cross-Framework e SSR-Safety

Todo artefato exportado por `New/Shareds/` DEVE funcionar de forma previsível nos três frameworks alvo (`AnalogJS`, `Next.js` e `Nuxt.js`), inclusive quando houver Server-Side Rendering (SSR):

- **SSR-Safety:** importações de `@genovalv/core` e `@genovalv/tokens` NÃO PODEM acessar `window` ou `document` no escopo de módulo; o registro `customElements.define(...)` de `@genovalv/elements` DEVE ser seguro contra execução dupla e restrito ao ambiente de browser (`'use client'` no Next.js, `<ClientOnly>` + `isCustomElement` no Nuxt, `CUSTOM_ELEMENTS_SCHEMA` no AnalogJS/Angular).
- **Encapsulamento e eventos:** componentes `@genovalv/elements` DEVEM isolar seus estilos (Shadow DOM com tokens CSS herdados ou `@layer` prefixada) e comunicar ações ao framework pai exclusivamente via propriedades/atributos tipados e `CustomEvent` com `bubbles: true` e `composed: true`.
- **Acessibilidade e interação:** inputs base, botões, alternância de visibilidade de senha, checkboxes e focos DEVEM preservar atributos ARIA, foco visível (`ring-2` em `secondary`) e navegação por teclado.

### IV. Test-First (TDD) e Contratos Verificáveis

O ciclo **Test-First (TDD)** é NÃO NEGOCIÁVEL em `New/Shareds/`:

- **Red-Green-Refactor:** testes unitários e de componente DEVEM ser escritos antes da implementação e falhar antes da escrita do código mínimo que os faz passar.
- **Cobertura:** 100% de cobertura unitária nos módulos puros de `@genovalv/core` (validações, máscaras, formatadores e regras); testes automatizados de renderização, propriedades, acessibilidade e emissão de `CustomEvent` para cada Web Component em `@genovalv/elements`.
- **Builds e tipagem:** todo pacote DEVE compilar com TypeScript estrito (`strict: true`), gerar declarações `.d.ts` válidas e passar no build sem erros antes de ser consumido pelos apps.

### V. Governança Spec Kit, Simplicidade e Segurança

O desenvolvimento em `New/Shareds/` DEVE seguir a disciplina do Spec Kit e as invariantes globais do ecossistema:

- **Regra Zero:** requisitos, props, eventos ou comportamentos ambíguos NÃO PODEM ser presumidos; dúvidas DEVEM ser validadas antes de implementar.
- **Sem segredos nem lógica de negócio indevida:** `New/Shareds/` NÃO DEVE conter tokens, chaves Auth0, credenciais ou regras específicas de domínio exclusivo de um único app; autenticação efetiva e autorização permanecem validadas via Auth0 (JWKS) e servidores dos respectivos apps/backends Go.
- **Autorização explícita:** `git commit`, `git push` e PRs exigem autorização direta do usuário; alterações de código exigem atualização de documentação e `graphify update .` quando aplicável.

## Estrutura de Pacotes, Tecnologias e Padrões de Exportação

- **Workspace:** `New/Shareds/` organiza os pacotes TypeScript (`@genovalv/core`, `@genovalv/tokens`, `@genovalv/elements`), mantendo também a infraestrutura de desenvolvimento local (`docker-compose.yml` com PostgreSQL 17 e volumes em `C:\Docker-Volumes\genova\...`).
- **Consumidores alvo:** `New/Admin/App/genovalv.app.admin` (AnalogJS / Angular 22), `New/Erp/App/genovalv.app.erp` (Next.js 16 / React 19) e `New/FactoryFloor/App/genovalv.app.factoryfloor` (Nuxt.js / Vue 3).
- **Empacotamento:** exports explícitos em `package.json` (`ESM` + tipos `.d.ts`), compatíveis com Vite, Turbopack e Nitro, sem acoplar dependências de runtime de um framework nos demais.

## Fluxo de Desenvolvimento e Portões de Qualidade

1. **Workflow Spec Kit obrigatório:** toda criação ou evolução em `New/Shareds/` DEVE seguir `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → aprovação do usuário → `/speckit-implement`.
2. **Alinhamento ao Design System:** toda spec de UI em `New/Shareds/` DEVE referenciar os tokens de `DESIGN.md` e os templates HTML/PNG aprovados (incluindo o template da tela de login para os componentes base iniciais).
3. **Critério de conclusão:** suíte TDD verde, 100% de cobertura em `@genovalv/core`, build de `@genovalv/tokens` e `@genovalv/elements` validado e verificação de consumo sem erros de SSR/tipagem.

## Governance

Esta Constituição rege exclusivamente o escopo compartilhado em `New/Shareds/` e complementa as regras globais do workspace. Emendas exigem atualização explícita deste arquivo com incremento semântico de versão: **MAJOR** para remoção ou quebra de princípios, **MINOR** para novos princípios/seções ou expansão material, e **PATCH** para refinamentos editoriais. Todo `/speckit-plan`, `/speckit-tasks` e revisão DEVE validar conformidade com os princípios I a V.

**Version**: 1.0.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
