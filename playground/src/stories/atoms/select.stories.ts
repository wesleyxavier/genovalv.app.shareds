import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const options = [
  { label: 'Matriz - São Paulo', value: 'sp' },
  { label: 'Filial - Rio de Janeiro', value: 'rj' },
  { label: 'Unidade Industrial - Campinas', value: 'cps' },
];

const meta: Meta = {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: 'select', options: ['', 'sp', 'rj', 'cps'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    options,
    value: 'sp',
    placeholder: 'Selecione uma unidade...',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:340px;">
      <genova-select
        .options=${args.options}
        value=${args.value}
        placeholder=${args.placeholder}
        ?disabled=${args.disabled}
      ></genova-select>
    </div>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
};
