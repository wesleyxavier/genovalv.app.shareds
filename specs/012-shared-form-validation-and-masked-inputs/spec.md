# Feature Specification: Shared Native Form Validation, Masked Inputs & Search Action (v0.6.0)

**Feature Branch**: `feature/012-shared-form-validation-and-masked-inputs`

**Created**: 2026-11-28

**Status**: Draft (Aguardando aprovação)

**Input**: Corrigir validação nativa de formulários em `@genovalv/elements` (`formAssociated` + `ElementInternals` em `genova-button`, `genova-input`, `genova-select`, `genova-textarea`) e adicionar `type="search"` + `inputmode="cpf" | "cnpj" | "cep"` com máscara progressiva em tempo real, bloqueio de não-dígitos/negativos e botão-ícone de lupa (`genova-search`), além de formatadores/validadores puros no `@genovalv/core`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Máscaras & Validação Pura de CPF, CNPJ e CEP em `@genovalv/core` (Priority: P1)

Como consumidor de `@genovalv/core`, quero funções puras `formatCpf`, `formatCnpj`, `formatCep` e `isValidCep` (além dos já existentes `isValidCpf`, `isValidCnpj`, `stripNonDigits`) e mensagens de validação genéricas em `pt-BR`, `en-US` e `es-ES` para aplicar formatação e validação consistentes em todos os apps.

**Why this priority**: Concentra regras puras de máscara/CEP no domínio compartilhado (`100%` cobertura Vitest) antes dos componentes Lit.

**Independent Test**: `npm run test:coverage --workspace=@genovalv/core` passa com 100% de cobertura cobrindo truncamento de dígitos, remoção de sinais negativos/letras, formatação progressiva e validação de CEP.

**Acceptance Scenarios**:

1. **Given** string com dígitos, letras ou sinal negativo (ex.: `"-12345678901abc"`), **When** chamado `formatCpf`, `formatCnpj` ou `formatCep`, **Then** apenas dígitos numéricos são mantidos, truncados ao tamanho máximo (`11`, `14`, `8`) e formatados progressivamente (`000.000.000-00`, `00.000.000/0001-00`, `00000-000`).
2. **Given** entrada `"01001000"` ou `"01001-000"`, **When** chamado `isValidCep`, **Then** retorna `true`; entradas com menos de 8 dígitos ou apenas zeros retornam `false`.
3. **Given** `createTranslator(locale)`, **When** acessadas chaves de validação genérica (`validation.fieldRequired`, `validation.cpfInvalid`, `validation.cnpjInvalid`, `validation.cepInvalid`, `auth.searchAction`), **Then** existem nos 3 idiomas (`pt-BR`, `en-US`, `es-ES`).

---

### User Story 2 - Validação Nativa & Submit de Formulários via `ElementInternals` em `@genovalv/elements` (Priority: P1)

Como aplicação consumidora (`Admin`, `ERP`, `FactoryFloor`) usando `<form>`, `<genova-input>`, `<genova-select>`, `<genova-textarea>` e `<genova-button type="submit">`, quero que clicar no botão de submit valide todos os campos `required`/tipados e dispare o evento `(submit)` apenas quando válidos (ou respeitando `novalidate`).

**Why this priority**: Hoje `GenovaButtonElement` não tem `formAssociated = true` nem chama `form.requestSubmit()`, `GenovaInputElement` nunca chama `internals.setValidity(...)`, e `GenovaSelectElement` não possui `formAssociated`, `required` nem `error`.

**Independent Test**: Testes Vitest (`happy-dom`) com `<form>` real contendo `<genova-input required>`, `<genova-select required>` e `<genova-button type="submit">` comprovando bloqueio quando inválido (`checkValidity() === false`), disparo de `(submit)` quando válido, e exibição visual de erro (`[aria-invalid='true']` + `.error-msg`).

**Acceptance Scenarios**:

1. **Given** `<form>` com `<genova-button type="submit">` não desabilitado, **When** o usuário clica no botão, **Then** dispara `genova-press` (cancelável) e em seguida invoca `internals.form.requestSubmit()`, executando validação do `<form>` e `(submit)` (e `type="reset"` invoca `internals.form.reset()`).
2. **Given** `<genova-input required>` ou `<genova-input type="email">` ou `<genova-input inputmode="cpf|cnpj|cep">`, **When** valor está vazio ou inválido, **Then** `internals.setValidity(...)` marca `valueMissing` / `typeMismatch` / `customError` com âncora no `<input>` interno e `checkValidity()` retorna `false`.
3. **Given** `<genova-select required>`, **When** nenhuma opção foi selecionada no submit ou `error` é informado, **Then** `checkValidity()` retorna `false` e exibe borda de erro + mensagem acessível (`role="alert"`).
4. **Given** `<genova-textarea required>` e `<genova-number-input [min]="0">`, **When** `min >= 0`, **Then** `GenovaNumberInputElement` impede valores negativos e `GenovaTextareaElement` reporta validade via `ElementInternals`.

---

### User Story 3 - `<genova-input>` com `type="search"` e `inputmode="cpf" | "cnpj" | "cep"` (Priority: P1)

