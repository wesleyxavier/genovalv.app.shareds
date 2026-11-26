import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/CloseButton',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Fechar',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-close-button label=${args.label} ?disabled=${args.disabled}></genova-close-button>`,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
