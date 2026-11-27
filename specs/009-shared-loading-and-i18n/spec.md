# Feature Specification: 009-shared-loading-and-i18n

**Feature Branch**: `feature/009-shared-loading-and-i18n`  
**Created**: 2026-11-27  
**Status**: Approved (Auto-authorized by user)

## User Scenarios & Testing
1. **Generic Loading State (`<genova-loading-state>`)**: Reusable Lit Web Component in `@genovalv/elements` supporting `variant="fullscreen" | "card"`, custom `message` (for i18n), and `size`, using Etapa 1 tokens (`#FAF7F0`, `#FFFFFF`, `#E7E2D8`, `#715FAF`, `#475569`).
2. **Multi-app Reuse**: Registered in `registerGenovaElements()` so Admin (Angular), ERP (Next.js), and FactoryFloor (Nuxt) share the exact same loading UI.
