import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Button',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'outline', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    variant: 'solid',
    size: 'md',
    disabled: false,
    loading: false,
    label: 'Salvar alterações',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      ${args.label}
    </genova-button>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <genova-button variant="solid">Solid</genova-button>
      <genova-button variant="outline">Outline</genova-button>
      <genova-button variant="ghost">Ghost</genova-button>
      <genova-button variant="danger">Danger</genova-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;align-items:center;">
      <genova-button size="sm">Pequeno</genova-button>
      <genova-button size="md">Médio</genova-button>
      <genova-button size="lg">Grande</genova-button>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;">
      <genova-button disabled>Desabilitado</genova-button>
      <genova-button loading>Carregando</genova-button>
    </div>
  `,
};
