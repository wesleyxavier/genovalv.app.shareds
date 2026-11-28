# Tasks: 013-shared-app-header-box-sizing

**Input**: Design documents from `/specs/013-shared-app-header-box-sizing/`
**Prerequisites**: [spec.md](spec.md), [plan.md](plan.md)

## 0. Branch

- [ ] T000 Create worktree at `New/Shareds/worktrees/013-shared-app-header-box-sizing` on branch `feature/013-shared-app-header-box-sizing` from `develop`, moving `specs/013-shared-app-header-box-sizing/` into the worktree and keeping `develop` clean

---

## Phase 1: Fix `box-sizing` no `<genova-app-header>` (US1 — TDD) 🎯 MVP

### Tests First (Red)
- [ ] T001 [US1] Add regression assertion in `packages/elements/tests/app-header.test.ts` verifying `GenovaAppHeaderElement` includes `box-sizing: border-box` styles for `.bar`

### Implementation (Green)
- [ ] T002 [US1] Include `etapa1BaseStyles` in `packages/elements/src/components/navigation/app-header/genova-app-header.ts` and `box-sizing: border-box` on `.bar` in `packages/elements/src/components/navigation/app-header/genova-app-header.styles.ts`
- [ ] T003 [US1] Run `npm run build` and `npm run test:coverage` across all workspaces

### Group 1 Commit Gate (Explicit User Authorization Required)
- [ ] T004 Ask explicit user permission, then `git commit` + `git push` Group 1

---

## Phase 2: Release `0.6.1`, `README.md`, Tarballs `.tgz` & PR

- [ ] T005 Update `README.md` (`v0.6.1`), bump SemVer `0.6.0 → 0.6.1` across `package.json`, `packages/*/package.json`, `playground/package.json`, `peerDependencies` (`^0.6.1`) and `package-lock.json`
- [ ] T006 Run `npm run build`, `npm run test:coverage`, pack `dist/tarballs/*-0.6.1.tgz`, and update `graphify-out/`
- [ ] T007 Ask explicit user permission, then final `git commit` + `git push` and create PR (`source: feature/013-shared-app-header-box-sizing`, `target: develop`)
- [ ] T008 After explicit user authorization (and merge), remove `worktrees/013-shared-app-header-box-sizing`
