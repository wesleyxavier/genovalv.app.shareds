---
description: "Task list for 001-shared-login-foundation (New/Shareds)"
---

# Tasks: Shared Login Foundation & Base Components

**Input**: Design documents from `specs/001-shared-login-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Obrigatórios (TDD conforme Princípio IV da Constituição de `New/Shareds/`: `Vitest` 100% em `@genovalv/core`, DOM + SSR-safety em `@genovalv/elements`, `Playwright` E2E sobre `playground/`).

**Organization**: Organizado por fase e User Story (`US1`–`US4`) com marcos de commit/push após cada grupo (sempre mediante autorização explícita do usuário).

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependência pendente)
- **[Story]**: User Story atendida (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Todos os caminhos são relativos a `New/Shareds/`

---

## 0. Branch

- [ ] T001 Create worktree at `worktrees/feature/001-shared-login-foundation` from base `develop` using skill `openspec-worktree`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar o monorepo `npm workspaces` em `New/Shareds/` com pacotes `core`, `tokens`, `elements`, sandbox `playground/` e ferramentas de build/teste.

- [X] T002 Create root workspace manifest with scripts (`build`, `test:unit`, `test:coverage`, `preview`, `test:e2e`) in `package.json`
- [X] T003 [P] Create strict shared TypeScript configuration (`strict: true`, target `ES2022`, `moduleResolution: "bundler"`) in `tsconfig.base.json`
- [X] T004 [P] Initialize `@genovalv/core` package manifest and TypeScript config in `packages/core/package.json` and `packages/core/tsconfig.json`
- [X] T005 [P] Initialize `@genovalv/tokens` package manifest exposing CSS entrypoints (`./tokens.css`, `./tailwind.css`) in `packages/tokens/package.json`
- [X] T006 [P] Initialize `@genovalv/elements` package manifest, TypeScript config and Vite library build config (`lit` v3, `happy-dom`, `vitest`) in `packages/elements/package.json`, `packages/elements/tsconfig.json` and `packages/elements/vite.config.ts`
- [X] T007 [P] Initialize `playground` Vite app manifest and Playwright config (desktop `1280x800` and mobile `390x844` Chromium) in `playground/package.json` and `playwright.config.ts`
- [X] T008 Install workspace dependencies via `npm install` and verify Playwright Chromium availability in `New/Shareds/`

### 1.1 Commit Group 1

- [ ] T009 Commit and push Setup structure to `feature/001-shared-login-foundation` (requires explicit user confirmation)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de tipos, dicionários i18n (`pt-BR`, `en-US`, `es-ES`), tokens visuais do `DESIGN.md` e registro SSR-safe que bloqueiam todas as User Stories.

**⚠️ CRITICAL**: Nenhuma implementação de User Story começa antes da conclusão desta fase.

### Tests First (TDD)

- [X] T010 [P] Write failing unit tests for `DEFAULT_LOCALE`, `LOGIN_TRANSLATIONS` (`pt-BR`, `en-US`, `es-ES`) and `createTranslator` (automatic fallback to `pt-BR`, overrides, `{param}` interpolation) in `packages/core/tests/i18n.translator.test.ts`
- [X] T011 [P] Write failing unit tests for `DEFAULT_LOGIN_CONTEXT` constraints (`brandName: "Genova"`, `mfaMode: "optional"`, `rememberDeviceDays: 30`, `supportLinks`, `footerLinks`) in `packages/core/tests/auth.context.test.ts`

### Implementation

- [X] T012 [P] Create public types (`SupportedLocale`, `MfaMode`, `MfaMethod`, `SubmissionState`, `LoginTranslationKey`, `LoginDictionary`, `LoginLink`, `LoginContextConfiguration`, `LoginRawInput`, `LoginSubmissionInput`, `LoginFieldName`, `LoginValidationResult`, `MfaGuidance`) per `contracts/core-api.md` in `packages/core/src/auth/types.ts`
- [X] T013 [P] Implement `DEFAULT_LOCALE`, `LOGIN_TRANSLATIONS` (`pt-BR`, `en-US`, `es-ES`) and `createTranslator` in `packages/core/src/i18n/locales.ts` and `packages/core/src/i18n/translator.ts` (depends on T010, T012)
- [X] T014 [P] Implement `DEFAULT_LOGIN_CONTEXT` in `packages/core/src/auth/context.ts` (depends on T011, T012)
- [X] T015 [P] Create semantic CSS custom properties (`--gnv-surface: #f8f9ff`, `--gnv-surface-container-lowest: #ffffff`, `--gnv-surface-container-low: #eff4ff`, `--gnv-on-surface: #0b1c30`, `--gnv-secondary: #0051d5`, `--gnv-secondary-container: #316bf3`, `--gnv-error: #ba1a1a`, `Inter` + `JetBrains Mono`, 4px spacing scale, `0.25rem`/`0.5rem`/`9999px` radii) and native input/checkbox/dot-grid recipes in `packages/tokens/src/tokens.css`
- [X] T016 [P] Create Tailwind CSS v4 `@theme` mapping matching `contracts/tokens-api.md` in `packages/tokens/src/tailwind.css`
- [X] T017 Create SSR-safe custom element registration helper (`typeof window !== 'undefined' && typeof customElements !== 'undefined' && !customElements.get(tag)`) in `packages/elements/src/register.ts` and write failing Node SSR import test in `packages/elements/tests/elements.ssr.test.ts`

