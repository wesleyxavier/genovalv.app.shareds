# Implementation Plan: Shared App Header Box-Sizing & Viewport Width Fix (v0.6.1)

**Branch**: `feature/013-shared-app-header-box-sizing` | **Date**: 2026-11-28 | **Spec**: [spec.md](spec.md)

## Summary

1. Criar worktree `New/Shareds/worktrees/013-shared-app-header-box-sizing` (`feature/013-shared-app-header-box-sizing` a partir de `develop`).
2. Adicionar teste em `packages/elements/tests/app-header.test.ts` (TDD Red), incluir `etapa1BaseStyles` em `GenovaAppHeaderElement` e `box-sizing: border-box` em `.bar` (`genova-app-header.styles.ts`).
3. Validar `npm run build` e `npm run test:coverage`, atualizar `README.md`, bumpar SemVer `0.6.0 → 0.6.1`, gerar `.tgz` em `dist/tarballs/` e abrir PR para `develop` após autorização.

## Technical Context

**Language/Version**: TypeScript `^5.8.2`, Lit `^3.2.1`
**Testing**: Vitest 3 (`happy-dom`)
**Constraints**: `<= 100` linhas/arquivo, TDD, sem commit/push/PR sem autorização explícita.
