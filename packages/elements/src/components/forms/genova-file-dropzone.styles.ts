import { css } from 'lit';

export const fileDropzoneStyles = css`
  :host { display: block; }
  .zone {
    border: 1.5px dashed var(--gnv-outline, #857f93); border-radius: 0.625rem;
    background: var(--gnv-surface, #faf7f0); padding: 1.25rem 1rem; text-align: center;
    cursor: pointer; transition: border-color 150ms ease, background 150ms ease;
  }
  .zone[data-drag='true'], .zone:hover { border-color: var(--gnv-primary, #715faf); background: var(--gnv-primary-container, #f1eefc); }
  .zone[data-disabled='true'] { opacity: 0.55; cursor: not-allowed; }
  .icon { color: var(--gnv-primary, #715faf); margin-bottom: 0.375rem; display: inline-flex; }
  .title { margin: 0; font-size: 0.875rem; font-weight: 600; color: var(--gnv-text, #0f172a); }
  .hint { margin: 0.25rem 0 0; font-size: 0.75rem; color: var(--gnv-text-muted, #64748b); }
  .error { margin: 0.5rem 0 0; font-size: 0.75rem; font-weight: 600; color: var(--gnv-error, #bc3737); }
  input[type='file'] { display: none; }
  .files { list-style: none; margin: 0.75rem 0 0; padding: 0; display: grid; gap: 0.5rem; }
  .file-row {
    display: flex; align-items: center; justify-content: space-between; gap: 0.625rem;
    padding: 0.5rem 0.75rem; border-radius: 0.5rem; background: #fff;
    border: 1px solid var(--gnv-outline-variant, #e7e2d8); font-size: 0.8125rem;
  }
  .file-meta { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
  .file-name { font-weight: 600; color: var(--gnv-text, #0f172a); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-size { color: var(--gnv-text-muted, #64748b); font-size: 0.75rem; }
  .file-actions { display: flex; align-items: center; gap: 0.5rem; }
  .check { color: #3fa37c; font-weight: 700; }
  .remove { border: 0; background: transparent; cursor: pointer; color: var(--gnv-text-muted, #64748b); padding: 0.25rem; }
  .remove:hover { color: var(--gnv-error, #bc3737); }
`;