### 2.1 Commit Group 2

- [ ] T018 Commit and push Foundational tokens, i18n and SSR-safe registry to `feature/001-shared-login-foundation` (requires explicit user confirmation)

**Checkpoint**: Fundação pronta — as User Stories (`US1`–`US4`) já podem ser implementadas e validadas incrementalmente.

---

## Phase 3: User Story 1 - Estrutura Institucional e Identidade Visual de Autenticação (Priority: P1) 🎯 MVP

**Goal**: Entregar a casca visual padrão da tela de autenticação (`<genova-auth-shell>`, `<genova-header>`, `<genova-footer>`, `<genova-auth-card>`) fiel ao `DESIGN.md` e ao template HTML de referência, com suporte a `locale` e personalização contextual por portal.

**Independent Test**: Renderizar os Web Components estruturais no `playground/` sem backend ativo e verificar em Chromium desktop (`1280x800`) e mobile (`390x844`) a presença do cabeçalho com selo "Ambiente Seguro", cartão centralizado, links configuráveis, rodapé e zero rolagem horizontal.

### Tests for User Story 1 (TDD)

> **NOTE: Escrever estes testes PRIMEIRO e garantir que FALHEM antes da implementação**

- [X] T019 [P] [US1] Write failing DOM/Shadow DOM tests for `<genova-header>`, `<genova-footer>`, `<genova-auth-card>` and `<genova-auth-shell>` (`brand-name`, `brand-suffix`, `badge-text`, `portal-title`, `portal-subtitle`, `locale`, `support-links`, `footer-links`, `genova-link-click` composed event) in `packages/elements/tests/us1.shell.test.ts`
- [X] T020 [P] [US1] Write failing Playwright E2E tests for US1 visual shell layout, configurable context texts, locale switching (`pt-BR` vs `en-US`) and zero horizontal overflow at `1280x800` and `390x844` in `playground/e2e/login-foundation.spec.ts`

### Implementation for User Story 1

- [X] T021 [P] [US1] Implement `<genova-header>` Lit component (`brand-name`, `brand-suffix`, `badge-text`, `locale`, slots `icon` and `actions`) in `packages/elements/src/components/genova-header.ts`
- [X] T022 [P] [US1] Implement `<genova-footer>` Lit component (`copyright-text`, `links`, `locale`, `genova-link-click` `CustomEvent` with `bubbles: true, composed: true`) in `packages/elements/src/components/genova-footer.ts`
- [X] T023 [P] [US1] Implement `<genova-auth-card>` Lit component (`portal-title`, `portal-subtitle`, `support-links`, `locale`, slots `default`, `icon`, `feedback`) in `packages/elements/src/components/genova-auth-card.ts`
- [X] T024 [US1] Implement `<genova-auth-shell>` Lit component composing dot-grid background, `<genova-header>`, centered `<main>` slot and `<genova-footer>` in `packages/elements/src/components/genova-auth-shell.ts` (depends on T021, T022)
- [X] T025 [US1] Create initial `playground/index.html` and `playground/src/main.ts` rendering `<genova-auth-shell>` and `<genova-auth-card>` styled with `@genovalv/tokens`

