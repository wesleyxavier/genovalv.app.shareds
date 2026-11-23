# Phase 1 Data Model: Shared Login Foundation & Base Components

**Feature**: `001-shared-login-foundation`
**Date**: 2026-11-23

## 1. Entities & Value Types (`@genovalv/core`)

### `LoginContextConfiguration`
Configuração contextual fornecida pelo portal consumidor para personalizar textos, políticas de MFA e links institucionais sem alterar a estrutura visual.

| Campo | Tipo | Obrigatório | Padrão / Regra |
|---|---|---|---|
| `locale` | `'pt-BR' \| 'en-US' \| 'es-ES'` | Sim | `'pt-BR'` |
| `brandName` | `string` | Sim | `"Genova"` |
| `brandSuffix` | `string` | Não | `"Cloud"` |
| `portalTitle` | `string` | Sim | `"Genova Cloud"` |
| `portalSubtitle` | `string` | Sim | `"Admin Console • Acesso Restrito"` |
| `securityBadgeText` | `string` | Sim | `"Ambiente Seguro"` |
| `mfaMode` | `'hidden' \| 'optional' \| 'required'` | Sim | `'optional'` |
| `allowMfaMethodSwitch` | `boolean` | Sim | `false` |
| `defaultMfaMethod` | `'totp' \| 'yubikey' \| 'biometric'` | Não | `'totp'` |
| `submitLabel` | `string` | Sim | `"Entrar"` |
| `forgotPasswordHref` | `string` | Não | `"#"` |
| `rememberDeviceDays` | `number` | Sim | `30` |
| `supportLinks` | `LoginLink[]` | Sim | Ajuda, Políticas de Privacidade, Status do Sistema |
| `footerLinks` | `LoginLink[]` | Sim | Termos de Uso, Segurança, Suporte |
| `copyrightText` | `string` | Sim | `"© 2026 Genova Cloud. Todos os direitos reservados."` |

### `LoginLink`
| Campo | Tipo | Obrigatório | Regra |
|---|---|---|---|
| `label` | `string` | Sim | Texto visível do link |
| `href` | `string` | Sim | Destino do link (URL ou rota) |
| `external` | `boolean` | Não | `false` |

### `LoginSubmissionInput`
Dados normalizados enviados pelo formulário de login ao manipulador de autenticação do portal consumidor.

| Campo | Tipo | Normalização / Regra |
|---|---|---|
| `email` | `string` | `trim().toLowerCase()`; obrigatório e formato válido de e-mail |
| `password` | `string` | Obrigatória (não vazia após checagem de comprimento > 0; **não** aplicar trim silencioso na senha) |
| `mfaCode` | `string \| undefined` | Remove todos os caracteres não numéricos (`\D`) e limita/valida 6 dígitos quando preenchido ou quando `mfaMode === 'required'` |
| `mfaMethod` | `'totp' \| 'yubikey' \| 'biometric' \| undefined` | Método ativo quando seleção de MFA está habilitada |
| `rememberDevice` | `boolean` | Padrão `false` (ou configurável pelo contexto) |

### `FieldValidationResult` & `LoginValidationResult`
| Campo | Tipo | Descrição |
|---|---|---|
| `valid` | `boolean` | `true` somente quando nenhum campo possui erro |
| `errors` | `Partial<Record<'email' \| 'password' \| 'mfaCode', string>>` | Mensagens traduzidas no `locale` ativo por campo inválido |
| `errorKeys` | `Partial<Record<'email' \| 'password' \| 'mfaCode', LoginTranslationKey>>` | Chaves semânticas de erro para integração opcional com i18n externo |
| `normalized` | `LoginSubmissionInput` | Payload normalizado pronto para submissão |

## 2. State Machine (`SubmissionState`)

Estados válidos da ação principal (`<genova-action-button>` e fluxo do cartão de login):

```text
idle ──(submit válido)──▶ validating ──(sucesso)──▶ success
  ▲                           │
  │                       (erro / rejeição)
  │                           ▼
  └──(nova edição / reset)── error
```

- **Invariante de duplo envio (`SC-004`):** enquanto em `validating`, o botão permanece desabilitado (`disabled = true`) e ignora novos disparos de submissão.
- **Invariante de erro:** ao transicionar para `error`, o campo `email` permanece preservado para correção; uma mensagem acessível é exibida no `<genova-alert-banner>`.

## 3. MFA Method Guidance Map

| Método (`MfaMethod`) | Título / Orientação | Detalhe técnico (`code-sm`) |
|---|---|---|
| `'totp'` | `"Abra o Google Authenticator ou Microsoft Auth"` | `"Insira o token temporário de 6 dígitos gerado."` |
| `'yubikey'` | `"Insira ou toque no seu YubiKey"` | `"Aguardando sinal WebAuthn CTAP2..."` |
| `'biometric'` | `"Autenticação Biométrica Pronta"` | `"Posicione o dedo no sensor Touch ID ou use Windows Hello."` |
