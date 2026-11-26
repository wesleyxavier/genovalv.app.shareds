import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Tag',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    removable: { control: 'boolean' },
  },
  args: {
    label: 'Lavanderia Industrial',
    removable: true,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-tag label=${args.label} ?removable=${args.removable}></genova-tag>`,
};

export const Group: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <genova-tag label="Hospitalar"></genova-tag>
      <genova-tag label="Hoteleiro" removable></genova-tag>
      <genova-tag label="Industrial" removable></genova-tag>
    </div>
  `,
};
