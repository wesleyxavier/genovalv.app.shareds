import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/00 - Fundamentos',
};

export default meta;
type Story = StoryObj;

export const PrimitivesAndTypography: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.25rem;max-width:900px;">
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
