# Implementation Plan: 005-shared-storybook

- **Framework**: `@storybook/web-components-vite` + `@storybook/addon-essentials` (ou Storybook 8/9 Vite)
- **Workspace**: `New/Shareds/playground` (`@genovalv/playground`)
- **Structure**:
  - `playground/.storybook/main.ts`
  - `playground/.storybook/preview.ts` (`@genovalv/tokens/tokens.css` + `registerGenovaElements()`)
  - `playground/src/stories/elements/*.stories.ts` (stories unitárias por Web Component)
  - `playground/src/stories/flows/login-foundation.stories.ts` (story composta de login para E2E)
  - `playground/e2e/login-foundation.spec.ts` + `playwright.config.ts` apontando para `/iframe.html?id=flows-login-foundation--...`
