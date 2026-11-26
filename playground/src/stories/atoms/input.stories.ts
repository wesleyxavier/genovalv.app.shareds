import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password'] },
    icon: { control: 'select', options: ['none', 'email', 'lock', 'shield'] },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    showPasswordToggle: { control: 'boolean' },
  },
  args: {
    type: 'email',
    icon: 'email',
    label: 'E-mail Corporativo',
    placeholder: 'nome@empresa.com.br',
    hint: '',
    error: '',
    required: true,
    disabled: false,
    showPasswordToggle: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:420px;">
      <genova-input
        name="field"
        type=${args.type}
        icon=${args.icon}
        label=${args.label}
        placeholder=${args.placeholder}
        hint=${args.hint}
        error=${args.error}
        ?required=${args.required}
        ?disabled=${args.disabled}
        ?show-password-toggle=${args.showPasswordToggle}
      ></genova-input>
    </div>
  `,
};

export const PasswordWithToggle: Story = {
  args: {
    type: 'password',
    icon: 'lock',
    label: 'Senha',
    placeholder: '••••••••••••',
    showPasswordToggle: true,
  },
  render: Default.render,
};

export const WithError: Story = {
  args: {
    error: 'Informe um e-mail corporativo válido.',
  },
  render: Default.render,
};
