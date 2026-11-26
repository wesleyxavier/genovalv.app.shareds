import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Elements/Inputs & Checkbox',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    checked: { control: 'boolean' },
  },
  args: {
    label: 'E-mail Corporativo',
    placeholder: 'nome@empresa.com',
    error: '',
    checked: true,
  },
};

export default meta;
type Story = StoryObj;

export const EmailAndPassword: Story = {
  render: (args) => html`
    <div style="max-width:420px;margin:2rem auto;display:flex;flex-direction:column;gap:1rem;">
      <genova-input
        name="email"
        type="email"
        icon="email"
        label=${args.label}
        placeholder=${args.placeholder}
        error=${args.error}
      ></genova-input>
      <genova-input
        name="password"
        type="password"
        icon="lock"
        label="Senha"
        placeholder="••••••••••••"
        show-password-toggle
      ></genova-input>
      <genova-checkbox
        name="rememberDevice"
        label="Confiar neste dispositivo por 30 dias"
        ?checked=${args.checked}
      ></genova-checkbox>
    </div>
  `,
};