### 3.1 Commit Group 3

- [ ] T026 Commit and push US1 shell and structural components to `feature/001-shared-login-foundation` (requires explicit user confirmation)

**Checkpoint**: US1 (MVP visual) totalmente funcional e testável de forma independente no `playground/`.

---

## Phase 4: User Story 2 - Entrada de Credenciais, Alternância de Senha e Feedback de Submissão (Priority: P1)

**Goal**: Entregar validação e normalização de credenciais (`email`, `password`), controle de botão com proteção contra duplo clique (`<genova-action-button>`) e banner acessível de erro/sucesso (`<genova-alert-banner>`), integrados no `playground/` com alternância de visibilidade da senha e opção de lembrar dispositivo por 30 dias.

**Independent Test**: Testar no Vitest a validação/normalização de e-mail e senha em `pt-BR`/`en-US`/`es-ES`, o bloqueio de cliques no `<genova-action-button>` em estado `validating`, e validar via Playwright no `playground/` a alternância de senha, bloqueio de entrada inválida, sucesso e erro preservando o e-mail.

### Tests for User Story 2 (TDD)

- [X] T027 [P] [US2] Write failing unit tests for `normalizeEmail` (trim + lowercase), `validateEmail`, `validatePassword` (required without silent trim) and `validateLoginSubmission` (`errors` and `errorKeys` in `pt-BR`/`en-US`/`es-ES`) in `packages/core/tests/auth.validation.test.ts`
- [X] T028 [P] [US2] Write failing DOM/component tests for `<genova-action-button>` (`state: 'idle' | 'validating' | 'success' | 'error'`, blocking `genova-action` event while `validating` or `disabled`) and `<genova-alert-banner>` (`variant`, `message`, `visible`, `role="alert"`) in `packages/elements/tests/us2.feedback.test.ts`
- [X] T029 [P] [US2] Add failing Playwright E2E scenarios for US2 (password visibility toggle, invalid email/empty password blocking, double-submit lock during `validating`, simulated success state, simulated error preserving email) in `playground/e2e/login-foundation.spec.ts`

### Implementation for User Story 2

- [X] T030 [P] [US2] Implement `normalizeEmail`, `validateEmail`, `validatePassword` and `validateLoginSubmission` in `packages/core/src/auth/validation.ts` (depends on T027)
- [X] T031 [P] [US2] Implement `<genova-action-button>` Lit component per `contracts/elements-api.md` in `packages/elements/src/components/genova-action-button.ts` (depends on T028)
- [X] T032 [P] [US2] Implement `<genova-alert-banner>` Lit component per `contracts/elements-api.md` in `packages/elements/src/components/genova-alert-banner.ts` (depends on T028)
- [X] T033 [US2] Wire corporate email input, password input with visibility toggle, "Esqueceu a senha?" link, 30-day remember-device checkbox, `<genova-alert-banner>` and `<genova-action-button>` with simulated submit handler in `playground/index.html` and `playground/src/main.ts`

### 4.1 Commit Group 4

- [ ] T034 Commit and push US2 credential validation, button and alert components to `feature/001-shared-login-foundation` (requires explicit user confirmation)

**Checkpoint**: US1 e US2 operando completas com validação e feedback de submissão.

---

## Phase 5: User Story 3 - Código de Verificação (MFA) e Extensibilidade de Segundo Fator (Priority: P2)

**Goal**: Suportar campo MFA de 6 dígitos com higienização de colagem/formatação e componente extensível `<genova-mfa-selector>` para alternância futura entre TOTP, YubiKey e Biometria com orientações traduzidas.

