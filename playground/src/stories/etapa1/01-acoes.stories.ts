import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/01 - Ações',
};

export default meta;
type Story = StoryObj;

export const ActionsCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:flex;flex-direction:column;gap:1.5rem;">
      <genova-button-group>
        <genova-button variant="solid">Salvar</genova-button>
        <genova-button variant="outline">Cancelar</genova-button>
        <genova-button variant="ghost">Detalhes</genova-button>
        <genova-button variant="danger">Excluir</genova-button>
      </genova-button-group>
      <div style="display:flex;gap:1rem;align-items:center;">
        <genova-icon-button ariaLabel="Buscar"><genova-icon name="search" size="16"></genova-icon></genova-icon-button>
        <genova-icon-button variant="solid" ariaLabel="Adicionar"><genova-icon name="plus" size="16"></genova-icon></genova-icon-button>
        <genova-close-button></genova-close-button>
        <genova-link href="https://genovacloud.com" external>Acessar Genova Cloud →</genova-link>
      </div>
    </div>
  `,
};
