import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/05 - Feedback',
};

export default meta;
type Story = StoryObj;

export const FeedbackCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.25rem;max-width:600px;">
      <genova-alert status="info" title="Informação">Sincronização em andamento.</genova-alert>
      <genova-alert status="success" title="Sucesso">Lote finalizado e faturado.</genova-alert>
      <genova-alert status="warning" title="Atenção">Certificado A1 vence em 15 dias.</genova-alert>
      <genova-alert status="error" title="Erro">Falha ao conectar no broker MQTT.</genova-alert>
      <div style="display:flex;align-items:center;gap:1.5rem;">
        <genova-circular-progress value="72"></genova-circular-progress>
        <genova-spinner size="28"></genova-spinner>
      </div>
      <genova-progress value="68"></genova-progress>
      <genova-skeleton width="70%" height="1.25rem"></genova-skeleton>
      <genova-toast status="success" message="Alterações salvas com sucesso!"></genova-toast>
    </div>
  `,
};
