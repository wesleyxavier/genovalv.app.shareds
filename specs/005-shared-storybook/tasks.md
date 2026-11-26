# Tasks: 005-shared-storybook

## 0. Branch
- [x] Worktree `worktrees/005-shared-storybook` criado a partir de `develop`.

## 1. Setup do Storybook (`@storybook/web-components-vite`)
- [x] Instalar Storybook (`@storybook/web-components-vite`, `storybook`) em `playground/package.json` e configurar `.storybook/main.ts` e `.storybook/preview.ts`.
- [x] Atualizar scripts de `playground/package.json` (`dev`, `build`, `preview`).

## 2. Stories dos Componentes e Fluxo de Login
- [x] Criar stories individuais em `playground/src/stories/elements/*.stories.ts` para todos os Web Components de `@genovalv/elements`.
- [x] Criar story composta `playground/src/stories/flows/login-foundation.stories.ts` suportando `outcome`, `mfaMode` e `locale`.
- [x] Remover `playground/index.html` e `playground/src/main.ts`.

## 3. E2E Playwright & Build
- [x] Adaptar `playwright.config.ts` e `playground/e2e/login-foundation.spec.ts` para o Storybook estático.
- [x] Executar `npm run build`, `npm run test:unit` e `npm run test:e2e`.

## 4. Pre-PR Checklist
- [x] Atualizar `README.md` com os novos comandos do Storybook.
- [x] Executar `graphify update .`.

## 5. Create PR
- [x] Commit final + push + PR para `develop`.
