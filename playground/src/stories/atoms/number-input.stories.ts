import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/NumberInput',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: {
    value: 25,
    min: 0,
    max: 500,
    step: 5,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-number-input
      value=${args.value}
      min=${args.min}
      max=${args.max}
      step=${args.step}
      ?disabled=${args.disabled}
    ></genova-number-input>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
