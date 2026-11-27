import { css } from 'lit';

export const listToolbarStyles = css`
  :host { display: block; }
  .bar {
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
    gap: 0.75rem; margin-bottom: 1rem;
  }
  .left { display: flex; flex-wrap: wrap; align-items: center; gap: 0.625rem; flex: 1 1 auto; }
  .search-wrap { position: relative; flex: 1 1 14rem; max-width: 22rem; min-width: 11rem; }
  .search-icon {
    position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%);
    color: var(--gnv-text-muted, #64748b); pointer-events: none; display: inline-flex;
  }
  input, select {
    height: 2.25rem; border-radius: 0.5rem; border: 1px solid var(--gnv-outline, #857f93);
    background: #fff; color: var(--gnv-text, #0f172a); font-size: 0.875rem; font-family: inherit;
    outline: none;
  }
  input { width: 100%; padding: 0 0.75rem 0 2.15rem; }
  select { padding: 0 0.75rem; cursor: pointer; }
  input:focus, select:focus { border-color: var(--gnv-primary, #715faf); box-shadow: 0 0 0 3px var(--gnv-primary-container, #f1eefc); }
  .actions { display: flex; align-items: center; gap: 0.5rem; }
`;
