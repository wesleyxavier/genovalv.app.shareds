import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import logoCabecalho from '@genovalv/tokens/logo/genova-cabecalho.svg';
import logoSimbolo from '@genovalv/tokens/logo/genova-simbolo.svg';

const meta: Meta = {
  title: 'Etapa 1/00 - Fundamentos',
};

export default meta;
type Story = StoryObj;

export const PrimitivesAndTypography: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.25rem;max-width:900px;">
      <div style="display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;">
        <img src=${logoCabecalho} alt="Genova Cloud" style="height:40px;width:auto;" />
        <img src=${logoSimbolo} alt="Símbolo Genova" style="height:40px;width:auto;" />
      </div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;font-size:0.75rem;">
        <span style="padding:0.4rem 0.75rem;border-radius:0.5rem;background:#715faf;color:#fff;font-weight:600;">Primary #715FAF</span>
        <span style="padding:0.4rem 0.75rem;border-radius:0.5rem;background:#bc3737;color:#fff;font-weight:600;">Error #BC3737</span>
        <span style="padding:0.4rem 0.75rem;border-radius:0.5rem;background:#3fa37c;color:#fff;font-weight:600;">Success #3FA37C</span>
        <span style="padding:0.4rem 0.75rem;border-radius:0.5rem;background:#faf7f0;border:1px solid #e7e2d8;color:#0f172a;font-weight:600;">Surface #FAF7F0</span>
      </div>
      <genova-heading size="xl">Tipografia Plus Jakarta Sans</genova-heading>
      <genova-box variant="surface">Box Surface (#FFFFFF)</genova-box>
      <genova-box variant="muted">Box Muted (#EEEBE4)</genova-box>
      <genova-box variant="tint">Box Tint (#F1EEFC)</genova-box>
      <genova-pseudo-box>PseudoBox (hover / active / focus)</genova-pseudo-box>
      <div style="display:flex;gap:0.75rem;align-items:center;">
        <genova-control-box checked><genova-icon name="check" size="14"></genova-icon></genova-control-box>
        <genova-control-box shape="circle"></genova-control-box>
        <genova-icon name="search" size="20"></genova-icon>
        <genova-icon name="warning" size="20"></genova-icon>
        <genova-icon name="user" size="20"></genova-icon>
      </div>
      <genova-divider label="Divisor com texto"></genova-divider>
      <genova-image alt="Preview" fallbackText="Imagem / Placeholder Genova" style="width:240px;height:120px;"></genova-image>
    </div>
  `,
};
