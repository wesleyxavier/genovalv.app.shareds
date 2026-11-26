import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/06 - Sobreposições',
};

export default meta;
type Story = StoryObj;

export const OverlaysCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:flex;gap:1rem;flex-wrap:wrap;align-items:center;">
      <genova-tooltip label="Dica rápida do campo">
        <genova-button variant="outline">Passe o mouse (Tooltip)</genova-button>
      </genova-tooltip>
      <genova-button @genova-press=${() => {
        const el = document.querySelector('#demo-modal') as HTMLElement & { open: boolean };
        if (el) el.open = true;
      }}>Abrir Modal</genova-button>
      <genova-button variant="outline" @genova-press=${() => {
        const el = document.querySelector('#demo-drawer') as HTMLElement & { open: boolean };
        if (el) el.open = true;
      }}>Abrir Drawer</genova-button>
      <genova-button variant="danger" @genova-press=${() => {
        const el = document.querySelector('#demo-alert-dialog') as HTMLElement & { open: boolean };
        if (el) el.open = true;
      }}>Abrir AlertDialog</genova-button>

      <genova-modal id="demo-modal" title="Detalhes do Pedido">Conteúdo do Modal Genova.</genova-modal>
      <genova-drawer id="demo-drawer" title="Filtros Avançados">Opções laterais do Drawer.</genova-drawer>
      <genova-alert-dialog id="demo-alert-dialog" title="Remover vínculo?">Esta ação não poderá ser desfeita.</genova-alert-dialog>
    </div>
  `,
};
