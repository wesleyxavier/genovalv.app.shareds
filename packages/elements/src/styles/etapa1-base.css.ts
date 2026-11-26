import { css } from 'lit';

export const etapa1BaseStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--gnv-font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
    color: var(--gnv-on-surface, #0f172a);
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  :focus-visible {
    outline: 2px solid var(--gnv-primary-focus, #8e7cd8);
    outline-offset: 2px;
  }
`;
