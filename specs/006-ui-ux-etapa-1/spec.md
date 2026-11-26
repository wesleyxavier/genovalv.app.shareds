# Feature Specification: 006-ui-ux-etapa-1

**Feature Branch**: `006-ui-ux-etapa-1`  
**Created**: 2026-11-26  
**Status**: Draft (Aguardando aprovação)  
**Design Source**: `C:\Users\User\Downloads\genova-etapa1` (`componentes/00..07.svg` + `logo/*.svg`)

## Overview

Evoluir o Design System compartilhado (`@genovalv/tokens`, `@genovalv/elements`, `@genovalv/playground` Storybook) para a **UI/UX Etapa 1**, adotando a nova identidade visual (`#FAF7F0` creme, `#715faf` roxo Genova, `#E7E2D8` bordas, fonte **Plus Jakarta Sans** e novos logos SVG) e implementando o catálogo completo de **46 componentes Web Components (Lit 3)** com stories interativas no Storybook.

## Visual Foundations & Typography (`00-fundamentos.svg`)

- **Fonte da aplicação:** `Plus Jakarta Sans` (`--gnv-font-sans`) com fallback `system-ui, sans-serif`.
- **Paleta extraída de `00-fundamentos.svg`:**
  - Superfícies: `--gnv-surface: #FAF7F0`, `--gnv-surface-container-lowest: #FFFFFF`, `--gnv-surface-container: #EEEBE4`, `--gnv-outline-variant: #E7E2D8`
  - Marca / Primário: `--gnv-primary: #715faf`, `--gnv-primary-hover: #3E2F73`, `--gnv-primary-active: #31255C`, `--gnv-primary-tint: #F1EEFC`, `--gnv-primary-border: #CFC4F5`, `--gnv-primary-focus: #8E7CD8`
  - Texto: `--gnv-on-surface: #0F172A`, `--gnv-on-surface-variant: #475569`, `--gnv-text-muted: #64748B`
  - Semânticas: Success (`#3FA37C` / `#E6F5EE` / `#1F5C4A`), Warning (`#92400E` / `#FEF3C7`), Danger (`#BC3737` / `#FEF2F2`), Info (`#2F4A8C`)
- **Logos:** Incorporar os 7 SVGs de `logo/` (`genova-cabecalho.svg`, `genova-cabecalho-escuro.svg`, `genova-cloud-horizontal.svg`, `genova-cloud-horizontal-escuro.svg`, `genova-simbolo.svg`, `genova-simbolo-reduzido.svg`, `genova-logo-prancha.svg`).

## Component Catalog (46 Componentes no Storybook)

1. **00 — Fundamentos & Primitivos:** `Box`, `PseudoBox`, `ControlBox`, `Divider`, `Heading`, `Icons`, `Image`
2. **01 — Ações:** `Button`, `ButtonGroup`, `CloseButton`, `IconButton`, `Link`
3. **02 — Formulários:** `Input`, `InputGroup`, `NumberInput`, `Textarea`, `Editable`, `FormControl`
4. **03 — Seleção:** `Checkbox`, `CheckboxGroup`, `Radio`, `RadioButtonGroup`, `Select`, `Switch`, `Slider`
5. **04 — Navegação:** `Breadcrumb`, `Tabs`, `Menu`, `Accordion`, `Collapse`
6. **05 — Feedback:** `Alert`, `CircularProgress`, `Progress`, `Skeleton`, `Spinner`, `Toast`
7. **06 — Sobreposições:** `AlertDialog`, `Drawer`, `Modal`, `Tooltip`
8. **07 — Dados:** `Avatar`, `Badge`, `List`, `Stats`, `Table`, `Tag`

## Requirements

- **FR-001**: Todos os 46 componentes devem ser implementados como Web Components Lit 3 SSR-safe em `packages/elements/src/components/` com prefixo `genova-*` (ex.: `<genova-button>`, `<genova-modal>`, `<genova-table>`) e registrados em `registerGenovaElements()`.
- **FR-002**: Manter compatibilidade com os componentes de autenticação existentes (`genova-auth-shell`, `genova-auth-card`, `genova-header`, `genova-footer`, `genova-action-button`, `genova-alert-banner`, `genova-mfa-selector`, `genova-locale-selector`, `genova-input`, `genova-checkbox`) atualizados para os novos tokens e fonte `Plus Jakarta Sans`.
- **FR-003**: Cada grupo (`00` a `07`) deve possuir stories organizadas no Storybook (`playground/src/stories/etapa1/`), com `controls`/`argTypes` para todas as variantes e estados.
- **FR-004**: Cobertura de testes unitários/DOM em `@genovalv/elements` (Vitest + jsdom) e validação de acessibilidade (`role`, `aria-*`, foco/teclado em Modal/Drawer/AlertDialog/Tabs/Accordion/Menu).
- **FR-005**: Empacotar `.tgz` atualizados de `@genovalv/tokens` e `@genovalv/elements` ao final (consumo futuro por Admin, ERP e FactoryFloor).
