import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/IconButton',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['outline', 'solid'] },
    icon: { control: 'select', options: ['search', 'plus', 'check', 'close', 'user', 'warning'] },
    ariaLabel: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    variant: 'outline',
    icon: 'search',
    ariaLabel: 'Buscar',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-icon-button variant=${args.variant} ariaLabel=${args.ariaLabel} ?disabled=${args.disabled}>
      <genova-icon name=${args.icon} size="16"></genova-icon>
    </genova-icon-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;align-items:center;">
      <genova-icon-button variant="outline" ariaLabel="Buscar">
        <genova-icon name="search" size="16"></genova-icon>
      </genova-icon-button>
      <genova-icon-button variant="solid" ariaLabel="Adicionar">
        <genova-icon name="plus" size="16"></genova-icon>
      </genova-icon-button>
      <genova-icon-button variant="solid" ariaLabel="Desabilitado" disabled>
        <genova-icon name="check" size="16"></genova-icon>
      </genova-icon-button>
    </div>
  `,
};
