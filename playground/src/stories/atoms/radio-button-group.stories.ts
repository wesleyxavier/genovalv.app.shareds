import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const options = [
  { label: 'Diário', value: 'd' },
  { label: 'Semanal', value: 'w' },
  { label: 'Mensal', value: 'm' },
];

const meta: Meta = {
  title: 'Atoms/Radio Button Group',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'select', options: ['d', 'w', 'm'] },
  },
  args: {
    options,
    value: 'w',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`<genova-radio-button-group .options=${args.options} value=${args.value}></genova-radio-button-group>`,
};
