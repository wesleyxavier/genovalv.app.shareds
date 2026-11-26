import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Tooltip',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: 'Emite a NF-e automaticamente após fechar o lote',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="padding:2.5rem 1rem;">
      <genova-tooltip label=${args.label}>
        <genova-button variant="outline">Passe o mouse ou foque aqui</genova-button>
      </genova-tooltip>
    </div>
  `,
};