**Independent Test**: Testar isoladamente no Vitest `sanitizeMfaCode` (`"123 456"` → `"123456"`), `validateMfaCode` para os modos `'hidden' | 'optional' | 'required'` e `getMfaGuidance` nos 3 idiomas, além de validar no Playwright a digitação/colagem no campo MFA e troca de método no `<genova-mfa-selector>`.

### Tests for User Story 3 (TDD)

- [X] T035 [P] [US3] Write failing unit tests for `sanitizeMfaCode` (digits only, max 6 chars), `formatMfaCodeDisplay`, `validateMfaCode` (`'hidden' | 'optional' | 'required'`) and `getMfaGuidance` (`'totp' | 'yubikey' | 'biometric'` across `pt-BR`/`en-US`/`es-ES`) in `packages/core/tests/auth.mfa.test.ts`
- [X] T036 [P] [US3] Write failing DOM/component tests for `<genova-mfa-selector>` (`selected-method`, `locale`, `genova-mfa-method-change` composed event with `{ method, guidance }`) in `packages/elements/tests/us3.mfa.test.ts`
- [X] T037 [P] [US3] Add failing Playwright E2E scenarios for US3 (pasting `"123 456"` and non-numeric chars into MFA input, max 6 digits, optional vs required MFA validation, switching MFA method updates guidance) in `playground/e2e/login-foundation.spec.ts`

### Implementation for User Story 3

- [X] T038 [P] [US3] Implement `MFA_GUIDANCE_MAP`, `sanitizeMfaCode`, `formatMfaCodeDisplay`, `validateMfaCode` and `getMfaGuidance` in `packages/core/src/auth/mfa.ts` and integrate MFA validation into `packages/core/src/auth/validation.ts` (depends on T035)
- [X] T039 [P] [US3] Implement `<genova-mfa-selector>` Lit component per `contracts/elements-api.md` in `packages/elements/src/components/genova-mfa-selector.ts` (depends on T036)
- [X] T040 [US3] Wire 6-digit `JetBrains Mono` MFA input (sanitizing on input/paste) and configurable `<genova-mfa-selector>` preview toggle in `playground/index.html` and `playground/src/main.ts`

### 5.1 Commit Group 5

- [ ] T041 Commit and push US3 MFA rules and `<genova-mfa-selector>` to `feature/001-shared-login-foundation` (requires explicit user confirmation)

**Checkpoint**: US3 completa e validada unitariamente e em E2E.

---

## Phase 6: User Story 4 - Regras Compartilhadas, Acessibilidade e Exportação Unificada (Priority: P2)

**Goal**: Consolidar barrels públicos (`@genovalv/core` e `@genovalv/elements`), garantir 100% de acessibilidade por teclado, troca dinâmica de idioma (`pt-BR` / `en-US` / `es-ES`) e compatibilidade SSR estrita em Node.

**Independent Test**: Importar os barrels compilados em Node puro sem DOM (passando no SSR), percorrer 100% dos controles do `playground/` somente via teclado no Playwright e alternar entre os 3 idiomas verificando tradução imediata e fallback.

### Tests for User Story 4 (TDD)

- [X] T042 [P] [US4] Add failing Playwright E2E tests for full keyboard-only traversal (`Tab`, `Shift+Tab`, `Space`, `Enter`), visible focus indicators and live locale switching (`pt-BR` ↔ `en-US` ↔ `es-ES`) in `playground/e2e/login-foundation.spec.ts`
- [X] T043 [P] [US4] Expand SSR Node test importing full `@genovalv/elements` barrel without `window`/`document` and asserting idempotent `registerGenovaElements()` in `packages/elements/tests/elements.ssr.test.ts`

### Implementation for User Story 4

- [X] T044 [P] [US4] Expose complete public API barrels and `registerGenovaElements()` in `packages/core/src/index.ts` and `packages/elements/src/index.ts`
- [X] T045 [US4] Audit and refine ARIA attributes (`aria-invalid`, `aria-describedby`, `locale`-aware `aria-label`), focus rings (`secondary` `#0051d5`) and keyboard activation across `packages/tokens/src/tokens.css` and `packages/elements/src/components/*.ts`

### 6.1 Commit Group 6

