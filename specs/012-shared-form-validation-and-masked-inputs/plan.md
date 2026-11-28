# Implementation Plan: Shared Native Form Validation, Masked Inputs & Search Action (v0.6.0)

**Branch**: `feature/012-shared-form-validation-and-masked-inputs` | **Date**: 2026-11-28 | **Spec**: [spec.md](spec.md)

**Input**: Specification em `specs/012-shared-form-validation-and-masked-inputs/spec.md`

## Summary

1. Isolar no worktree `New/Shareds/worktrees/012-shared-form-validation-and-masked-inputs` (`feature/012-shared-form-validation-and-masked-inputs` a partir de `develop`).
2. Adicionar `formatCpf`, `formatCnpj`, `formatCep`, `isValidCep` e chaves de i18n em `@genovalv/core` (mantendo 100% de cobertura e arquivos `<= 100` linhas).
3. Corrigir validação nativa de formulários (`formAssociated = true` + `ElementInternals.setValidity`/`requestSubmit`) em `GenovaButtonElement`, `GenovaInputElement`, `GenovaSelectElement`, `GenovaTextareaElement` e bloqueio de negativos em `GenovaNumberInputElement`.
4. Implementar `type="search"` (botão-ícone de lupa + `CustomEvent('genova-search')`) e `inputmode="cpf" | "cnpj" | "cep"` (máscara progressiva + bloqueio de não-dígitos e sinal `-`) em `GenovaInputElement`, fatiando `genova-input.ts` em submódulos coesos `<= 100` linhas.
5. Validar via Vitest (`test:coverage`) + Vite build, bumpar versão para `0.6.0`, gerar tarballs `.tgz` em `dist/tarballs/`, atualizar `README.md` e `graphify-out/`.

## Technical Context

**Language/Version**: TypeScript `^5.8.2`, Lit `^3.2.1`
**Testing**: Vitest 3 (`node` no core, `happy-dom` no elements)
**Constraints**: `<= 100` linhas/arquivo, 100% cobertura unitária no `@genovalv/core`, zero acesso a DOM no `@genovalv/core`, SSR-safe em `@genovalv/elements`, nenhuma operação Git destrutiva ou commit/push/PR sem autorização explícita.

## Constitution Check

- **I. Arquitetura Híbrida & TS Compartilhado:** Máscaras e `isValidCep` vivem puras em `@genovalv/core`; componentes visuais e `ElementInternals` ficam isolados em `@genovalv/elements`. **PASS**
- **III. SSR-Safety:** Todo acesso a `attachInternals` e eventos é guardado por runtime checks sem tocar `window`/`document` no escopo de módulo. **PASS**
- **IV. TDD & Limite de 100 Linhas:** Split de `genova-input.ts` (305 → módulos `<= 100` linhas) e split limpo de `login-translations.ts` se necessário; testes escritos antes do código. **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/012-shared-form-validation-and-masked-inputs/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code Affected (`New/Shareds/`)

```text
packages/
├── core/
│   ├── src/
│   │   ├── domain/
│   │   │   ├── constants/login-translations.ts        # + chaves validation.* e auth.searchAction (split se > 100 linhas)
│   │   │   ├── dtos/login-translation-key.dto.ts
│   │   │   └── validators/format-document-mask.ts     # Novo: formatCpf, formatCnpj, formatCep, isValidCep
│   │   └── index.ts
│   └── tests/
│       └── document-mask-and-cep.test.ts              # Novo: TDD 100% cobertura
└── elements/
    ├── src/components/
    │   ├── actions/genova-button.ts                   # formAssociated + requestSubmit / reset + min-height: 34.5px; width: 100%
│   │   ├── genova-action-button.ts                    # + min-height: 34.5px (split se > 100 linhas)
    │   ├── selection/genova-select.ts                 # formAssociated + required + error + setValidity
    │   ├── forms/genova-textarea.ts                   # formAssociated + required + error + setValidity
    │   ├── forms/genova-number-input.ts               # Bloqueio de negativos quando min >= 0
    │   └── input/ (ou genova-input.*)                 # Split <= 100 linhas: styles, helpers (mask/validity/icons) & element
    └── tests/
        ├── us4.form-controls.test.ts                  # Atualiza e estende validação nativa + genova-select/button
        └── input-search-masks.test.ts                 # Novo: TDD type="search" + inputmode="cpf|cnpj|cep"
```
