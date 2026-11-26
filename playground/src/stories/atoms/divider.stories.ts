import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Divider',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    label: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
    label: 'ou continue com',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:460px;">
      <genova-divider orientation=${args.orientation} label=${args.label}></genova-divider>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1rem;height:2.5rem;">
      <span>ERP</span>
      <genova-divider orientation="vertical"></genova-divider>
      <span>Produção</span>
      <genova-divider orientation="vertical"></genova-divider>
      <span>Admin</span>
    </div>
  `,
};
