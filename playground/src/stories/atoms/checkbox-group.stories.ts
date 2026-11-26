import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const options = [
  { label: 'Lavagem Pesada', value: 'wash' },
  { label: 'Secagem Industrial', value: 'dry' },
  { label: 'Passadoria', value: 'iron' },
];

const meta: Meta = {
  title: 'Atoms/CheckboxGroup',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    direction: { control: 'select', options: ['column', 'row'] },
  },
  args: {
    direction: 'column',
    options,
    value: ['wash'],
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-checkbox-group
      direction=${args.direction}
      .options=${args.options}
      .value=${args.value}
    ></genova-checkbox-group>
  `,
};

export const RowLayout: Story = {
  args: { direction: 'row', value: ['wash', 'dry'] },
  render: Default.render,
};
