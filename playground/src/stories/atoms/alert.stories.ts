import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Atoms/Alert',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    status: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  args: {
    status: 'info',
    title: 'Sincronização em andamento',
    message: 'Os dados fiscais e lotes operacionais estão sendo atualizados.',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:540px;">
      <genova-alert status=${args.status} title=${args.title}>${args.message}</genova-alert>
    </div>
  `,
};

export const AllStatuses: Story = {
  render: () => html`
    <div style="max-width:540px;display:grid;gap:0.75rem;">
      <genova-alert status="info" title="Informação">Sincronização em andamento com a matriz.</genova-alert>
      <genova-alert status="success" title="Sucesso">Lote #1042 finalizado e faturado com sucesso.</genova-alert>
      <genova-alert status="warning" title="Atenção">Certificado digital A1 vence em 15 dias.</genova-alert>
      <genova-alert status="error" title="Erro">Falha ao conectar no broker MQTT da planta.</genova-alert>
    </div>
  `,
};
