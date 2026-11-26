import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Elements/Feedback, MFA & Locale',
  argTypes: {
    variant: { control: 'select', options: ['info', 'error', 'success'] },
    buttonState: { control: 'select', options: ['idle', 'validating', 'success', 'error'] },
    locale: { control: 'select', options: ['pt-BR', 'en-US', 'es-ES'] },
  },
  args: {
    variant: 'error',
    buttonState: 'idle',
    locale: 'pt-BR',
  },
};

export default meta;
type Story = StoryObj;

export const InteractiveControls: Story = {
  render: (args) => html`
    <div style="max-width:440px;margin:2rem auto;display:flex;flex-direction:column;gap:1.25rem;">
      <genova-locale-selector locale=${args.locale}></genova-locale-selector>
      <genova-alert-banner
        variant=${args.variant}
        message="Exemplo de mensagem de feedback"
        visible
      ></genova-alert-banner>
      <genova-mfa-selector locale=${args.locale}></genova-mfa-selector>
      <genova-action-button
        state=${args.buttonState}
        label="Entrar no Console"
        locale=${args.locale}
      ></genova-action-button>
    </div>
  `,
};