- [ ] T046 Commit and push US4 accessibility, barrels and SSR hardening to `feature/001-shared-login-foundation` (requires explicit user confirmation)

---

## Phase 7: Pre-PR Checklist & Full Validation

**Purpose**: Validar todos os portões de qualidade da Constituição (`100%` cobertura no `core`, build ESM + `.d.ts`, E2E Playwright) e preparar documentação/grafo antes do PR.

- [X] T047 Run full `npm run build`, `npm run test:coverage` (verifying 100% coverage in `@genovalv/core`) and `npm run test:e2e` per `specs/001-shared-login-foundation/quickstart.md`
- [X] T048 Update `New/Shareds/README.md` documenting `@genovalv/core`, `@genovalv/tokens`, `@genovalv/elements`, `playground/` and test/build commands
- [ ] T049 Run `graphify update .` to synchronize the knowledge graph

---

## Phase 8: Create PR

- [ ] T050 Commit final changes, push branch `feature/001-shared-login-foundation` and create PR (`source: feature/001-shared-login-foundation`, `target: develop`) via MCP (requires explicit user confirmation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Branch (`0`)**: Sem dependências — executar primeiro.
- **Setup (`Phase 1`)**: Depende de `0` — inicializa workspaces e dependências.
- **Foundational (`Phase 2`)**: Depende de `Phase 1` — **BLOQUEIA** todas as User Stories (`US1`–`US4`).
- **User Stories (`Phase 3`–`Phase 6`)**: Dependem de `Phase 2`.
  - `US1 (P1)` → base visual estrutural no `playground/`
  - `US2 (P1)` → depende da estrutura de `US1` apenas para integração no `playground/`, mas os módulos `core/validation` e `elements/action-button` + `alert-banner` são independentes
  - `US3 (P2)` → estende validação e `playground/` com MFA
  - `US4 (P2)` → consolida barrels públicos, acessibilidade e testes integrados finais
- **Pre-PR (`Phase 7`) & PR (`Phase 8`)**: Dependem da conclusão das User Stories desejadas.

### Parallel Opportunities

- Em `Phase 1`: `T003`, `T004`, `T005`, `T006`, `T007` rodam em paralelo.
- Em `Phase 2`: `T010`–`T016` (testes TDD, tipos, tokens CSS, `@theme`) rodam em paralelo por pacote.
- Em cada User Story (`US1`–`US4`): testes TDD (`Vitest` + `Playwright`) rodam em paralelo antes da implementação; componentes Lit independentes (`genova-header`, `genova-footer`, `genova-auth-card`, `genova-action-button`, `genova-alert-banner`, `genova-mfa-selector`) rodam em paralelo.

---

## Parallel Example: User Story 1

```text
# 1. Testes TDD em paralelo (devem falhar antes da implementação):
T019 [P] [US1] packages/elements/tests/us1.shell.test.ts
T020 [P] [US1] playground/e2e/login-foundation.spec.ts

# 2. Componentes Lit independentes em paralelo:
T021 [P] [US1] packages/elements/src/components/genova-header.ts
T022 [P] [US1] packages/elements/src/components/genova-footer.ts
T023 [P] [US1] packages/elements/src/components/genova-auth-card.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Concluir `0. Branch` + `Phase 1 (Setup)` + `Phase 2 (Foundational)`.
2. Concluir `Phase 3 (US1)` → validar layout e tokens no `playground/`.
3. Concluir `Phase 4 (US2)` → fluxo completo de login (e-mail, senha com olhinho, lembrar 30 dias, validação, loading/erro/sucesso).
4. **STOP and VALIDATE**: Rodar `npm run test:unit` + `npm run test:e2e`.

### Incremental Delivery

1. Setup + Foundational → `core` (i18n/tipos) + `tokens` prontos.
2. `+ US1` → casca institucional responsiva.
3. `+ US2` → credenciais e submissão com feedback.
4. `+ US3` → MFA 6 dígitos e seletor extensível de segundo fator.
5. `+ US4` → barrels finais, teclado/ARIA completo e SSR-safety verificado.
6. Pre-PR (`README.md` + `graphify update .`) → PR.
