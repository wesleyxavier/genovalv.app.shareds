# Contract: `@genovalv/elements` Web Components (Lit)

**Package**: `@genovalv/elements`
**Runtime**: Lit 3 Web Components (ESM + `.d.ts`, SSR-safe registration, Shadow DOM + CSS vars from `@genovalv/tokens`)

## Custom Elements Catalog

> **Convenção comum de i18n:** todos os componentes abaixo aceitam o atributo/propriedade `locale` (`'pt-BR' | 'en-US' | 'es-ES'`, padrão `'pt-BR'`). Quando atributos textuais explícitos (ex.: `badge-text`, `label`) não forem informados, o componente resolve automaticamente o texto pelo dicionário de `@genovalv/core` no `locale` ativo.

### 1. `<genova-header>`
Cabeçalho institucional com marca e selo de ambiente seguro.
- **Attributes / Properties:**
  - `brand-name` (`string`, default `"Genova"`)
  - `brand-suffix` (`string`, default `"Cloud"`)
  - `badge-text` (`string`, default `"Ambiente Seguro"`)
- **Slots:** `icon` (opcional), `actions` (opcional à direita)

### 2. `<genova-footer>`
Rodapé institucional com copyright e links configuráveis.
- **Attributes / Properties:**
  - `copyright-text` (`string`)
  - `links` (`LoginLink[]`, property JS)
- **Events (`bubbles: true, composed: true`):**
  - `genova-link-click` — `detail: { label: string; href: string }`

### 3. `<genova-auth-shell>`
Contêiner estrutural de página de autenticação (fundo com grade sutil pontilhada, header no topo, área principal centralizada e footer na base sem rolagem horizontal).
- **Attributes / Properties:** repassa props de header/footer ou aceita slots `header` e `footer`.
- **Slots:** `default` (conteúdo central), `header` (opcional), `footer` (opcional).

### 4. `<genova-auth-card>`
Bloco central de autenticação com emblema, título do portal, subtítulo contextual, superfície branca elevada (`surface-container-lowest`) e links inferiores de apoio.
- **Attributes / Properties:**
  - `portal-title` (`string`, default `"Genova Cloud"`)
  - `portal-subtitle` (`string`, default `"Admin Console • Acesso Restrito"`)
  - `support-links` (`LoginLink[]`, property JS)
- **Slots:** `default` (formulário nativo ou campos do portal consumidor), `icon` (opcional), `feedback` (banner de erro/status).

### 5. `<genova-action-button>`
Botão principal de ação com controle estrito de estado para prevenir múltiplos envios simultâneos.
- **Attributes / Properties:**
  - `label` (`string`, default `"Entrar"`)
  - `loading-label` (`string`, default `"Validando..."`)
  - `success-label` (`string`, default `"Acesso Concedido"`)
  - `state` (`'idle' | 'validating' | 'success' | 'error'`, default `'idle'`)
  - `disabled` (`boolean`, default `false`)
  - `type` (`'button' | 'submit'`, default `'button'`)
- **Events (`bubbles: true, composed: true`):**
  - `genova-action` — disparado ao clicar apenas quando `!disabled && state !== 'validating'`.

### 6. `<genova-alert-banner>`
Banner acessível (`role="alert"` / `aria-live="polite"`) para exibir erros de validação/autenticação ou confirmações.
- **Attributes / Properties:**
  - `variant` (`'error' | 'success' | 'warning' | 'info'`, default `'info'`)
  - `message` (`string`)
  - `visible` (`boolean`, default `false`)

### 7. `<genova-mfa-selector>`
Seletor extensível de método de segundo fator (TOTP, YubiKey, Biometria) com cartão de orientação dinâmica.
- **Attributes / Properties:**
  - `selected-method` (`'totp' | 'yubikey' | 'biometric'`, default `'totp'`)
- **Events (`bubbles: true, composed: true`):**
  - `genova-mfa-method-change` — `detail: { method: MfaMethod; guidance: MfaGuidance }`

## SSR-Safety Contract

- Importar `@genovalv/elements` em ambiente Node sem `window`/`document` NÃO deve lançar exceção.
- A função explícita `registerGenovaElements()` (também executada de forma protegida quando em browser) verifica `typeof window !== 'undefined' && typeof customElements !== 'undefined'` e `!customElements.get(tagName)` antes de registrar cada elemento.
