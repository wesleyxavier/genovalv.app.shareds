import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Etapa 1/04 - Navegação',
};

export default meta;
type Story = StoryObj;

export const NavigationCatalog: Story = {
  render: () => html`
    <div style="padding:2rem;background:#faf7f0;display:grid;gap:1.5rem;max-width:680px;">
      <genova-breadcrumb .items=${[{ label: 'Início', href: '#' }, { label: 'Produção', href: '#' }, { label: 'Lotes' }]}></genova-breadcrumb>
      <genova-tabs
        activeId="geral"
        .tabs=${[
          { id: 'geral', label: 'Visão Geral', content: 'Resumo operacional da planta.' },
          { id: 'maquinas', label: 'Máquinas', content: '12 lavadoras conectadas via MQTT.' },
        ]}
      ></genova-tabs>
      <genova-menu label="Ações do Lote" .items=${[{ id: 'edit', label: 'Editar Lote' }, { id: 'print', label: 'Imprimir Etiqueta' }]}></genova-menu>
      <genova-accordion
        openId="a1"
        .items=${[
          { id: 'a1', title: 'Configuração Fiscal NF-e', content: 'Certificado A1 válido até 2027.' },
          { id: 'a2', title: 'Integração IoT / EMQX', content: 'Tópicos MQTT ativos.' },
        ]}
      ></genova-accordion>
      <genova-collapse open>Conteúdo expansível via Collapse.</genova-collapse>
    </div>
  `,
};
