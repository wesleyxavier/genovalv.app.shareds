import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const tabs = [
  { id: 'geral', label: 'Visão Geral', content: 'Resumo operacional da planta e indicadores do dia.' },
  { id: 'maquinas', label: 'Máquinas', content: '12 lavadoras industriais conectadas via broker MQTT/EMQX.' },
  { id: 'fiscal', label: 'Fiscal', content: 'Emissão automática de NF-e/NFS-e via Focus NFe.' },
];

const meta: Meta = {
  title: 'Atoms/Tabs',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    activeId: { control: 'select', options: ['geral', 'maquinas', 'fiscal'] },
  },
  args: {
    activeId: 'geral',
    tabs,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <div style="max-width:620px;">
      <genova-tabs activeId=${args.activeId} .tabs=${args.tabs}></genova-tabs>
    </div>
  `,
};
