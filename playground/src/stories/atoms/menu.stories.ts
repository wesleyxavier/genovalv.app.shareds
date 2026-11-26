import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const items = [
  { id: 'edit', label: 'Editar Lote' },
  { id: 'print', label: 'Imprimir Etiqueta' },
  { id: 'archive', label: 'Arquivar' },
];

const meta: Meta = {
  title: 'Atoms/Menu',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    label: 'Ações do Lote',
    open: false,
    items,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="min-height:10rem;">
      <genova-menu label=${args.label} .items=${args.items} ?open=${args.open}></genova-menu>
    </div>
  `,
};

export const OpenByDefault: Story = {
  args: { open: true },
  render: Default.render,
};
