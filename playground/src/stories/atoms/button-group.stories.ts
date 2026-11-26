import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Button Group',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    attached: { control: 'boolean' },
  },
  args: {
    attached: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-button-group ?attached=${args.attached}>
      <genova-button variant="solid">Salvar</genova-button>
      <genova-button variant="outline">Cancelar</genova-button>
      <genova-button variant="ghost">Detalhes</genova-button>
    </genova-button-group>
  `,
};

export const Attached: Story = {
  args: { attached: true },
  render: (args) => html`
    <genova-button-group ?attached=${args.attached}>
      <genova-button variant="outline">Dia</genova-button>
      <genova-button variant="solid">Semana</genova-button>
      <genova-button variant="outline">Mês</genova-button>
    </genova-button-group>
  `,
};
