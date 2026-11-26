# Tasks: 004-shared-remove-h3

## 0. Branch
- [x] Worktree `worktrees/004-shared-remove-h3` criado a partir de `develop`.

## 1. Desacoplamento de h3
- [x] Remover `presentation/controllers/`, `require-user-session.ts`, `require-idempotency-key.ts` e `tests/auth-controllers.test.ts`.
- [x] Remover `h3` de `package.json`, `vite.config.ts` e `src/index.ts`.

## 2. Testes e Build
- [x] Executar `npm test` e `npm run build` em `@genovalv/server`.

## 3. Pre-PR Checklist
- [x] Atualizar `README.md` com a regra agnóstica de `@genovalv/server`.
- [x] Executar `graphify update .`.

## 4. Create PR
- [x] Commit + push + PR para `develop` e merge.