Como desenvolvedor usando `<genova-input>`, quero usar `inputmode="cpf"`, `inputmode="cnpj"` ou `inputmode="cep"` (com ou sem `type="search"`) para obter máscara automática durante a digitação, bloqueio de caracteres não numéricos e negativos (`-`), e quando `type="search"` habilitar um botão-ícone de lupa que emite `genova-search`.

**Why this priority**: Padroniza busca e máscaras brasileiras de CPF/CNPJ/CEP diretamente no Design System sem duplicar handlers nos frontends.

**Independent Test**: Testes Vitest em `packages/elements/tests/` simulando digitação (`keydown`, `input`, `paste`) com letras/negativos/números para `cpf`/`cnpj`/`cep`, e clique no botão lupa + `Enter` em `type="search"` disparando `genova-search`.

**Acceptance Scenarios**:

1. **Given** `<genova-input inputmode="cpf">` (ou `cnpj` / `cep`), **When** o usuário tenta digitar `-`, `+`, letras ou símbolos, **Then** o evento bloqueia caracteres inválidos e a entrada mantém somente dígitos formatados progressivamente (`000.000.000-00` / `00.000.000/0001-00` / `00000-000`), respeitando limite máximo (`11` / `14` / `8` dígitos).
2. **Given** `<genova-input type="search" inputmode="cpf">` (ou `cnpj` / `cep` / texto), **When** renderizado, **Then** exibe um botão ícone estilo lupa dentro do input (`button.search-btn`) e o `<input>` interno mantém `inputmode="numeric"` para teclado numérico mobile.
3. **Given** usuário clicando no botão lupa (ou pressionando `Enter` dentro de `type="search"`), **When** acionado (e não desabilitado), **Then** emite `CustomEvent('genova-search', { detail: { value, rawDigits, inputmode, name }, bubbles: true, composed: true })` sem submeter o `<form>` pai acidentalmente.

---

### User Story 4 - Clean Code (`<= 100` linhas), Release `0.6.0` & Empacotamento `.tgz` (Priority: P2)

Refatorar `genova-input.ts` (hoje 305 linhas) em módulos `<= 100` linhas (`styles`, `helpers` de máscara/validação, `component`), atualizar `README.md`, bumpar versão para `0.6.0`, gerar tarballs `.tgz` em `dist/tarballs/` e atualizar `graphify-out/`.

### Edge Cases

- Se um consumidor usar `<genova-input>` com `[value]` externo sem máscara (ex.: `'11222333000181'`), `formatMaskedInputValue` normaliza para exibição mascarada sem perder consistência ao emitir `genova-input` / `genova-change`.
- Pressionar `Backspace`, `Delete`, `Tab`, setas, `Ctrl/Cmd+A/C/V/X` continua permitido em `inputmode="cpf|cnpj|cep"`.
- Em `type="search"` + `showPasswordToggle`, o botão de lupa e toggle não se sobrepõem (lupa atua para `type="search"`, toggle para `type="password"`).
- `GenovaButtonElement`: se algum handler de `genova-press` chamar `event.preventDefault()`, `requestSubmit()` não é disparado (evita duplo submit durante migração).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Criar `packages/core/src/domain/validators/format-document-mask.ts` (`formatCpf`, `formatCnpj`, `formatCep`, `isValidCep`) e adicionar chaves de validação/busca em `LOGIN_TRANSLATIONS` (mantendo cada arquivo `<= 100` linhas).
- **FR-002**: Atualizar `GenovaButtonElement`, `GenovaSelectElement`, `GenovaTextareaElement` e `GenovaNumberInputElement` para suportar `formAssociated = true` + `ElementInternals` (`setValidity`, `checkValidity`, `reportValidity`, `requestSubmit`), bloqueio de negativos em `NumberInput` quando `min >= 0`, e dimensionamento mínimo dos botões (`min-height: 34.5px; width: 100%;` no `button` de `GenovaButtonElement`, e `min-height: 34.5px` em `GenovaActionButtonElement`).
- **FR-003**: Refatorar `GenovaInputElement` (`<= 100` linhas por arquivo) adicionando `setValidity` completo via `ElementInternals`, suporte a `type="search"` (botão lupa + evento `genova-search`) e `inputmode="cpf" | "cnpj" | "cep"` (máscara em tempo real + bloqueio de não-dígitos e sinal negativo `-`).
- **FR-004**: Escrever testes Vitest (TDD) em `@genovalv/core` (`100%` cobertura) e `@genovalv/elements`, atualizar `README.md`, bumpar SemVer `0.5.0 → 0.6.0` e gerar tarballs `.tgz` em `dist/tarballs/`.

## Success Criteria *(mandatory)*

- **SC-001**: `<form>` com `<genova-input>`, `<genova-select>` e `<genova-button type="submit">` bloqueia envio inválido, exibe erro e submete corretamente quando válido.
- **SC-002**: `<genova-input type="search" inputmode="cpf|cnpj|cep">` aplica máscara progressiva, rejeita `-`/letras e dispara `genova-search` pelo ícone de lupa.
- **SC-003**: `npm run build`, `npm run test:coverage` (`100%` no `core`) e tarballs `0.6.0` concluem sem erros, com todos os arquivos alterados/novos `<= 100` linhas.
