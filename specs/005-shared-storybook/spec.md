# Feature Specification: 005-shared-storybook

**Feature Branch**: `005-shared-storybook`  
**Created**: 2026-11-26  
**Status**: Draft (Aguardando aprovação)

## Overview

Substituir o playground Vite manual em `playground/` pelo **Storybook (`@storybook/web-components-vite`)** para documentar, testar visualmente e interagir com todos os Web Components Lit do `@genovalv/elements` e tokens CSS do `@genovalv/tokens` + helpers de `@genovalv/core`, mantendo os testes E2E Playwright (`playground/e2e/login-foundation.spec.ts`) executando sobre o Storybook estático (`iframe.html`).

## User Scenarios

- **US1 — Catálogo de Stories de Componentes (`@genovalv/elements`):** Stories isoladas para cada componente (`genova-auth-shell`, `genova-header`, `genova-footer`, `genova-auth-card`, `genova-input`, `genova-checkbox`, `genova-action-button`, `genova-alert-banner`, `genova-mfa-selector`, `genova-locale-selector`) com controles interativos (args/argTypes) e `tokens.css` aplicados globalmente.
- **US2 — Story Composta de Login (`LoginFoundation`):** Story completa reproduzindo o fluxo de login (com `outcome=error|success`, validação de `@genovalv/core`, troca de idioma `pt-BR`/`en-US`/`es-ES` e toggle de senha) para inspeção e testes E2E.
- **US3 — E2E Playwright sobre Storybook:** `playground/e2e/login-foundation.spec.ts` e `playwright.config.ts` adaptados para subir o Storybook buildado (porta `6006` ou `4173`) e validar todos os cenários existentes via `iframe.html?id=...`.

## Requirements
- **FR-001**: Usar `@storybook/web-components-vite` em `playground/` (mantendo `@genovalv/shareds` agnóstico de Angular/React/Vue).
- **FR-002**: Registrar `registerGenovaElements()` e importar `@genovalv/tokens/tokens.css` em `playground/.storybook/preview.ts`.
- **FR-003**: Scripts no `playground/package.json` (`dev` → `storybook dev -p 6006`, `build` → `storybook build`, `preview` → servir `storybook-static` na porta `4173`) e atualizar `README.md`.
- **FR-004**: Remover `playground/index.html` e `playground/src/main.ts` após migração das stories.
