# Contract: `@genovalv/tokens` Visual Tokens & Form Recipes

**Package**: `@genovalv/tokens`
**Source of Truth**: `DESIGN.md` (`Genova Cloud Console`) + Login HTML Reference

## Exported Entrypoints

- `@genovalv/tokens/tokens.css` — CSS Custom Properties (`:root`), classes base de fundo/tipografia e receitas CSS reutilizáveis para inputs nativos (`.genova-field`, `.genova-label`, `.genova-input`, `.genova-input-icon`, `.genova-checkbox`, `.genova-dot-grid`).
- `@genovalv/tokens/tailwind.css` — Definições `@theme` para Tailwind CSS v4 expondo as mesmas cores, fontes, tamanhos, espaçamentos e raios.

## Required CSS Variables (`tokens.css`)

- **Surfaces & Backgrounds:**
  - `--gnv-surface: #f8f9ff`
  - `--gnv-surface-dim: #cbdbf5`
  - `--gnv-surface-bright: #f8f9ff`
  - `--gnv-surface-container-lowest: #ffffff`
  - `--gnv-surface-container-low: #eff4ff`
  - `--gnv-surface-container: #e5eeff`
  - `--gnv-surface-container-high: #dce9ff`
  - `--gnv-surface-container-highest: #d3e4fe`
  - `--gnv-background: #f8f9ff`
- **Text & Outlines:**
  - `--gnv-on-surface: #0b1c30`
  - `--gnv-on-surface-variant: #45464d`
  - `--gnv-outline: #76777d`
  - `--gnv-outline-variant: #c6c6cd`
- **Brand & Interactive Accents:**
  - `--gnv-primary: #000000`
  - `--gnv-on-primary: #ffffff`
  - `--gnv-primary-container: #131b2e`
  - `--gnv-on-primary-container: #7c839b`
  - `--gnv-secondary: #0051d5`
  - `--gnv-on-secondary: #ffffff`
  - `--gnv-secondary-container: #316bf3`
  - `--gnv-secondary-fixed: #dbe1ff`
  - `--gnv-on-secondary-fixed: #00174b`
- **Semantic Status:**
  - `--gnv-error: #ba1a1a`
  - `--gnv-on-error: #ffffff`
  - `--gnv-error-container: #ffdad6`
  - `--gnv-on-error-container: #93000a`
  - `--gnv-status-success: #10b981`
  - `--gnv-status-warning: #f59e0b`
  - `--gnv-status-danger: #ef4444`
- **Typography, Spacing & Radii:**
  - `--gnv-font-sans: 'Inter', system-ui, -apple-system, sans-serif`
  - `--gnv-font-mono: 'JetBrains Mono', ui-monospace, monospace`
  - `--gnv-space-xs: 0.25rem`, `--gnv-space-sm: 0.5rem`, `--gnv-space-md: 0.75rem`, `--gnv-space-lg: 1rem`, `--gnv-space-xl: 1.5rem`
  - `--gnv-radius-sm: 0.125rem`, `--gnv-radius-md: 0.25rem`, `--gnv-radius-lg: 0.5rem`, `--gnv-radius-xl: 0.75rem`, `--gnv-radius-pill: 9999px`
