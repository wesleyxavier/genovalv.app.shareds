import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'success', 'warning', 'error'] },
    label: { control: 'text' },
  },
  args: {
    variant: 'primary',
    label: 'Admin',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-badge variant=${args.variant}>${args.label}</genova-badge>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
      <genova-badge variant="primary">Admin</genova-badge>
      <genova-badge variant="success">Ativo</genova-badge>
      <genova-badge variant="warning">Sandbox</genova-badge>
      <genova-badge variant="error">Bloqueado</genova-badge>
    </div>
  `,
};
