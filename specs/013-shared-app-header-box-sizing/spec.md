# Feature Specification: Shared App Header Box-Sizing & Viewport Width Fix (v0.6.1)

**Feature Branch**: `feature/013-shared-app-header-box-sizing`

**Created**: 2026-11-28

**Status**: Draft (Aguardando aprovação)

**Input**: Corrigir overflow horizontal (> 100% da largura) no `<genova-app-header>` causado por `.bar { width: 100%; padding: 0 1.25rem; }` sem `box-sizing: border-box` nem `etapa1BaseStyles` em `GenovaAppHeaderElement`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Conter `<genova-app-header>` em `100%` da Largura (Priority: P1)

Como usuário de qualquer portal consumidor (`Admin`, `ERP`, `FactoryFloor`), quero que `<genova-app-header>` respeite `box-sizing: border-box` em seu Shadow DOM (incluindo `.bar`) para que a barra de navegação nunca ultrapasse `100%` da largura da viewport nem corte o botão de avatar no canto direito.

**Why this priority**: Elimina barra de rolagem horizontal e o corte visual do menu de usuário em resoluções desktop/mobile.

**Independent Test**: Teste unitário em `packages/elements/tests/app-header.test.ts` validando presença de `box-sizing: border-box` via `etapa1BaseStyles` / `appHeaderLayoutStyles` e integridade do header renderizado.

**Acceptance Scenarios**:

1. **Given** `GenovaAppHeaderElement` montado, **When** inspecionados os estilos aplicados ao Shadow DOM (`.bar` e filhos), **Then** `etapa1BaseStyles` e `box-sizing: border-box` estão incluídos para que `width: 100%; padding: 0 1.25rem;` não exceda `100%`.
2. **Given** `npm run build` e `npm run test:unit` no `New/Shareds`, **When** executados, **Then** passam 100% e os tarballs `0.6.1` são gerados em `dist/tarballs/`.

## Requirements *(mandatory)*

- **FR-001**: Incluir `etapa1BaseStyles` em `GenovaAppHeaderElement.styles` (`packages/elements/src/components/navigation/app-header/genova-app-header.ts`) e `box-sizing: border-box;` explícito em `.bar` (`genova-app-header.styles.ts`).
- **FR-002**: Adicionar asserção em `packages/elements/tests/app-header.test.ts`, bumpar versão `0.6.0 → 0.6.1`, atualizar `README.md`, empacotar `.tgz` em `dist/tarballs/` e atualizar `graphify-out/`.

## Success Criteria *(mandatory)*

- **SC-001**: `<genova-app-header>` aplica `box-sizing: border-box` na `.bar` sem overflow além de `100%`.
- **SC-002**: `npm run build` e `npm run test:coverage` passam sem erros e tarballs `0.6.1` são gerados.
