# Implementation Plan: 006-ui-ux-etapa-1

## Architecture & Packages (`New/Shareds`)
- **`@genovalv/tokens`**:
  - Atualizar `src/tokens.css` e `src/tailwind.css` com a paleta Etapa 1 (`#FAF7F0`, `#4C3A8A`, `#E7E2D8`, etc.) e fonte `Plus Jakarta Sans`.
  - Adicionar `src/assets/logo/*.svg` com os 7 SVGs oficiais da marca.
- **`@genovalv/elements`**:
  - Estrutura modular por categoria em `packages/elements/src/components/`:
    - `primitives/` (`genova-box`, `genova-pseudo-box`, `genova-control-box`, `genova-divider`, `genova-heading`, `genova-icon`, `genova-image`)
    - `actions/` (`genova-button`, `genova-button-group`, `genova-close-button`, `genova-icon-button`, `genova-link`)
    - `forms/` (`genova-input-group`, `genova-number-input`, `genova-textarea`, `genova-editable`, `genova-form-control` + `genova-input` atualizado)
    - `selection/` (`genova-checkbox-group`, `genova-radio`, `genova-radio-button-group`, `genova-select`, `genova-switch`, `genova-slider` + `genova-checkbox` atualizado)
    - `navigation/` (`genova-breadcrumb`, `genova-tabs`, `genova-menu`, `genova-accordion`, `genova-collapse`)
    - `feedback/` (`genova-alert`, `genova-circular-progress`, `genova-progress`, `genova-skeleton`, `genova-spinner`, `genova-toast`)
    - `overlays/` (`genova-alert-dialog`, `genova-drawer`, `genova-modal`, `genova-tooltip`)
    - `data/` (`genova-avatar`, `genova-badge`, `genova-list`, `genova-stats`, `genova-table`, `genova-tag`)
- **`@genovalv/playground` (Storybook)**:
  - Carregar `Plus Jakarta Sans` em `.storybook/preview-head.html` e configurar tema Storybook com logo Genova.
  - Criar stories organizadas por categoria (`00-Fundamentos`, `01-Acoes`, `02-Formularios`, `03-Selecao`, `04-Navegacao`, `05-Feedback`, `06-Sobreposicoes`, `07-Dados`).
