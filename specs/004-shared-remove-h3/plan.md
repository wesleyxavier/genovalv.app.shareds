# Implementation Plan: 004-shared-remove-h3

- Remover `packages/server/src/presentation/` e helpers `h3` (`require-user-session.ts`, `require-idempotency-key.ts`).
- Remover `h3` de `packages/server/package.json` e `packages/server/vite.config.ts`.
- Atualizar `packages/server/src/index.ts` e `packages/server/tests/auth0-and-security.test.ts`.
- Validar `npm test` e `npm run build` em `@genovalv/core` e `@genovalv/server`.
- Atualizar `README.md` e executar `graphify update .`.
