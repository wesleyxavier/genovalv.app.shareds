import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const FILTERS = [
  {
    id: 'status',
    label: 'Situação',
    value: 'all',
    options: [
      { value: 'all', label: 'Situação: todas' },
      { value: 'active', label: 'Ativa' },
      { value: 'failed', label: 'Falhou' },
    ],
  },
];

const UPLOADED_FILES = [
  { id: '1', name: 'autorizacao-lgpd-assinada.pdf', sizeBytes: 184320, mimeType: 'application/pdf' },
];

const meta: Meta = {
  title: 'Etapa 1/08 - List Upload',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const ListToolbarAndPagination: Story = {
  render: () => html`
    <div style="background:#faf7f0;padding:1.5rem;max-width:960px;">
      <genova-list-toolbar search-placeholder="Nome ou CNPJ" .filters=${FILTERS}>
        <genova-button slot="actions" variant="primary">+ Nova empresa</genova-button>
      </genova-list-toolbar>
      <div style="background:#fff;border:1px solid #e7e2d8;border-radius:0.875rem;overflow:hidden;">
        <genova-table .columns=${['Empresa', 'Situação']} .rows=${[['Lavanderia Alpha', 'Ativa']]}></genova-table>
        <genova-pagination page="1" page-size="10" total-items="24"></genova-pagination>
      </div>
    </div>
  `,
};

export const SupportAccessModalWithDropzone: Story = {
  render: () => html`
    <div style="min-height:480px;background:#efebe2;">
      <genova-modal open size="md" title="Permitir acesso de suporte" subtitle="Lavanderia Exemplo B · anexo obrigatório">
        <genova-file-dropzone .files=${UPLOADED_FILES}></genova-file-dropzone>
        <div slot="footer">
          <genova-button variant="outline">Cancelar</genova-button>
          <genova-button variant="primary">Permitir acesso</genova-button>
        </div>
      </genova-modal>
    </div>
  `,
};
