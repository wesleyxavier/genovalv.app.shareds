# Quickstart Validation Guide: Shared Login Foundation

**Feature**: `001-shared-login-foundation`
**Scope**: `New/Shareds/`

## 1. Prerequisites

- Node.js `>= 22.x` e npm `>= 11.x`
- Navegadores do Playwright instalados para E2E (`npx playwright install chromium`)

## 2. Setup & Build

A partir da pasta `New/Shareds/`:

```powershell
npm install
npm run build
```

**Expected outcome:** `@genovalv/core`, `@genovalv/tokens` e `@genovalv/elements` compilam sem erros gerando seus respectivos diretórios `dist/` e arquivos `.d.ts`.

## 3. Unit & Component Tests (Vitest)

```powershell
npm run test:unit
```

**Expected outcome:**
- `@genovalv/core`: 100% de cobertura em funções puras (`normalizeEmail`, `validateEmail`, `validatePassword`, `sanitizeMfaCode`, `validateMfaCode`, `validateLoginSubmission`, `getMfaGuidance`, `createTranslator` com `pt-BR`/`en-US`/`es-ES` e fallback).
- `@genovalv/elements`: todos os testes de renderização, atributos, troca de `locale`, eventos (`bubbles: true, composed: true`) e importação SSR-safe em Node aprovados.

## 4. Visual Inspection (`playground/`)

```powershell
npm run preview
```

**Expected outcome:**
- Servidor local abre a tela de login de referência (`Genova Cloud — Admin Console • Acesso Restrito`) montada exclusivamente com `@genovalv/tokens` + `@genovalv/core` + `@genovalv/elements`.
- Conferência visual frente ao `DESIGN.md`: paleta `#f8f9ff`/`#ffffff`/`#0051d5`, fontes `Inter`/`JetBrains Mono`, botões/inputs `0.25rem` (`4px`), card `0.5rem` (`8px`), alternância de visibilidade de senha e feedback de validação/envio.

## 5. End-to-End Tests (Playwright)

```powershell
npm run test:e2e
```

**Expected outcome:**
- Todos os cenários E2E passam em Chromium headless nos viewports desktop (`1280x800`) e mobile (`390x844`):
  - Fluxo completo via teclado (`Tab` / `Enter` / `Espaço`) sem armadilhas de foco;
  - Bloqueio de e-mail inválido, senha vazia e código MFA incompleto;
  - Higienização de colagem no campo MFA (`"123 456"` → `"123456"`);
  - Alternância de visibilidade da senha e estado de carregamento bloqueando duplo clique;
  - Preservação do e-mail ao simular erro de autenticação e confirmação visual ao simular sucesso;
  - Ausência de rolagem horizontal em desktop e mobile.

## 6. Contracts & Data Model References

- Entidades e máquina de estados: [data-model.md](data-model.md)
- API `@genovalv/core`: [contracts/core-api.md](contracts/core-api.md)
- Tokens `@genovalv/tokens`: [contracts/tokens-api.md](contracts/tokens-api.md)
- Web Components `@genovalv/elements`: [contracts/elements-api.md](contracts/elements-api.md)
