import { css } from 'lit';

export const genovaInputStyles = css`
  :host { display: block; width: 100%; }
  :host([hidden]) { display: none; }
  .field { display: flex; flex-direction: column; gap: 0.375rem; }
  .header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  label { font-size: 0.8125rem; line-height: 1rem; font-weight: 600; color: var(--gnv-on-surface, #0f172a); }
  .hint { font-family: var(--gnv-font-mono, 'JetBrains Mono', monospace); font-size: 0.6875rem; line-height: 1rem; font-weight: 500; color: var(--gnv-on-surface-variant, #475569); }
  a.action-link { font-size: 0.6875rem; line-height: 0.875rem; font-weight: 600; letter-spacing: 0.025em; color: var(--gnv-primary, #715faf); text-decoration: none; }
  a.action-link:hover, a.action-link:focus-visible { text-decoration: underline; outline: none; }
  .wrap { position: relative; display: flex; align-items: center; width: 100%; }
  .icon { position: absolute; left: 0.75rem; display: inline-flex; align-items: center; justify-content: center; color: var(--gnv-on-surface-variant, #45464d); pointer-events: none; font-size: 0.95rem; }
  input {
    width: 100%; box-sizing: border-box; background-color: var(--gnv-surface-container-lowest, #ffffff);
    color: var(--gnv-on-surface, #0f172a); font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
    font-size: 0.8125rem; line-height: 1.25rem; padding: 0.625rem 0.875rem;
    border: 1px solid var(--gnv-outline, #857f93); border-radius: var(--gnv-radius-lg, 0.5rem);
    outline: none; transition: background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
  }
  input.with-icon { padding-left: 2.5rem; }
  input.with-action { padding-right: 2.5rem; }
  input.mono { font-family: var(--gnv-font-mono, 'JetBrains Mono', monospace); letter-spacing: 0.12em; }
  input:focus { background-color: var(--gnv-surface-container-lowest, #ffffff); border-color: var(--gnv-primary, #715faf); box-shadow: 0 0 0 2px var(--gnv-primary-border, #cfc4f5); }
  input[aria-invalid='true'] { border-color: var(--gnv-error, #bc3737); box-shadow: 0 0 0 1.5px rgba(188, 55, 55, 0.25); }
  button.toggle, button.search-btn {
    position: absolute; right: 0.5rem; display: inline-flex; align-items: center; justify-content: center;
    padding: 0.25rem; border: none; background: transparent; color: var(--gnv-on-surface-variant, #475569);
    border-radius: var(--gnv-radius-md, 0.25rem); cursor: pointer;
  }
  button.toggle:hover, button.toggle:focus-visible, button.search-btn:hover, button.search-btn:focus-visible {
    color: var(--gnv-primary, #715faf); outline: 2px solid var(--gnv-primary-focus, #8e7cd8); outline-offset: 1px;
  }
  .error-msg { font-size: 0.75rem; line-height: 1.125rem; color: var(--gnv-error, #bc3737); font-weight: 500; }
`;
