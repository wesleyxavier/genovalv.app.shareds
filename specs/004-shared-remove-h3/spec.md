# Feature Specification: 004-shared-remove-h3

**Branch**: `004-shared-remove-h3` | **Created**: 2026-11-26 | **Status**: Implemented

## Overview
Remover o acoplamento com `h3` (`H3Event`, controllers base/auth e helpers HTTP `requireUserSession` / `requireIdempotencyKey`) do pacote `@genovalv/server`, mantendo o pacote 100% agnóstico de framework para consumo por AnalogJS/Nitro (Admin), Next.js (ERP) e Nuxt (FactoryFloor).

## Requirements
- **FR-001**: `@genovalv/server` não deve declarar nem importar `h3`.
- **FR-002**: Controllers e helpers acoplados ao `h3` pertencem exclusivamente ao app AnalogJS (`genovalv.app.admin`).
- **FR-003**: Use cases, gateways (`Auth0Gateway`, `JoseSessionTokenGateway`), helpers de cookie Web-standard e `NodeHashService` permanecem exportados em `@genovalv/server`.
- **FR-004**: Atualizar `README.md` documentando a regra arquitetural agnóstica de framework para `@genovalv/server`.
