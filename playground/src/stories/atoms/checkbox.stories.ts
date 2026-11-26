import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Confiar neste dispositivo por 30 dias',
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-checkbox
      name="remember"
      label=${args.label}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
    ></genova-checkbox>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display:grid;gap:0.5rem;">
      <genova-checkbox name="c1" label="Não marcado"></genova-checkbox>
      <genova-checkbox name="c2" label="Marcado" checked></genova-checkbox>
      <genova-checkbox name="c3" label="Desabilitado" checked disabled></genova-checkbox>
    </div>
  `,
};
