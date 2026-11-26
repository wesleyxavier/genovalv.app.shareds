import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'select', options: ['info', 'success', 'error'] },
    message: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    status: 'success',
    message: 'Alterações salvas com sucesso!',
    open: true,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:420px;">
      <genova-toast status=${args.status} message=${args.message} ?open=${args.open}></genova-toast>
    </div>
  `,
};

export const AllStatuses: Story = {
  render: () => html`
    <div style="max-width:420px;display:grid;gap:0.75rem;">
      <genova-toast status="info" message="Sincronização em segundo plano iniciada."></genova-toast>
      <genova-toast status="success" message="Certificado A1 validado com sucesso!"></genova-toast>
      <genova-toast status="error" message="Não foi possível conectar ao serviço fiscal."></genova-toast>
    </div>
  `,
};
