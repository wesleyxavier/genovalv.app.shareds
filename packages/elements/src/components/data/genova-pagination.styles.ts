import { css } from 'lit';

export const paginationStyles = css`
  :host { display: block; }
  .wrap {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
    gap: 0.75rem; padding: 0.75rem 1rem; font-size: 0.8125rem;
    color: var(--gnv-text-muted, #64748b);
  }
  .controls { display: flex; align-items: center; gap: 0.375rem; }
  button {
    min-width: 2rem; height: 2rem; padding: 0 0.5rem; border-radius: 0.5rem;
    border: 1px solid var(--gnv-outline-variant, #e7e2d8); background: #fff;
    color: var(--gnv-text, #0f172a); font-size: 0.8125rem; font-weight: 600; cursor: pointer;
  }
  button[data-active='true'] {
    background: var(--gnv-primary-container, #f1eefc);
    border-color: var(--gnv-primary-border, #cfc4f5);
    color: var(--gnv-primary, #715faf);
  }
  button:disabled { opacity: 0.45; cursor: not-allowed; }
`;
