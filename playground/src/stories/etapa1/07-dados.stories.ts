import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/07 - Dados',
};

export default meta;
type Story = StoryObj;

export const DataCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.5rem;max-width:760px;">
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
        <genova-avatar name="Wesley Xavier"></genova-avatar>
        <genova-badge variant="primary">Admin</genova-badge>
        <genova-badge variant="success">Ativo</genova-badge>
        <genova-badge variant="warning">Sandbox</genova-badge>
        <genova-tag label="Lavanderia Industrial" removable></genova-tag>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;">
        <genova-stats label="Kg Processados Hoje" value="4.280 kg" helpText="+12% vs ontem"></genova-stats>
        <genova-stats label="Lotes Ativos" value="18" helpText="3 em secagem"></genova-stats>
      </div>
      <genova-list .items=${['Entrada de Roupa Suja', 'Lavagem Pesada', 'Centrifugação & Secagem']}></genova-list>
      <genova-table
        .columns=${['Cliente', 'CNPJ', 'Status']}
        .rows=${[['Hotel Imperial', '12.345.678/0001-95', 'Ativo'], ['Hospital Central', '98.765.432/0001-10', 'Sandbox']]}
      ></genova-table>
    </div>
  `,
};
