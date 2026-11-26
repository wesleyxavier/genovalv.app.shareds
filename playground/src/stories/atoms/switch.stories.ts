import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Switch',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Modo Sandbox Ativo',
    checked: true,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <genova-switch label=${args.label} ?checked=${args.checked} ?disabled=${args.disabled}></genova-switch>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display:grid;gap:0.75rem;">
      <genova-switch label="Desligado"></genova-switch>
      <genova-switch label="Ligado" checked></genova-switch>
      <genova-switch label="Desabilitado" checked disabled></genova-switch>
    </div>
  `,
};
